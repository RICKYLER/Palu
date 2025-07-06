import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Theme = "light" | "dark" | "system";

interface ThemeContextType {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>("system");
  const systemColorScheme = useColorScheme();

  const isDark =
    theme === "dark" || (theme === "system" && systemColorScheme === "dark");

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme");
      if (savedTheme && ["light", "dark", "system"].includes(savedTheme)) {
        setThemeState(savedTheme as Theme);
      }
    } catch (error) {
      console.error("Error loading theme:", error);
    }
  };

  const setTheme = async (newTheme: Theme) => {
    try {
      setThemeState(newTheme);
      await AsyncStorage.setItem("theme", newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = isDark ? "light" : "dark";
    setTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, isDark, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
