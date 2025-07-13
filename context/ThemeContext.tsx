// // context/ThemeContext.tsx
// import { darkThemeColors, lightThemeColors, ThemeColors } from "@/constants/Colors";
// import { createContext, useContext, useEffect, useState } from "react";
// import { Appearance } from "react-native";

// type ThemeContextType = {
//   theme: ThemeColors;
//   toggleTheme: () => void;
// };

// const ThemeContext = createContext<ThemeContextType>({
//   theme: lightThemeColors,
//   toggleTheme: () => {},
// });

// export const useTheme = () => useContext(ThemeContext);

// export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
//   const [theme, setTheme] = useState(
//     Appearance.getColorScheme() === "dark" ? darkThemeColors : lightThemeColors
//   );

//   const toggleTheme = () => {
//     setTheme((prev) =>
//       prev === lightThemeColors ? darkThemeColors : lightThemeColors
//     );
//   };

//   useEffect(() => {
//     const listener = Appearance.addChangeListener(({ colorScheme }) => {
//       setTheme(colorScheme === "dark" ? darkThemeColors : lightThemeColors);
//     });

//     return () => listener.remove();
//   }, []);

//   return (
//     <ThemeContext.Provider value={{ theme, toggleTheme }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };
