import { useState, useRef } from "react";

/* ── Types ───────────────────────────── */

type ToolId = "clip-path" | "gradient" | "shadow" | "radius";
type MsgType = "CLIP_PATH" | "GRADIENT" | "BOX_SHADOW" | "BORDER_RADIUS";

interface Point {
  x: number;
  y: number;
}

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

interface ShadowLayer {
  id: number;
  x: number;
  y: number;
  blur: number;
  spread: number;
  color: string;
  opacity: number;
  inset: boolean;
}

interface CornerState {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

/* ── Figma bridge ────────────────────── */

function postToFigma(type: MsgType, value: string) {
  parent.postMessage({ pluginMessage: { type, value } }, "*");
}

/* ── Shared Components ──────────────── */

function Slider({
  label,
  value,
  onChange,
  max = 100,
  unit = "",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
  unit?: string;
}) {
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] mb-1 opacity-70">
        <span>{label}</span>
        <span className="tabular-nums">
          {value}
          {unit}
        </span>
      </div>
      <input
        type="range"
        min={0}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider"
      />
    </div>
  );
}

function NumberField({
  value,
  onChange,
  className,
}: {
  value: number;
  onChange: (v: number) => void;
  className?: string;
}) {
  return (
    <input
      type="number"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className={`px-1.5 py-1 text-[10px] font-mono rounded border ${className ?? ""}`}
      style={{
        borderColor: "var(--figma-color-border)",
        background: "var(--figma-color-bg-secondary)",
        color: "var(--figma-color-text)",
      }}
    />
  );
}

function ChipButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="px-2 py-0.5 text-[10px] rounded-md border transition-colors"
      style={{
        borderColor: active ? "var(--figma-color-bg-brand)" : "var(--figma-color-border)",
        background: active
          ? "color-mix(in srgb, var(--figma-color-bg-brand) 15%, transparent)"
          : "transparent",
        color: active ? "var(--figma-color-bg-brand)" : "var(--figma-color-text-secondary)",
      }}
    >
      {children}
    </button>
  );
}

function PreviewAndApply({
  cssPreview,
  msgType,
  msgValue,
  children,
}: {
  cssPreview: string;
  msgType: MsgType;
  msgValue: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-14 h-14 shrink-0 rounded-lg overflow-hidden">
        {children}
      </div>
      <div className="flex-1 min-w-0">
        <pre className="text-[10px] font-mono opacity-60 truncate">{cssPreview}</pre>
        <button
          type="button"
          onClick={() => postToFigma(msgType, msgValue)}
          className="mt-1.5 w-full py-1.5 text-[11px] font-medium rounded-lg transition-colors text-white"
          style={{ background: "var(--figma-color-bg-brand)" }}
        >
          Apply to Selection
        </button>
      </div>
    </div>
  );
}

function SectionHeader({
  label,
  badge,
  onAdd,
}: {
  label: string;
  badge?: string;
  onAdd?: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-1.5">
        <span className="text-[10px] font-medium opacity-60">{label}</span>
        {badge !== undefined && (
          <span className="text-[9px] tabular-nums opacity-35">({badge})</span>
        )}
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={onAdd}
          className="text-[10px] font-medium transition-colors disabled:opacity-30"
          style={{ color: "var(--figma-color-bg-brand)" }}
        >
          + Add
        </button>
      )}
    </div>
  );
}

/* ── Tab Bar ─────────────────────────── */

const TOOLS: { id: ToolId; label: string }[] = [
  { id: "clip-path", label: "Clip" },
  { id: "gradient", label: "Gradient" },
  { id: "shadow", label: "Shadow" },
  { id: "radius", label: "Radius" },
];

function TabBar({
  active,
  onChange,
}: {
  active: ToolId;
  onChange: (t: ToolId) => void;
}) {
  return (
    <div className="flex border-b" style={{ borderColor: "var(--figma-color-border)" }}>
      {TOOLS.map((t) => {
        const isActive = active === t.id;
        return (
          <button
            key={t.id}
            type="button"
            onClick={() => onChange(t.id)}
            className="flex-1 py-2 text-[11px] font-medium transition-colors"
            style={{
              color: isActive
                ? "var(--figma-color-text)"
                : "var(--figma-color-text-secondary)",
              borderBottom: isActive
                ? "2px solid var(--figma-color-bg-brand)"
                : "2px solid transparent",
            }}
          >
            {t.label}
          </button>
        );
      })}
    </div>
  );
}

/* ── Clip Path Presets ───────────────── */

const CLIP_PRESETS: Record<string, Point[]> = {
  triangle: [
    { x: 50, y: 5 }, { x: 95, y: 90 }, { x: 5, y: 90 },
  ],
  rhombus: [
    { x: 50, y: 5 }, { x: 95, y: 50 }, { x: 50, y: 95 }, { x: 5, y: 50 },
  ],
  hexagon: [
    { x: 50, y: 3 }, { x: 93, y: 25 }, { x: 93, y: 75 },
    { x: 50, y: 97 }, { x: 7, y: 75 }, { x: 7, y: 25 },
  ],
  star: [
    { x: 50, y: 3 }, { x: 61, y: 35 }, { x: 95, y: 35 },
    { x: 68, y: 55 }, { x: 78, y: 92 }, { x: 50, y: 68 },
    { x: 22, y: 92 }, { x: 32, y: 55 }, { x: 5, y: 35 }, { x: 39, y: 35 },
  ],
  arrow: [
    { x: 20, y: 30 }, { x: 60, y: 30 }, { x: 60, y: 5 },
    { x: 95, y: 50 }, { x: 60, y: 95 }, { x: 60, y: 70 }, { x: 20, y: 70 },
  ],
};

/* ── Clip Path Panel ─────────────────── */

function ClipPathPanel() {
  const [points, setPoints] = useState<Point[]>(CLIP_PRESETS.hexagon);
  const [activePreset, setActivePreset] = useState("hexagon");

  const applyPreset = (name: string) => {
    const preset = CLIP_PRESETS[name];
    if (!preset) return;
    setPoints(preset.map((p) => ({ ...p })));
    setActivePreset(name);
  };

  const updatePoint = (i: number, axis: "x" | "y", val: number) => {
    setPoints((prev) =>
      prev.map((pt, idx) =>
        idx === i ? { ...pt, [axis]: clamp(val, 0, 100) } : pt
      )
    );
  };

  const clipValue = `polygon(${points
    .map((p) => `${p.x}% ${p.y}%`)
    .join(", ")})`;
  const css = `clip-path: ${clipValue};`;

  return (
    <div className="p-3 space-y-3">
      <div className="flex flex-wrap gap-1">
        {Object.keys(CLIP_PRESETS).map((name) => (
          <ChipButton
            key={name}
            active={activePreset === name}
            onClick={() => applyPreset(name)}
          >
            {name}
          </ChipButton>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto">
        {points.map((p, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-[9px] opacity-40 w-3 tabular-nums">{i + 1}</span>
            <NumberField value={p.x} onChange={(v) => updatePoint(i, "x", v)} />
            <NumberField value={p.y} onChange={(v) => updatePoint(i, "y", v)} />
          </div>
        ))}
      </div>

      <PreviewAndApply cssPreview={css} msgType="CLIP_PATH" msgValue={css}>
        <div
          className="w-full h-full"
          style={{
            background: "linear-gradient(135deg, #6366f1, #ec4899)",
            clipPath: clipValue,
          }}
        />
      </PreviewAndApply>
    </div>
  );
}

/* ── Gradient Panel ──────────────────── */

function GradientPanel() {
  const idRef = useRef(3);
  const [type, setType] = useState<"linear" | "radial">("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: "#6366f1", position: 0 },
    { id: 2, color: "#ec4899", position: 100 },
  ]);

  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");

  const gradientCSS =
    type === "linear"
      ? `linear-gradient(${angle}deg, ${stopStr})`
      : `radial-gradient(circle, ${stopStr})`;

  const addStop = () => {
    if (stops.length >= 6) return;
    const mid = stops.length === 2
      ? 50
      : Math.round(
          (sorted[Math.floor(sorted.length / 2) - 1].position +
            sorted[Math.floor(sorted.length / 2)].position) /
            2
        );
    setStops((prev) =>
      [...prev, { id: idRef.current++, color: "#a855f7", position: mid }].sort(
        (a, b) => a.position - b.position
      )
    );
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex gap-1">
        {(["linear", "radial"] as const).map((t) => (
          <ChipButton key={t} active={type === t} onClick={() => setType(t)}>
            {t}
          </ChipButton>
        ))}
      </div>

      {type === "linear" && (
        <Slider label="Angle" value={angle} onChange={setAngle} max={360} unit="deg" />
      )}

      <SectionHeader
        label="Stops"
        badge={String(stops.length)}
        onAdd={stops.length < 6 ? addStop : undefined}
      />

      {sorted.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <span className="text-[9px] opacity-40 w-3 tabular-nums">{i + 1}</span>
          <input
            type="color"
            value={s.color}
            onChange={(e) =>
              setStops((prev) =>
                prev.map((st) => (st.id === s.id ? { ...st, color: e.target.value } : st))
              )
            }
            className="w-6 h-6 shrink-0"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={s.position}
            onChange={(e) =>
              setStops((prev) =>
                prev.map((st) =>
                  st.id === s.id ? { ...st, position: Number(e.target.value) } : st
                )
              )
            }
            className="slider flex-1"
          />
          <span className="text-[9px] tabular-nums opacity-50 w-7 text-right">
            {s.position}%
          </span>
        </div>
      ))}

      <PreviewAndApply
        cssPreview={`background: ${gradientCSS};`}
        msgType="GRADIENT"
        msgValue={gradientCSS}
      >
        <div className="w-full h-full" style={{ background: gradientCSS }} />
      </PreviewAndApply>
    </div>
  );
}

