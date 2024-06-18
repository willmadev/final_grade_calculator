import { createContext, useContext, useEffect, useState } from "react";
import { fetchApi } from "../../utils/fetchApi";

export type AuthObject =
  | {
      isAuthenticated: false;
    }
  | {
      isAuthenticated: true;
      email: string;
    };

type AuthContext = {
  auth: AuthObject;
  refreshAuth: () => Promise<void>;
};

export const AuthContext = createContext<AuthContext>({
  auth: { isAuthenticated: false },
  refreshAuth: async () => {},
});

interface AuthProviderProps {
  children?: React.ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthObject>({ isAuthenticated: false });

  const refreshAuth = async () => {
    try {
      const userInfo = await fetchApi("/auth/user-info", "GET");
      setAuth({ email: userInfo.email, isAuthenticated: true });
    } catch (error) {
      setAuth({ isAuthenticated: false });
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ auth, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext).auth;
};
