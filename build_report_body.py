"""
Replace letterhead document.xml body content with game report.
Preserves header/footer (ATT logo) from the template.
"""
import re

# ── Helpers ─────────────────────────────────────────────────────
BLUE   = '2E74B6'
DBLUE  = '1A477A'
GRAY   = '444444'
LGRAY  = 'AAAAAA'
YELLOW = 'FFD116'
LBGBLUE= 'EBF3FB'

def rPr(font='Calibri', size=22, bold=False, color=GRAY, italic=False):
    b   = '<w:b/>' if bold else ''
    i   = '<w:i/>' if italic else ''
    clr = f'<w:color w:val="{color}"/>'
    return f'<w:rPr><w:rFonts w:ascii="{font}" w:hAnsi="{font}"/>{b}{i}<w:sz w:val="{size}"/>{clr}</w:rPr>'

def pPr(spacing_before=0, spacing_after=120, indent_left=0, hanging=0, align=''):
    spc = f'<w:spacing w:before="{spacing_before}" w:after="{spacing_after}"/>'
    ind = f'<w:ind w:left="{indent_left}" w:hanging="{hanging}"/>' if indent_left else ''
    jc  = f'<w:jc w:val="{align}"/>' if align else ''
    return f'<w:pPr>{spc}{ind}{jc}</w:pPr>'

def para(texts, spacing_before=0, spacing_after=120, indent_left=0, border_bottom=False):
    """texts = list of (text, font, size, bold, color, italic)"""
    spc = f'<w:spacing w:before="{spacing_before}" w:after="{spacing_after}"/>'
    ind = f'<w:ind w:left="{indent_left}"/>' if indent_left else ''
    bdr = f'<w:pBdr><w:bottom w:val="single" w:sz="12" w:color="{BLUE}" w:space="1"/></w:pBdr>' if border_bottom else ''
    pp  = f'<w:pPr>{bdr}{spc}{ind}</w:pPr>'
    runs = ''
    for text, font, size, bold, color, italic in texts:
        b = '<w:b/>' if bold else ''
        i = '<w:i/>' if italic else ''
        runs += f'<w:r><w:rPr><w:rFonts w:ascii="{font}" w:hAnsi="{font}"/>{b}{i}<w:sz w:val="{size}"/><w:color w:val="{color}"/></w:rPr><w:t xml:space="preserve">{text}</w:t></w:r>'
    return f'<w:p>{pp}{runs}</w:p>'

def h1(text):
    return para([(text, 'Tahoma', 30, True, BLUE, False)], spacing_before=320, spacing_after=80)

def h2(text):
    return para([(text, 'Tahoma', 24, True, DBLUE, False)], spacing_before=220, spacing_after=60)

def p(text, bold=False, indent=0, color=GRAY, size=22, italic=False):
    return para([(text, 'Calibri', size, bold, color, italic)], spacing_after=120, indent_left=indent)

def hr_line():
    return para([], spacing_before=120, spacing_after=0, border_bottom=True)

def spacer(pt=120):
    return f'<w:p><w:pPr><w:spacing w:before="0" w:after="{pt}"/></w:pPr></w:p>'

def meta(label, value):
    return para([
        (label + '  ', 'Calibri', 22, True, DBLUE, False),
        (value, 'Calibri', 22, False, GRAY, False)
    ], spacing_after=60)

def bul(prefix_bold, text):
    return para([
        ('▸  ', 'Calibri', 22, False, BLUE, False),
        (prefix_bold + '  ', 'Calibri', 22, True, DBLUE, False) if prefix_bold else ('', 'Calibri', 0, False, GRAY, False),
        (text, 'Calibri', 22, False, GRAY, False)
    ], spacing_after=80, indent_left=400)

