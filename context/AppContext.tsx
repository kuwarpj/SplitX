// context/AppContext.tsx
import { storage } from "@/utils/storage";
import React, { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  token: string;
}

type AppContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (val: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
};

const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const getUser = async () => {
    const token = await storage.get("token");
    const storedUser = await storage.get("user");

    if (token && storedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(storedUser));
    } else {
      setIsLoggedIn(false);
      setUser(null);
    }
  };
  useEffect(() => {
    getUser();
  }, [isLoggedIn]);

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
