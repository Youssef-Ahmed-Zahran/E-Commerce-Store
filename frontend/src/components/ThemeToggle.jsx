// src/components/ThemeToggle.jsx
import { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa";

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const initial = saved ? saved === "dark" : prefersDark;
    setIsDark(initial);
    document.documentElement.classList.toggle("dark", initial);
  }, []);

  const toggleTheme = () => {
    const newMode = !isDark;
    setIsDark(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 left-6 z-50 p-3 bg-slate-800 dark:bg-slate-200 rounded-full shadow-2xl hover:scale-110 transition-all duration-300"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FaSun className="w-5 h-5 text-yellow-400" />
      ) : (
        <FaMoon className="w-5 h-5 text-blue-600" />
      )}
    </button>
  );
};

export default ThemeToggle;
