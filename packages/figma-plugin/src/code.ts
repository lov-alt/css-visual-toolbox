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

/* ── Message Router ──────────────────── */

figma.ui.onmessage = (msg: Message) => {
  const sel = figma.currentPage.selection;
  if (sel.length === 0) {
    figma.notify("Select at least one layer first", { error: true });
    return;
  }

  switch (msg.type) {
    case "BORDER_RADIUS":
      applyBorderRadius(sel, msg.value);
      break;
    case "GRADIENT":
      applyGradient(sel, msg.value);
      break;
    case "BOX_SHADOW":
      applyShadow(sel, msg.value);
      break;
    case "CLIP_PATH":
      applyClipPath(sel, msg.value);
      break;
  }
};

/* ── Border Radius ──────────────────── */

function applyBorderRadius(nodes: readonly SceneNode[], value: string) {
  const parts = value.split(/[ ,]+/).map(Number);
  const radii = parts.length === 1
    ? [parts[0], parts[0], parts[0], parts[0]] as const
    : [parts[0], parts[1], parts[2], parts[3]] as const;

  let count = 0;
  for (const node of nodes) {
    if (!("cornerRadius" in node)) continue;

    if (radii[0] === radii[1] && radii[1] === radii[2] && radii[2] === radii[3]) {
      node.cornerRadius = radii[0];
    } else {
      node.topLeftRadius = radii[0];
      node.topRightRadius = radii[1];
      node.bottomRightRadius = radii[2];
      node.bottomLeftRadius = radii[3];
    }
    count++;
  }
  figma.notify(`✓ Border radius applied to ${count} layer(s)`);
}

/* ── Gradient ───────────────────────── */

