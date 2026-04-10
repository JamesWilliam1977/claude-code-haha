# Claude Code 桌面端文档

> 图形化的 AI Code Editor，支持多会话、多标签、外部 UI 接入的完整桌面体验。

---

## 文档目录

### [01-quick-start.md](./01-quick-start.md) — 快速上手

面向用户的桌面端使用指南，涵盖：

- **启动与界面**：首次运行、界面布局、主题切换
- **对话操作**：新建会话、发送消息、附件上传、斜杠命令
- **多标签系统**：标签切换、拖拽排序、关闭策略
- **权限控制**：四种权限模式、工具审批流程
- **项目管理**：工作目录关联、项目筛选、Git 信息展示
- **模型与提供商**：模型切换、自定义 Provider、连接测试
- **IM 适配器**：Telegram / 飞书接入、用户配对
- **定时任务**：Cron 任务创建、运行历史查看

**适合人群**：所有桌面端用户

---

### [02-architecture.md](./02-architecture.md) — 架构设计

面向开发者的技术架构解析，涵盖：

- **技术栈总览**：Tauri 2 + React 18 + Zustand + Vite + Tailwind CSS 4
- **三层架构**：Tauri Shell → Express Server → CLI 子进程
- **通信协议**：WebSocket 消息格式、HTTP API 端点、流式输出机制
- **状态管理**：Zustand Store 设计、数据流向、持久化策略
- **会话生命周期**：创建 → 连接 → 交互 → 断开 → 恢复
- **代理层**：多协议转换（Anthropic / OpenAI）、Provider 管理
- **适配器桥接**：外部 IM 平台的 WebSocket 接入架构

**适合人群**：贡献者、架构师、想接入自定义 UI 的开发者

---

### [03-features.md](./03-features.md) — 功能详解

深入解析桌面端每个功能模块，涵盖：

- **聊天引擎**：消息类型、流式渲染、代码高亮、Diff 展示、思考块
- **工具调用系统**：权限请求卡片、Tool 输入/输出展示、Bash 终端模拟
- **Agent Teams**：团队视图、成员状态、转录查看
- **技能与 Agent 定义**：技能浏览、Agent 配置、自定义扩展
- **定时任务**：Cron 编辑器、Day-of-Week 选择、运行日志
- **国际化**：中英文切换、翻译 Key 体系
- **键盘快捷键**：全局快捷键、输入框快捷操作

**适合人群**：想充分利用桌面端功能的高级用户和开发者

---

## 配图说明

所有配图采用深色背景（#1a1a2e）+ Anthropic 品牌橙铜色（#D97757）风格，与项目文档视觉语言一致。

| 图片 | 说明 | 所属文档 |
|------|------|----------|
| `01-desktop-overview.png` | 桌面端界面总览 — 布局与核心区域 | 快速上手 |
| `02-tech-stack.png` | 技术栈全景 — 框架与工具链 | 架构设计 |
| `03-three-layer-arch.png` | 三层架构图 — Tauri / Server / CLI | 架构设计 |
| `04-websocket-protocol.png` | WebSocket 通信协议 — 消息类型与流向 | 架构设计 |
| `05-session-lifecycle.png` | 会话生命周期 — 创建到恢复的完整流程 | 架构设计 |
| `06-features-grid.png` | 功能全景图 — 核心功能模块一览 | 功能详解 |
| `07-adapter-bridge.png` | 适配器桥接 — 外部 IM 平台接入架构 | 功能详解 |
| `08-chat-message-flow.png` | 聊天消息流 — 从输入到渲染的数据流 | 功能详解 |

---

## 快速开始

### 用户

1. 阅读 [快速上手](./01-quick-start.md)
2. 了解界面布局和基本操作
3. 配置 AI 模型提供商
4. 开始你的第一次对话

### 开发者

1. 阅读 [架构设计](./02-architecture.md)
2. 查看源码位置：
   - `desktop/src/` — React 前端代码
   - `desktop/src-tauri/` — Tauri Rust 后端
   - `desktop/sidecars/` — Sidecar 启动器
   - `src/server/` — Express API 服务端
   - `adapters/` — 外部 IM 适配器
3. 理解三层架构和 WebSocket 通信协议

---

## 核心概念速查

| 概念 | 说明 |
|------|------|
| **Tauri** | 轻量级跨平台桌面框架，用 Rust 管理窗口和 Sidecar 进程 |
| **Sidecar** | 随 Tauri 主进程启动的后台服务，运行 Express API 服务器 |
| **Session** | 一次对话会话，绑定工作目录，通过 WebSocket 通信 |
| **Tab** | 标签页，一个 Tab 对应一个 Session 或特殊页面（设置、任务） |
| **Provider** | AI 模型提供商，支持 Anthropic、OpenAI 兼容等多种接口 |
| **Adapter** | 外部 IM 适配器，让 Telegram / 飞书等平台接入 Claude Code |
| **Pairing** | 配对机制，6 位安全码授权外部 IM 用户访问 |
| **Store** | Zustand 状态容器，管理聊天、会话、设置等状态 |
| **Slash Command** | 斜杠命令，`/commit`、`/review-pr` 等快捷操作 |

---

## 相关资源

- [Claude Code Haha 主页](/)
- [多 Agent 系统文档](/agent/)
- [记忆系统文档](/memory/)
- [Skills 系统文档](/skills/)
- [GitHub Issues](https://github.com/NanmiCoder/cc-haha/issues)
