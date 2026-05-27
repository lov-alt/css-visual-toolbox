import { useRef, useState } from "react";

interface Props {
  onImage: (dataUrl: string | null) => void;
  currentImage: string | null;
}

export default function ImageUpload({ onImage, currentImage }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = () => onImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
      onDragLeave={() => setDragOver(false)}
      onDrop={handleDrop}
      className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-200 ${
        dragOver
          ? "border-indigo-400 bg-indigo-50/50 dark:bg-indigo-500/5 scale-[1.02]"
          : currentImage
            ? "border-transparent"
            : "border-zinc-300 dark:border-zinc-700 hover:border-indigo-300 dark:hover:border-indigo-600"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
        className="hidden"
      />

      {currentImage ? (
        <div className="relative group">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-48 object-cover rounded-xl"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors rounded-xl flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium bg-white/90 hover:bg-white text-zinc-700 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
            >
              Change
            </button>
            <button
              type="button"
              onClick={() => onImage(null)}
              className="px-3 py-1.5 text-xs font-medium bg-white/90 hover:bg-rose-50 text-zinc-700 hover:text-rose-600 rounded-lg shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 translate-y-1 group-hover:translate-y-0"
            >
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="w-full py-12 flex flex-col items-center gap-2 text-zinc-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <path d="m21 15-5-5L5 21" />
          </svg>
          <span className="text-xs font-medium">
            Drop image here or click to upload
          </span>
          <span className="text-[10px] opacity-50">
            PNG, JPG, WebP, SVG
          </span>
        </button>
      )}
    </div>
  );
}
