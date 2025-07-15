// context/AppContext.tsx
import Routes from "@/constants/ApiRoutes";
import { fetchAPI } from "@/utils/fetchAPI";
import { storage } from "@/utils/storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

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
  userGroup: any[] | null;  
  setUserGroup?: (items: any[] | null) => void;  
};

const AppContext = createContext<AppContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  userGroup: null,
  setUserGroup: () => {},
});

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [userGroup, setUserGroup] = useState<any[] | null>(null);

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

  const getUserGroup = useCallback(async () => {
    try {
      const data = await fetchAPI(Routes.GET_USER_GROUP, "GET");
      if (data?.success === true) {
        setUserGroup(data?.data);
      }
    } catch (error) {}
  }, []);
  useEffect(() => {
    getUser();
    getUserGroup();
  }, [isLoggedIn]);

  return (
    <AppContext.Provider value={{ isLoggedIn, setIsLoggedIn, user, setUser , userGroup}}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
