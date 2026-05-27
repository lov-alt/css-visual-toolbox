import { useState, useRef } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";
import Slider from "../components/Slider";
import SegmentedControl from "../components/SegmentedControl";
import SectionLabel from "../components/SectionLabel";
import { useI18n } from "../i18n/index";
import { generateCode, type Framework } from "../generators/index";
import ImageUpload from "../components/ImageUpload";
import { placeholders } from "../components/placeholderImages";

const PLACEHOLDER = `url('${placeholders.portrait}')`;

type GradientType = "linear" | "radial" | "conic";

interface ColorStop { id: number; color: string; position: number }

const TYPE_OPTIONS: { value: GradientType; label: string }[] = [
  { value: "linear", label: "Linear" },
  { value: "radial", label: "Radial" },
  { value: "conic", label: "Conic" },
];

const MAX_STOPS = 8;
const MIN_STOPS = 2;
const ALL_FW: Framework[] = ["css", "json", "tailwind", "react", "vue", "svelte", "swiftui", "flutter"];

export default function Gradient() {
  const { t } = useI18n();
  const idRef = useRef(3);
  const [gradType, setGradType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: 1, color: "#6366f1", position: 0 },
    { id: 2, color: "#ec4899", position: 100 },
  ]);

  const updateStop = (id: number, field: keyof ColorStop, value: string | number) => {
    setStops((prev) => prev.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStop = () => {
    if (stops.length >= MAX_STOPS) return;
    const sorted = [...stops].sort((a, b) => a.position - b.position);
    const mi = Math.floor(sorted.length / 2);
    const mid = sorted.length >= 2 ? Math.round((sorted[mi - 1].position + sorted[mi].position) / 2) : 50;
    setStops([...stops, { id: idRef.current++, color: "#a855f7", position: mid }].sort((a, b) => a.position - b.position));
  };

  const removeStop = (id: number) => {
    if (stops.length <= MIN_STOPS) return;
    setStops((prev) => prev.filter((s) => s.id !== id));
  };

  const sorted = [...stops].sort((a, b) => a.position - b.position);
  const stopStr = sorted.map((s) => `${s.color} ${s.position}%`).join(", ");

  const gradientCSS = (() => {
    switch (gradType) {
      case "linear": return `linear-gradient(${angle}deg, ${stopStr})`;
      case "radial": return `radial-gradient(circle, ${stopStr})`;
      case "conic": return `conic-gradient(from ${angle}deg, ${stopStr})`;
    }
  })();

  const [bgImage, setBgImage] = useState<string | null>(null);
  const codeMap = Object.fromEntries(ALL_FW.map((fw) => [fw, generateCode(fw, "background", gradientCSS)])) as Record<Framework, string>;

  const controls = (
    <>
      <SectionLabel label={t.gradient.type} />
      <SegmentedControl options={TYPE_OPTIONS} value={gradType} onChange={setGradType} columns={3} />
      {(gradType === "linear" || gradType === "conic") && (
        <Slider label={t.gradient.angle} value={angle} onChange={setAngle} max={360} unit="deg" />
      )}
      <SectionLabel label={t.gradient.stops} badge={`${stops.length}`}
        action={{ label: t.common.add, onClick: addStop, disabled: stops.length >= MAX_STOPS }} />
      <div className="space-y-2">
        {sorted.map((s) => (
          <div key={s.id} className="flex items-center gap-2">
            <input type="color" value={s.color} onChange={(e) => updateStop(s.id, "color", e.target.value)} className="w-8 h-8 shrink-0" />
            <input type="number" value={s.position} onChange={(e) => updateStop(s.id, "position", Math.max(0, Math.min(100, Number(e.target.value))))}
              className="w-14 px-2 py-1.5 text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-400 transition-colors bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300" />
            <span className="text-[11px] text-zinc-400">%</span>
            <button type="button" onClick={() => removeStop(s.id)} disabled={stops.length <= MIN_STOPS}
              className="ml-auto text-[10px] text-rose-400 hover:text-rose-600 disabled:opacity-20 font-medium transition-colors">
              {t.common.del}
            </button>
          </div>
        ))}
      </div>

      <ImageUpload onImage={setBgImage} currentImage={bgImage} />
    </>
  );

  return (
    <ToolLayout title={t.gradient.title} description={t.gradient.description} controls={controls}
      preview={
        <div className="w-64 h-64 rounded-2xl shadow-lg ring-1 ring-zinc-900/5 dark:ring-white/5" style={{
          backgroundImage: `${gradientCSS}, ${bgImage ? `url(${bgImage})` : PLACEHOLDER}`,
          backgroundSize: "auto, cover",
          backgroundPosition: "center",
          backgroundBlendMode: "soft-light, normal",
        }} />
      }
      code={<CodePreview codeMap={codeMap} />}
    />
  );
}
