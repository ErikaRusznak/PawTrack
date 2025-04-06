import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { login, logout, register } from "@/firebase/firebaseService";

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<User | undefined>;

  signUp: (email: string, password: string, name?: string) => Promise<User | undefined>;

  signOut: () => void;

  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function useSession(): AuthContextType {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

export function SessionProvider(props: { children: React.ReactNode }) {

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignIn = async (email: string, password: string) => {
    try {
      const response = await login(email, password);
      return response?.user;
    } catch (error) {
      console.error("[handleSignIn error] ==>", error);
      return undefined;
    }
  };

  const handleSignUp = async (
    email: string,
    password: string,
    name?: string
  ) => {
    try {
      const response = await register(email, password, name);
      return response?.user;
    } catch (error) {
      console.error("[handleSignUp error] ==>", error);
      return undefined;
    }
  };

  const handleSignOut = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error("[handleSignOut error] ==>", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        signIn: handleSignIn,
        signUp: handleSignUp,
        signOut: handleSignOut,
        user,
        isLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
}