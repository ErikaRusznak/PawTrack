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
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';

export interface FirebaseUserResponse {
    user: User;
}
 
export async function registerForPushNotificationsAsync(userId: string) {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    // Save token to Firestore
    await updateDoc(doc(db, 'users', userId), { expoPushToken: token });
  }
  return token;
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
  phoneNumber: string,
  picture?: string
  ): Promise<FirebaseUserResponse | undefined> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (picture) {
        await updateProfile(userCredential.user, { photoURL: picture });
      }

      addUserProfile(userCredential.user.uid, firstName, lastName, age, county, email, phoneNumber, picture);
  
      return { user: userCredential.user };
      
    } catch (e) {
      console.error("[error registering] ==>", e);
      throw e;
    }
}

export async function sendBeautifulFoundNotification(expoPushToken: string, senderName: string, message: string) {
  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      to: expoPushToken,
      sound: 'default',
      title: `🐾 Someone found your pet!`,
      body: `${senderName} sent you a message. Check to see details!`,
      priority: 'high',
      data: { type: 'found_pet', senderName },
      color: '#d98324',
      badge: 1,
    }),
  });
}

export async function getExpoPushTokenForUser(userId: string): Promise<string | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));
  if (userDoc.exists()) {
    return userDoc.data().expoPushToken || null;
  }
  return null;
}