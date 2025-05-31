import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebase/firebaseConfig";
import { login, logout, register } from "@/firebase/firebaseService";
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<User | undefined>;

  signUp: (firstName: string, lastName: string, age: number, county: string, email: string, password: string, phoneNumber: string, picture?: string) => Promise<User | undefined>;

  signOut: () => void;

  user: User | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useSession = (): AuthContextType => {
  const value = useContext(AuthContext);

  if (process.env.NODE_ENV !== "production") {
    if (!value) {
      throw new Error("useSession must be wrapped in a <SessionProvider />");
    }
  }
  return value;
}

export const SessionProvider = (props: { children: React.ReactNode }) => {

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
      if (response?.user?.uid) {
        await AsyncStorage.setItem('userId', response.user.uid);
      }
      return response?.user;
    } catch (error) {
      console.error("Error: ", error);
      return undefined;
    }
  };

  const handleSignUp = async (
    firstName: string, 
    lastName: string,
    age: number, 
    county: string,
    email: string, 
    password: string, 
    phoneNumber: string,
    picture?: string
  ) => {
    try {
      const response = await register(firstName, lastName, age, county, email, password, phoneNumber, picture);
      return response?.user;
    } catch (error) {
      console.error("Error: ", error);
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