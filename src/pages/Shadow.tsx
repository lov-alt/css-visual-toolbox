import { useState, useRef } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";
import NumberInput from "../components/NumberInput";
import SectionLabel from "../components/SectionLabel";
import { useI18n } from "../i18n/index";
import { generateCode, type Framework } from "../generators/index";
import ImageUpload from "../components/ImageUpload";
import { placeholders } from "../components/placeholderImages";

const PLACEHOLDER = `url('${placeholders.texture}')`;

interface ShadowLayer {
  id: number; x: number; y: number; blur: number; spread: number;
  color: string; opacity: number; inset: boolean;
}

const MAX_LAYERS = 6;
const MIN_LAYERS = 1;
const ALL_FW: Framework[] = ["css", "tailwind", "react", "vue", "svelte", "swiftui", "flutter"];

const NEUMORPH_PRESETS: Record<string, { bg: string; box: string; layers: Omit<ShadowLayer, "id">[] }> = {
  "Flat Raise": {
    bg: "#e8ebf0", box: "#e8ebf0",
    layers: [
      { x: 8, y: 8, blur: 16, spread: 0, color: "#b8bcc8", opacity: 0.55, inset: false },
      { x: -8, y: -8, blur: 16, spread: 0, color: "#ffffff", opacity: 0.85, inset: false },
    ],
  },
  "Flat Pressed": {
    bg: "#e8ebf0", box: "#e8ebf0",
    layers: [
      { x: 3, y: 3, blur: 8, spread: 0, color: "#b8bcc8", opacity: 0.45, inset: true },
      { x: -3, y: -3, blur: 8, spread: 0, color: "#ffffff", opacity: 0.75, inset: true },
    ],
  },
  Convex: {
    bg: "#e8ebf0", box: "#e8ebf0",
    layers: [
      { x: 12, y: 12, blur: 24, spread: -4, color: "#a0a4b0", opacity: 0.5, inset: false },
      { x: -12, y: -12, blur: 24, spread: -4, color: "#ffffff", opacity: 0.95, inset: false },
    ],
  },
  Concave: {
    bg: "#e8ebf0", box: "#e8ebf0",
    layers: [
      { x: 6, y: 6, blur: 12, spread: -2, color: "#a0a4b0", opacity: 0.4, inset: true },
      { x: -6, y: -6, blur: 12, spread: -2, color: "#ffffff", opacity: 0.65, inset: true },
    ],
  },
};

const PRESET_LABELS: Record<string, string> = {
  "Flat Raise": "Raised", "Flat Pressed": "Pressed", Convex: "Convex", Concave: "Concave",
};

