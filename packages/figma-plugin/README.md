# CSS Visual Toolbox — Figma Plugin

在 Figma 设计稿中直接使用 CSS Visual Toolbox，选中图层一键应用样式。

## Supported Tools

| Tool | Figma Mapping |
|------|--------------|
| **Border Radius** | `cornerRadius` / individual corner radii |
| **Gradient** | `GRADIENT_LINEAR` / `GRADIENT_RADIAL` fills |
| **Box Shadow** | `DROP_SHADOW` / `INNER_SHADOW` effects |
| **Clip Path** | Polygon → vector shape replacement; circle/ellipse → ellipse shape |

## Development

```bash
npm install --legacy-peer-deps
npm run build    # builds both UI (vite) and backend (esbuild)
```

## Install in Figma

1. Open Figma desktop app
2. **Plugins → Development → Import plugin from manifest**
3. Select `packages/figma-plugin/manifest.json`
4. The plugin appears under **Plugins → Development → CSS Visual Toolbox**

## Usage

1. Select one or more layers in Figma
2. Run the plugin (Plugins → Development → CSS Visual Toolbox)
3. Choose a tool tab, adjust parameters
4. Click **Apply to Selection**

## Project Structure

```
src/
├── code.ts          # Figma sandbox backend — applies styles via Figma API
└── ui/              # React UI loaded in iframe
    ├── index.html
    ├── main.tsx
    ├── App.tsx       # All 4 tool panels
    └── index.css
```
