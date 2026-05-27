import { useState } from "react";
import ToolLayout from "../components/ToolLayout";
import CodePreview from "../components/CodePreview";
import Slider from "../components/Slider";
import SegmentedControl from "../components/SegmentedControl";
import SectionLabel from "../components/SectionLabel";
import { useI18n } from "../i18n/index";
import { generateCode, type Framework } from "../generators/index";
import ImageUpload from "../components/ImageUpload";

type UnitMode = "px" | "%";
type CornerMode = "symmetric" | "independent";

interface Corners { tl: number; tr: number; br: number; bl: number }

const ALL_FW: Framework[] = ["css", "tailwind", "react", "vue", "svelte", "swiftui", "flutter"];

const CORNER_DEFS: { key: keyof Corners; labelKey: "topLeft" | "topRight" | "bottomRight" | "bottomLeft" }[] = [
  { key: "tl", labelKey: "topLeft" },
  { key: "tr", labelKey: "topRight" },
  { key: "br", labelKey: "bottomRight" },
  { key: "bl", labelKey: "bottomLeft" },
];

export default function BorderRadius() {
  const { t } = useI18n();
  const [unit, setUnit] = useState<UnitMode>("px");
  const [mode, setMode] = useState<CornerMode>("symmetric");
  const [all, setAll] = useState(24);
  const [corners, setCorners] = useState<Corners>({ tl: 24, tr: 24, br: 24, bl: 24 });

  const suffix = unit === "%" ? "%" : "px";
  const max = unit === "%" ? 50 : 200;

  const setAllValue = (v: number) => { setAll(v); setCorners({ tl: v, tr: v, br: v, bl: v }); };
  const setCorner = (c: keyof Corners, v: number) => { setCorners((prev) => ({ ...prev, [c]: v })); if (mode === "symmetric") setAll(v); };
  const switchMode = (m: CornerMode) => { setMode(m); if (m === "symmetric") setCorners({ tl: all, tr: all, br: all, bl: all }); };

  const { tl, tr, br, bl } = corners;
  const isUniform = tl === tr && tr === br && br === bl;
  const [bgImage, setBgImage] = useState<string | null>(null);
  const radiusValue = isUniform ? `${tl}${suffix}` : `${tl}${suffix} ${tr}${suffix} ${br}${suffix} ${bl}${suffix}`;

  const codeMap = Object.fromEntries(ALL_FW.map((fw) => [fw, generateCode(fw, "border-radius", radiusValue)])) as Record<Framework, string>;

  const unitOpts = [{ value: "px" as UnitMode, label: "px" }, { value: "%" as UnitMode, label: "%" }];
  const modeOpts = [
    { value: "symmetric" as CornerMode, label: t.radius.symmetric },
    { value: "independent" as CornerMode, label: t.radius.independent },
  ];

  const controls = (
    <>
      <SectionLabel label={t.radius.unit} />
      <SegmentedControl options={unitOpts} value={unit} onChange={setUnit} columns={2} />
      <SectionLabel label={t.radius.mode} />
      <SegmentedControl options={modeOpts} value={mode} onChange={switchMode} columns={2} />

      {mode === "symmetric" ? (
        <>
          <Slider label={t.radius.allCorners} value={all} onChange={setAllValue} max={max} unit={suffix} />
          <input type="number" value={all} onChange={(e) => setAllValue(Math.max(0, Math.min(max, Number(e.target.value) || 0)))}
            className="w-full px-3 py-2 text-sm font-mono border border-zinc-200 dark:border-zinc-800 rounded-lg focus:outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-100 dark:focus:ring-indigo-900 transition-all bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300" />
        </>
      ) : (
        <div className="space-y-3">
          {CORNER_DEFS.map(({ key, labelKey }) => (
            <Slider key={key} label={t.radius[labelKey]} value={corners[key]} onChange={(v) => setCorner(key, v)} max={max} unit={suffix} />
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-[11px] font-mono text-zinc-400 dark:text-zinc-500 pt-1">
        {CORNER_DEFS.map(({ key, labelKey }) => (
          <div key={key} className="flex justify-between">
            <span>{t.radius[labelKey]}</span>
            <span className="tabular-nums">{corners[key]}{suffix}</span>
          </div>
        ))}
      </div>

      <ImageUpload onImage={setBgImage} currentImage={bgImage} />
    </>
  );

  return (
    <ToolLayout title={t.radius.title} description={t.radius.description} controls={controls}
      preview={
        <div className="flex items-center justify-center w-full py-4">
          <div className="w-52 h-52 shadow-xl shadow-zinc-300/30 dark:shadow-zinc-950/50 transition-all duration-300 flex items-center justify-center overflow-hidden"
            style={{
              borderRadius: radiusValue,
              background: bgImage
                ? `url(${bgImage}) center/cover no-repeat`
                : "linear-gradient(135deg, #6366f1, #a855f7)",
            }}>
            {!bgImage && (
              <span className="text-white/70 text-xs font-mono tracking-tight">{radiusValue}</span>
            )}
          </div>
        </div>
      }
      code={<CodePreview codeMap={codeMap} />}
    />
  );
}
