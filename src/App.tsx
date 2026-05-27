import { useEffect, useState, useRef } from "react";
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
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem("css-toolbox-theme");
    return saved ? saved === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  const iconKey = useRef(0);

  useEffect(() => {
    document.body.classList.toggle("dark", dark);
    localStorage.setItem("css-toolbox-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleDark = () => {
    iconKey.current++;
    setDark(!dark);
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-[#0f0f1a] transition-colors duration-300">
      <header className="border-b border-zinc-200/60 dark:border-zinc-800/60 bg-white/80 dark:bg-[#0f0f1a]/80 backdrop-blur-xl sticky top-0 z-50 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link
            to="/"
            className="font-semibold text-lg tracking-tight text-zinc-900 dark:text-zinc-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
          >
            CSS Visual Toolbox
          </Link>
          <div className="flex items-center gap-3">
            {!isHome && (
              <nav className="flex gap-1">
                {tools.map((t) => (
                  <Link
                    key={t.path}
                    to={t.path}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all duration-200 ${
                      location.pathname === t.path
                        ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 shadow-sm"
                        : "text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800/50"
                    }`}
                  >
                    {t.name}
                  </Link>
                ))}
              </nav>
            )}
            <button
              onClick={toggleDark}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-zinc-200 dark:border-zinc-700 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-zinc-300 dark:hover:border-zinc-600 transition-all duration-200"
              aria-label="Toggle dark mode"
            >
              <span key={iconKey.current} className="theme-icon-enter inline-flex">
                {dark ? (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <circle cx="8" cy="8" r="3" />
                    <path d="M8 1v1M8 14v1M1 8h1M14 8h1M3.05 3.05l.7.7M12.25 12.25l.7.7M3.05 12.95l.7-.7M12.25 3.75l.7-.7" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                    <path d="M13.5 9.5A5.5 5.5 0 0 1 6.5 2.5 5.5 5.5 0 1 0 13.5 9.5Z" />
                  </svg>
                )}
              </span>
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div key={location.pathname} className="page-enter">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
