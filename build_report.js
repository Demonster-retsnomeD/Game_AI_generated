/**
 * ATT Systems letterhead report — 平台冒险·肉鸽养成版 项目汇报
 * Uses docx-js to generate body content; letterhead logo comes from template header/footer.
 *
 * Page: A4 (11907 x 16839 DXA), margins ~1.2cm each side
 * Fonts: Tahoma Bold (headings), Calibri (body)
 * Brand colors: #2E74B6 (ATT blue), #FFD116 (yellow)
 */
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType,
  LevelFormat, HeadingLevel, PageNumber, PageBreak,
  Header, Footer
} = require('docx');
const fs = require('fs');

// ── Colors ─────────────────────────────────────────────────────
const ATT_BLUE  = '2E74B6';
const ATT_YELLOW= 'FFD116';
const DARK_BLUE = '1A477A';
const GRAY      = '555555';
const LIGHT_BG  = 'EBF3FB';

// ── Helpers ─────────────────────────────────────────────────────
const hr = (color = ATT_BLUE, size = 8) =>
  new Paragraph({
    border: { bottom: { style: BorderStyle.SINGLE, size, color, space: 1 } },
    spacing: { after: 0, before: 120 },
    children: []
  });

const spacer = (pt = 120) =>
  new Paragraph({ spacing: { before: 0, after: pt }, children: [] });

const metaRow = (label, value) =>
  new Paragraph({
    spacing: { before: 0, after: 60 },
    children: [
      new TextRun({ text: label, bold: true, font: 'Calibri', size: 22, color: DARK_BLUE }),
      new TextRun({ text: '  ' + value, font: 'Calibri', size: 22, color: GRAY }),
    ]
  });

const heading1 = (text) =>
  new Paragraph({
    spacing: { before: 320, after: 80 },
    children: [
      new TextRun({ text, font: 'Tahoma', bold: true, size: 30, color: ATT_BLUE })
    ]
  });

const heading2 = (text) =>
  new Paragraph({
    spacing: { before: 220, after: 60 },
    children: [
      new TextRun({ text, font: 'Tahoma', bold: true, size: 24, color: DARK_BLUE })
    ]
  });

const body = (text, { bold = false, indent = false } = {}) =>
  new Paragraph({
    spacing: { before: 0, after: 120 },
    indent: indent ? { left: 360 } : undefined,
    children: [
      new TextRun({ text, font: 'Calibri', size: 22, bold, color: GRAY })
    ]
  });

const bullet = (text, label = null) => {
  const children = [];
  if (label) {
    children.push(new TextRun({ text: label + '  ', font: 'Calibri', bold: true, size: 22, color: ATT_BLUE }));
  }
  children.push(new TextRun({ text, font: 'Calibri', size: 22, color: GRAY }));
  return new Paragraph({
    spacing: { before: 0, after: 80 },
    indent: { left: 420, hanging: 240 },
    children: [
      new TextRun({ text: '▸  ', font: 'Calibri', size: 22, color: ATT_BLUE }),
      ...children
    ]
  });
};

const infoBox = (rows) => {
  const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCDDEE' };
  const borders = { top: border, bottom: border, left: border, right: border };
  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: [2800, 6200],
    rows: rows.map(([k, v]) => new TableRow({
      children: [
        new TableCell({
          borders, width: { size: 2800, type: WidthType.DXA },
          shading: { fill: LIGHT_BG, type: ShadingType.CLEAR },
          margins: { top: 80, bottom: 80, left: 160, right: 120 },
          children: [new Paragraph({ children: [
            new TextRun({ text: k, font: 'Calibri', bold: true, size: 20, color: DARK_BLUE })
          ]})]
        }),
        new TableCell({
          borders, width: { size: 6200, type: WidthType.DXA },
          margins: { top: 80, bottom: 80, left: 160, right: 120 },
          children: [new Paragraph({ children: [
            new TextRun({ text: v, font: 'Calibri', size: 20, color: GRAY })
          ]})]
        })
      ]
    }))
  });
};

// ── Phase table ─────────────────────────────────────────────────
const phaseTable = (phases) => {
  const border = { style: BorderStyle.SINGLE, size: 1, color: 'CCCCCC' };
  const borders = { top: border, bottom: border, left: border, right: border };
  const headerBorder = { style: BorderStyle.SINGLE, size: 2, color: ATT_BLUE };
  const headerBorders = { top: headerBorder, bottom: headerBorder, left: headerBorder, right: headerBorder };

  return new Table({
    width: { size: 9000, type: WidthType.DXA },
    columnWidths: [1800, 3300, 3900],
    rows: [
      // Header row
      new TableRow({
        tableHeader: true,
        children: ['阶段', '工作内容', '主要成果'].map((h, i) =>
          new TableCell({
            borders: headerBorders,
            width: { size: [1800, 3300, 3900][i], type: WidthType.DXA },
            shading: { fill: ATT_BLUE, type: ShadingType.CLEAR },
            margins: { top: 80, bottom: 80, left: 160, right: 120 },
            children: [new Paragraph({ alignment: AlignmentType.CENTER, children: [
              new TextRun({ text: h, font: 'Calibri', bold: true, size: 20, color: 'FFFFFF' })
            ]})]
          })
        )
      }),
      // Data rows
      ...phases.map(([phase, work, result], idx) =>
        new TableRow({
          children: [phase, work, result].map((cell, i) =>
            new TableCell({
              borders,
              width: { size: [1800, 3300, 3900][i], type: WidthType.DXA },
              shading: { fill: idx % 2 === 0 ? LIGHT_BG : 'FFFFFF', type: ShadingType.CLEAR },
              margins: { top: 80, bottom: 80, left: 160, right: 120 },
              children: [new Paragraph({ children: [
                new TextRun({ text: cell, font: 'Calibri', size: 20, color: GRAY,
                  bold: i === 0 })
              ]})]
            })
          )
        })
      )
    ]
  });
};

