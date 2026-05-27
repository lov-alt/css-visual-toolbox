import type { ReactNode } from "react";

interface Props {
  title: string;
  description: string;
  controls: ReactNode;
  preview: ReactNode;
  code: ReactNode;
}

export default function ToolLayout({ title, description, controls, preview, code }: Props) {
  return (
    <div className="max-w-6xl mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-zinc-900">{title}</h1>
        <p className="text-sm text-zinc-500 mt-1">{description}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls Panel */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-zinc-200 rounded-xl p-5 space-y-5 sticky top-20">
            {controls}
          </div>
        </div>

        {/* Preview + Code */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-zinc-200 rounded-xl p-8 flex items-center justify-center min-h-[360px]">
            {preview}
          </div>
          {code}
        </div>
      </div>
    </div>
  );
}
