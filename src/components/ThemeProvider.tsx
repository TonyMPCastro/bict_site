"use client";

import * as React from "react";

type ThemeMode = "light" | "dark" | "system";
type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: ThemeMode;
  resolvedTheme: ResolvedTheme;
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  mounted: boolean;
};

type ThemeProviderProps = React.PropsWithChildren<{
  defaultTheme?: ThemeMode;
  attribute?: string;
  enableSystem?: boolean;
  disableTransitionOnChange?: boolean;
}>;

const ThemeContext = React.createContext<ThemeContextValue | undefined>(undefined);

function getSystemTheme(): ResolvedTheme {
  if (typeof window === "undefined") {
    return "light";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: ThemeMode, resolvedTheme: ResolvedTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.classList.toggle("dark", resolvedTheme === "dark");
  root.setAttribute("data-theme", resolvedTheme);
  root.style.colorScheme = resolvedTheme;

  if (theme === "system") {
    root.setAttribute("data-theme-mode", "system");
  } else {
    root.setAttribute("data-theme-mode", theme);
  }
}

export function ThemeProvider({ children, defaultTheme = "light" }: ThemeProviderProps) {
  const [theme, setThemeState] = React.useState<ThemeMode>(defaultTheme);
  const [resolvedTheme, setResolvedTheme] = React.useState<ResolvedTheme>("light");
  const [mounted, setMounted] = React.useState(false);
  const themeRef = React.useRef<ThemeMode>(defaultTheme);

  const applyThemeState = React.useCallback((nextTheme: ThemeMode) => {
    const effectiveTheme = nextTheme === "system" ? getSystemTheme() : nextTheme;
    setResolvedTheme(effectiveTheme);
    applyTheme(nextTheme, effectiveTheme);
  }, []);

  const setTheme = React.useCallback(
    (nextTheme: ThemeMode) => {
      themeRef.current = nextTheme;
      setThemeState(nextTheme);
      if (typeof window !== "undefined") {
        window.localStorage.setItem("theme", nextTheme);
      }
      applyThemeState(nextTheme);
    },
    [applyThemeState],
  );

  const toggleTheme = React.useCallback(() => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme]);

  React.useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as ThemeMode | null;
    const initialTheme = storedTheme ?? defaultTheme;
    themeRef.current = initialTheme;
    setThemeState(initialTheme);
    applyThemeState(initialTheme);
    setMounted(true);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemThemeChange = () => {
      if (themeRef.current === "system") {
        applyThemeState("system");
      }
    };

    mediaQuery.addEventListener("change", handleSystemThemeChange);
    return () => {
      mediaQuery.removeEventListener("change", handleSystemThemeChange);
    };
  }, [applyThemeState, defaultTheme]);

  const value = React.useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      setTheme,
      toggleTheme,
      mounted,
    }),
    [mounted, resolvedTheme, setTheme, theme, toggleTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = React.useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
