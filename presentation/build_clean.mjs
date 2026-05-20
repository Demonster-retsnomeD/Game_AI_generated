import pptxgen from "pptxgenjs";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const img = (name) => path.join(__dirname, name);

const prs = new pptxgen();
prs.layout = "LAYOUT_WIDE"; // 13.33 x 7.5 in

// ── Palette ──────────────────────────────────────────────────────────────────
const DARK   = "0f172a";
const NAVY   = "1e3a5f";
const ACCENT = "0ea5e9";
const WHITE  = "FFFFFF";
const LIGHT  = "f0f4f8";
const GRAY   = "64748b";
const GREEN  = "16a34a";
const AMBER  = "d97706";
const RED    = "dc2626";
const BORDER = "dde3ed";

// ── Helpers ───────────────────────────────────────────────────────────────────
function footer(slide) {
  slide.addText("Proprietary & Confidential — ATT Group", {
    x: 0.4, y: 7.15, w: 12.5, h: 0.22,
    fontSize: 7, color: "94a3b8", align: "center",
  });
}

// Dark divider slide (Part X)
function divider(prs, num, zh, en, imgPath) {
  const s = prs.addSlide();
  // Full dark BG
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:DARK} });
  // Right image strip
  if (imgPath) {
    s.addImage({ path: imgPath, x: 6.8, y: 0, w: 6.53, h: 7.5, sizing:{ type:"cover", w:6.53, h:7.5 } });
    // gradient overlay on image
    s.addShape(prs.ShapeType.rect, { x:6.8, y:0, w:6.53, h:7.5,
      fill:{ type:"gradient", stops:[{pos:0,color:"0f172a"},{pos:40,color:"0f172a",transparency:40},{pos:100,color:"0f172a",transparency:90}], angle:0 } });
  }
  // Part number
  s.addText(`${num < 10 ? "0" + num : num}`, {
    x:0.6, y:1.6, w:1.4, h:1.4, fontSize:72, bold:true,
    color: ACCENT, align:"left",
  });
  s.addText("PART", {
    x:0.6, y:1.3, w:3, h:0.4, fontSize:11, bold:true, color:"475569", charSpacing:5, align:"left",
  });
  s.addShape(prs.ShapeType.rect, { x:0.6, y:3.3, w:1.2, h:0.06, fill:{color:ACCENT} });
  s.addText(zh, { x:0.6, y:3.6, w:6, h:0.7, fontSize:36, bold:true, color:WHITE, align:"left" });
  s.addText(en, { x:0.6, y:4.35, w:6, h:0.45, fontSize:18, color:"94a3b8", align:"left" });
  return s;
}

// Icon badge (colored circle background behind emoji)
function iconCard(s, x, y, w, h, icon, title, body, accentColor) {
  const c = accentColor || ACCENT;
  // card bg
  s.addShape(prs.ShapeType.roundRect, { x, y, w, h, rectRadius:0.12,
    fill:{color:LIGHT}, line:{color:BORDER, w:0.5} });
  // icon circle
  s.addShape(prs.ShapeType.ellipse, { x: x+0.18, y: y+0.18, w:0.52, h:0.52, fill:{color:c, transparency:15} });
  s.addText(icon, { x: x+0.15, y: y+0.13, w:0.58, h:0.58, fontSize:16, align:"center", valign:"middle" });
  s.addText(title, { x: x+0.8, y: y+0.15, w: w-0.95, h:0.32, fontSize:11, bold:true, color:DARK, align:"left" });
  s.addText(body,  { x: x+0.8, y: y+0.47, w: w-0.95, h: h-0.6, fontSize:9.5, color:GRAY, align:"left", breakLine:true });
}

