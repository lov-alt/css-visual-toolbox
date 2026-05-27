<p align="center">
  <img src="public/favicon.svg" width="64" alt="CSS Visual Toolbox" />
</p>

<h1 align="center">CSS Visual Toolbox</h1>

<p align="center">
  开源 CSS 可视化工具箱 — 直观的图形界面，实时预览，多框架代码导出
</p>

<p align="center">
  <a href="https://github.com/lov-alt/css-visual-toolbox/stargazers">
    <img src="https://img.shields.io/github/stars/lov-alt/css-visual-toolbox?style=flat-square&color=6366f1" alt="Stars" />
  </a>
  <a href="https://github.com/lov-alt/css-visual-toolbox/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/lov-alt/css-visual-toolbox?style=flat-square&color=6366f1" alt="License" />
  </a>
  <a href="https://github.com/lov-alt/css-visual-toolbox/deployments">
    <img src="https://img.shields.io/github/deployments/lov-alt/css-visual-toolbox/github-pages?style=flat-square&label=gh%20pages" alt="GitHub Pages" />
  </a>
</p>

---

## Live Demo

**[lov-alt.github.io/css-visual-toolbox](https://lov-alt.github.io/css-visual-toolbox/)**

## Quick Start

### Online — 免安装直接使用

打开 [GitHub Pages](https://lov-alt.github.io/css-visual-toolbox/) 即可使用，支持 PWA 添加到桌面离线使用。

### Desktop — 下载到本地

```bash
git clone https://github.com/lov-alt/css-visual-toolbox.git
cd css-visual-toolbox
npm install
npm run dev
```

打开 `http://localhost:5173`

### Deploy Your Own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lov-alt/css-visual-toolbox)

点击上方按钮一键部署到 Vercel，或手动构建静态文件部署到任意服务器：

```bash
npm run build   # 产出 dist/ 目录，可直接托管
```

---

## Tools

| Tool | Description |
| --- | --- |
| **Clip Path** | 可视化编辑 clip-path，支持 polygon / circle / ellipse / inset，7 种预设形状 |
| **Gradient** | 线性 / 径向 / 锥形渐变编辑器，拖拽色标、调角度 |
| **Box Shadow** | 多层阴影叠加编辑，一键生成 Neumorphism (新拟态) |
| **Border Radius** | 圆角可视化调节，对称 / 独立四角控制，px / % 切换 |

## Features

- **实时预览** — 所有参数即时看到效果
- **三格式导出** — CSS / Tailwind / React 代码一键复制
- **暗色模式** — 跟随系统偏好，手动切换
- **离线可用** — PWA 就绪，数据存储在浏览器本地

## Tech Stack

React 19 + TypeScript + Vite + Tailwind CSS v4 + React Router

## License

MIT — 自由使用、修改、分发。
