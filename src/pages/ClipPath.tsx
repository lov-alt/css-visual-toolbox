import { useState, useCallback } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";
import Slider from "../components/Slider";
import SegmentedControl from "../components/SegmentedControl";
import SectionLabel from "../components/SectionLabel";
import { useI18n } from "../i18n/index";
import { generateCode, type Framework } from "../generators/index";
import ImageUpload from "../components/ImageUpload";
import { placeholders } from "../components/placeholderImages";

const PLACEHOLDER = `url('${placeholders.landscape}')`;

type ShapeType = "polygon" | "circle" | "ellipse" | "inset";

interface Point { x: number; y: number }

const SHAPE_OPTIONS = ["polygon", "circle", "ellipse", "inset"] as const;

const PRESETS: Record<string, Point[]> = {
  triangle: [{ x: 50, y: 5 }, { x: 95, y: 90 }, { x: 5, y: 90 }],
  rhombus: [{ x: 50, y: 5 }, { x: 95, y: 50 }, { x: 50, y: 95 }, { x: 5, y: 50 }],
  pentagon: [
    { x: 50, y: 3 }, { x: 95, y: 35 }, { x: 78, y: 92 }, { x: 22, y: 92 }, { x: 5, y: 35 },
  ],
  hexagon: [
    { x: 50, y: 3 }, { x: 93, y: 25 }, { x: 93, y: 75 }, { x: 50, y: 97 }, { x: 7, y: 75 }, { x: 7, y: 25 },
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

const MAX_PTS = 12;
const MIN_PTS = 3;

const ALL_FW: Framework[] = ["css", "json", "tailwind", "react", "vue", "svelte", "swiftui", "flutter"];

export default function ClipPath() {
  const { t } = useI18n();

  const [shapeType, setShapeType] = useState<ShapeType>("polygon");
  const [points, setPoints] = useState<Point[]>(PRESETS.hexagon);
  const [circleR, setCircleR] = useState(40);
  const [circleCx, setCircleCx] = useState(50);
  const [circleCy, setCircleCy] = useState(50);
  const [ellipseRx, setEllipseRx] = useState(40);
  const [ellipseRy, setEllipseRy] = useState(30);
  const [ellipseCx, setEllipseCx] = useState(50);
  const [ellipseCy, setEllipseCy] = useState(50);
  const [insetT, setInsetT] = useState(10);
  const [insetR, setInsetR] = useState(10);
  const [insetB, setInsetB] = useState(10);
  const [insetL, setInsetL] = useState(10);
  const [insetRound, setInsetRound] = useState(0);
  const [bgImage, setBgImage] = useState<string | null>(null);

  const applyPreset = useCallback((name: string) => {
    if (PRESETS[name]) { setPoints([...PRESETS[name]]); setShapeType("polygon"); }
  }, []);

  const updatePoint = (i: number, field: "x" | "y", val: number) => {
    setPoints((prev) => prev.map((p, idx) => idx === i ? { ...p, [field]: Math.max(0, Math.min(100, val)) } : p));
  };

  const addPoint = () => {
    if (points.length >= MAX_PTS) return;
    const tail = points[points.length - 1] ?? { x: 50, y: 50 };
    setPoints([...points, { x: Math.min(100, tail.x + 8), y: Math.min(100, tail.y + 8) }]);
  };

  const removePoint = (i: number) => {
    if (points.length <= MIN_PTS) return;
    setPoints(points.filter((_, idx) => idx !== i));
  };

  const clipValue = (() => {
    switch (shapeType) {
      case "circle": return `circle(${circleR}% at ${circleCx}% ${circleCy}%)`;
      case "ellipse": return `ellipse(${ellipseRx}% ${ellipseRy}% at ${ellipseCx}% ${ellipseCy}%)`;
      case "inset": return `inset(${insetT}% ${insetR}% ${insetB}% ${insetL}% round ${insetRound}px)`;
      default: return `polygon(${points.map((p) => `${p.x}% ${p.y}%`).join(", ")})`;
    }
  })();

  const codeMap = Object.fromEntries(ALL_FW.map((fw) => [fw, generateCode(fw, "clip-path", clipValue)])) as Record<Framework, string>;

  const shapeOpts = SHAPE_OPTIONS.map((v) => ({ value: v, label: v }));

  const controls = (
    <>
      <SectionLabel label={t.clipPath.shape} />
      <SegmentedControl options={shapeOpts} value={shapeType} onChange={setShapeType} columns={2} />

      {shapeType === "polygon" && (
        <>
          <SectionLabel label={t.clipPath.presets} />
          <div className="flex flex-wrap gap-1">
            {Object.keys(PRESETS).map((name) => (
              <button key={name} type="button" onClick={() => applyPreset(name)}
                className="px-2.5 py-1 text-[11px] font-medium rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-600 dark:text-zinc-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all">
                {name}
              </button>
            ))}
          </div>

          <SectionLabel label={t.clipPath.points} badge={`${points.length}`}
            action={{ label: t.clipPath.add, onClick: addPoint, disabled: points.length >= MAX_PTS }} />
          <div className="space-y-1 max-h-48 overflow-y-auto custom-scrollbar">
            {points.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="text-[10px] text-zinc-400 font-mono w-5 shrink-0">{i + 1}</span>
                <input type="number" value={p.x} onChange={(e) => updatePoint(i, "x", Number(e.target.value))}
                  className="w-14 px-2 py-1 text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-indigo-400 transition-colors bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300" />
                <input type="number" value={p.y} onChange={(e) => updatePoint(i, "y", Number(e.target.value))}
                  className="w-14 px-2 py-1 text-[11px] font-mono border border-zinc-200 dark:border-zinc-800 rounded-md focus:outline-none focus:border-indigo-400 transition-colors bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300" />
                <span className="text-[10px] text-zinc-400">%</span>
                <button type="button" onClick={() => removePoint(i)} disabled={points.length <= MIN_PTS}
                  className="ml-auto text-[10px] text-rose-400 hover:text-rose-600 disabled:opacity-20 font-medium transition-colors">
                  {t.clipPath.del}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {shapeType === "circle" && (
        <div className="space-y-3">
          <Slider label="Radius" value={circleR} onChange={setCircleR} max={50} unit="%" />
          <Slider label="Center X" value={circleCx} onChange={setCircleCx} unit="%" />
          <Slider label="Center Y" value={circleCy} onChange={setCircleCy} unit="%" />
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
          <Slider label="Top" value={insetT} onChange={setInsetT} unit="%" />
          <Slider label="Right" value={insetR} onChange={setInsetR} unit="%" />
          <Slider label="Bottom" value={insetB} onChange={setInsetB} unit="%" />
          <Slider label="Left" value={insetL} onChange={setInsetL} unit="%" />
          <Slider label="Round" value={insetRound} onChange={setInsetRound} max={100} unit="px" />
        </div>
      )}

      <ImageUpload onImage={setBgImage} currentImage={bgImage} />
    </>
  );

  return (
    <ToolLayout title={t.clipPath.title} description={t.clipPath.description} controls={controls}
      preview={
        <div className="relative w-64 h-64">
          {/* Layer 1: full image (dimmed background) */}
          <div className="absolute inset-0 rounded-xl" style={{
            background: bgImage
              ? `url(${bgImage}) center/cover no-repeat`
              : PLACEHOLDER,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
          {/* Dark overlay on entire area */}
          <div className="absolute inset-0 rounded-xl bg-black/35 dark:bg-black/55" />
          {/* Layer 2: clipped image (spotlight — bright) */}
          <div className="absolute inset-0 rounded-xl" style={{
            background: bgImage
              ? `url(${bgImage}) center/cover no-repeat`
              : PLACEHOLDER,
            backgroundSize: "cover",
            backgroundPosition: "center",
            clipPath: clipValue,
          }} />
          {/* Dashed outline */}
          <div className="absolute inset-0 rounded-xl border-2 border-dashed border-white/70 dark:border-white/50 pointer-events-none" style={{ clipPath: clipValue }} />
        </div>
      }
      code={<CodePreview codeMap={codeMap} />}
    />
  );
}