// ── SLIDE 1 — Title ──────────────────────────────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:DARK} });
  // Robot image right half
  s.addImage({ path: img("robot2.png"), x:6.4, y:0, w:6.93, h:7.5, sizing:{type:"cover",w:6.93,h:7.5} });
  // gradient overlay
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5,
    fill:{ type:"gradient", stops:[{pos:0,color:DARK},{pos:50,color:DARK,transparency:0},{pos:70,color:DARK,transparency:60},{pos:100,color:DARK,transparency:90}], angle:90 } });

  s.addText("工作汇报", { x:0.7, y:1.4, w:7, h:0.55, fontSize:13, color:ACCENT, bold:true, charSpacing:6 });
  s.addText("PROGRESS REPORT", { x:0.7, y:2.0, w:8, h:1.2, fontSize:54, bold:true, color:WHITE });
  s.addShape(prs.ShapeType.rect, { x:0.7, y:3.35, w:1.8, h:0.06, fill:{color:ACCENT} });
  s.addText("机器人系统  ·  AI游戏开发  ·  Claude Code 应用", {
    x:0.7, y:3.6, w:8, h:0.4, fontSize:13, color:"94a3b8",
  });
  // Meta pills
  const pillY = 5.4;
  const pills = [["📅","2025"],["👤","Kenny"],["🏢","ATT Group"]];
  pills.forEach(([icon, label], i) => {
    const px = 0.7 + i * 2.0;
    s.addShape(prs.ShapeType.roundRect, { x:px, y:pillY, w:1.7, h:0.42, rectRadius:0.21,
      fill:{color:"1e3a5f"}, line:{color:ACCENT,w:0.5} });
    s.addText(`${icon}  ${label}`, { x:px, y:pillY, w:1.7, h:0.42, fontSize:10.5, color:WHITE, align:"center", valign:"middle" });
  });
  footer(s);
}

// ── SLIDE 2 — Part 01 Divider ─────────────────────────────────────────────────
divider(prs, 1, "机器人系统", "Robot System", img("robot1.png"));

// ── SLIDE 3 — Robot: Completed ───────────────────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:WHITE} });
  // Accent left bar
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:0.08, h:7.5, fill:{color:GREEN} });

  s.addText("✅  已完成 — 机器人基础功能", {
    x:0.5, y:0.35, w:8, h:0.5, fontSize:20, bold:true, color:DARK
  });
  s.addText("Robot System — Completed Milestones", {
    x:0.5, y:0.88, w:8, h:0.3, fontSize:11, color:GRAY
  });

  const cards = [
    ["🔧","接线排查","发现并纠正 PCB 接线错误"],
    ["🚗","基础运动","正常行驶，响应控制指令"],
    ["🗺️","地图探测","扫描环境并建立 SLAM 地图"],
    ["📍","自主导航","A→B 路径规划，自主到达"],
    ["📱","WiFi 远控","同热点下正常通信"],
  ];
  cards.forEach(([icon, title, body], i) => {
    const col = i < 3 ? 0 : 1;
    const row = i < 3 ? i : i - 3;
    const x = 0.5 + col * 3.7;
    const y = 1.45 + row * 1.55;
    iconCard(s, x, y, 3.35, 1.35, icon, title, body, GREEN);
    // Check badge
    s.addText("✓ 完成", { x: x+2.6, y: y+0.12, w:0.65, h:0.25,
      fontSize:8, color:GREEN, bold:true, align:"right" });
  });

  // Robot image right
  s.addImage({ path: img("robot1.png"), x:7.7, y:0.8, w:5.3, h:6.2,
    sizing:{type:"contain",w:5.3,h:6.2} });

  footer(s);
}

// ── SLIDE 4 — Problem: Display Short Circuit ──────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:DARK} });
  // Left content
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:0.08, h:7.5, fill:{color:RED} });
  s.addText("⚠️  当前问题", { x:0.5, y:0.35, w:6, h:0.5, fontSize:20, bold:true, color:WHITE });
  s.addText("显示屏短路 — 机器人暂时无法远程操控", {
    x:0.5, y:0.9, w:6.5, h:0.35, fontSize:12, color:"94a3b8"
  });

  // 3 problem cards
  const probs = [
    ["💥","起因","封装时两块 PCB 金属背板背靠背接触，导致显示屏短路黑屏"],
    ["📡","影响","无法进入设置界面配置 WiFi 热点，目前无法远程操控"],
    ["💡","教训","金属背板之间必须加绝缘隔层，封装前检查各部件绝缘状态"],
  ];
  probs.forEach(([icon, title, body], i) => {
    const y = 1.55 + i * 1.6;
    s.addShape(prs.ShapeType.roundRect, { x:0.5, y, w:5.8, h:1.4, rectRadius:0.1,
      fill:{color:"1e293b"}, line:{color:"334155",w:0.5} });
    s.addShape(prs.ShapeType.ellipse, { x:0.75, y:y+0.42, w:0.55, h:0.55, fill:{color:RED, transparency:20} });
    s.addText(icon, { x:0.72, y:y+0.38, w:0.62, h:0.62, fontSize:16, align:"center", valign:"middle" });
    s.addText(title, { x:1.45, y:y+0.15, w:4.7, h:0.3, fontSize:12, bold:true, color:WHITE });
    s.addText(body,  { x:1.45, y:y+0.48, w:4.7, h:0.72, fontSize:9.5, color:"94a3b8", breakLine:true });
  });

  // Package box image right
  s.addImage({ path: img("package_box.png"), x:6.8, y:0.6, w:6.1, h:6.3,
    sizing:{type:"contain",w:6.1,h:6.3} });

  footer(s);
}

