export type Framework = "css" | "tailwind" | "react" | "vue" | "svelte" | "swiftui" | "flutter";

export const FRAMEWORKS: { key: Framework; label: string }[] = [
  { key: "css", label: "CSS" },
  { key: "tailwind", label: "Tailwind" },
  { key: "react", label: "React" },
  { key: "vue", label: "Vue" },
  { key: "svelte", label: "Svelte" },
  { key: "swiftui", label: "SwiftUI" },
  { key: "flutter", label: "Flutter" },
];

/* ── CSS ─────────────────────────────── */

function genCSS(property: string, value: string): string {
  return `${property}: ${value};`;
}

/* ── Tailwind ─────────────────────────── */

function genTailwind(property: string, value: string): string {
  switch (property) {
    case "border-radius": {
      const v = value.replace(/px/g, "");
      return `rounded-[${v}]`;
    }
    case "clip-path":
      return `/* clip-path 无内建工具类，使用任意值 */\nclip-[${value.replace(/ /g, "_")}]`;
    default:
      return `/* ${property}: ${value}; */`;
  }
}

/* ── React ───────────────────────────── */

function genReact(property: string, value: string): string {
  const camel = toCamel(property);
  return `<div style={{ ${camel}: "${value}" }} />`;
}

/* ── Vue ─────────────────────────────── */

function genVue(property: string, value: string): string {
  const kebab = property;
  return `<template>\n  <div :style="{ ${toCamel(kebab)}: '${value}' }" />\n</template>`;
}

/* ── Svelte ──────────────────────────── */

function genSvelte(property: string, value: string): string {
  return `<div style="${property}: ${value}" />`;
}

/* ── SwiftUI ─────────────────────────── */

function genSwiftUI(property: string, value: string): string {
  switch (property) {
    case "border-radius":
      return `RoundedRectangle(cornerRadius: ${parseFloat(value) || 0})`;
    case "box-shadow":
      return `// SwiftUI shadow:\n.shadow(radius: 10)`;
    case "clip-path":
      return `// SwiftUI clipShape:\n.clipShape(Circle())`;
    default:
      return `// ${property}: ${value}`;
  }
}

/* ── Flutter ─────────────────────────── */

function genFlutter(property: string, value: string): string {
  switch (property) {
    case "border-radius":
      return `BorderRadius.circular(${parseFloat(value) || 0})`;
    case "box-shadow":
      return `BoxDecoration(\n  boxShadow: [\n    BoxShadow(\n      blurRadius: 10,\n      color: Colors.black26,\n    ),\n  ],\n)`;
    case "clip-path":
      return `ClipPath(\n  clipper: ShapeBorderClipper(\n    shape: RoundedRectangleBorder(),\n  ),\n)`;
    default:
      return `// ${property}: ${value}`;
  }
}

/* ── Aggregator ──────────────────────── */

const generators: Record<Framework, (prop: string, val: string) => string> = {
  css: genCSS,
  tailwind: genTailwind,
  react: genReact,
  vue: genVue,
  svelte: genSvelte,
  swiftui: genSwiftUI,
  flutter: genFlutter,
};

export function generateCode(framework: Framework, property: string, value: string): string {
  return generators[framework](property, value);
}

/* ── Utility ─────────────────────────── */

function toCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}
