import { useState, useRef, useEffect } from "react";

/* ── Types ───────────────────────────── */

type Tool = "clip-path" | "gradient" | "shadow" | "radius";

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

/* ── Helpers ─────────────────────────── */

function postToFigma(type: string, value: string) {
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

function TabBar({
  tools,
  active,
  onChange,
}: {
  tools: { id: Tool; label: string }[];
  active: Tool;
  onChange: (t: Tool) => void;
}) {
  return (
    <div className="flex border-b" style={{ borderColor: "var(--figma-color-border)" }}>
      {tools.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className="flex-1 py-2 text-[11px] font-medium transition-colors"
          style={{
            color: active === t.id ? "var(--figma-color-text)" : "var(--figma-color-text-secondary)",
            borderBottom: active === t.id ? "2px solid var(--figma-color-bg-brand)" : "2px solid transparent",
          }}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

/* ── Clip Path Panel ─────────────────── */

const CLIP_PRESETS: Record<string, Point[]> = {
  triangle: [{ x: 50, y: 5 }, { x: 95, y: 90 }, { x: 5, y: 90 }],
  rhombus: [{ x: 50, y: 5 }, { x: 95, y: 50 }, { x: 50, y: 95 }, { x: 5, y: 50 }],
  hexagon: [
    { x: 50, y: 3 }, { x: 93, y: 25 }, { x: 93, y: 75 },
    { x: 50, y: 97 }, { x: 7, y: 75 }, { x: 7, y: 25 },
  ],
  star: [
    { x: 50, y: 3 }, { x: 61, y: 35 }, { x: 95, y: 35 }, { x: 68, y: 55 },
    { x: 78, y: 92 }, { x: 50, y: 68 }, { x: 22, y: 92 }, { x: 32, y: 55 },
    { x: 5, y: 35 }, { x: 39, y: 35 },
  ],
  arrow: [
    { x: 20, y: 30 }, { x: 60, y: 30 }, { x: 60, y: 5 },
    { x: 95, y: 50 }, { x: 60, y: 95 }, { x: 60, y: 70 }, { x: 20, y: 70 },
  ],
};

function ClipPathPanel() {
  const [points, setPoints] = useState<Point[]>(CLIP_PRESETS.hexagon);
  const [activePreset, setActivePreset] = useState("hexagon");

  const applyPreset = (name: string) => {
    if (CLIP_PRESETS[name]) {
      setPoints([...CLIP_PRESETS[name]]);
      setActivePreset(name);
    }
  };

  const updatePoint = (i: number, f: "x" | "y", v: number) => {
    setPoints((p) => p.map((pt, idx) => (idx === i ? { ...pt, [f]: Math.max(0, Math.min(100, v)) } : pt)));
  };

  const clipValue = `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
  const css = `clip-path: ${clipValue};`;

  return (
    <div className="p-3 space-y-3">
      <div className="flex flex-wrap gap-1">
        {Object.keys(CLIP_PRESETS).map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => applyPreset(name)}
            className="px-2 py-0.5 text-[10px] rounded-md border transition-colors"
            style={{
              borderColor: activePreset === name ? "var(--figma-color-bg-brand)" : "var(--figma-color-border)",
              background: activePreset === name ? "color-mix(in srgb, var(--figma-color-bg-brand) 15%, transparent)" : "transparent",
              color: activePreset === name ? "var(--figma-color-bg-brand)" : "var(--figma-color-text-secondary)",
            }}
          >
            {name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-1.5 max-h-32 overflow-y-auto">
        {points.map((p, i) => (
          <div key={i} className="flex items-center gap-1">
            <span className="text-[9px] opacity-40 w-3">{i + 1}</span>
            <input
              type="number"
              value={p.x}
              onChange={(e) => updatePoint(i, "x", Number(e.target.value))}
              className="w-full px-1.5 py-1 text-[10px] font-mono rounded border"
              style={{ borderColor: "var(--figma-color-border)", background: "var(--figma-color-bg-secondary)", color: "var(--figma-color-text)" }}
            />
            <input
              type="number"
              value={p.y}
              onChange={(e) => updatePoint(i, "y", Number(e.target.value))}
              className="w-full px-1.5 py-1 text-[10px] font-mono rounded border"
              style={{ borderColor: "var(--figma-color-border)", background: "var(--figma-color-bg-secondary)", color: "var(--figma-color-text)" }}
            />
          </div>
        ))}
      </div>

      {/* Preview + Apply */}
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 shrink-0 rounded-lg" style={{ background: "linear-gradient(135deg, #6366f1, #ec4899)", clipPath: clipValue }} />
        <div className="flex-1 min-w-0">
          <pre className="text-[10px] font-mono opacity-60 truncate">{css}</pre>
          <button type="button" onClick={() => postToFigma("CLIP_PATH", css)} className="mt-1.5 w-full py-1.5 text-[11px] font-medium rounded-lg transition-colors" style={{ background: "var(--figma-color-bg-brand)", color: "#fff" }}>
            Apply to Selection
          </button>
        </div>
      </div>
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

  const css = `background: ${gradientCSS};`;

  const addStop = () => {
    if (stops.length >= 6) return;
    setStops([...stops, { id: idRef.current++, color: "#a855f7", position: 50 }]);
  };

  return (
    <div className="p-3 space-y-3">
      <div className="flex gap-1">
        {(["linear", "radial"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className="flex-1 py-1.5 text-[10px] font-medium rounded-md border transition-colors"
            style={{
              borderColor: type === t ? "var(--figma-color-bg-brand)" : "var(--figma-color-border)",
              background: type === t ? "color-mix(in srgb, var(--figma-color-bg-brand) 15%, transparent)" : "transparent",
              color: type === t ? "var(--figma-color-bg-brand)" : "var(--figma-color-text-secondary)",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      <Slider label="Angle" value={angle} onChange={setAngle} max={360} unit="deg" />

      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium opacity-60">Stops</span>
        <button type="button" onClick={addStop} disabled={stops.length >= 6} className="text-[10px] font-medium transition-colors disabled:opacity-30" style={{ color: "var(--figma-color-bg-brand)" }}>
          + Add
        </button>
      </div>

      {sorted.map((s, i) => (
        <div key={s.id} className="flex items-center gap-2">
          <span className="text-[9px] opacity-40 w-3">{i + 1}</span>
          <input
            type="color"
            value={s.color}
            onChange={(e) => setStops(stops.map((st) => (st.id === s.id ? { ...st, color: e.target.value } : st)))}
            className="w-6 h-6 shrink-0"
          />
          <input
            type="range"
            min={0}
            max={100}
            value={s.position}
            onChange={(e) => setStops(stops.map((st) => (st.id === s.id ? { ...st, position: Number(e.target.value) } : st)))}
            className="slider flex-1"
          />
          <span className="text-[9px] tabular-nums opacity-50 w-7 text-right">{s.position}%</span>
        </div>
      ))}

      <div className="flex items-center gap-3">
        <div className="w-14 h-14 shrink-0 rounded-lg" style={{ background: gradientCSS }} />
        <div className="flex-1 min-w-0">
          <pre className="text-[10px] font-mono opacity-60 truncate">{css}</pre>
          <button type="button" onClick={() => postToFigma("GRADIENT", gradientCSS)} className="mt-1.5 w-full py-1.5 text-[11px] font-medium rounded-lg transition-colors" style={{ background: "var(--figma-color-bg-brand)", color: "#fff" }}>
            Apply to Selection
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Shadow Panel ────────────────────── */

function ShadowPanel() {
  const idRef = useRef(10);
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: 1, x: 4, y: 6, blur: 12, spread: 0, color: "#000000", opacity: 0.1, inset: false },
  ]);

  const update = (id: number, f: keyof ShadowLayer, v: number | boolean) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, [f]: v } : l)));
  };

  const add = () => {
    if (layers.length >= 4) return;
    setLayers([...layers, { id: idRef.current++, x: 2, y: 2, blur: 8, spread: 0, color: "#000000", opacity: 0.08, inset: false }]);
  };

  const format = layers
    .map((l) => {
      const hex = l.color + Math.round(l.opacity * 255).toString(16).padStart(2, "0");
      return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hex}`;
    })
    .join(", ");
  const css = `box-shadow: ${format};`;

  return (
    <div className="p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-medium opacity-60">Layers ({layers.length})</span>
        <button type="button" onClick={add} disabled={layers.length >= 4} className="text-[10px] font-medium transition-colors disabled:opacity-30" style={{ color: "var(--figma-color-bg-brand)" }}>
          + Add
        </button>
      </div>

      <div className="space-y-2 max-h-48 overflow-y-auto">
        {layers.map((l, i) => (
          <div key={l.id} className="p-2 rounded-lg border space-y-1.5" style={{ borderColor: "var(--figma-color-border)", background: "var(--figma-color-bg-secondary)" }}>
            <div className="flex items-center justify-between">
              <span className="text-[9px] font-medium opacity-50">#{i + 1}</span>
              <label className="flex items-center gap-1 text-[9px] opacity-50">
                <input type="checkbox" checked={l.inset} onChange={(e) => update(l.id, "inset", e.target.checked)} />
                inset
              </label>
            </div>
            <div className="grid grid-cols-4 gap-1">
              {(["x", "y", "blur", "spread"] as const).map((f) => (
                <div key={f}>
                  <span className="text-[8px] opacity-40">{f}</span>
                  <input
                    type="number"
                    value={l[f]}
                    onChange={(e) => update(l.id, f, Number(e.target.value))}
                    className="w-full px-1 py-0.5 text-[9px] font-mono rounded border"
                    style={{ borderColor: "var(--figma-color-border)", background: "var(--figma-color-bg)", color: "var(--figma-color-text)" }}
                  />
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input type="color" value={l.color} onChange={(e) => update(l.id, "color", e.target.value)} className="w-5 h-5 shrink-0" />
              <input type="range" min={0} max={100} value={Math.round(l.opacity * 100)} onChange={(e) => update(l.id, "opacity", Number(e.target.value) / 100)} className="slider flex-1" />
              <span className="text-[9px] tabular-nums opacity-50 w-7">{Math.round(l.opacity * 100)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <div className="w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center" style={{ background: "#e8ebf0", boxShadow: format }}>
          <span className="text-[8px] font-medium opacity-40">{layers.some((l) => l.inset) ? "in" : "out"}</span>
        </div>
        <div className="flex-1 min-w-0">
          <pre className="text-[10px] font-mono opacity-60 truncate">{css}</pre>
          <button type="button" onClick={() => postToFigma("BOX_SHADOW", format)} className="mt-1.5 w-full py-1.5 text-[11px] font-medium rounded-lg transition-colors" style={{ background: "var(--figma-color-bg-brand)", color: "#fff" }}>
            Apply to Selection
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Border Radius Panel ─────────────── */

function RadiusPanel() {
  const [all, setAll] = useState(16);
  const [tl, setTl] = useState(16);
  const [tr, setTr] = useState(16);
  const [br, setBr] = useState(16);
  const [bl, setBl] = useState(16);
  const [independent, setIndependent] = useState(false);

  const updateAll = (v: number) => {
    setAll(v);
    setTl(v);
    setTr(v);
    setBr(v);
    setBl(v);
  };

  const value = independent ? `${tl} ${tr} ${br} ${bl}` : `${all}`;
  const css = `border-radius: ${value}px;`;

  return (
    <div className="p-3 space-y-3">
      <label className="flex items-center gap-2 text-[10px] opacity-60">
        <input type="checkbox" checked={independent} onChange={(e) => setIndependent(e.target.checked)} />
        Independent corners
      </label>

      {independent ? (
        <>
          {[
            { label: "Top Left", v: tl, set: setTl },
            { label: "Top Right", v: tr, set: setTr },
            { label: "Bottom Right", v: br, set: setBr },
            { label: "Bottom Left", v: bl, set: setBl },
          ].map(({ label, v, set }) => (
            <Slider key={label} label={label} value={v} onChange={set} max={200} unit="px" />
          ))}
        </>
      ) : (
        <Slider label="All Corners" value={all} onChange={updateAll} max={200} unit="px" />
      )}

      <div className="flex items-center gap-3">
        <div className="w-14 h-14 shrink-0 flex items-center justify-center rounded-lg" style={{ background: "linear-gradient(135deg, #6366f1, #a855f7)", borderRadius: `${value}px` }}>
          <span className="text-[8px] text-white/60 font-mono">{value}</span>
        </div>
        <div className="flex-1 min-w-0">
          <pre className="text-[10px] font-mono opacity-60 truncate">{css}</pre>
          <button type="button" onClick={() => postToFigma("BORDER_RADIUS", value)} className="mt-1.5 w-full py-1.5 text-[11px] font-medium rounded-lg transition-colors" style={{ background: "var(--figma-color-bg-brand)", color: "#fff" }}>
            Apply to Selection
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main App ────────────────────────── */

const TOOLS: { id: Tool; label: string }[] = [
  { id: "clip-path", label: "Clip" },
  { id: "gradient", label: "Gradient" },
  { id: "shadow", label: "Shadow" },
  { id: "radius", label: "Radius" },
];

export default function App() {
  const [tool, setTool] = useState<Tool>("clip-path");

  return (
    <div className="flex flex-col h-full" style={{ color: "var(--figma-color-text)", background: "var(--figma-color-bg)" }}>
      <TabBar tools={TOOLS} active={tool} onChange={setTool} />
      <div className="flex-1 overflow-y-auto">
        {tool === "clip-path" && <ClipPathPanel />}
        {tool === "gradient" && <GradientPanel />}
        {tool === "shadow" && <ShadowPanel />}
        {tool === "radius" && <RadiusPanel />}
      </div>
      <div className="px-3 py-2 border-t text-center text-[9px] opacity-35" style={{ borderColor: "var(--figma-color-border)" }}>
        CSS Visual Toolbox for Figma
      </div>
    </div>
  );
}