// ── SLIDE 5 — Solution & Pre-development ────────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:WHITE} });
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:0.08, h:7.5, fill:{color:ACCENT} });

  s.addText("🔭  解决方案 & 软件预开发", {
    x:0.5, y:0.35, w:12, h:0.5, fontSize:20, bold:true, color:DARK
  });

  // Left: Hardware steps
  s.addText("硬件修复路径", { x:0.5, y:1.1, w:5.5, h:0.35, fontSize:12, bold:true, color:GRAY, charSpacing:2 });
  const hw = [
    ["1","新显示屏已下单","预计 1–2 周到货","进行中"],
    ["2","安装 & WiFi 配置","显示屏到货后重新配置热点","待完成"],
    ["3","系统实际联调","软件与机器人进行连接测试","待完成"],
  ];
  hw.forEach(([n, title, sub, status], i) => {
    const y = 1.62 + i * 1.52;
    s.addShape(prs.ShapeType.ellipse, { x:0.5, y:y+0.25, w:0.5, h:0.5,
      fill:{color: n==="1"?ACCENT:BORDER} });
    s.addText(n, { x:0.5, y:y+0.25, w:0.5, h:0.5, fontSize:13, bold:true,
      color: n==="1"?WHITE:GRAY, align:"center", valign:"middle" });
    s.addText(title, { x:1.15, y:y+0.22, w:5, h:0.3, fontSize:12, bold:true, color:DARK });
    s.addText(sub,   { x:1.15, y:y+0.55, w:5, h:0.25, fontSize:9.5, color:GRAY });
    // status badge
    const bc = n==="1"?ACCENT:"94a3b8";
    s.addShape(prs.ShapeType.roundRect, { x:4.8, y:y+0.22, w:1.05, h:0.27, rectRadius:0.13,
      fill:{color:"f0f9ff"}, line:{color:bc,w:0.5} });
    s.addText(status, { x:4.8, y:y+0.22, w:1.05, h:0.27, fontSize:7.5, color:bc, bold:true, align:"center", valign:"middle" });
  });

  // Divider
  s.addShape(prs.ShapeType.rect, { x:6.35, y:1.0, w:0.06, h:6.1, fill:{color:BORDER} });

  // Right: Software ready
  s.addText("软件已提前完成", { x:6.6, y:1.1, w:6.3, h:0.35, fontSize:12, bold:true, color:GRAY, charSpacing:2 });
  s.addText("利用 Claude Code 在硬件修复前完成全部 UI 开发", {
    x:6.6, y:1.55, w:6.3, h:0.35, fontSize:10.5, color:GRAY
  });

  const sw = [
    ["✅","完整控制系统 UI"],
    ["✅","账号登录 / 注册系统"],
    ["✅","机器人状态实时显示"],
    ["✅","导航指令 & 地图可视化"],
  ];
  sw.forEach(([icon, label], i) => {
    const y = 2.1 + i * 0.82;
    s.addShape(prs.ShapeType.roundRect, { x:6.6, y, w:6.0, h:0.65, rectRadius:0.09,
      fill:{color:"f0fdf4"}, line:{color:"bbf7d0",w:0.5} });
    s.addText(`${icon}  ${label}`, {
      x:6.85, y, w:5.7, h:0.65, fontSize:12, color:DARK, valign:"middle", bold:true
    });
  });

  // Strategy box
  s.addShape(prs.ShapeType.roundRect, { x:6.6, y:5.5, w:6.0, h:1.5, rectRadius:0.1,
    fill:{color:"eff6ff"}, line:{color:ACCENT,w:0.8} });
  s.addText("💡  策略优势", { x:6.85, y:5.6, w:5.5, h:0.32, fontSize:11, bold:true, color:ACCENT });
  s.addText("软件已在硬件修复前完成开发\n显示屏到货后可立即进行实际适配，节省整体项目时间", {
    x:6.85, y:5.95, w:5.5, h:0.85, fontSize:10, color:DARK, breakLine:true
  });

  footer(s);
}

