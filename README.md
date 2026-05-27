<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="public/favicon.svg">
    <img src="public/favicon.svg" width="80" alt="CSS Visual Toolbox" />
  </picture>
</p>

<h1 align="center">CSS Visual Toolbox</h1>

<p align="center">
  <strong>开源 CSS 可视化编辑工具集</strong> — 图形化界面编辑 CSS 效果，实时预览，一键导出生产代码
</p>

<p align="center">
  <a href="https://lov-alt.github.io/css-visual-toolbox/"><img src="https://img.shields.io/badge/demo-live-6366f1?style=flat-square" alt="Live Demo" /></a>
  <a href="https://github.com/lov-alt/css-visual-toolbox/stargazers"><img src="https://img.shields.io/github/stars/lov-alt/css-visual-toolbox?style=flat-square&color=6366f1" alt="Stars" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/lov-alt/css-visual-toolbox?style=flat-square&color=6366f1" alt="MIT License" /></a>
  <a href="https://github.com/lov-alt/css-visual-toolbox/deployments"><img src="https://img.shields.io/github/deployments/lov-alt/css-visual-toolbox/github-pages?style=flat-square&label=pages" alt="Pages" /></a>
</p>

---

## Live Demo

<p align="center">
  <a href="https://lov-alt.github.io/css-visual-toolbox/">
    <strong>lov-alt.github.io/css-visual-toolbox</strong>
  </a>
</p>

---

## Tools

| Tool | What it does |
| --- | --- |
| **Clip Path** | polygon / circle / ellipse / inset 可视化编辑，7 种预设形状，实时裁切预览 |
| **Gradient** | 线性 / 径向 / 锥形渐变，拖拽色标调节，`background-blend-mode` 实时混合 |
| **Box Shadow** | 多层阴影叠加，Neumorphism 一键生成，x / y / blur / spread 独立控制 |
| **Border Radius** | 四角独立圆角，px / % 切换，对称 / 非对称模式 |

## Features

| | |
| --- | --- |
| 实时预览 | 所有参数即时反映在预览区 |
| 图片上传 | 拖拽或点击上传本地图片，预览效果直接应用到照片上 |
| 占位图 | 内置 3 张专业 SVG 占位图，不上传图片也有内容预览 |
| 7 框架导出 | CSS / Tailwind / React / Vue / Svelte / SwiftUI / Flutter |
| 语法高亮 | 代码面板 token 级着色，行号，macOS 风格窗口 |
| 可折叠 | 代码面板默认隐藏，点 ⌄ 展开 — 让工具回归编辑体验 |
| 暗色模式 | 跟随系统偏好 + 手动切换，localStorage 记忆 |
| 国际化 | 中文 / English / 日本語，自动检测浏览器语言 |
| Figma 插件 | 同款工具嵌入 Figma，选中图层一键应用样式 |
| 离线就绪 | PWA 架构，所有计算在浏览器端完成，无需网络 |
| 零依赖部署 | 纯静态 `dist/`，丢到任意服务器即用 |

## Quick Start

```bash
git clone https://github.com/lov-alt/css-visual-toolbox.git
cd css-visual-toolbox
npm install
npm run dev        # http://localhost:5173
```

一键部署到 Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lov-alt/css-visual-toolbox)

## Figma Plugin

```bash
cd packages/figma-plugin
npm install --legacy-peer-deps
npm run build

# Figma → Plugins → Development → Import plugin from manifest
# 选择 packages/figma-plugin/manifest.json
```

插件将 CSS 值直接映射到 Figma API — `fills`、`effects`、`cornerRadius`、矢量形状等。

## Tech Stack

React 19 · TypeScript · Vite · Tailwind CSS v4 · React Router

## License

MIT
