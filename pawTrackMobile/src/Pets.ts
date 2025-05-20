import { addDoc, collection, doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";

const TABLE_NAME = 'pet';

export type Pet = {
    name: string;
    age: number;
    details: string;
    type: string;
    picture?: string | null;
};
export const addPet = async (pet: Pet) => {
  const petRef = collection(db, TABLE_NAME);
  await addDoc(petRef, pet);
};

export const updatePet = async (id: string, pet: Pet) => {
  const petRef = doc(db, TABLE_NAME, id);
  await updateDoc(petRef, pet);
};

export const getPetById = async (id: string) => {
  const petRef = doc(db, TABLE_NAME, id);
  const docSnap = await getDoc(petRef);
  return docSnap.exists() ? docSnap.data() : null;
};