// ── SLIDE 6 — Part 02 Divider ─────────────────────────────────────────────────
divider(prs, 2, "AI 生成游戏", "AI-Generated Game", img("ai_game.png"));

// ── SLIDE 7 — Ball Dungeon ────────────────────────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:DARK} });

  // Game screenshot left
  s.addImage({ path: img("ai_game.png"), x:0, y:0, w:7.0, h:7.5,
    sizing:{type:"cover",w:7.0,h:7.5} });
  // gradient overlay on image
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:7.0, h:7.5,
    fill:{ type:"gradient", stops:[{pos:60,color:DARK,transparency:100},{pos:100,color:DARK,transparency:0}], angle:90 } });

  // Right content
  s.addText("🎮  Ball Dungeon", { x:7.3, y:0.5, w:5.7, h:0.55, fontSize:24, bold:true, color:WHITE });
  s.addText("AI 辅助开发的完整浏览器游戏", { x:7.3, y:1.1, w:5.7, h:0.3, fontSize:12, color:"94a3b8" });
  s.addText("🔗  demonster-retsnomed.github.io/Game_AI_generated", {
    x:7.3, y:1.5, w:5.7, h:0.3, fontSize:9, color:ACCENT
  });

  const features = [
    ["🎯","多关卡模式","平台跳跃 · Roguelite · 地牢探索 · 无尽挑战"],
    ["👤","账号系统","注册登录 · 3槽存档 · 跨设备同步"],
    ["🏆","排行榜","无尽模式最高层数 · Top 20 实时更新"],
    ["⚔️","BOSS战","护盾 / 弹幕 / 召唤三阶段 · 打败才能过关"],
  ];
  features.forEach(([icon, title, body], i) => {
    iconCard(s, 7.3, 2.1 + i * 1.25, 5.7, 1.1, icon, title, body, ACCENT);
  });

  footer(s);
}

// ── SLIDE 8 — Tech Architecture ───────────────────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:WHITE} });
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:0.08, h:7.5, fill:{color:ACCENT} });

  s.addText("🛠️  技术架构", { x:0.5, y:0.35, w:12, h:0.5, fontSize:20, bold:true, color:DARK });
  s.addText("Ball Dungeon — Tech Stack", { x:0.5, y:0.88, w:12, h:0.3, fontSize:11, color:GRAY });

  // 3 tech cards
  const techs = [
    ["🌐","前端 Frontend","GitHub Pages","HTML5 Canvas · 纯 JavaScript\n无框架 · ~2,800 行代码", ACCENT],
    ["⚡","后端 Backend","Cloudflare Workers","JWT-less Token 认证\nPBKDF2 加密 · RESTful API", AMBER],
    ["🗄️","数据库 Database","Cloudflare D1 (SQLite)","账号 & Token 存储\n排行榜 & 技能数据持久化", GREEN],
  ];
  techs.forEach(([icon, title, sub, body, color], i) => {
    const x = 0.5 + i * 3.55;
    s.addShape(prs.ShapeType.roundRect, { x, y:1.45, w:3.2, h:4.1, rectRadius:0.14,
      fill:{color:LIGHT}, line:{color:BORDER,w:0.5} });
    // Top color strip
    s.addShape(prs.ShapeType.roundRect, { x, y:1.45, w:3.2, h:0.6, rectRadius:0.14,
      fill:{color:color, transparency:15} });
    s.addText(icon, { x, y:1.45, w:3.2, h:0.6, fontSize:20, align:"center", valign:"middle" });
    s.addText(title, { x:x+0.15, y:2.2, w:2.9, h:0.35, fontSize:12, bold:true, color:DARK, align:"center" });
    s.addText(sub,   { x:x+0.15, y:2.58, w:2.9, h:0.28, fontSize:9.5, color:color, bold:true, align:"center" });
    s.addShape(prs.ShapeType.rect, { x:x+1.0, y:2.9, w:1.2, h:0.04, fill:{color:BORDER} });
    s.addText(body,  { x:x+0.2, y:3.0, w:2.8, h:2.3, fontSize:10, color:GRAY, align:"center", breakLine:true });
  });

  // Previous function screenshot (game UI)
  s.addImage({ path: img("previous_function.png"), x:10.85, y:1.3, w:2.1, h:4.5,
    sizing:{type:"contain",w:2.1,h:4.5} });

  // Learning value strip
  s.addShape(prs.ShapeType.roundRect, { x:0.5, y:5.85, w:10.0, h:1.28, rectRadius:0.1,
    fill:{color:"eff6ff"}, line:{color:ACCENT,w:0.8} });
  s.addText("🎓  学习价值 — 直接服务机器人开发", {
    x:0.7, y:5.95, w:9.5, h:0.32, fontSize:11, bold:true, color:ACCENT
  });
  s.addText("掌握 Claude Code 完整工具链  ·  前后端分离架构设计  ·  API 安全认证  ·  数据库设计 & 自动部署  ·  积累项目调试经验", {
    x:0.7, y:6.3, w:9.5, h:0.6, fontSize:10, color:DARK
  });

  footer(s);
}

