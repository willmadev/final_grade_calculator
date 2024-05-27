import { createContext, useState } from "react";

type AuthObject =
  | {
      isLoggedIn: false;
    }
  | {
      isLoggedIn: true;
      email: string;
    };

type AuthContext = {
  auth: AuthObject;
  setAuth: React.Dispatch<React.SetStateAction<AuthObject>>;
};

export const AuthContext = createContext<AuthContext>({
  auth: { isLoggedIn: false },
  setAuth: () => {},
});

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [auth, setAuth] = useState<AuthObject>({ isLoggedIn: false });
  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
