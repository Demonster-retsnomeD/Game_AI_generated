"""
Edit ATT template slides for game project report.
Replaces placeholder text while preserving all logo/design elements.
"""
import re, os, shutil

BASE = "D:/claude_ai_game/att_unpacked/ppt/slides"

def read(f):
    return open(f, encoding='utf-8').read()

def write(f, content):
    open(f, 'w', encoding='utf-8').write(content)

def replace_text(content, old, new):
    return content.replace(f'<a:t>{old}</a:t>', f'<a:t>{new}</a:t>')

def replace_text_partial(content, old, new):
    """Replace text that might have xml:space attributes."""
    pattern = r'<a:t[^>]*>' + re.escape(old) + r'</a:t>'
    return re.sub(pattern, f'<a:t>{new}</a:t>', content)

def replace_lorem_block(content, new_paragraphs):
    """
    Replace the entire Lorem ipsum fragmented run block with clean paragraphs.
    new_paragraphs: list of (text, bold) tuples
    """
    # Find the Lorem ipsum block - it starts with 'Lorem ipsum' run and spans many runs
    # We'll find the parent <a:txBody> that contains 'Lorem ipsum' and replace its paragraphs
    # Strategy: find the <a:p> that contains 'Lorem ipsum' and all subsequent <a:p> until
    # a run containing 'Body text:' or 'Header:' or end of txBody

    # Find the big text frame with Lorem ipsum - it's in a shape with many fragmented runs
    # Replace the entire paragraph sequence

    # Pattern: find the paragraph containing 'Lorem ipsum' run
    lorem_start = content.find('<a:t>Lorem ipsum</a:t>')
    if lorem_start == -1:
        lorem_start = content.find('<a:t xml:space="preserve">Lorem ipsum</a:t>')
    if lorem_start == -1:
        return content

    # Find the opening <a:p> before this
    para_open = content.rfind('<a:p>', 0, lorem_start)
    # Find the closing </a:txBody> after this block
    # The Lorem ipsum block ends before the style-guide text or before </a:txBody>
    body_close = content.find('</a:txBody>', lorem_start)

    # Find what comes after the lorem block but before </a:txBody>
    # Look for the 'Body text:' instruction text box (separate shape)
    # The lorem block should end at a certain </a:p> sequence
    # Find all </a:p> after lorem_start, stop at the right boundary

    # Simple approach: replace from para_open to the last </a:p> before 'Body text:' or 'Inside Page'
    after_lorem = content[lorem_start:]
    # Find 'laborum' which is last word of lorem ipsum
    laborum_pos = after_lorem.find('laborum')
    if laborum_pos == -1:
        return content
    # Find closing </a:p> after laborum
    para_close_after_laborum = after_lorem.find('</a:p>', laborum_pos)
    if para_close_after_laborum == -1:
        return content

    absolute_end = lorem_start + para_close_after_laborum + len('</a:p>')

    # Build replacement paragraphs with proper Calibri 24pt formatting
    def make_para(text, bold=False, size=2400):
        b_attr = ' b="1"' if bold else ''
        return f'''<a:p>
          <a:pPr>
            <a:lnSpc><a:spcPts val="2800"/></a:lnSpc>
            <a:spcAft><a:spcPts val="200"/></a:spcAft>
          </a:pPr>
          <a:r>
            <a:rPr lang="en-US" sz="{size}"{b_attr} dirty="0">
              <a:latin typeface="Calibri"/>
            </a:rPr>
            <a:t xml:space="preserve">{text}</a:t>
          </a:r>
        </a:p>'''

    new_content_xml = '\n'.join(make_para(text, bold) for text, bold in new_paragraphs)

    return content[:para_open] + new_content_xml + content[absolute_end:]


# ═══════════════════════════════════════════════════════════
# SLIDE 1: Cover — 平台冒险 · 肉鸽养成版
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide1.xml"
c = read(f)
c = replace_text(c, 'TEMPLATE', '平台冒险 · 肉鸽养成版')
c = replace_text(c, 'PRESENTATION', '项目汇报  |  Kenny  |  2026')
write(f, c)
print("✓ slide1 (Cover)")