// ── SLIDE 9 — Part 03 Divider ─────────────────────────────────────────────────
{
  const s = divider(prs, 3, "Claude Code 应用", "Claude Code Usage", null);
  // Code-like decorative text
  s.addText("> claude --help\n> init project\n> deploy ✓", {
    x:7.5, y:2.5, w:5, h:2, fontSize:16, color:"1e3a5f", fontFace:"Consolas",
    shadow:{type:"outer",color:"0ea5e9",blur:12,offset:0,opacity:0.4}
  });
}

// ── SLIDE 10 — Claude Code Learning ──────────────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:WHITE} });
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:0.08, h:7.5, fill:{color:ACCENT} });

  s.addText("🤖  Claude Code 学习与应用", {
    x:0.5, y:0.35, w:12, h:0.5, fontSize:20, bold:true, color:DARK
  });
  s.addText("起源于 Gabriel 组织的会议介绍，系统性学习 Claude Code 在网站开发和工程项目中的应用", {
    x:0.5, y:0.9, w:12, h:0.32, fontSize:10.5, color:GRAY
  });

  // 5 skills (left)
  s.addText("核心能力", { x:0.5, y:1.45, w:6, h:0.32, fontSize:11, bold:true, color:GRAY, charSpacing:2 });
  const skills = [
    ["AI 辅助代码生成与快速迭代","95%", ACCENT],
    ["项目架构设计","80%", ACCENT],
    ["前后端联调","75%", AMBER],
    ["Token 成本控制策略","85%", GREEN],
    ["机器人系统应用","60%", AMBER],
  ];
  skills.forEach(([label, pct, color], i) => {
    const y = 1.95 + i * 0.92;
    s.addText(label, { x:0.5, y, w:4.5, h:0.28, fontSize:11, color:DARK, bold:true });
    s.addText(pct,   { x:5.0, y, w:0.7, h:0.28, fontSize:11, color:color, bold:true, align:"right" });
    // bar bg
    s.addShape(prs.ShapeType.roundRect, { x:0.5, y:y+0.33, w:5.5, h:0.2, rectRadius:0.1,
      fill:{color:BORDER} });
    // bar fill
    const fillW = 5.5 * parseFloat(pct) / 100;
    s.addShape(prs.ShapeType.roundRect, { x:0.5, y:y+0.33, w:fillW, h:0.2, rectRadius:0.1,
      fill:{color:color} });
  });

  // Right: previous_function2 screenshot
  s.addImage({ path: img("previous_function2.png"), x:6.7, y:1.2, w:6.3, h:5.8,
    sizing:{type:"contain",w:6.3,h:5.8} });
  s.addShape(prs.ShapeType.roundRect, { x:6.7, y:1.2, w:6.3, h:5.8, rectRadius:0.1,
    fill:{type:"none"}, line:{color:BORDER,w:0.5} });

  footer(s);
}

