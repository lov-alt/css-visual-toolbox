import { Link } from "react-router-dom";

const tools = [
  {
    path: "/clip-path",
    name: "Clip Path",
    desc: "可视化编辑 CSS clip-path 形状，支持 polygon、circle、ellipse、inset，实时预览 + 代码导出",
    gradient: "from-rose-400 via-violet-500 to-indigo-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12,2 22,8.5 22,15.5 12,22 2,15.5 2,8.5" />
      </svg>
    ),
  },
  {
    path: "/gradient",
    name: "Gradient",
    desc: "线性 / 径向 / 锥形渐变编辑器，拖拽色标、调角度、导出 CSS / Tailwind / React 代码",
    gradient: "from-amber-400 via-orange-500 to-rose-500",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 2a10 10 0 0 1 0 20" />
        <path d="M12 2a10 10 0 0 0 0 20" />
      </svg>
    ),
  },
  {
    path: "/shadow",
    name: "Box Shadow",
    desc: "多层阴影叠加编辑器，支持新拟态 (Neumorphism) 一键生成，x / y / blur / spread 可视化调节",
    gradient: "from-sky-400 via-blue-500 to-indigo-600",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="3" />
        <rect x="5" y="5" width="14" height="14" rx="2" opacity="0.35" />
      </svg>
    ),
  },
  {
    path: "/border-radius",
    name: "Border Radius",
    desc: "圆角可视化调节，支持对称 / 独立四角控制，百分比与像素单位自由切换",
    gradient: "from-emerald-400 via-teal-500 to-cyan-600",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
        <rect x="3" y="3" width="18" height="18" rx="7" />
        <circle cx="7" cy="7" r="1" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
];

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <p className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 uppercase tracking-[0.2em] mb-4">
          Open Source Design Tools
        </p>
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 mb-4">
          CSS Visual Toolbox
        </h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400 max-w-md mx-auto leading-relaxed">
          开源、离线可用、支持多框架导出的 CSS 可视化编辑工具集
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/60 p-6 hover:shadow-xl hover:shadow-zinc-200/50 dark:hover:shadow-zinc-950/50 hover:border-zinc-300 dark:hover:border-zinc-700 hover:-translate-y-0.5 transition-all duration-300"
          >
            <div
              className={`absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl ${tool.gradient} opacity-[0.05] group-hover:opacity-[0.1] rounded-bl-full transition-opacity duration-500`}
            />
            <div className="relative">
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${tool.gradient} text-white flex items-center justify-center mb-4 shadow-sm`}>
                {tool.icon}
              </div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-1.5">
                {tool.name}
              </h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                {tool.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-20 text-center">
        <p className="text-sm text-zinc-400 dark:text-zinc-500">
          全部工具数据保存在本地浏览器，无需网络即可使用
        </p>
        <p className="mt-2">
          <a
            href="https://github.com/lov-alt/css-visual-toolbox"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-400 dark:text-zinc-500 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
            target="_blank"
            rel="noopener noreferrer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.385-1.335-1.755-1.335-1.755-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.605-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z" />
            </svg>
            GitHub 开源
          </a>
        </p>
      </div>
    </div>
  );
}