// ══════════════════════════════════════════════════════════════════
// DOCUMENT
// ══════════════════════════════════════════════════════════════════
const doc = new Document({
  numbering: { config: [] },
  styles: {
    default: { document: { run: { font: 'Calibri', size: 22, color: GRAY } } }
  },
  sections: [{
    properties: {
      page: {
        size: { width: 11907, height: 16839 },
        margin: { top: 897, right: 1134, bottom: 737, left: 1134, header: 737, footer: 737 }
      }
    },
    children: [

      // ── Document header info ───────────────────────────────────
      spacer(160),
      metaRow('日期 Date:', '2026年5月18日'),
      metaRow('报告人 Author:', 'Kenny'),
      metaRow('部门 Department:', 'ATT Group — Internship'),
      metaRow('主题 Subject:', '横版2D闯关小游戏项目工作及学习汇报'),
      spacer(80),
      hr(ATT_BLUE, 12),
      spacer(160),

      // ── 1. Executive Summary ───────────────────────────────────
      heading1('一、执行摘要  Executive Summary'),
      body('本报告汇报了"平台冒险·肉鸽养成版"项目的开发过程、技术实现及学习收获。该项目为一款纯浏览器运行的横版2D闯关游戏，结合 Roguelite 元成长机制，采用原生 HTML5/JavaScript 开发，零外部框架依赖，展现了从零搭建完整游戏的工程能力，以及与 AI 工具协作开发的实践探索。'),
      spacer(80),

      // ── 2. Project Overview ────────────────────────────────────
      heading1('二、项目概述  Project Overview'),
      spacer(60),
      infoBox([
        ['项目名称', '平台冒险 · 肉鸽养成版（Platform Adventure · Roguelite Edition）'],
        ['项目类型', '横版2D闯关游戏 + 节奏音游（双模式）'],
        ['技术栈', 'HTML5 Canvas 2D · 原生 JavaScript · localStorage · JSON'],
        ['外部依赖', '零 — 无任何第三方框架或库'],
        ['游戏难度', '5档（D1新手 → D5地狱），程序化随机关卡生成'],
        ['交付文件', 'game.html · rhythm.html · index.html · level_medium.json'],
        ['文件大小', '主游戏单文件 43KB'],
      ]),
      spacer(160),

      // ── 3. Technical Implementation ────────────────────────────
      heading1('三、技术实现  Technical Implementation'),

      heading2('3.1  游戏核心架构'),
      bullet('requestAnimationFrame 驱动的主游戏循环，实现流畅60FPS渲染'),
      bullet('HTML5 Canvas 2D 绘图：平台、玩家精灵、敌人、粒子特效、UI叠层'),
      bullet('自定义物理引擎：重力加速度(0.55)、跳跃速度(-13.5)、AABB碰撞检测'),
      bullet('视口跟随系统：镜头平滑跟随玩家，支持最大宽度4800px的关卡'),
      spacer(80),

      heading2('3.2  程序化关卡生成'),
      bullet('"脊骨路径"算法：先生成可达主路径，再随机添加分支平台'),
      bullet('难度参数化：平台宽度、间距、分支数量、关卡长度均由配置对象控制'),
      bullet('5档难度从新手(≥20条路径)到地狱(≥3条路径)动态缩放'),
      bullet('支持 JSON 预设关卡文件(level_medium.json)，实现关卡编辑器功能'),
      spacer(80),

      heading2('3.3  战斗系统'),
      bullet('双攻击模式：近战(范围68px，冷却220ms) / 远程子弹(速度9px/帧，冷却350ms)'),
      bullet('双敌人类型：地面巡逻敌(walkerHp 1-5) + 飞行敌(flyerHp 1-3)'),
      bullet('击退物理：受击后向量分离，配合受伤无敌帧防止连续伤害'),
      spacer(80),

      heading2('3.4  元成长与存档系统'),
      bullet('跨局经验值积累：每局根据难度获得不同XP基础值(150-1500)'),
      bullet('技能树：6种永久强化技能，含二段跳、攻速提升、血量增加等'),
      bullet('成就系统：多维度成就解锁激励探索'),
      bullet('localStorage 持久化：跨会话保存等级、技能、成就进度'),
      spacer(160),

      // ── 4. Work Done ───────────────────────────────────────────
      heading1('四、工作内容  Work Breakdown'),
      spacer(80),
      phaseTable([
        ['阶段一\n框架搭建', 'Canvas渲染循环\n物理引擎设计\n玩家移动控制\n游戏状态机', 'Canvas主循环\n重力/碰撞系统\n基础可玩原型'],
        ['阶段二\n关卡系统', '程序化生成算法\n主路径+分支设计\nJSON关卡支持\n难度配置系统', '5档难度配置\n无限随机关卡\n关卡编辑器支持'],
        ['阶段三\n战斗系统', '近战/远程切换\n飞行+地面敌人\n伤害/击退物理\nAI巡逻逻辑', '完整战斗循环\n双类型敌人\n流畅打击感'],
        ['阶段四\n元游戏', '经验值系统\n技能树设计\n成就解锁机制\n存档持久化', 'Roguelite元成长\n跨局进度保存\n6种技能解锁'],
        ['阶段五\n节奏模块', 'rhythm.html开发\nMIDI音频分析\n游戏中心整合', '独立节奏游戏\n双模式入口页\n最高分排行'],
      ]),
      spacer(160),

      // ── 5. Key Learnings ───────────────────────────────────────
      heading1('五、学习收获  Key Learnings'),

      heading2('5.1  技术能力'),
      bullet('Canvas 2D 渲染', 'requestAnimationFrame循环机制、精灵绘制技巧、视口裁剪性能优化'),
      bullet('物理与碰撞', 'AABB矩形碰撞检测的完整实现、平台边缘检测与角色卡墙修正'),
      bullet('程序化生成', '随机种子关卡算法的设计思路与调参方法'),
      bullet('状态管理', '在无框架环境下实现完整游戏状态机与数据持久化'),
      spacer(80),

      heading2('5.2  工程思维'),
      bullet('模块化设计：将游戏拆分为关卡生成/战斗/元游戏独立模块，降低耦合便于迭代'),
      bullet('配置化驱动：CFG对象集中管理所有难度参数，代码自解释且易于扩展'),
      bullet('增量迭代：小步快跑，每阶段均有可运行的可验证版本，规避大爆炸风险'),
      bullet('调试方法论：用可视化辅助线+console定位碰撞与渲染问题的系统化方法'),
      spacer(80),

      heading2('5.3  AI 辅助开发实践'),
      bullet('与 Claude Code 协作开发，探索 AI 作为编程伙伴的有效工作模式'),
      bullet('学习如何将复杂需求拆解为清晰的技术子任务并传递给 AI 工具'),
      bullet('理解 AI 工具的能力边界——适合实现逻辑，但架构决策仍需人工主导'),
      spacer(160),

      // ── 6. Results ─────────────────────────────────────────────
      heading1('六、项目成果  Deliverables'),
      spacer(60),
      infoBox([
        ['game.html', '完整横版2D闯关游戏 · 5档难度 · 随机关卡 · 元成长 · 双攻击模式'],
        ['rhythm.html', '节奏音游模块 · MIDI音频分析 · 独立可玩'],
        ['index.html', '游戏中心入口 · 整合两款游戏 · 最高分展示 · 粒子动效背景'],
        ['level_medium.json', '预设关卡配置 · 支持自定义关卡编辑'],
      ]),
      spacer(160),

      // ── 7. Conclusion ──────────────────────────────────────────
      heading1('七、总结  Conclusion'),
      body('本项目完整经历了从概念到可交付产品的游戏开发全过程，在技术深度（Canvas/物理/AI）和工程广度（架构/迭代/调试）两个维度均有显著成长。尤其在探索 AI 辅助开发工作流方面积累了可复用的实践经验，为后续项目开发提供了可参考的方法论基础。'),
      spacer(160),

      // ── Signature ──────────────────────────────────────────────
      hr(ATT_BLUE, 6),
      spacer(120),
      new Paragraph({
        spacing: { before: 0, after: 60 },
        children: [
          new TextRun({ text: 'Kenny', font: 'Tahoma', bold: true, size: 22, color: DARK_BLUE }),
          new TextRun({ text: '     |     ATT Group     |     2026年5月18日', font: 'Calibri', size: 20, color: GRAY }),
        ]
      }),
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({ text: 'Proprietary and confidential. Please do not circulate without consent from ATT Group.',
            font: 'Calibri', size: 16, color: 'AAAAAA', italics: true }),
        ]
      }),
    ]
  }]
});

// ── Write output ───────────────────────────────────────────────
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync('D:/claude_ai_game/ATT_游戏项目汇报_Kenny.docx', buf);
  console.log('Done: ATT_游戏项目汇报_Kenny.docx');
  console.log('Size:', (buf.length / 1024).toFixed(0), 'KB');
});
