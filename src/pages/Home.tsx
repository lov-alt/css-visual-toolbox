import { Link } from "react-router-dom";

const tools = [
  {
    path: "/clip-path",
    name: "Clip Path",
    icon: "◇",
    desc: "可视化编辑 CSS clip-path 形状，支持 polygon、circle、ellipse、inset，实时预览+代码导出",
    color: "from-rose-500 to-violet-500",
  },
  {
    path: "/gradient",
    name: "Gradient",
    icon: "◐",
    desc: "线性/径向/锥形渐变编辑器，拖拽色标、调角度、导出 CSS/Tailwind/React 代码",
    color: "from-amber-500 to-rose-500",
  },
  {
    path: "/shadow",
    name: "Box Shadow",
    icon: "◼",
    desc: "多层阴影叠加编辑器，支持新拟态(Neumorphism)一键生成，x/y/blur/spread 可视化调节",
    color: "from-sky-500 to-indigo-500",
  },
  {
    path: "/border-radius",
    name: "Border Radius",
    icon: "◯",
    desc: "圆角可视化调节，支持四角独立控制、非对称圆角、百分比与像素单位切换",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold tracking-tight text-zinc-900 mb-4">
          CSS Visual Toolbox
        </h1>
        <p className="text-lg text-zinc-500 max-w-lg mx-auto">
          开源、离线可用、支持多框架导出的 CSS 可视化编辑工具集
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {tools.map((tool) => (
          <Link
            key={tool.path}
            to={tool.path}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200/60 bg-white p-6 hover:shadow-lg hover:border-zinc-300 transition-all duration-300"
          >
            <div
              className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${tool.color} opacity-[0.07] rounded-bl-full group-hover:opacity-[0.12] transition-opacity`}
            />
            <div className="relative">
              <span className="text-3xl">{tool.icon}</span>
              <h2 className="text-xl font-semibold text-zinc-900 mt-3 mb-2">
                {tool.name}
              </h2>
              <p className="text-sm text-zinc-500 leading-relaxed">
                {tool.desc}
              </p>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-16 text-center text-sm text-zinc-400">
        <p>全部工具数据保存在本地浏览器，无需网络即可使用</p>
        <p className="mt-1">
          <a
            href="https://github.com/lov-alt/css-visual-toolbox"
            className="text-indigo-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub 开源
          </a>
        </p>
      </div>
    </div>
  );
}
