import type { Translations } from "./zh";

const en: Translations = {
  app: { title: "CSS Visual Toolbox" },

  home: {
    tagline: "Open Source Design Tools",
    heading: "CSS Visual Toolbox",
    subtitle: "Open source, offline-ready CSS visual editing toolkit with multi-framework export",
    offline: "All data stored locally in your browser — works without internet",
    github: "GitHub",
  },

  tools: {
    "clip-path": {
      name: "Clip Path",
      desc: "Visually edit CSS clip-path shapes — polygon, circle, ellipse, inset with live preview + code export",
    },
    gradient: {
      name: "Gradient",
      desc: "Linear / radial / conic gradient editor with draggable color stops and multi-framework export",
    },
    shadow: {
      name: "Box Shadow",
      desc: "Multi-layer shadow editor with Neumorphism presets and visual x/y/blur/spread controls",
    },
    radius: {
      name: "Border Radius",
      desc: "Visual border-radius editor with independent corner control and px/% unit switching",
    },
  },

  clipPath: {
    title: "Clip Path",
    description: "Visually edit CSS clip-path — polygon / circle / ellipse / inset",
    shape: "Shape",
    presets: "Presets",
    points: "Points",
    add: "+ Add",
    del: "Del",
  },

  gradient: {
    title: "Gradient",
    description: "Linear / radial / conic gradient editor with live preview + multi-framework export",
    type: "Type",
    angle: "Angle",
    stops: "Stops",
  },

  shadow: {
    title: "Box Shadow",
    description: "Multi-layer shadows + Neumorphism presets with visual controls",
    neumorphism: "Neumorphism",
    layers: "Layers",
    layer: "Layer",
  },

  radius: {
    title: "Border Radius",
    description: "Visual corner radius editor — symmetric / independent + px / % units",
    unit: "Unit",
    mode: "Mode",
    symmetric: "Symmetric",
    independent: "Independent",
    allCorners: "All Corners",
    topLeft: "Top Left",
    topRight: "Top Right",
    bottomRight: "Bottom Right",
    bottomLeft: "Bottom Left",
  },

  code: {
    copy: "Copy",
    copied: "Copied",
  },

  common: {
    apply: "Apply to Selection",
    back: "Back to Home",
    del: "Del",
    add: "+ Add",
    darkMode: "Toggle dark mode",
    footer: "CSS Visual Toolbox for Figma",
  },
};

export default en;
