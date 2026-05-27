import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";

type ShapeType = "polygon" | "circle" | "ellipse" | "inset";

interface Point {
  x: number;
  y: number;
}

const presets: Record<string, Point[]> = {
  triangle: [
    { x: 50, y: 5 },
    { x: 95, y: 90 },
    { x: 5, y: 90 },
  ],
  rhombus: [
    { x: 50, y: 5 },
    { x: 95, y: 50 },
    { x: 50, y: 95 },
    { x: 5, y: 50 },
  ],
  pentagon: [
    { x: 50, y: 3 },
    { x: 95, y: 35 },
    { x: 78, y: 92 },
    { x: 22, y: 92 },
    { x: 5, y: 35 },
  ],
  hexagon: [
    { x: 50, y: 3 },
    { x: 93, y: 25 },
    { x: 93, y: 75 },
    { x: 50, y: 97 },
    { x: 7, y: 75 },
    { x: 7, y: 25 },
  ],
  star: [
    { x: 50, y: 3 },
    { x: 61, y: 35 },
    { x: 95, y: 35 },
    { x: 68, y: 55 },
    { x: 78, y: 92 },
    { x: 50, y: 68 },
    { x: 22, y: 92 },
    { x: 32, y: 55 },
    { x: 5, y: 35 },
    { x: 39, y: 35 },
  ],
  arrow: [
    { x: 20, y: 30 },
    { x: 60, y: 30 },
    { x: 60, y: 5 },
    { x: 95, y: 50 },
    { x: 60, y: 95 },
    { x: 60, y: 70 },
    { x: 20, y: 70 },
  ],
};

