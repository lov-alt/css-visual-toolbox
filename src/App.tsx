import { Outlet, Link, useLocation } from "react-router-dom";

const tools = [
  { path: "/clip-path", name: "Clip Path" },
  { path: "/gradient", name: "Gradient" },
  { path: "/shadow", name: "Shadow" },
  { path: "/border-radius", name: "Radius" },
];

export default function App() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="border-b border-zinc-200/60 bg-white/80 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="font-semibold text-lg tracking-tight text-zinc-900 hover:text-indigo-600 transition-colors"
          >
            CSS Visual Toolbox
          </Link>
          {!isHome && (
            <nav className="flex gap-1">
              {tools.map((t) => (
                <Link
                  key={t.path}
                  to={t.path}
                  className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                    location.pathname === t.path
                      ? "bg-indigo-50 text-indigo-700"
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  }`}
                >
                  {t.name}
                </Link>
              ))}
            </nav>
          )}
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
