import React, { createContext, useState, useContext, ReactNode } from "react";

interface ThemeColors {
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
  primary: string;
}

interface ThemeContextType {
  isDark: boolean;
  toggleTheme: () => void;
  colors: ThemeColors;
}

const lightColors: ThemeColors = {
  background: "#F2F2F7",
  surface: "#FFFFFF",
  textPrimary: "#000000",
  textSecondary: "#8E8E93",
  border: "#E5E5EA",
  primary: "#007AFF",
};

const darkColors: ThemeColors = {
  background: "#000000",
  surface: "#1C1C1E",
  textPrimary: "#FFFFFF",
  textSecondary: "#8E8E93",
  border: "#333333",
  primary: "#0A84FF",
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const value = {
    isDark,
    toggleTheme,
    colors: isDark ? darkColors : lightColors,
  };

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
