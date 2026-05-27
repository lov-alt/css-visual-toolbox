import { useState } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";
import Slider from "../components/Slider";
import SegmentedControl from "../components/SegmentedControl";
import SectionLabel from "../components/SectionLabel";

type UnitMode = "px" | "%";
type CornerMode = "symmetric" | "independent";

interface Corners {
  tl: number;
  tr: number;
  br: number;
  bl: number;
}

const UNIT_OPTIONS: { value: UnitMode; label: string }[] = [
  { value: "px", label: "px" },
  { value: "%", label: "%" },
];

const MODE_OPTIONS: { value: CornerMode; label: string }[] = [
  { value: "symmetric", label: "Symmetric" },
  { value: "independent", label: "Independent" },
];

const CORNER_KEYS: { key: keyof Corners; label: string }[] = [
  { key: "tl", label: "Top Left" },
  { key: "tr", label: "Top Right" },
  { key: "br", label: "Bottom Right" },
  { key: "bl", label: "Bottom Left" },
];

export default function BorderRadius() {
  const [unit, setUnit] = useState<UnitMode>("px");
  const [mode, setMode] = useState<CornerMode>("symmetric");
  const [all, setAll] = useState(24);
  const [corners, setCorners] = useState<Corners>({ tl: 24, tr: 24, br: 24, bl: 24 });

  const suffix = unit === "%" ? "%" : "px";
  const max = unit === "%" ? 50 : 200;

  const setAllValue = (v: number) => {
    setAll(v);
    setCorners({ tl: v, tr: v, br: v, bl: v });
  };

  const setCorner = (c: keyof Corners, v: number) => {
    setCorners((prev) => ({ ...prev, [c]: v }));
    if (mode === "symmetric") setAll(v);
  };

  const switchMode = (m: CornerMode) => {
    setMode(m);
    if (m === "symmetric") setCorners({ tl: all, tr: all, br: all, bl: all });
  };

  const { tl, tr, br, bl } = corners;
  const isUniform = tl === tr && tr === br && br === bl;
  const radiusCSS = isUniform
    ? `${tl}${suffix}`
    : `${tl}${suffix} ${tr}${suffix} ${br}${suffix} ${bl}${suffix}`;

  const cssCode = `border-radius: ${radiusCSS};`;

  const tailwindCode = isUniform
    ? `<div className="rounded-[${all}${suffix}]" />`
    : `<div className="rounded-tl-[${tl}${suffix}] rounded-tr-[${tr}${suffix}] rounded-br-[${br}${suffix}] rounded-bl-[${bl}${suffix}]" />`;

  const reactCode = `<div style={{ borderRadius: "${radiusCSS}" }} />`;

  const controls = (
    <>
      <SectionLabel label="Unit" />
      <SegmentedControl options={UNIT_OPTIONS} value={unit} onChange={setUnit} columns={2} />

      <SectionLabel label="Mode" />
      <SegmentedControl options={MODE_OPTIONS} value={mode} onChange={switchMode} columns={2} />

      {mode === "symmetric" ? (
        <>
          <Slider label="All Corners" value={all} onChange={setAllValue} max={max} unit={suffix} />
          <input
            type="number"
            value={all}
            onChange={(e) => setAllValue(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 text-sm font-mono border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
            min={0}
            max={max}
          />
        </>
      ) : (
        <div className="space-y-3">
          {CORNER_KEYS.map(({ key, label }) => (
            <Slider
              key={key}
              label={label}
              value={corners[key]}
              onChange={(v) => setCorner(key, v)}
              max={max}
              unit={suffix}
            />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 pt-1">
        {CORNER_KEYS.map(({ key, label }) => (
          <div key={key} className="flex justify-between">
            <span>{label}</span>
            <span className="tabular-nums">{corners[key]}{suffix}</span>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <ToolLayout
      title="Border Radius"
      description="圆角可视化调节，支持对称 / 独立四角控制 + px / % 单位切换"
      controls={controls}
      preview={
        <div className="flex items-center justify-center w-full py-4">
          <div
            className="w-52 h-52 bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 transition-all duration-300 flex items-center justify-center"
            style={{ borderRadius: radiusCSS }}
          >
            <span className="text-white/70 text-xs font-mono tracking-tight">{radiusCSS}</span>
          </div>
        </div>
      }
      code={<CodePreview cssCode={cssCode} tailwindCode={tailwindCode} reactCode={reactCode} />}
    />
  );
}