def info_table(rows):
    """2-column info table: label | value"""
    cells = ''
    for k, v in rows:
        bg = f'<w:shd w:val="clear" w:fill="{LBGBLUE}"/>'
        white = '<w:shd w:val="clear" w:fill="FFFFFF"/>'
        bdr = f'<w:tcBorders><w:top w:val="single" w:sz="1" w:color="CCDDEE"/><w:bottom w:val="single" w:sz="1" w:color="CCDDEE"/><w:left w:val="single" w:sz="1" w:color="CCDDEE"/><w:right w:val="single" w:sz="1" w:color="CCDDEE"/></w:tcBorders>'
        pad = '<w:tcMar><w:top w:w="80" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>'

        kp = f'<w:p><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="20"/><w:color w:val="{DBLUE}"/></w:rPr><w:t xml:space="preserve">{k}</w:t></w:r></w:p>'
        vp = f'<w:p><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:sz w:val="20"/><w:color w:val="{GRAY}"/></w:rPr><w:t xml:space="preserve">{v}</w:t></w:r></w:p>'

        cells += f'''<w:tr>
          <w:tc><w:tcPr><w:tcW w:w="2600" w:type="dxa"/>{bdr}{bg}{pad}</w:tcPr>{kp}</w:tc>
          <w:tc><w:tcPr><w:tcW w:w="6400" w:type="dxa"/>{bdr}{white}{pad}</w:tcPr>{vp}</w:tc>
        </w:tr>'''

    return f'''<w:tbl>
      <w:tblPr><w:tblW w:w="9000" w:type="dxa"/><w:tblLook w:val="0000"/></w:tblPr>
      <w:tblGrid><w:gridCol w:w="2600"/><w:gridCol w:w="6400"/></w:tblGrid>
      {cells}
    </w:tbl>'''

def phase_table(phases):
    """3-column phase table"""
    hdrbdr = f'<w:tcBorders><w:top w:val="single" w:sz="2" w:color="{BLUE}"/><w:bottom w:val="single" w:sz="2" w:color="{BLUE}"/><w:left w:val="single" w:sz="2" w:color="{BLUE}"/><w:right w:val="single" w:sz="2" w:color="{BLUE}"/></w:tcBorders>'
    bdr    = f'<w:tcBorders><w:top w:val="single" w:sz="1" w:color="CCCCCC"/><w:bottom w:val="single" w:sz="1" w:color="CCCCCC"/><w:left w:val="single" w:sz="1" w:color="CCCCCC"/><w:right w:val="single" w:sz="1" w:color="CCCCCC"/></w:tcBorders>'
    pad    = '<w:tcMar><w:top w:w="80" w:type="dxa"/><w:bottom w:w="80" w:type="dxa"/><w:left w:w="160" w:type="dxa"/><w:right w:w="120" w:type="dxa"/></w:tcMar>'

    def hcell(text, width):
        return f'<w:tc><w:tcPr><w:tcW w:w="{width}" w:type="dxa"/>{hdrbdr}<w:shd w:val="clear" w:fill="{BLUE}"/>{pad}</w:tcPr><w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/><w:b/><w:sz w:val="20"/><w:color w:val="FFFFFF"/></w:rPr><w:t>{text}</w:t></w:r></w:p></w:tc>'

    def dcell(text, width, bg, bold=False):
        b = '<w:b/>' if bold else ''
        return f'<w:tc><w:tcPr><w:tcW w:w="{width}" w:type="dxa"/>{bdr}<w:shd w:val="clear" w:fill="{bg}"/>{pad}</w:tcPr><w:p><w:r><w:rPr><w:rFonts w:ascii="Calibri" w:hAnsi="Calibri"/>{b}<w:sz w:val="20"/><w:color w:val="{GRAY}"/></w:rPr><w:t xml:space="preserve">{text}</w:t></w:r></w:p></w:tc>'

    header_row = f'<w:tr>{hcell("阶段", 1800)}{hcell("工作内容", 3300)}{hcell("主要成果", 3900)}</w:tr>'
    rows = ''
    for i, (phase, work, result) in enumerate(phases):
        bg = LBGBLUE if i % 2 == 0 else 'FFFFFF'
        rows += f'<w:tr>{dcell(phase, 1800, bg, bold=True)}{dcell(work, 3300, bg)}{dcell(result, 3900, bg)}</w:tr>'

    return f'''<w:tbl>
      <w:tblPr><w:tblW w:w="9000" w:type="dxa"/><w:tblLook w:val="0000"/></w:tblPr>
      <w:tblGrid><w:gridCol w:w="1800"/><w:gridCol w:w="3300"/><w:gridCol w:w="3900"/></w:tblGrid>
      {header_row}{rows}
    </w:tbl>'''

