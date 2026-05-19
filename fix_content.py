"""Fix content slides - replace Lorem ipsum bodies."""
import re, sys

def read(f):
    return open(f, encoding='utf-8').read()

def write(f, content):
    open(f, 'w', encoding='utf-8').write(content)

def replace_lorem_body(content, paragraphs):
    """Replace p:txBody containing Lorem ipsum with new content."""
    idx = content.find('Lorem ipsum')
    if idx == -1:
        return content, False
    tx_start = content.rfind('<p:txBody>', 0, idx)
    tx_end = content.find('</p:txBody>', idx) + len('</p:txBody>')
    # Extract original bodyPr
    inner = content[tx_start:tx_end]
    bodypr_match = re.search(r'<a:bodyPr[^>]*/>', inner)
    if not bodypr_match:
        bodypr_match = re.search(r'<a:bodyPr.*?</a:bodyPr>', inner, re.DOTALL)
    bodypr = bodypr_match.group(0) if bodypr_match else '<a:bodyPr/>'

    def para(text, bold=False):
        if not text:
            return '          <a:p><a:endParaRPr lang="en-US" sz="2000" dirty="0"><a:latin typeface="Calibri"/></a:endParaRPr></a:p>'
        b = ' b="1"' if bold else ''
        return (f'          <a:p>\n'
                f'            <a:pPr><a:lnSpc><a:spcPts val="2700"/></a:lnSpc><a:spcAft><a:spcPts val="160"/></a:spcAft></a:pPr>\n'
                f'            <a:r><a:rPr lang="zh-CN" altLang="en-US" sz="2000"{b} dirty="0"><a:latin typeface="Calibri"/></a:rPr>\n'
                f'            <a:t>{text}</a:t></a:r>\n'
                f'          </a:p>')

    paras_xml = '\n'.join(para(t, b) for t, b in paragraphs)
    new_body = f'<p:txBody>\n          {bodypr}\n          <a:lstStyle/>\n{paras_xml}\n        </p:txBody>'
    return content[:tx_start] + new_body + content[tx_end:], True

# ── Slide 3: 项目概述 ───────────────────────────────────────
f = "D:/claude_ai_game/att_unpacked/ppt/slides/slide3.xml"
c = read(f)
c, ok = replace_lorem_body(c, [
    ('【项目名称】  平台冒险 · 肉鸽养成版', True),
    ('一款运行在浏览器中的横版2D闯关游戏，融合 Roguelite 元成长机制。', False),
    ('', False),
    ('【技术栈】', True),
    ('▸  HTML5 Canvas 2D 渲染（无框架，零依赖）', False),
    ('▸  原生 JavaScript 游戏循环（requestAnimationFrame）', False),
    ('▸  localStorage 持久化存档系统', False),
    ('▸  JSON 关卡配置文件，支持自定义关卡', False),
    ('', False),
    ('【游戏模式】', True),
    ('▸  横版闯关模式：5档难度，程序化随机生成关卡', False),
    ('▸  节奏音游模式：MIDI 音频分析节拍', False),
    ('', False),
    ('【项目规模】  单文件 43KB · 零外部依赖 · 4个交付文件', False),
])
write(f, c)
print(f"slide3 OK={ok}, Lorem left={'Lorem ipsum' in c}")

# ── Slide 4: 工作内容 ────────────────────────────────────────
f = "D:/claude_ai_game/att_unpacked/ppt/slides/slide4.xml"
c = read(f)
c, ok = replace_lorem_body(c, [
    ('阶段一  ·  游戏框架搭建', True),
    ('Canvas 渲染循环 / 物理引擎（重力·碰撞） / 玩家移动控制 / 游戏状态机', False),
    ('', False),
    ('阶段二  ·  关卡生成系统', True),
    ('程序化平台生成算法 / 主路径+随机分支 / JSON关卡配置 / 难度参数化', False),
    ('', False),
    ('阶段三  ·  战斗与敌人系统', True),
    ('近战/远程双模式 / 飞行+地面双敌人 / 伤害计算 / 击退物理 / AI巡逻', False),
    ('', False),
    ('阶段四  ·  元游戏与存档', True),
    ('跨局经验值系统 / 技能树（6种） / 成就解锁 / localStorage 持久化', False),
    ('', False),
    ('阶段五  ·  节奏游戏模块', True),
    ('独立 rhythm.html / MIDI音频分析 / 游戏中心 index.html 整合两款游戏', False),
])
write(f, c)
print(f"slide4 OK={ok}, Lorem left={'Lorem ipsum' in c}")

# ── Slide 10 (copy of slide3): 核心机制 ─────────────────────
f = "D:/claude_ai_game/att_unpacked/ppt/slides/slide10.xml"
c = read(f)
c, ok = replace_lorem_body(c, [
    ('【程序化关卡生成】', True),
    ('▸  主路径脊骨 + 随机分支平台，每局不重复', False),
    ('▸  关卡宽度/平台间距/分支数量随难度参数化', False),
    ('', False),
    ('【5档难度系统】', True),
    ('▸  D1新手（≥20条路径）→ D5地狱（≥3条路径，22+敌人）', False),
    ('▸  D4/D5 需解锁二段跳技能才可挑战', False),
    ('', False),
    ('【双模式战斗】', True),
    ('▸  近战：攻击范围68px，冷却220ms', False),
    ('▸  远程：子弹速度9px/帧，冷却350ms', False),
    ('▸  地面巡逻敌 + 飞行敌，各有独立AI逻辑', False),
    ('', False),
    ('【元成长系统】', True),
    ('▸  跨局经验值积累，解锁6种永久技能强化', False),
    ('▸  成就系统 + localStorage 跨会话保存', False),
])
write(f, c)
print(f"slide10 OK={ok}, Lorem left={'Lorem ipsum' in c}")

# ── Slide 11 (copy of slide3): 学习收获 ─────────────────────
f = "D:/claude_ai_game/att_unpacked/ppt/slides/slide11.xml"
c = read(f)
c, ok = replace_lorem_body(c, [
    ('【技术能力提升】', True),
    ('▸  Canvas 2D 渲染：requestAnimationFrame 循环、精灵绘制、视口裁剪优化', False),
    ('▸  物理与碰撞：AABB检测实现、重力模拟、平台边缘检测与修正', False),
    ('▸  程序化生成：随机种子关卡算法、参数化难度配置', False),
    ('▸  状态管理：无框架完整游戏状态机、元数据持久化存档', False),
    ('', False),
    ('【工程思维与方法论】', True),
    ('▸  模块化设计：关卡/战斗/存档独立模块，降低耦合，便于维护', False),
    ('▸  配置化代码：CFG对象让代码自解释，减少硬编码', False),
    ('▸  增量迭代：小步快跑，每阶段功能可验证', False),
    ('', False),
    ('【AI 辅助开发实践】', True),
    ('▸  与 Claude Code 协作迭代功能，学会拆解需求与验证逻辑', False),
    ('▸  探索 AI 作为编程伙伴的工作流与有效使用边界', False),
])
write(f, c)
print(f"slide11 OK={ok}, Lorem left={'Lorem ipsum' in c}")