export default function ClipPath() {
  const [shapeType, setShapeType] = useState<ShapeType>("polygon");
  const [points, setPoints] = useState<Point[]>(presets.hexagon);
  const [circleRadius, setCircleRadius] = useState(40);
  const [circleX, setCircleX] = useState(50);
  const [circleY, setCircleY] = useState(50);
  const [ellipseRx, setEllipseRx] = useState(40);
  const [ellipseRy, setEllipseRy] = useState(30);
  const [ellipseCx, setEllipseCx] = useState(50);
  const [ellipseCy, setEllipseCy] = useState(50);
  const [insetTop, setInsetTop] = useState(10);
  const [insetRight, setInsetRight] = useState(10);
  const [insetBottom, setInsetBottom] = useState(10);
  const [insetLeft, setInsetLeft] = useState(10);
  const [insetRound, setInsetRound] = useState(0);

  const handlePreset = useCallback((name: string) => {
    if (presets[name]) {
      setPoints([...presets[name]]);
      setShapeType("polygon");
    }
  }, []);

  const updatePoint = (index: number, field: "x" | "y", value: number) => {
    const next = points.map((p, i) =>
      i === index ? { ...p, [field]: Math.max(0, Math.min(100, value)) } : p
    );
    setPoints(next);
  };

  const addPoint = () => {
    if (points.length >= 12) return;
    const last = points[points.length - 1] ?? { x: 50, y: 50 };
    setPoints([...points, { x: Math.min(100, last.x + 10), y: Math.min(100, last.y + 10) }]);
  };

  const removePoint = (index: number) => {
    if (points.length <= 3) return;
    setPoints(points.filter((_, i) => i !== index));
  };

  const clipValue = (() => {
    switch (shapeType) {
      case "circle":
        return `circle(${circleRadius}% at ${circleX}% ${circleY}%)`;
      case "ellipse":
        return `ellipse(${ellipseRx}% ${ellipseRy}% at ${ellipseCx}% ${ellipseCy}%)`;
      case "inset":
        return `inset(${insetTop}% ${insetRight}% ${insetBottom}% ${insetLeft}% round ${insetRound}px)`;
      case "polygon":
      default:
        return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
    }
  })();

  const cssCode = `clip-path: ${clipValue};`;

  const tailwindCode = `/* Tailwind 不原生支持任意 clip-path */
/* 建议在 global CSS 中定义为 utility */

.clip-custom {
  clip-path: ${clipValue};
}

/* 然后在 JSX 中使用 className="clip-custom" */`;

  const reactCode = `<div style={{
  clipPath: "${clipValue}",
  width: "100%",
  height: "100%",
}} />`;

  const controls = (
    <>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Shape Type</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(["polygon", "circle", "ellipse", "inset"] as ShapeType[]).map((t) => (
            <button
              key={t}
              onClick={() => setShapeType(t)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                shapeType === t
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {shapeType === "polygon" && (
        <>
          <div>
            <label className="block text-sm font-medium text-zinc-700 mb-2">Presets</label>
            <div className="flex flex-wrap gap-1.5">
              {Object.keys(presets).map((name) => (
                <button
                  key={name}
                  onClick={() => handlePreset(name)}
                  className="px-2.5 py-1 text-xs rounded-lg border border-zinc-200 text-zinc-600 hover:border-indigo-300 hover:bg-indigo-50 transition-colors"
                >
                  {name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-zinc-700">
                Points ({points.length})
              </label>
              <div className="flex gap-1">
                <button
                  onClick={addPoint}
                  disabled={points.length >= 12}
                  className="px-2 py-0.5 text-xs rounded border border-zinc-200 hover:bg-zinc-100 disabled:opacity-30"
                >
                  + Add
                </button>
              </div>
            </div>
            <div className="space-y-1.5 max-h-[240px] overflow-y-auto">
              {points.map((p, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-xs text-zinc-400 w-5">#{i + 1}</span>
                  <input
                    type="number"
                    value={p.x}
                    onChange={(e) => updatePoint(i, "x", Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs border border-zinc-200 rounded focus:outline-none focus:border-indigo-400"
                    placeholder="X"
                    min={0}
                    max={100}
                  />
                  <input
                    type="number"
                    value={p.y}
                    onChange={(e) => updatePoint(i, "y", Number(e.target.value))}
                    className="w-16 px-2 py-1 text-xs border border-zinc-200 rounded focus:outline-none focus:border-indigo-400"
                    placeholder="Y"
                    min={0}
                    max={100}
                  />
                  <button
                    onClick={() => removePoint(i)}
                    disabled={points.length <= 3}
                    className="text-xs text-rose-400 hover:text-rose-600 disabled:opacity-30 ml-auto"
                  >
                    Del
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {shapeType === "circle" && (
        <div className="space-y-3">
          <Slider label="Radius" value={circleRadius} onChange={setCircleRadius} max={50} unit="%" />
          <Slider label="Center X" value={circleX} onChange={setCircleX} unit="%" />
          <Slider label="Center Y" value={circleY} onChange={setCircleY} unit="%" />
        </div>
      )}

      {shapeType === "ellipse" && (
        <div className="space-y-3">
          <Slider label="Radius X" value={ellipseRx} onChange={setEllipseRx} max={50} unit="%" />
          <Slider label="Radius Y" value={ellipseRy} onChange={setEllipseRy} max={50} unit="%" />
          <Slider label="Center X" value={ellipseCx} onChange={setEllipseCx} unit="%" />
          <Slider label="Center Y" value={ellipseCy} onChange={setEllipseCy} unit="%" />
        </div>
      )}

      {shapeType === "inset" && (
        <div className="space-y-3">
          <Slider label="Top" value={insetTop} onChange={setInsetTop} unit="%" />
          <Slider label="Right" value={insetRight} onChange={setInsetRight} unit="%" />
          <Slider label="Bottom" value={insetBottom} onChange={setInsetBottom} unit="%" />
          <Slider label="Left" value={insetLeft} onChange={setInsetLeft} unit="%" />
          <Slider label="Round" value={insetRound} onChange={setInsetRound} max={100} unit="px" />
        </div>
      )}
    </>
  );

  return (
    <ToolLayout
      title="Clip Path"
      description="可视化编辑 CSS clip-path，支持 polygon / circle / ellipse / inset 四种形状"
      controls={controls}
      preview={
        <div className="relative w-72 h-72">
          {/* Background gradient to show clip effect */}
          <div
            className="absolute inset-0 rounded-lg"
            style={{
              background: `url('data:image/svg+xml,${encodeURIComponent(
                `<svg xmlns="http://www.w3.org/2000/svg" width="288" height="288">
                  <defs>
                    <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" style="stop-color:#6366f1"/>
                      <stop offset="50%" style="stop-color:#a855f7"/>
                      <stop offset="100%" style="stop-color:#ec4899"/>
                    </linearGradient>
                  </defs>
                  <rect fill="url(#g)" width="288" height="288" rx="8"/>
                </svg>`
              )}')`,
              backgroundSize: "cover",
              clipPath: clipValue,
            }}
          />
          {/* Dashed outline */}
          <div
            className="absolute inset-0 rounded-lg border-2 border-dashed border-zinc-300"
            style={{
              clipPath: clipValue,
            }}
          />
        </div>
      }
      code={
        <CodePreview cssCode={cssCode} tailwindCode={tailwindCode} reactCode={reactCode} />
      }
    />
  );
}

function Slider({
  label,
  value,
  onChange,
  max = 100,
  unit = "%",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max?: number;
  unit?: string;
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs text-zinc-600">{label}</label>
        <span className="text-xs text-zinc-400">
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
        className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
      />
    </div>
  );
}
