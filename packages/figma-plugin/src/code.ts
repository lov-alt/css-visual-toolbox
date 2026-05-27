/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, {
  width: 380,
  height: 540,
  themeColors: true,
});

type Message =
  | { type: "CLIP_PATH"; value: string }
  | { type: "GRADIENT"; value: string }
  | { type: "BOX_SHADOW"; value: string }
  | { type: "BORDER_RADIUS"; value: string };

type AnySceneNode = SceneNode & Record<string, any>;

/* ── Regex ───────────────────────────── */

const RE_GRADIENT = /(linear|radial)-gradient\(\s*(?:from\s+(\d+)deg\s*,)?\s*(.+?)\s*\)/;
const RE_SHADOW = /(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(#[0-9a-fA-F]+)/;
const RE_POLYGON = /polygon\(([^)]+)\)/;
const RE_POINT = /([\d.]+)%\s+([\d.]+)%/;
const RE_CIRCLE = /circle\((\d+)%\s*at\s*(\d+)%\s*(\d+)%\)/;
const RE_ELLIPSE = /ellipse\((\d+)%\s+(\d+)%\s*at\s*(\d+)%\s*(\d+)%\)/;

/* ── Router ──────────────────────────── */

figma.ui.onmessage = (msg: Message) => {
  const sel = figma.currentPage.selection;
  if (sel.length === 0) {
    figma.notify("Select at least one layer first", { error: true });
    return;
  }

  switch (msg.type) {
    case "BORDER_RADIUS": applyRadius(sel, msg.value); break;
    case "GRADIENT": applyGradient(sel, msg.value); break;
    case "BOX_SHADOW": applyShadow(sel, msg.value); break;
    case "CLIP_PATH": applyClip(sel, msg.value); break;
  }
};

/* ── Border Radius ──────────────────── */

function applyRadius(nodes: readonly SceneNode[], value: string) {
  const parts = value.split(/[ ,]+/).map(Number);
  const [tl, tr, br, bl] = parts.length === 1
    ? [parts[0], parts[0], parts[0], parts[0]]
    : [parts[0], parts[1], parts[2], parts[3]];

  let count = 0;
  for (const node of nodes) {
    const n = node as AnySceneNode;
    if (n.cornerRadius === undefined) continue;

    if (tl === tr && tr === br && br === bl) {
      (n as any).cornerRadius = tl;
    } else {
      (n as any).topLeftRadius = tl;
      (n as any).topRightRadius = tr;
      (n as any).bottomRightRadius = br;
      (n as any).bottomLeftRadius = bl;
    }
    count++;
  }

  if (count > 0) figma.notify(`Radius → ${count} layer(s)`);
}

/* ── Gradient ────────────────────────── */

function applyGradient(nodes: readonly SceneNode[], css: string) {
  const match = css.match(RE_GRADIENT);
  if (!match) {
    figma.notify("Could not parse gradient", { error: true });
    return;
  }

  const [, type, angleStr, stopsStr] = match;
  const deg = parseInt(angleStr || "180", 10) - 90;
  const stops = stopsStr
    .split(",")
    .map((s) => s.trim().match(/(#[0-9a-fA-F]+)\s+(\d+)%/))
    .filter((m): m is RegExpMatchArray => m !== null);

  if (stops.length < 2) {
    figma.notify("Need at least 2 color stops", { error: true });
    return;
  }

  const gradientStops = stops.map((m) => ({
    color: hexToRgba(m[1]),
    position: Number(m[2]) / 100,
  }));

  const rad = (deg * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);

  const transform: Transform = [
    [cos, sin, 0.5 - cos / 2 - sin / 2],
    [-sin, cos, 0.5 + sin / 2 - cos / 2],
  ];

  let count = 0;
  for (const node of nodes) {
    const n = node as AnySceneNode;
    if (!n.fills) continue;

    const paintType = type === "radial" ? "GRADIENT_RADIAL" : "GRADIENT_LINEAR";

    const existing = Array.isArray(n.fills) ? [...(n.fills as Paint[])] : [];
    existing[0] = { type: paintType, gradientStops, gradientTransform: transform } as GradientPaint;
    n.fills = existing;
    count++;
  }

  if (count > 0) figma.notify(`${type} gradient → ${count} layer(s)`);
}

/* ── Box Shadow ──────────────────────── */

function applyShadow(nodes: readonly SceneNode[], css: string) {
  const shadows = css
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter(Boolean);

  const effects: Effect[] = [];

  for (const shadow of shadows) {
    const inset = shadow.startsWith("inset");
    const cleaned = inset ? shadow.slice(5).trim() : shadow;
    const parts = cleaned.match(RE_SHADOW);
    if (!parts) continue;

    const [, x, y, blur, spread, color] = parts;

    effects.push({
      type: inset ? "INNER_SHADOW" : "DROP_SHADOW",
      offset: { x: Number(x), y: Number(y) },
      radius: Number(blur),
      spread: Number(spread),
      color: hexToRgba(color),
      visible: true,
      blendMode: "NORMAL",
    });
  }

  if (effects.length === 0) {
    figma.notify("Could not parse shadow values", { error: true });
    return;
  }

  let count = 0;
  for (const node of nodes) {
    const n = node as AnySceneNode;
    if (!n.effects) continue;
    n.effects = effects;
    count++;
  }

  if (count > 0) figma.notify(`Shadow → ${count} layer(s)`);
}

/* ── Clip Path ───────────────────────── */

function applyClip(nodes: readonly SceneNode[], css: string) {
  for (const node of nodes) {
    const n = node as AnySceneNode;
    if (!n.resize || !n.fills) continue;

    const w: number = n.width;
    const h: number = n.height;
    const fills: Paint[] = Array.isArray(n.fills) ? [...(n.fills as Paint[])] : [];

    if (clipPolygon(n, css, w, h, fills)) return;
    if (clipCircle(n, css, w, h, fills)) return;
    if (clipEllipse(n, css, w, h, fills)) return;

    figma.notify("Clip-path type not yet supported", { error: true });
  }
}

function clipPolygon(
  node: AnySceneNode,
  css: string,
  w: number,
  h: number,
  fills: Paint[],
): boolean {
  const match = css.match(RE_POLYGON);
  if (!match) return false;

  const points = match[1]
    .split(",")
    .map((p) => p.trim().match(RE_POINT))
    .filter((m): m is RegExpMatchArray => m !== null)
    .map((m) => ({
      x: round((Number(m[1]) / 100) * w, 1),
      y: round((Number(m[2]) / 100) * h, 1),
    }));

  if (points.length < 3) return false;

  const poly = figma.createPolygon();
  const pn = poly as AnySceneNode;
  pn.pointCount = points.length;
  pn.x = node.x;
  pn.y = node.y;
  pn.resize(w, h);
  pn.fills = fills;
  // Set vertex positions via vector network
  if (pn.vectorNetwork) {
    const vertices = points.map((p) => ({ x: p.x, y: p.y, strokeCap: "NONE" as const, strokeJoin: "MITER" as const, cornerRadius: 0, handleMirroring: "NONE" as const }));
    (pn as any).vectorNetwork = { vertices, segments: vertices.map((_: any, i: number) => ({ start: i, end: (i + 1) % vertices.length, tangentStart: { x: 0, y: 0 }, tangentEnd: { x: 0, y: 0 } })), regions: [{ windingRule: "NONZERO" as const, loops: [vertices.map((_, i) => i)] }] };
  }
  figma.currentPage.appendChild(poly);
  node.remove();
  figma.notify("Polygon shape created");
  return true;
}

function clipCircle(
  node: AnySceneNode,
  css: string,
  w: number,
  h: number,
  fills: Paint[],
): boolean {
  const match = css.match(RE_CIRCLE);
  if (!match) return false;

  const [, r, cx, cy] = match.map(Number);
  const d = (r / 100) * Math.min(w, h);
  const el = figma.createEllipse();
  const en = el as AnySceneNode;
  en.x = node.x + ((cx / 100) * w - d / 2);
  en.y = node.y + ((cy / 100) * h - d / 2);
  en.resize(d, d);
  en.fills = fills;
  figma.currentPage.appendChild(el);
  node.remove();
  figma.notify("Circle shape created");
  return true;
}

function clipEllipse(
  node: AnySceneNode,
  css: string,
  w: number,
  h: number,
  fills: Paint[],
): boolean {
  const match = css.match(RE_ELLIPSE);
  if (!match) return false;

  const [, rx, ry, cx, cy] = match.map(Number);
  const ew = (rx / 100) * w;
  const eh = (ry / 100) * h;
  const el = figma.createEllipse();
  const en = el as AnySceneNode;
  en.x = node.x + ((cx / 100) * w - ew / 2);
  en.y = node.y + ((cy / 100) * h - eh / 2);
  en.resize(ew, eh);
  en.fills = fills;
  figma.currentPage.appendChild(el);
  node.remove();
  figma.notify("Ellipse shape created");
  return true;
}

/* ── Color ───────────────────────────── */

function hexToRgba(hex: string): RGBA {
  const h = hex.replace("#", "");

  if (h.length === 3) {
    const [r, g, b] = h.split("").map((c) => parseInt(c + c, 16));
    return { r: r / 255, g: g / 255, b: b / 255, a: 1 };
  }

  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
    a: h.length >= 8 ? parseInt(h.slice(6, 8), 16) / 255 : 1,
  };
}

/* ── Math ────────────────────────────── */

function round(v: number, d: number): number {
  const f = 10 ** d;
  return Math.round(v * f) / f;
}