# ═══════════════════════════════════════════════════════════
# SLIDE 2: Divider — 项目概述
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide2.xml"
c = read(f)
# Replace the split title "Sample" + "divider page 1"
c = replace_text(c, 'Sample', '项目概述')
c = replace_text(c, 'divider page 1', 'Project Overview')
c = replace_text(c, 'Sub-Header', '游戏类型 · 技术栈 · 成果')
# Remove style-guide notes
c = replace_text(c, 'Header: Tahoma Regular 60 Pts', '')
c = replace_text(c, 'Sub-Header: Calibri Regular 40 Pts', '')
write(f, c)
print("✓ slide2 (Divider: 项目概述)")

# ═══════════════════════════════════════════════════════════
# SLIDE 3: Content — 项目概述详情
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide3.xml"
c = read(f)
# Left sidebar title
c = replace_text(c, 'Inside', '项目')
c = replace_text(c, 'Page', '概述')
# Another title element
c = replace_text(c, 'Inside Page', '项目概述')
# Remove style guides
c = replace_text(c, 'Body text: Calibri Regular 24 Pts', '')
c = replace_text(c, 'Header: Tahoma Regular 60 Pts', '')
c = replace_text(c, 'Sub-Header: Calibri Regular 40 Pts', '')
# Replace Lorem ipsum body
c = replace_lorem_block(c, [
    ('【项目名称】  平台冒险 · 肉鸽养成版', True),
    ('一款运行在浏览器中的横版2D闯关游戏，融合 Roguelite 元成长机制。', False),
    ('', False),
    ('【技术栈】', True),
    ('▸  HTML5 Canvas 2D 渲染（无框架，零依赖）', False),
    ('▸  原生 JavaScript 游戏循环（requestAnimationFrame）', False),
    ('▸  localStorage 持久化存档系统', False),
    ('▸  JSON 关卡配置文件支持自定义关卡', False),
    ('', False),
    ('【游戏模式】', True),
    ('▸  横版闯关模式 — 5档难度，程序化随机关卡', False),
    ('▸  节奏音游模式 — MIDI 音频分析节拍', False),
    ('', False),
    ('【项目规模】  单文件 43KB · 游戏中心入口页 · 4个交付文件', False),
])
write(f, c)
print("✓ slide3 (Content: 项目概述)")

# ═══════════════════════════════════════════════════════════
# SLIDE 7 (copy of slide2): Divider — 核心功能
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide7.xml"
c = read(f)
c = replace_text(c, 'Sample', '核心功能')
c = replace_text(c, 'divider page 1', 'Core Game Mechanics')
c = replace_text(c, 'Sub-Header', '关卡生成 · 战斗系统 · 元成长')
c = replace_text(c, 'Header: Tahoma Regular 60 Pts', '')
c = replace_text(c, 'Sub-Header: Calibri Regular 40 Pts', '')
write(f, c)
print("✓ slide7 (Divider: 核心功能)")

# ═══════════════════════════════════════════════════════════
# SLIDE 10 (copy of slide3): Content — 核心机制
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide10.xml"
c = read(f)
c = replace_text(c, 'Inside', '核心')
c = replace_text(c, 'Page', '机制')
c = replace_text(c, 'Inside Page', '核心机制')
c = replace_text(c, 'Body text: Calibri Regular 24 Pts', '')
c = replace_text(c, 'Header: Tahoma Regular 60 Pts', '')
c = replace_text(c, 'Sub-Header: Calibri Regular 40 Pts', '')
c = replace_lorem_block(c, [
    ('【程序化关卡生成】', True),
    ('▸  主路径脊骨 + 随机分支平台，每局不重复', False),
    ('▸  关卡宽度、平台间距、分支数量随难度参数化', False),
    ('', False),
    ('【5档难度系统】', True),
    ('▸  D1新手（≥20条路径）→ D5地狱（≥3条路径，22+敌人）', False),
    ('▸  D4/D5 需解锁二段跳技能才可挑战', False),
    ('', False),
    ('【双模式战斗】', True),
    ('▸  近战：范围攻击68px，冷却220ms', False),
    ('▸  远程：子弹速度9px/帧，冷却350ms', False),
    ('▸  地面巡逻敌 + 飞行敌，各有独立AI', False),
    ('', False),
    ('【元成长系统】', True),
    ('▸  跨局经验值积累，解锁6种永久技能强化', False),
    ('▸  成就系统 + localStorage 跨会话保存', False),
])
write(f, c)
print("✓ slide10 (Content: 核心机制)")

