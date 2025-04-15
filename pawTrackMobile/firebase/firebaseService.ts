import { 
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    updateProfile,
    User,
    UserCredential
  } from 'firebase/auth';
import { auth } from './firebaseConfig';
import { addUserProfile } from '@/src/User';

export interface FirebaseUserResponse {
    user: User;
}
  
export const getCurrentUser = async () => {
    try {
      return new Promise((resolve) => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
          unsubscribe();
          resolve(user ? { user } : null);
        });
      });
    } catch (error) {
      console.error("[error getting user] ==>", error);
      return null;
    }
};
  
export const login = async (
    email: string, 
    password: string
  ): Promise<FirebaseUserResponse | undefined> => {
    try {
      const userCredential: UserCredential = await signInWithEmailAndPassword(
        auth, 
        email, 
        password
      );
      return { user: userCredential.user };
    } catch (e) {
      console.error("[error logging in] ==>", e);
      throw e;
    }
}
  
export const logout = async(): Promise<void> => {
    try {
      await signOut(auth);
    } catch (e) {
      console.error("[error logging out] ==>", e);
      throw e;
    }
}
  
export const register = async(
  firstName: string,
  lastName: string,
  age: number,
  county: string,
  email: string, 
  password: string, 
  picture?: string
  ): Promise<FirebaseUserResponse | undefined> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (picture) {
        await updateProfile(userCredential.user, { photoURL: picture });
      }

      addUserProfile(userCredential.user.uid, firstName, lastName, age, county, email, picture);
  
      return { user: userCredential.user };
      
    } catch (e) {
      console.error("[error registering] ==>", e);
      throw e;
    }
}