# ══════════════════════════════════════════════════════════════════
# Build body content
# ══════════════════════════════════════════════════════════════════
body_parts = [
    spacer(160),
    meta('日期 Date:', '2026年5月18日'),
    meta('报告人 Author:', 'Kenny'),
    meta('部门 Department:', 'ATT Group — Internship'),
    meta('主题 Subject:', '横版2D闯关小游戏项目工作及学习汇报'),
    spacer(80),
    hr_line(),
    spacer(160),

    # 1. Executive Summary
    h1('一、执行摘要  Executive Summary'),
    p('本报告汇报了"平台冒险·肉鸽养成版"项目的开发过程、技术实现及学习收获。该项目为一款纯浏览器运行的横版2D闯关游戏，结合 Roguelite 元成长机制，采用原生 HTML5/JavaScript 开发，零外部框架依赖，完整展现了从零搭建游戏的工程能力，以及与 AI 工具协作开发的实践探索。'),
    spacer(80),

    # 2. Project Overview
    h1('二、项目概述  Project Overview'),
    spacer(60),
    info_table([
        ('项目名称', '平台冒险 · 肉鸽养成版（Platform Adventure · Roguelite Edition）'),
        ('项目类型', '横版2D闯关游戏 + 节奏音游（双模式）'),
        ('技术栈',   'HTML5 Canvas 2D · 原生 JavaScript · localStorage · JSON'),
        ('外部依赖', '零 — 无任何第三方框架或库'),
        ('游戏难度', '5档（D1新手 → D5地狱），程序化随机关卡生成'),
        ('交付文件', 'game.html · rhythm.html · index.html · level_medium.json'),
        ('文件大小', '主游戏单文件 43KB'),
    ]),
    spacer(160),

    # 3. Technical Implementation
    h1('三、技术实现  Technical Implementation'),
    h2('3.1  游戏核心架构'),
    bul('', 'requestAnimationFrame 驱动的主游戏循环，实现流畅60FPS渲染'),
    bul('', 'HTML5 Canvas 2D：平台、精灵、敌人、粒子特效、UI叠层全部自绘'),
    bul('', '自定义物理引擎：重力(0.55)、跳跃速度(-13.5)、AABB碰撞检测'),
    bul('', '视口跟随系统：镜头平滑跟随玩家，支持最大宽度4800px关卡'),
    spacer(80),

    h2('3.2  程序化关卡生成'),
    bul('', '"脊骨路径"算法：先生成可达主路径，再随机添加分支平台'),
    bul('', '难度参数化：平台宽度/间距/分支数量/关卡长度由配置对象(CFG)控制'),
    bul('', '5档难度从新手(≥20条路径)到地狱(≥3条路径)动态缩放'),
    bul('', '支持JSON预设关卡文件(level_medium.json)，实现关卡编辑器功能'),
    spacer(80),

    h2('3.3  战斗系统'),
    bul('', '双攻击模式：近战(范围68px，冷却220ms) / 远程子弹(速度9px/帧，冷却350ms)'),
    bul('', '双敌人类型：地面巡逻敌(walkerHp 1-5) + 飞行敌(flyerHp 1-3)'),
    bul('', '击退物理：受击后向量分离，配合受伤无敌帧防止连续伤害'),
    spacer(80),

    h2('3.4  元成长与存档系统'),
    bul('', '跨局经验值积累：每局根据难度获得不同XP基础值(150-1500)'),
    bul('', '技能树：6种永久强化技能，含二段跳、攻速提升、血量增加等'),
    bul('', 'localStorage持久化：跨会话保存等级、技能、成就进度'),
    spacer(160),

    # 4. Work Breakdown
    h1('四、工作内容  Work Breakdown'),
    spacer(80),
    phase_table([
        ('阶段一\n框架搭建', 'Canvas渲染循环\n物理引擎设计\n玩家移动控制\n游戏状态机', 'Canvas主循环 / 重力碰撞\n基础可玩原型'),
        ('阶段二\n关卡系统', '程序化生成算法\n主路径+分支设计\nJSON关卡支持\n难度配置系统', '5档难度 / 无限随机关卡\n关卡编辑器支持'),
        ('阶段三\n战斗系统', '近战/远程切换\n飞行+地面敌人\n伤害/击退物理\nAI巡逻逻辑', '完整战斗循环\n双类型敌人AI'),
        ('阶段四\n元游戏', '经验值系统\n技能树设计\n成就解锁机制\n存档持久化', 'Roguelite元成长\n跨局进度保存'),
        ('阶段五\n节奏模块', 'rhythm.html开发\nMIDI音频分析\n游戏中心整合', '独立节奏游戏\n双模式入口页'),
    ]),
    spacer(160),

    # 5. Key Learnings
    h1('五、学习收获  Key Learnings'),
    h2('5.1  技术能力'),
    bul('Canvas 2D 渲染：', 'requestAnimationFrame循环机制、精灵绘制技巧、视口裁剪性能优化'),
    bul('物理与碰撞：', 'AABB矩形碰撞检测完整实现、平台边缘检测与角色卡墙修正'),
    bul('程序化生成：', '随机种子关卡算法设计思路与参数调优方法'),
    bul('状态管理：', '无框架环境下完整游戏状态机与数据持久化实现'),
    spacer(80),

    h2('5.2  工程思维'),
    bul('', '模块化设计：关卡生成/战斗/元游戏独立模块，降低耦合便于迭代'),
    bul('', '配置化驱动：CFG对象集中管理所有难度参数，代码自解释且易扩展'),
    bul('', '增量迭代：小步快跑，每阶段均有可运行可验证版本，规避大爆炸风险'),
    bul('', '调试方法论：可视化辅助线 + console 定位碰撞与渲染问题的系统化方法'),
    spacer(80),

    h2('5.3  AI 辅助开发实践'),
    bul('', '与 Claude Code 协作开发，探索 AI 作为编程伙伴的有效工作模式'),
    bul('', '学习如何将复杂需求拆解为清晰技术子任务并传递给 AI 工具'),
    bul('', '理解 AI 工具能力边界：适合实现逻辑，架构决策仍需人工主导'),
    spacer(160),

    # 6. Deliverables
    h1('六、项目成果  Deliverables'),
    spacer(60),
    info_table([
        ('game.html',            '完整横版2D闯关游戏 · 5档难度 · 随机关卡 · 元成长 · 双攻击模式'),
        ('rhythm.html',          '节奏音游模块 · MIDI音频分析 · 独立可玩'),
        ('index.html',           '游戏中心入口 · 整合两款游戏 · 最高分展示 · 粒子动效背景'),
        ('level_medium.json',    '预设关卡配置 · 支持自定义关卡编辑'),
    ]),
    spacer(160),

    # 7. Conclusion
    h1('七、总结  Conclusion'),
    p('本项目完整经历了从概念到可交付产品的游戏开发全过程，在技术深度（Canvas/物理/AI）和工程广度（架构/迭代/调试）两个维度均有显著成长。尤其在探索 AI 辅助开发工作流方面积累了可复用的实践经验，为后续项目开发提供了可参考的方法论基础。'),
    spacer(160),

    # Sign-off
    hr_line(),
    spacer(120),
    para([
        ('Kenny', 'Tahoma', 22, True, DBLUE, False),
        ('     |     ATT Group     |     2026年5月18日', 'Calibri', 20, False, GRAY, False),
    ], spacing_after=60),
    p('Proprietary and confidential. Please do not circulate without consent from ATT Group.',
      color=LGRAY, size=16, italic=True),
]

body_xml = '\n'.join(body_parts)

# ── Inject into letterhead template ────────────────────────────
doc_path = 'D:/claude_ai_game/letterhead_unpacked/word/document.xml'
content = open(doc_path, encoding='utf-8').read()

# Find body start and sectPr (must preserve sectPr for header/footer)
body_start = content.find('<w:body>') + len('<w:body>')
sectp_start = content.rfind('<w:sectPr')
body_end_close = content.find('</w:body>')

# Extract sectPr
sectp = content[sectp_start:body_end_close]

new_doc = content[:body_start] + '\n' + body_xml + '\n' + sectp + '\n</w:body></w:document>'
open(doc_path, 'w', encoding='utf-8').write(new_doc)
print(f'Updated document.xml ({len(new_doc)//1024}KB)')