function applyGradient(nodes: readonly SceneNode[], css: string) {
  const match = css.match(
    /(linear|radial|conic)-gradient\(\s*(?:from\s+(\d+)deg\s*,)?\s*(.+?)\s*\)/
  );
  if (!match) {
    figma.notify("Could not parse gradient", { error: true });
    return;
  }

  const [, type, angleStr, stopsStr] = match;
  const angle = parseInt(angleStr || "180", 10) - 90;
  const stops = stopsStr
    .split(",")
    .map((s) => s.trim().match(/(#[0-9a-fA-F]+)\s+(\d+)%/))
    .filter(Boolean) as RegExpMatchArray[];

  if (stops.length < 2) {
    figma.notify("Need at least 2 color stops", { error: true });
    return;
  }

  const gradientStops: GradientStop[] = stops.map((m) => ({
    color: hexToRgba(m[1]),
    position: Number(m[2]) / 100,
  }));

  const radians = (angle * Math.PI) / 180;
  const gradientTransform: Transform = [
    [Math.cos(radians), Math.sin(radians), 0.5 - Math.cos(radians) / 2 - Math.sin(radians) / 2],
    [-Math.sin(radians), Math.cos(radians), 0.5 + Math.sin(radians) / 2 - Math.cos(radians) / 2],
  ];

  let count = 0;
  for (const node of nodes) {
    if (!("fills" in node)) continue;

    const fill: GradientPaint = {
      type: type === "radial" ? "GRADIENT_RADIAL" : "GRADIENT_LINEAR",
      gradientStops,
      gradientTransform,
    };

    if (Array.isArray(node.fills) && node.fills.length > 0) {
      const existing = [...node.fills] as Paint[];
      existing[0] = fill;
      node.fills = existing;
    } else {
      node.fills = [fill];
    }
    count++;
  }
  figma.notify(`✓ ${type} gradient applied to ${count} layer(s)`);
}

/* ── Box Shadow ─────────────────────── */

function applyShadow(nodes: readonly SceneNode[], css: string) {
  const shadows = css
    .split(/,(?![^(]*\))/)
    .map((s) => s.trim())
    .filter(Boolean);

  const effects: Effect[] = [];

  for (const shadow of shadows) {
    const inset = shadow.includes("inset");
    const cleaned = shadow.replace("inset", "").trim();
    const parts = cleaned.match(
      /(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(-?[\d.]+)px\s+(#[0-9a-fA-F]+)/
    );
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
    if (!("effects" in node)) continue;
    node.effects = effects;
    count++;
  }
  figma.notify(`✓ Shadow applied to ${count} layer(s)`);
}

/* ── Clip Path ──────────────────────── */

function applyClipPath(nodes: readonly SceneNode[], css: string) {
  for (const node of nodes) {
    if (!("resize" in node) || !("fills" in node)) continue;

    const w = (node as any).width as number;
    const h = (node as any).height as number;

    // polygon(...)
    const polygonMatch = css.match(/polygon\(([^)]+)\)/);
    if (polygonMatch) {
      const points = polygonMatch[1]
        .split(",")
        .map((p) => p.trim().match(/([\d.]+)%\s+([\d.]+)%/))
        .filter(Boolean)
        .map((m) => [((Number(m![1]) / 100) * w).toFixed(1), ((Number(m![2]) / 100) * h).toFixed(1)])
        .map(([x, y]) => ({ x: Number(x), y: Number(y) }));

      if (points.length >= 3) {
        const poly = figma.createPolygon();
        poly.pointCount = points.length;
        poly.vertexList = points;
        poly.x = node.x;
        poly.y = node.y;
        poly.resize(w, h);
        poly.fills = Array.isArray(node.fills) ? [...node.fills] as Paint[] : [];
        figma.currentPage.appendChild(poly);
        node.remove();
        figma.notify("✓ Converted polygon shape");
      }
      return;
    }

    // circle(...)
    const circleMatch = css.match(/circle\((\d+)%\s*at\s*(\d+)%\s*(\d+)%\)/);
    if (circleMatch) {
      const [, r, cx, cy] = circleMatch.map(Number);
      const ellipse = figma.createEllipse();
      ellipse.x = node.x + (cx / 100) * w - ((r / 100) * w) / 2;
      ellipse.y = node.y + (cy / 100) * h - ((r / 100) * h) / 2;
      ellipse.resize((r / 100) * w, (r / 100) * h);
      ellipse.fills = Array.isArray(node.fills) ? [...node.fills] as Paint[] : [];
      figma.currentPage.appendChild(ellipse);
      node.remove();
      figma.notify("✓ Converted circle shape");
      return;
    }

    // ellipse(...)
    const ellipseMatch = css.match(/ellipse\((\d+)%\s+(\d+)%\s*at\s*(\d+)%\s*(\d+)%\)/);
    if (ellipseMatch) {
      const [, rx, ry, cx, cy] = ellipseMatch.map(Number);
      const el = figma.createEllipse();
      el.x = node.x + (cx / 100) * w - ((rx / 100) * w) / 2;
      el.y = node.y + (cy / 100) * h - ((ry / 100) * h) / 2;
      el.resize((rx / 100) * w, (ry / 100) * h);
      el.fills = Array.isArray(node.fills) ? [...node.fills] as Paint[] : [];
      figma.currentPage.appendChild(el);
      node.remove();
      figma.notify("✓ Converted ellipse shape");
      return;
    }

    figma.notify("Clip-path type not yet supported in Figma", { error: true });
  }
}

/* ── Helpers ─────────────────────────── */

function hexToRgba(hex: string): RGBA {
  hex = hex.replace("#", "");
  if (hex.length === 8) {
    return {
      r: parseInt(hex.slice(0, 2), 16) / 255,
      g: parseInt(hex.slice(2, 4), 16) / 255,
      b: parseInt(hex.slice(4, 6), 16) / 255,
      a: parseInt(hex.slice(6, 8), 16) / 255,
    };
  }
  return {
    r: parseInt(hex.slice(0, 2), 16) / 255,
    g: parseInt(hex.slice(2, 4), 16) / 255,
    b: parseInt(hex.slice(4, 6), 16) / 255,
    a: 1,
  };
}
