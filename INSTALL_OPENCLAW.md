# Auto-Redbook-Skills 部署到 OpenClaw 指南

本文档详细介绍如何将 Auto-Redbook-Skills 部署安装到 OpenClaw 中。

## 📋 目录

- [什么是 OpenClaw](#什么是-openclaw)
- [前提条件](#前提条件)
- [安装步骤](#安装步骤)
  - [1. 安装 OpenClaw](#1-安装-openclaw)
  - [2. 安装 Auto-Redbook-Skills](#2-安装-auto-redbook-skills)
  - [3. 安装依赖](#3-安装依赖)
  - [4. 配置技能](#4-配置技能)
- [使用方法](#使用方法)
- [常见问题](#常见问题)
- [故障排查](#故障排查)

## 🤔 什么是 OpenClaw

OpenClaw 是一个支持 Skills 扩展的 AI 客户端，允许用户安装和使用各种技能来增强 AI 的功能。它提供了一个统一的接口，让用户可以方便地管理和使用不同的技能。

## 📦 前提条件

在开始部署之前，请确保您的系统满足以下要求：

- **操作系统**：Windows、macOS 或 Linux
- **Python**：3.8 或更高版本
- **Node.js**：14.0 或更高版本
- **Git**：用于克隆代码库
- **OpenClaw**：最新版本

## 🚀 安装步骤

### 1. 安装 OpenClaw

1. 访问 OpenClaw 官方网站或 GitHub 仓库下载最新版本的 OpenClaw
2. 按照官方安装指南完成安装
3. 启动 OpenClaw 并完成初始设置

### 2. 安装 Auto-Redbook-Skills

#### 方法一：直接克隆到 OpenClaw 技能目录

1. 找到 OpenClaw 的技能目录：
   - **Windows**：`%APPDATA%\OpenClaw\skills`
   - **macOS**：`~/Library/Application Support/OpenClaw/skills`
   - **Linux**：`~/.config/OpenClaw/skills`

2. 克隆项目到技能目录：

```bash
# 进入技能目录
cd /path/to/openclaw/skills

# 克隆项目
git clone https://github.com/comeonzhj/Auto-Redbook-Skills.git
```

#### 方法二：通过 OpenClaw 界面安装

1. 打开 OpenClaw
2. 进入「技能管理」界面
3. 点击「添加技能」按钮
4. 输入项目 GitHub 地址：`https://github.com/comeonzhj/Auto-Redbook-Skills.git`
5. 点击「安装」按钮

### 3. 安装依赖

进入 Auto-Redbook-Skills 目录，安装所需的依赖：

#### Python 依赖

```bash
# 进入技能目录
cd /path/to/openclaw/skills/Auto-Redbook-Skills

# 安装 Python 依赖
pip install -r requirements.txt

# 安装 Playwright 浏览器
playwright install chromium
```

#### Node.js 依赖

```bash
# 安装 Node.js 依赖
npm install

# 安装 Playwright 浏览器
npx playwright install chromium
```

### 4. 配置技能

1. 打开 OpenClaw
2. 进入「技能管理」界面
3. 找到 Auto-Redbook-Skills 技能
4. 点击「配置」按钮
5. 根据需要调整配置选项

## 📖 使用方法

在 OpenClaw 中使用 Auto-Redbook-Skills：

1. 打开 OpenClaw 聊天界面
2. 输入指令：`/小红书笔记 创建 <内容>`
3. 可选参数：
   - `--theme <主题>`：指定卡片主题（如 `playful-geometric`）
   - `--mode <分页模式>`：指定分页模式（如 `auto-split`）

### 示例

```
/小红书笔记 创建 最近在出版圈混，发现这个行业正在经历一场深刻的变革！📚 传统出版人都在讨论：数字化浪潮下，我们该如何生存和发展？ --theme professional --mode auto-split
```

## ❓ 常见问题

### 1. 技能安装后不显示

**解决方案**：
- 检查技能目录是否正确
- 确保依赖安装成功
- 重启 OpenClaw

### 2. 渲染图片失败

**解决方案**：
- 检查 Playwright 是否正确安装
- 确保网络连接正常
- 检查 Markdown 文件格式是否正确

### 3. 发布到小红书失败

**解决方案**：
- 检查 Cookie 是否正确配置
- 确保 Cookie 未过期
- 检查网络连接是否正常

## 🔧 故障排查

### 查看日志

OpenClaw 的日志文件通常位于：
- **Windows**：`%APPDATA%\OpenClaw\logs`
- **macOS**：`~/Library/Application Support/OpenClaw/logs`
- **Linux**：`~/.config/OpenClaw/logs`

### 检查依赖

```bash
# 检查 Python 依赖
pip list | grep -E "xhs|playwright|python-dotenv"

# 检查 Node.js 依赖
npm list | grep -E "playwright|marked"
```

### 测试渲染功能

```bash
# 测试 Python 渲染脚本
python scripts/render_xhs.py demos/content.md -m auto-split

# 测试 Node.js 渲染脚本
node scripts/render_xhs.js demos/content.md -m auto-split
```

## 📞 支持

如果在部署过程中遇到问题，可以：

1. 查看项目的 [README.md](README.md) 文件获取更多信息
2. 在项目 GitHub 仓库提交 Issue
3. 联系项目维护者获取支持

---

**注意**：本指南基于当前版本的 OpenClaw 和 Auto-Redbook-Skills。如果您使用的是不同版本，可能需要调整安装步骤。

祝您使用愉快！ 🎉