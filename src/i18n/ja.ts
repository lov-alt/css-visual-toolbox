import type { Translations } from "./zh";

const ja: Translations = {
  app: { title: "CSS Visual Toolbox" },

  home: {
    tagline: "Open Source Design Tools",
    heading: "CSS Visual Toolbox",
    subtitle: "オープンソース、オフライン対応、マルチフレームワーク出力のCSSビジュアル編集ツール",
    offline: "すべてのデータはブラウザにローカル保存 — オフラインでも使えます",
    github: "GitHub",
  },

  tools: {
    "clip-path": {
      name: "Clip Path",
      desc: "CSS clip-pathをビジュアル編集 — polygon、circle、ellipse、insetに対応、ライブプレビュー+コード出力",
    },
    gradient: {
      name: "Gradient",
      desc: "線形/放射/扇形グラデーションエディタ、カラーストップをドラッグ、マルチフレームワーク出力",
    },
    shadow: {
      name: "Box Shadow",
      desc: "多層シャドウエディタ、ニューモフィズムプリセット、x/y/blur/spreadをビジュアル調整",
    },
    radius: {
      name: "Border Radius",
      desc: "角丸をビジュアル編集、独立コーナー制御、px/%単位切替",
    },
  },

  clipPath: {
    title: "Clip Path",
    description: "CSS clip-pathをビジュアル編集 — polygon / circle / ellipse / inset",
    shape: "形状",
    presets: "プリセット",
    points: "頂点",
    add: "+ 追加",
    del: "削除",
  },

  gradient: {
    title: "Gradient",
    description: "線形 / 放射 / 扇形グラデーションエディタ、ライブプレビュー+マルチフレームワーク出力",
    type: "タイプ",
    angle: "角度",
    stops: "ストップ",
  },

  shadow: {
    title: "Box Shadow",
    description: "多層シャドウ + ニューモフィズムプリセット、ビジュアルコントロール",
    neumorphism: "ニューモフィズム",
    layers: "レイヤー",
    layer: "レイヤー",
  },

  radius: {
    title: "Border Radius",
    description: "角丸のビジュアルエディタ — 対称/独立 + px/% 単位",
    unit: "単位",
    mode: "モード",
    symmetric: "対称",
    independent: "独立",
    allCorners: "すべての角",
    topLeft: "左上",
    topRight: "右上",
    bottomRight: "右下",
    bottomLeft: "左下",
  },

  code: {
    copy: "コピー",
    copied: "コピー済み",
  },

  common: {
    apply: "選択に適用",
    back: "ホームに戻る",
    del: "削除",
    add: "+ 追加",
    darkMode: "ダークモード切替",
    footer: "CSS Visual Toolbox for Figma",
  },
};

export default ja;
