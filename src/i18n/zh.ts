const zh = {
  app: { title: "CSS Visual Toolbox" },

  home: {
    tagline: "Open Source Design Tools",
    heading: "CSS Visual Toolbox",
    subtitle: "开源、离线可用、支持多框架导出的 CSS 可视化编辑工具集",
    offline: "全部工具数据保存在本地浏览器，无需网络即可使用",
    github: "GitHub 开源",
  },

  tools: {
    "clip-path": {
      name: "Clip Path",
      desc: "可视化编辑 CSS clip-path 形状，支持 polygon、circle、ellipse、inset，实时预览 + 代码导出",
    },
    gradient: {
      name: "Gradient",
      desc: "线性 / 径向 / 锥形渐变编辑器，拖拽色标、调角度、导出多框架代码",
    },
    shadow: {
      name: "Box Shadow",
      desc: "多层阴影叠加编辑器，支持新拟态 (Neumorphism) 一键生成，x / y / blur / spread 可视化调节",
    },
    radius: {
      name: "Border Radius",
      desc: "圆角可视化调节，支持对称 / 独立四角控制，百分比与像素单位自由切换",
    },
  },

  clipPath: {
    title: "Clip Path",
    description: "可视化编辑 CSS clip-path，支持 polygon / circle / ellipse / inset 四种形状",
    shape: "形状",
    presets: "预设",
    points: "顶点",
    add: "+ 添加",
    del: "删",
  },

  gradient: {
    title: "Gradient",
    description: "线性 / 径向 / 锥形渐变编辑器，拖拽色标调节，实时预览 + 多格式代码导出",
    type: "类型",
    angle: "角度",
    stops: "色标",
  },

  shadow: {
    title: "Box Shadow",
    description: "多层阴影叠加 + 新拟态 (Neumorphism) 一键生成，x / y / blur / spread 可视化调节",
    neumorphism: "新拟态",
    layers: "图层",
    layer: "图层",
  },

  radius: {
    title: "Border Radius",
    description: "圆角可视化调节，支持对称 / 独立四角控制 + px / % 单位切换",
    unit: "单位",
    mode: "模式",
    symmetric: "对称",
    independent: "独立",
    allCorners: "全部圆角",
    topLeft: "左上",
    topRight: "右上",
    bottomRight: "右下",
    bottomLeft: "左下",
  },

  code: {
    copy: "复制",
    copied: "已复制",
  },

  common: {
    apply: "应用到选中图层",
    back: "返回首页",
    del: "删",
    add: "+ 添加",
    darkMode: "切换暗色模式",
    footer: "CSS Visual Toolbox for Figma",
  },
};

export default zh;
export type Translations = typeof zh;
