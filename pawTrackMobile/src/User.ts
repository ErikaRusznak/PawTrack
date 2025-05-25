import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const TABLE_NAME = 'users';

export type UserData = {
    firstName: string;
    lastName: string;
    age: number;
    county: string;
    email: string;
    picture?: string | null;
}

export const addUserProfile = async (uid: string, firstName: string, lastName: string, age: number, county: string, email: string, picture?: string) => {
    const userData: UserData = {firstName, lastName, age, county, email, picture: null};
    if(picture) userData.picture = picture;

    await setDoc(doc(db, TABLE_NAME, uid), userData);
}

export const getUserProfile = async (uid: string) => {
  const userDoc = await getDoc(doc(db, TABLE_NAME, uid));
  if (userDoc.exists()) {
    return userDoc.data();
  } else {
    return null;
  }
};