# ═══════════════════════════════════════════════════════════
# SLIDE 8 (copy of slide2): Divider — 工作内容
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide8.xml"
c = read(f)
c = replace_text(c, 'Sample', '工作内容')
c = replace_text(c, 'divider page 1', 'Work Done')
c = replace_text(c, 'Sub-Header', '框架搭建 · 系统开发 · 功能迭代')
c = replace_text(c, 'Header: Tahoma Regular 60 Pts', '')
c = replace_text(c, 'Sub-Header: Calibri Regular 40 Pts', '')
write(f, c)
print("✓ slide8 (Divider: 工作内容)")

# ═══════════════════════════════════════════════════════════
# SLIDE 4: Content — 工作内容
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide4.xml"
c = read(f)
c = replace_text(c, 'Inside Page 2', '工作内容')
c = replace_text(c, 'Body text: Calibri Regular 24 Pts', '')
c = replace_text(c, 'Header: Calibri 60 Pts', '')
c = replace_lorem_block(c, [
    ('阶段一 ·  游戏框架搭建', True),
    ('Canvas 渲染循环 / 物理引擎（重力·碰撞）/ 玩家移动控制 / 游戏状态机', False),
    ('', False),
    ('阶段二 ·  关卡生成系统', True),
    ('程序化平台生成算法 / 主路径+随机分支 / JSON关卡配置 / 难度参数化', False),
    ('', False),
    ('阶段三 ·  战斗与敌人系统', True),
    ('近战/远程双模式 / 飞行+地面双敌人 / 伤害计算 / 击退物理 / AI巡逻', False),
    ('', False),
    ('阶段四 ·  元游戏与存档', True),
    ('跨局经验值系统 / 技能树设计（6种） / 成就解锁 / localStorage持久化', False),
    ('', False),
    ('阶段五 ·  节奏游戏模块', True),
    ('独立 rhythm.html / MIDI音频分析 / 游戏中心 index.html 整合两款游戏', False),
])
write(f, c)
print("✓ slide4 (Content: 工作内容)")

# ═══════════════════════════════════════════════════════════
# SLIDE 9 (copy of slide2): Divider — 学习收获
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide9.xml"
c = read(f)
c = replace_text(c, 'Sample', '学习收获')
c = replace_text(c, 'divider page 1', 'Key Learnings')
c = replace_text(c, 'Sub-Header', '技术能力 · 工程思维 · AI协作')
c = replace_text(c, 'Header: Tahoma Regular 60 Pts', '')
c = replace_text(c, 'Sub-Header: Calibri Regular 40 Pts', '')
write(f, c)
print("✓ slide9 (Divider: 学习收获)")

# ═══════════════════════════════════════════════════════════
# SLIDE 11 (copy of slide3): Content — 学习收获
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide11.xml"
c = read(f)
c = replace_text(c, 'Inside', '学习')
c = replace_text(c, 'Page', '收获')
c = replace_text(c, 'Inside Page', '学习收获')
c = replace_text(c, 'Body text: Calibri Regular 24 Pts', '')
c = replace_text(c, 'Header: Tahoma Regular 60 Pts', '')
c = replace_text(c, 'Sub-Header: Calibri Regular 40 Pts', '')
c = replace_lorem_block(c, [
    ('【技术能力】', True),
    ('▸  Canvas 2D 渲染：requestAnimationFrame 循环、精灵绘制、视口裁剪', False),
    ('▸  物理与碰撞：AABB检测、重力模拟、平台边缘修正', False),
    ('▸  程序化生成：随机种子关卡算法、参数化难度配置', False),
    ('▸  状态管理：无框架完整游戏状态机、元数据持久化', False),
    ('', False),
    ('【工程思维】', True),
    ('▸  模块化设计：关卡/战斗/存档独立模块，降低耦合', False),
    ('▸  配置化代码：CFG对象让代码自解释，减少硬编码', False),
    ('▸  增量迭代：小步快跑，每阶段功能可验证', False),
    ('', False),
    ('【AI 辅助开发】', True),
    ('▸  与 Claude Code 协作迭代，学会拆解需求与验证逻辑', False),
    ('▸  探索 AI 作为编程伙伴的工作流与边界', False),
])
write(f, c)
print("✓ slide11 (Content: 学习收获)")

# ═══════════════════════════════════════════════════════════
# SLIDE 6: Thank You — clean up style note
# ═══════════════════════════════════════════════════════════
f = f"{BASE}/slide6.xml"
c = read(f)
c = replace_text(c, 'Text: Tahoma Bold 66 Pts', '')
write(f, c)
print("✓ slide6 (Thank You)")

print("\n✅ All slides edited successfully.")
