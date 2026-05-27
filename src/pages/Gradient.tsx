import { useState } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";

type GradientType = "linear" | "radial" | "conic";

interface ColorStop {
  id: number;
  color: string;
  position: number;
}

let stopId = 0;
function nextId() {
  return ++stopId;
}

export default function Gradient() {
  const [gradType, setGradType] = useState<GradientType>("linear");
  const [angle, setAngle] = useState(135);
  const [stops, setStops] = useState<ColorStop[]>([
    { id: nextId(), color: "#6366f1", position: 0 },
    { id: nextId(), color: "#ec4899", position: 100 },
  ]);

  const updateStop = (id: number, field: keyof ColorStop, value: string | number) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const addStop = () => {
    if (stops.length >= 8) return;
    const mid = stops.length === 2
      ? 50
      : Math.round(
          (stops[Math.floor(stops.length / 2)].position +
            stops[Math.floor(stops.length / 2) + 1].position) /
            2
        );
    setStops(
      [...stops, { id: nextId(), color: "#a855f7", position: mid }].sort(
        (a, b) => a.position - b.position
      )
    );
  };

  const removeStop = (id: number) => {
    if (stops.length <= 2) return;
    setStops(stops.filter((s) => s.id !== id));
  };

  const sortedStops = [...stops].sort((a, b) => a.position - b.position);

  const gradientCSS = (() => {
    const stopStr = sortedStops.map((s) => `${s.color} ${s.position}%`).join(", ");
    switch (gradType) {
      case "linear":
        return `linear-gradient(${angle}deg, ${stopStr})`;
      case "radial":
        return `radial-gradient(circle, ${stopStr})`;
      case "conic":
        return `conic-gradient(from ${angle}deg, ${stopStr})`;
    }
  })();

  const cssCode = `background: ${gradientCSS};`;

  const tailwindCode = `/* 渐变在 Tailwind 中通常用于 bg  */
/* 可以在 tailwind.config 中扩展，或使用任意值: */

<div className="bg-[${gradientCSS.replace(/ /g, "_")}]" />

/* 或自定义 utility:
.bg-custom-gradient {
  background: ${gradientCSS};
} */`;

  const reactCode = `<div style={{
  background: "${gradientCSS}",
}} />`;

  const controls = (
    <>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Type</label>
        <div className="grid grid-cols-3 gap-1.5">
          {(["linear", "radial", "conic"] as GradientType[]).map((t) => (
            <button
              key={t}
              onClick={() => setGradType(t)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                gradType === t
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {(gradType === "linear" || gradType === "conic") && (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-zinc-600">Angle</label>
            <span className="text-xs text-zinc-400">{angle}deg</span>
          </div>
          <input
            type="range"
            min={0}
            max={360}
            value={angle}
            onChange={(e) => setAngle(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
        </div>
      )}

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium text-zinc-700">
            Color Stops ({stops.length})
          </label>
          <button
            onClick={addStop}
            disabled={stops.length >= 8}
            className="px-2 py-0.5 text-xs rounded border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30"
          >
            + Add
          </button>
        </div>
        <div className="space-y-2">
          {sortedStops.map((s) => (
            <div key={s.id} className="flex items-center gap-2">
              <input
                type="color"
                value={s.color}
                onChange={(e) => updateStop(s.id, "color", e.target.value)}
                className="w-8 h-8 rounded border border-zinc-200 cursor-pointer p-0.5"
              />
              <input
                type="number"
                value={s.position}
                onChange={(e) =>
                  updateStop(s.id, "position", Math.max(0, Math.min(100, Number(e.target.value))))
                }
                className="w-14 px-2 py-1 text-xs border border-zinc-200 rounded focus:outline-none focus:border-indigo-400"
                min={0}
                max={100}
              />
              <span className="text-xs text-zinc-400">%</span>
              <button
                onClick={() => removeStop(s.id)}
                disabled={stops.length <= 2}
                className="text-xs text-rose-400 hover:text-rose-600 disabled:opacity-30 ml-auto"
              >
                Del
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Gradient"
      description="线性 / 径向 / 锥形渐变编辑器，拖拽色标调节，实时预览+多格式代码导出"
      controls={controls}
      preview={
        <div
          className="w-72 h-72 rounded-xl shadow-md"
          style={{ background: gradientCSS }}
        />
      }
      code={
        <CodePreview cssCode={cssCode} tailwindCode={tailwindCode} reactCode={reactCode} />
      }
    />
  );
}
