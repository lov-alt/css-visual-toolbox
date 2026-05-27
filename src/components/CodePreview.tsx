import { useState } from "react";
import { useI18n } from "../i18n/index";
import { FRAMEWORKS, type Framework } from "../generators/index";

interface Props {
  codeMap: Partial<Record<Framework, string>>;
}

export default function CodePreview({ codeMap }: Props) {
  const { t } = useI18n();
  const [format, setFormat] = useState<Framework>("css");
  const [copied, setCopied] = useState(false);

  const code = codeMap[format] ?? "";

  const copy = async () => {
    await navigator.clipboard.writeText(
      code.replace(/^\/\*[\s\S]*?\*\/\n*/gm, "").trim()
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const availableFrameworks = FRAMEWORKS.filter((f) => f.key in codeMap);

  return (
    <div className="bg-zinc-900 dark:bg-zinc-950 rounded-xl overflow-hidden border border-zinc-800">
      <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-800/40 dark:bg-zinc-900/60">
        <div className="flex gap-0.5 flex-wrap">
          {availableFrameworks.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFormat(f.key)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-md transition-all duration-200 ${
                format === f.key
                  ? "bg-zinc-700 text-white shadow-sm"
                  : "text-zinc-500 hover:text-zinc-200"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1.5 px-3 py-1 text-[11px] font-medium bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-all duration-200 shrink-0 ml-2"
        >
          {copied ? (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {t.code.copied}
            </>
          ) : (
            <>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
              {t.code.copy}
            </>
          )}
        </button>
      </div>
      <pre className="p-4 text-sm text-zinc-200 font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap break-words">
        <code>{code}</code>
      </pre>
    </div>
  );
}
