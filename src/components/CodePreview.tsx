import { useState } from "react";

type ExportFormat = "css" | "tailwind" | "react";

interface Props {
  cssCode: string;
  tailwindCode?: string;
  reactCode?: string;
}

export default function CodePreview({ cssCode, tailwindCode, reactCode }: Props) {
  const [format, setFormat] = useState<ExportFormat>("css");
  const [copied, setCopied] = useState(false);

  const codeMap: Record<ExportFormat, string> = {
    css: cssCode,
    tailwind: tailwindCode ?? cssCode,
    react: reactCode ?? cssCode,
  };

  const code = codeMap[format];

  const copy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-zinc-900 rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-800/50">
        <div className="flex gap-1">
          {(["css", "tailwind", "react"] as ExportFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-3 py-1 text-xs rounded-md transition-colors ${
                format === f
                  ? "bg-zinc-700 text-white"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {f === "css" ? "CSS" : f === "tailwind" ? "Tailwind" : "React"}
            </button>
          ))}
        </div>
        <button
          onClick={copy}
          className="px-3 py-1 text-xs bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors"
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-sm text-zinc-100 font-mono leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
}