// ── SLIDE 11 — Token Strategy ─────────────────────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:DARK} });

  s.addText("💰  Token 节省策略", {
    x:0.6, y:0.35, w:12, h:0.5, fontSize:20, bold:true, color:WHITE
  });
  s.addText("三层调用体系 — 最大化效率，最小化成本", {
    x:0.6, y:0.88, w:12, h:0.3, fontSize:11, color:"94a3b8"
  });

  const tiers = [
    { n:"0", label:"零 Token", method:"直接 Bash 命令", use:"磁盘 · git · 端口 · 进程 · 版本", save:"100%", color:GREEN },
    { n:"1", label:"本地 AI", method:"Ollama + free-scanner MCP", use:"扫描项目 · 总结代码 · 解释报错", save:"80–95%", color:ACCENT },
    { n:"2", label:"精准操作", method:"Grep + Edit 定点修改", use:"已知位置直接操作，不读整个文件", save:"60–80%", color:AMBER },
    { n:"3", label:"Claude", method:"Claude Code 完整推理", use:"新功能设计 · 复杂架构 · 跨文件逻辑", save:"基准", color:"94a3b8" },
  ];

  tiers.forEach(({ n, label, method, use, save, color }, i) => {
    const y = 1.5 + i * 1.38;
    const barW = 11.6 * (4 - i) / 4;
    // BG bar (decreasing width = pyramid)
    s.addShape(prs.ShapeType.roundRect, { x:0.6, y, w:barW, h:1.15, rectRadius:0.1,
      fill:{color:"1e293b"}, line:{color:"334155",w:0.5} });
    // Left accent
    s.addShape(prs.ShapeType.roundRect, { x:0.6, y, w:0.35, h:1.15, rectRadius:0.08,
      fill:{color:color} });
    // Tier number badge
    s.addShape(prs.ShapeType.ellipse, { x:1.1, y:y+0.25, w:0.62, h:0.62, fill:{color:color, transparency:20} });
    s.addText(n, { x:1.1, y:y+0.25, w:0.62, h:0.62, fontSize:16, bold:true, color:color, align:"center", valign:"middle" });
    // Content
    s.addText(label,  { x:1.88, y:y+0.1,  w:2.2, h:0.32, fontSize:12, bold:true, color:WHITE });
    s.addText(method, { x:4.2,  y:y+0.1,  w:4.2, h:0.32, fontSize:10.5, color:color });
    s.addText(use,    { x:1.88, y:y+0.47, w:8.0, h:0.38, fontSize:9.5, color:"94a3b8" });
    // Save badge
    s.addShape(prs.ShapeType.roundRect, { x: barW - 0.05, y:y+0.3, w:1.1, h:0.5, rectRadius:0.08,
      fill:{color:color, transparency:20}, line:{color:color,w:0.5} });
    s.addText(save, { x: barW - 0.05, y:y+0.3, w:1.1, h:0.5, fontSize:11, bold:true, color:color, align:"center", valign:"middle" });
  });

  footer(s);
}

// ── SLIDE 12 — Thank You ──────────────────────────────────────────────────────
{
  const s = prs.addSlide();
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5, fill:{color:DARK} });
  // Robot image subtle bg
  s.addImage({ path: img("robot2.png"), x:7.5, y:0, w:5.83, h:7.5,
    sizing:{type:"cover",w:5.83,h:7.5} });
  s.addShape(prs.ShapeType.rect, { x:0, y:0, w:13.33, h:7.5,
    fill:{ type:"gradient", stops:[{pos:0,color:DARK},{pos:55,color:DARK,transparency:0},{pos:75,color:DARK,transparency:70},{pos:100,color:DARK,transparency:90}], angle:90 } });

  s.addText("谢谢", { x:0.8, y:2.2, w:8, h:1.1, fontSize:64, bold:true, color:WHITE });
  s.addText("Thank You", { x:0.8, y:3.35, w:8, h:0.65, fontSize:28, color:ACCENT });
  s.addShape(prs.ShapeType.rect, { x:0.8, y:4.2, w:1.6, h:0.06, fill:{color:ACCENT} });
  s.addText("以上为本阶段工作汇报，欢迎提问与反馈", {
    x:0.8, y:4.4, w:8, h:0.4, fontSize:13, color:"94a3b8"
  });
  s.addText("ATT Group  ·  35 Ubi Crescent, ATT Building, Singapore 408585", {
    x:0.8, y:5.1, w:8, h:0.35, fontSize:10.5, color:"475569"
  });

  footer(s);
}

// ── Write ─────────────────────────────────────────────────────────────────────
const outPath = path.join(__dirname, "ATT_Progress_Report_2025_Clean.pptx");
await prs.writeFile({ fileName: outPath });
console.log("Written:", outPath);