export default function Shadow() {
  const { t } = useI18n();
  const idRef = useRef(10);
  const [bgColor, setBgColor] = useState("#e8ebf0");
  const [boxColor, setBoxColor] = useState("#e8ebf0");
  const [layers, setLayers] = useState<ShadowLayer[]>([
    { id: idRef.current++, x: 4, y: 6, blur: 12, spread: 0, color: "#000000", opacity: 0.1, inset: false },
  ]);
  const [activeNeumorph, setActiveNeumorph] = useState<string | null>(null);

  const updateLayer = (id: number, field: keyof ShadowLayer, value: number | string | boolean) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)));
  };

  const addLayer = () => {
    if (layers.length >= MAX_LAYERS) return;
    setLayers((prev) => [...prev, { id: idRef.current++, x: 2, y: 2, blur: 8, spread: 0, color: "#000000", opacity: 0.08, inset: false }]);
  };

  const removeLayer = (id: number) => {
    if (layers.length <= MIN_LAYERS) return;
    setLayers((prev) => prev.filter((l) => l.id !== id));
  };

  const applyPreset = (name: string) => {
    const p = NEUMORPH_PRESETS[name];
    if (!p) return;
    setActiveNeumorph(name);
    setBgColor(p.bg);
    setBoxColor(p.box);
    setLayers(p.layers.map((l) => ({ ...l, id: idRef.current++ })));
  };

  const formatShadow = layers.map((l) => {
    const alpha = Math.round(l.opacity * 255).toString(16).padStart(2, "0");
    return `${l.inset ? "inset " : ""}${l.x}px ${l.y}px ${l.blur}px ${l.spread}px ${l.color}${alpha}`;
  }).join(",\n       ");

  const [bgImage, setBgImage] = useState<string | null>(null);
  const shadowValue = formatShadow.replace(/\n\s+/g, " ");
  const codeMap = Object.fromEntries(ALL_FW.map((fw) => [fw, generateCode(fw, "box-shadow", shadowValue)])) as Record<Framework, string>;

  const hasInset = layers.some((l) => l.inset);
  const statusLabel = activeNeumorph ? PRESET_LABELS[activeNeumorph] ?? "Custom" : hasInset ? "Pressed" : "Custom";

  const controls = (
    <>
      <SectionLabel label={t.shadow.neumorphism} />
      <div className="flex flex-wrap gap-1">
        {Object.keys(NEUMORPH_PRESETS).map((name) => (
          <button key={name} type="button" onClick={() => applyPreset(name)}
            className={`px-2.5 py-1 text-[11px] font-medium rounded-md border transition-all ${
              activeNeumorph === name
                ? "border-indigo-200 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400"
                : "border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700"
            }`}>
            {PRESET_LABELS[name] ?? name}
          </button>
        ))}
      </div>

      <SectionLabel label={t.shadow.layers} badge={`${layers.length}`}
        action={{ label: t.common.add, onClick: addLayer, disabled: layers.length >= MAX_LAYERS }} />

      <div className="space-y-3 max-h-72 overflow-y-auto custom-scrollbar">
        {layers.map((l, i) => (
          <div key={l.id} className="p-3 border border-zinc-100 dark:border-zinc-800 rounded-xl space-y-2.5 bg-zinc-50/50 dark:bg-zinc-900/50">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">
                {t.shadow.layer} {i + 1}
              </span>
              <div className="flex items-center gap-2">
                <label className="flex items-center gap-1 text-[11px] text-zinc-400 dark:text-zinc-500 cursor-pointer select-none">
                  <input type="checkbox" checked={l.inset} onChange={(e) => updateLayer(l.id, "inset", e.target.checked)} className="rounded accent-indigo-500" />
                  inset
                </label>
                <button type="button" onClick={() => removeLayer(l.id)} disabled={layers.length <= MIN_LAYERS}
                  className="text-[10px] text-rose-400 hover:text-rose-600 disabled:opacity-20 font-medium transition-colors">
                  {t.common.del}
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
              <input type="color" value={l.color} onChange={(e) => updateLayer(l.id, "color", e.target.value)} className="w-7 h-7 shrink-0" />
              <input type="range" min={0} max={100} value={Math.round(l.opacity * 100)} onChange={(e) => updateLayer(l.id, "opacity", Number(e.target.value) / 100)} className="slider flex-1" />
              <span className="text-[11px] tabular-nums text-zinc-400 w-8 text-right">{Math.round(l.opacity * 100)}%</span>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-3 pt-1">
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-zinc-400">BG</span>
          <input type="color" value={bgColor} onChange={(e) => { setBgColor(e.target.value); setActiveNeumorph(null); }} className="w-7 h-7" />
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-zinc-400">Box</span>
          <input type="color" value={boxColor} onChange={(e) => { setBoxColor(e.target.value); setActiveNeumorph(null); }} className="w-7 h-7" />
        </div>
      </div>

      <ImageUpload onImage={setBgImage} currentImage={bgImage} />
    </>
  );

  return (
    <ToolLayout title={t.shadow.title} description={t.shadow.description} controls={controls}
      preview={
        <div className="flex items-center justify-center p-8 rounded-2xl transition-colors" style={{ background: bgColor }}>
          <div className="w-48 h-48 rounded-3xl flex items-center justify-center transition-all duration-300 overflow-hidden" style={{
            background: bgImage ? `url(${bgImage}) center/cover no-repeat` : `${PLACEHOLDER} center/cover no-repeat`,
            boxShadow: formatShadow,
          }}>
            {!bgImage && (
              <span className="text-sm font-medium select-none transition-colors" style={{ color: hasInset ? "#9ca3af" : "#6b7280" }}>
                {statusLabel}
              </span>
            )}
          </div>
        </div>
      }
      code={<CodePreview codeMap={codeMap} />}
    />
  );
}
