import { createContext, useEffect, useState, ReactNode } from "react";

export interface DarkModeContextType {
  darkMode: boolean;
  toggle: () => void;
}

const DarkModeContext = createContext<DarkModeContextType | null>(null);

interface DarkModeProviderProps {
  children: ReactNode;
}

function DarkModeProvider({ children }: DarkModeProviderProps) {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const mode = localStorage.getItem("darkMode");
    if (mode === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark-mode");
    }
  }, []);

  const toggle = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      document.body.classList.toggle("dark-mode", newMode);
      localStorage.setItem("darkMode", newMode ? "dark" : "light");
      return newMode;
    });
  };

  return (
    <DarkModeContext.Provider value={{ darkMode, toggle }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export { DarkModeProvider, DarkModeContext };