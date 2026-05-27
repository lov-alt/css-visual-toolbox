import { useState } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";

type UnitMode = "px" | "%";
type CornerMode = "symmetric" | "independent";

interface Corners {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

export default function BorderRadius() {
  const [unitMode, setUnitMode] = useState<UnitMode>("px");
  const [cornerMode, setCornerMode] = useState<CornerMode>("symmetric");
  const [all, setAll] = useState(24);
  const [corners, setCorners] = useState<Corners>({
    tl: 24,
    tr: 24,
    br: 24,
    bl: 24,
  });

  const setAllValue = (v: number) => {
    setAll(v);
    setCorners({ tl: v, tr: v, br: v, bl: v });
  };

  const setCorner = (c: keyof Corners, v: number) => {
    const next = { ...corners, [c]: v };
    setCorners(next);
    // sync all if symmetric
    if (cornerMode === "symmetric") {
      setAll(v);
    }
  };

  const switchCornerMode = (mode: CornerMode) => {
    setCornerMode(mode);
    if (mode === "symmetric") {
      setCorners({ tl: all, tr: all, br: all, bl: all });
    }
  };

  const unitSuffix = unitMode === "%" ? "%" : "px";
  const max = unitMode === "%" ? 50 : 200;

  const radiusCSS = (() => {
    const { tl, tr, br, bl } = corners;
    if (tl === tr && tr === br && br === bl) {
      return `${tl}${unitSuffix}`;
    }
    return `${tl}${unitSuffix} ${tr}${unitSuffix} ${br}${unitSuffix} ${bl}${unitSuffix}`;
  })();

  const cssCode = `border-radius: ${radiusCSS};`;

  const tailwindCode = `/* Tailwind 圆角工具类 */
/* symmetric: rounded-[${all}${unitSuffix}] */
/* independent: rounded-tl-[${corners.tl}${unitSuffix}] rounded-tr-[${corners.tr}${unitSuffix}] rounded-br-[${corners.br}${unitSuffix}] rounded-bl-[${corners.bl}${unitSuffix}] */`;

  const reactCode = `<div style={{
  borderRadius: "${radiusCSS}",
}} />`;

  const controls = (
    <>
      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Unit</label>
        <div className="grid grid-cols-2 gap-1.5">
          {(["px", "%"] as UnitMode[]).map((u) => (
            <button
              key={u}
              onClick={() => setUnitMode(u)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                unitMode === u
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              {u}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-zinc-700 mb-2">Mode</label>
        <div className="grid grid-cols-2 gap-1.5">
          {([
            { value: "symmetric" as CornerMode, label: "Symmetric" },
            { value: "independent" as CornerMode, label: "Independent" },
          ]).map((m) => (
            <button
              key={m.value}
              onClick={() => switchCornerMode(m.value)}
              className={`px-3 py-1.5 text-sm rounded-lg border transition-colors ${
                cornerMode === m.value
                  ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                  : "border-zinc-200 text-zinc-600 hover:border-zinc-300"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {cornerMode === "symmetric" ? (
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs text-zinc-600">All Corners</label>
            <span className="text-xs text-zinc-400">
              {all}
              {unitSuffix}
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={max}
            value={all}
            onChange={(e) => setAllValue(Number(e.target.value))}
            className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
          />
          <input
            type="number"
            value={all}
            onChange={(e) => setAllValue(Math.max(0, Math.min(max, Number(e.target.value))))}
            className="mt-2 w-full px-3 py-1.5 text-sm border border-zinc-200 rounded-lg focus:outline-none focus:border-indigo-400"
            min={0}
            max={max}
          />
        </div>
      ) : (
        <div className="space-y-3">
          {([
            { key: "tl" as keyof Corners, label: "Top Left" },
            { key: "tr" as keyof Corners, label: "Top Right" },
            { key: "br" as keyof Corners, label: "Bottom Right" },
            { key: "bl" as keyof Corners, label: "Bottom Left" },
          ]).map(({ key, label }) => (
            <div key={key}>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-zinc-600">{label}</label>
                <span className="text-xs text-zinc-400">
                  {corners[key]}
                  {unitSuffix}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={max}
                value={corners[key]}
                onChange={(e) => setCorner(key, Number(e.target.value))}
                className="w-full h-1.5 bg-zinc-200 rounded-full appearance-none cursor-pointer accent-indigo-500"
              />
            </div>
          ))}
        </div>
      )}

      {/* Visual corner diagram */}
      <div className="grid grid-cols-2 gap-2 text-xs text-zinc-500">
        <div>↖ TL: {corners.tl}{unitSuffix}</div>
        <div>↗ TR: {corners.tr}{unitSuffix}</div>
        <div>↙ BL: {corners.bl}{unitSuffix}</div>
        <div>↘ BR: {corners.br}{unitSuffix}</div>
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Border Radius"
      description="圆角可视化调节，支持对称/独立四角控制 + px/% 单位切换"
      controls={controls}
      preview={
        <div className="flex items-center justify-center w-full">
          <div
            className="w-56 h-56 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg transition-all flex items-center justify-center"
            style={{ borderRadius: radiusCSS }}
          >
            <span className="text-white/80 text-xs font-mono">{radiusCSS}</span>
          </div>
        </div>
      }
      code={
        <CodePreview cssCode={cssCode} tailwindCode={tailwindCode} reactCode={reactCode} />
      }
    />
  );
}
