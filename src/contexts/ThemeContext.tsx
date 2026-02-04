import React, { createContext, useContext, useEffect, useState } from "react";

export type ColorTheme = "teal" | "blue" | "purple" | "rose" | "amber";
export type Mode = "light" | "dark";

interface ThemeContextType {
  colorTheme: ColorTheme;
  mode: Mode;
  setColorTheme: (theme: ColorTheme) => void;
  setMode: (mode: Mode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const colorThemes: { id: ColorTheme; name: string; preview: string }[] = [
  { id: "teal", name: "Teal", preview: "bg-[hsl(174,62%,35%)]" },
  { id: "blue", name: "Ocean Blue", preview: "bg-[hsl(210,80%,50%)]" },
  { id: "purple", name: "Royal Purple", preview: "bg-[hsl(270,70%,50%)]" },
  { id: "rose", name: "Rose Pink", preview: "bg-[hsl(340,75%,55%)]" },
  { id: "amber", name: "Amber Gold", preview: "bg-[hsl(38,92%,50%)]" },
];

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [colorTheme, setColorTheme] = useState<ColorTheme>(() => {
    const saved = localStorage.getItem("colorTheme");
    return (saved as ColorTheme) || "teal";
  });
  
  const [mode, setMode] = useState<Mode>(() => {
    const saved = localStorage.getItem("mode");
    if (saved) return saved as Mode;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });

  useEffect(() => {
    localStorage.setItem("colorTheme", colorTheme);
    document.documentElement.setAttribute("data-theme", colorTheme);
  }, [colorTheme]);

  useEffect(() => {
    localStorage.setItem("mode", mode);
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

  const toggleMode = () => setMode((prev) => (prev === "light" ? "dark" : "light"));

  return (
    <ThemeContext.Provider value={{ colorTheme, mode, setColorTheme, setMode, toggleMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