/* ── Shadow Panel ────────────────────── */

function ShadowPanel() {
  const idRef = useRef(10);
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: 1, x: 4, y: 6, blur: 12, spread: 0, color: "#000000", opacity: 0.1, inset: false },
  ]);

  const updateLayer = (id: number, field: keyof ShadowLayer, val: number | boolean) => {
    setLayers((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: val } : l))
    );
  };

  const addLayer = () => {
    if (layers.length >= 4) return;
    setLayers((prev) => [
      ...prev,
      { id: idRef.current++, x: 2, y: 2, blur: 8, spread: 0, color: "#000000", opacity: 0.08, inset: false },
    ]);
  };

  const formatShadowLayer = (l: ShadowLayer): string => {
    const hex = l.color + Math.round(l.opacity * 255).toString(16).padStart(2, "0");
    return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hex}`;
  };

  const shadowValue = layers.map(formatShadowLayer).join(", ");
  const css = `box-shadow: ${shadowValue};`;
  const hasInset = layers.some((l) => l.inset);

  return (
    <div className="p-3 space-y-2">
      <SectionHeader
        label="Layers"
        badge={String(layers.length)}
        onAdd={layers.length < 4 ? addLayer : undefined}
      />

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {layers.map((l, i) => (
          <div
            key={l.id}
            className="p-2 rounded-lg border space-y-1.5"
            style={{
              borderColor: "var(--figma-color-border)",
              background: "var(--figma-color-bg-secondary)",
            }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-medium opacity-50">#{i + 1}</span>
              <label className="flex items-center gap-1 text-[9px] opacity-50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={l.inset}
                  onChange={(e) => updateLayer(l.id, "inset", e.target.checked)}
                />
                inset
              </label>
            </div>

            <div className="grid grid-cols-4 gap-1">
              {(["x", "y", "blur", "spread"] as const).map((field) => (
                <div key={field}>
                  <span className="text-[8px] opacity-40 capitalize">{field}</span>
                  <NumberField
                    value={l[field]}
                    onChange={(v) => updateLayer(l.id, field, v)}
                  />
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <input
                type="color"
                value={l.color}
                onChange={(e) => updateLayer(l.id, "color", e.target.value)}
                className="w-5 h-5 shrink-0"
              />
              <input
                type="range"
                min={0}
                max={100}
                value={Math.round(l.opacity * 100)}
                onChange={(e) => updateLayer(l.id, "opacity", Number(e.target.value) / 100)}
                className="slider flex-1"
              />
              <span className="text-[9px] tabular-nums opacity-50 w-7 text-right">
                {Math.round(l.opacity * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>

      <PreviewAndApply cssPreview={css} msgType="BOX_SHADOW" msgValue={shadowValue}>
        <div
          className="w-full h-full rounded-2xl flex items-center justify-center"
          style={{ background: "#e8ebf0", boxShadow: shadowValue }}
        >
          <span className="text-[8px] font-medium opacity-40">
            {hasInset ? "in" : "out"}
          </span>
        </div>
      </PreviewAndApply>
    </div>
  );
}

/* ── Border Radius Panel ─────────────── */

function RadiusPanel() {
  const [all, setAll] = useState(16);
  const [corners, setCorners] = useState<CornerState>({
    tl: 16,
    tr: 16,
    br: 16,
    bl: 16,
  });
  const [independent, setIndependent] = useState(false);

  const setAllValue = (v: number) => {
    setAll(v);
    setCorners({ tl: v, tr: v, br: v, bl: v });
  };

  const setCorner = (key: keyof CornerState, v: number) => {
    setCorners((prev) => ({ ...prev, [key]: v }));
    if (!independent) setAll(v);
  };

  const switchMode = (ind: boolean) => {
    setIndependent(ind);
    if (!ind) setCorners({ tl: all, tr: all, br: all, bl: all });
  };

  const { tl, tr, br, bl } = corners;
  const isUniform = tl === tr && tr === br && br === bl;
  const radiusValue = isUniform ? `${tl}px` : `${tl}px ${tr}px ${br}px ${bl}px`;

  const CORNER_DEFS: { key: keyof CornerState; label: string }[] = [
    { key: "tl", label: "Top Left" },
    { key: "tr", label: "Top Right" },
    { key: "br", label: "Bottom Right" },
    { key: "bl", label: "Bottom Left" },
  ];

  return (
    <div className="p-3 space-y-3">
      <label className="flex items-center gap-2 text-[10px] opacity-60 cursor-pointer">
        <input
          type="checkbox"
          checked={independent}
          onChange={(e) => switchMode(e.target.checked)}
        />
        Independent corners
      </label>

      {independent ? (
        CORNER_DEFS.map(({ key, label }) => (
          <Slider
            key={key}
            label={label}
            value={corners[key]}
            onChange={(v) => setCorner(key, v)}
            max={200}
            unit="px"
          />
        ))
      ) : (
        <Slider label="All Corners" value={all} onChange={setAllValue} max={200} unit="px" />
      )}

      <PreviewAndApply
        cssPreview={`border-radius: ${radiusValue};`}
        msgType="BORDER_RADIUS"
        msgValue={independent ? `${tl} ${tr} ${br} ${bl}` : `${all}`}
      >
        <div
          className="w-full h-full flex items-center justify-center"
          style={{
            background: "linear-gradient(135deg, #6366f1, #a855f7)",
            borderRadius: radiusValue,
          }}
        >
          <span className="text-[8px] text-white/50 font-mono">
            {isUniform ? all : `${tl}/${tr}`}
          </span>
        </div>
      </PreviewAndApply>
    </div>
  );
}

/* ── App Shell ───────────────────────── */

export default function App() {
  const [tool, setTool] = useState<ToolId>("clip-path");

  return (
    <div
      className="flex flex-col"
      style={{
        color: "var(--figma-color-text)",
        background: "var(--figma-color-bg)",
        height: "100%",
      }}
    >
      <TabBar active={tool} onChange={setTool} />
      <div className="flex-1 overflow-y-auto">
        {tool === "clip-path" && <ClipPathPanel />}
        {tool === "gradient" && <GradientPanel />}
        {tool === "shadow" && <ShadowPanel />}
        {tool === "radius" && <RadiusPanel />}
      </div>
      <footer
        className="px-3 py-2 border-t text-center text-[9px] opacity-35"
        style={{ borderColor: "var(--figma-color-border)" }}
      >
        CSS Visual Toolbox for Figma
      </footer>
    </div>
  );
}

/* ── Utility ─────────────────────────── */

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}
