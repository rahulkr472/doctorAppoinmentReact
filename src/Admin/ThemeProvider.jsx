import React from 'react'
import { createContext, useState, useEffect, useContext } from "react";

const ThemeContext = createContext();


const ThemeProvider = ({children}) => {

    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
    return useContext(ThemeContext);
  }

export default ThemeProvider