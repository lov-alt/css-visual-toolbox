import { useState } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";

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

let layerId = 0;
function nextLayerId() {
  return ++layerId;
}

const neumorphismPresets = {
  "flat-raise": [
    { x: 8, y: 8, blur: 16, spread: 0, color: "#b8bcc8", opacity: 0.6, inset: false },
    { x: -8, y: -8, blur: 16, spread: 0, color: "#ffffff", opacity: 0.8, inset: false },
  ],
  "flat-pressed": [
    { x: 3, y: 3, blur: 8, spread: 0, color: "#b8bcc8", opacity: 0.5, inset: true },
    { x: -3, y: -3, blur: 8, spread: 0, color: "#ffffff", opacity: 0.7, inset: true },
  ],
  "convex": [
    { x: 12, y: 12, blur: 24, spread: -4, color: "#a0a4b0", opacity: 0.5, inset: false },
    { x: -12, y: -12, blur: 24, spread: -4, color: "#ffffff", opacity: 0.9, inset: false },
  ],
  "concave": [
    { x: 6, y: 6, blur: 12, spread: -2, color: "#a0a4b0", opacity: 0.4, inset: true },
    { x: -6, y: -6, blur: 12, spread: -2, color: "#ffffff", opacity: 0.6, inset: true },
  ],
};

export default function Shadow() {
  const [bgColor, setBgColor] = useState("#e8ebf0");
  const [boxColor, setBoxColor] = useState("#e8ebf0");
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: nextLayerId(), x: 4, y: 6, blur: 12, spread: 0, color: "#000000", opacity: 0.1, inset: false },
  ]);

  const updateLayer = (id: number, field: keyof ShadowLayer, value: number | string | boolean) => {
    setLayers(layers.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const addLayer = () => {
    if (layers.length >= 6) return;
    setLayers([
      ...layers,
      { id: nextLayerId(), x: 2, y: 2, blur: 8, spread: 0, color: "#000000", opacity: 0.1, inset: false },
    ]);
  };

  const removeLayer = (id: number) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter((l) => l.id !== id));
  };

  const applyNeumorphism = (preset: keyof typeof neumorphismPresets) => {
    const presetLayers = neumorphismPresets[preset];
    const bgMap: Record<string, string> = {
      "flat-raise": "#e8ebf0",
      "flat-pressed": "#e8ebf0",
      convex: "#e8ebf0",
      concave: "#e8ebf0",
    };
    setBgColor(bgMap[preset]);
    setBoxColor(bgMap[preset]);
    setLayers(
      presetLayers.map((l) => ({
        ...l,
        id: nextLayerId(),
      }))
    );
  };

  const boxShadowCSS = layers
    .map((l) => {
      const hex = l.color + Math.round(l.opacity * 255)
        .toString(16)
        .padStart(2, "0");
      const inset = l.inset ? "inset " : "";
      return `${inset}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${hex}`;
    })
    .join(",\n       ");

  const cssCode = `background: ${bgColor};
box-shadow: ${boxShadowCSS};`;

  const tailwindCode = `/* Tailwind shadow 不支持多层+inset */
/* 使用任意值: */
<div className="shadow-[${boxShadowCSS.replace(/\n\s+/g, " ")}] bg-[${bgColor}]" />

/* 或自定义 utility:
.shadow-custom {
  box-shadow: ${boxShadowCSS};
} */`;

  const reactCode = `<div style={{
  background: "${bgColor}",
  boxShadow: "${boxShadowCSS.replace(/\n\s+/g, " ")}",
}} />`;

  const controls = (
    <>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Neumorphism</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(Object.keys(neumorphismPresets) as (keyof typeof neumorphismPresets)[]).map(
            (name) => (
              <button
                key={name}
                onClick={() => applyNeumorphism(name)}
                className="px-2 py-1.5 text-xs rounded-lg border border-zinc-200 text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
              >
                {name}
              </button>
            )
          )}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-700">
            Layers ({layers.length})
          </label>
          <button
            onClick={addLayer}
            disabled={layers.length >= 6}
            className="px-2 py-0.5 text-xs rounded border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30"
          >
            + Add
          </button>
        </div>
        <div className="space-y-4 max-h-[320px] overflow-y-auto">
          {layers.map((l, i) => (
            <div key={l.id} className="p-3 border border-zinc-100 rounded-lg space-y-2 bg-zinc-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-600">Layer {i + 1}</span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1 text-xs text-zinc-500">
                    <input
                      type="checkbox"
                      checked={l.inset}
                      onChange={(e) => updateLayer(l.id, "inset", e.target.checked)}
                      className="rounded accent-indigo-500"
                    />
                    inset
                  </label>
                  <button
                    onClick={() => removeLayer(l.id)}
                    disabled={layers.length <= 1}
                    className="text-xs text-rose-400 hover:text-rose-600 disabled:opacity-30"
                  >
                    Del
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <NumberInput label="X" value={l.x} onChange={(v) => updateLayer(l.id, "x", v)} unit="px" />
                <NumberInput label="Y" value={l.y} onChange={(v) => updateLayer(l.id, "y", v)} unit="px" />
                <NumberInput label="Blur" value={l.blur} onChange={(v) => updateLayer(l.id, "blur", v)} unit="px" min={0} />
                <NumberInput label="Spread" value={l.spread} onChange={(v) => updateLayer(l.id, "spread", v)} unit="px" />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={l.color}
                  onChange={(e) => updateLayer(l.id, "color", e.target.value)}
                  className="w-7 h-7 rounded border border-zinc-200 cursor-pointer p-0.5"
                />
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(l.opacity * 100)}
                  onChange={(e) => updateLayer(l.id, "opacity", Number(e.target.value) / 100)}
                  className="flex-1 h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-xs text-zinc-400 w-8">
                  {Math.round(l.opacity * 100)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <div>
          <label className="text-xs text-zinc-500">BG</label>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-8 h-8 rounded border border-zinc-200 cursor-pointer ml-1"
          />
        </div>
        <div>
          <label className="text-xs text-zinc-500">Box</label>
          <input
            type="color"
            value={boxColor}
            onChange={(e) => setBoxColor(e.target.value)}
            className="w-8 h-8 rounded border border-zinc-200 cursor-pointer ml-1"
          />
        </div>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Box Shadow"
      description="多层阴影叠加 + 新拟态(Neumorphism)一键生成，x/y/blur/spread 可视化调节"
      controls={controls}
      preview={
        <div
          className="w-56 h-56 rounded-3xl flex items-center justify-center transition-all"
          style={{
            background: boxColor,
            boxShadow: boxShadowCSS,
          }}
        >
          <span
            className="text-sm font-medium select-none"
            style={{ color: layers.some((l) => l.inset) ? "#9ca3af" : "#6b7280" }}
          >
            {layers.some((l) => l.inset) ? "Pressed" : "Raised"}
          </span>
        </div>
      }
      code={
        <CodePreview cssCode={cssCode} tailwindCode={tailwindCode} reactCode={reactCode} />
      }
    />
  );
}

function NumberInput({
  label,
  value,
  onChange,
  unit = "",
  min,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  unit?: string;
  min?: number;
}) {
  return (
    <div>
      <label className="text-xs text-zinc-400">{label}</label>
      <div className="flex items-center gap-0.5">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          min={min}
          className="w-full px-2 py-1 text-xs border border-zinc-200 rounded focus:outline-none focus:border-indigo-400"
        />
        {unit && <span className="text-xs text-zinc-400">{unit}</span>}
      </div>
    </div>
  );
}
