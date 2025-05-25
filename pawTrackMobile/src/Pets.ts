import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";

const TABLE_NAME = 'pet';
const PAGE_SIZE = 6;

export type Pet = {
    id: string;
    userId: string;
    name: string;
    age: number;
    details: string;
    animalType: string;
    found: boolean;
    picture?: string | null;
};

export const addPet = async (pet: Pet) => {
  const petCollectionRef = collection(db, TABLE_NAME);
  const newPetRef = doc(petCollectionRef);
  const petWithId = { ...pet, id: newPetRef.id };

  await setDoc(newPetRef, petWithId);
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

export const getPets = async (
  startAfterDoc?: QueryDocumentSnapshot<DocumentData>
): Promise<{ pets: Pet[]; lastDoc: QueryDocumentSnapshot<DocumentData> | null; hasMore: boolean }> => {
  const petRef = collection(db, TABLE_NAME);
  let petsQuery = query(petRef, orderBy("name"), limit(PAGE_SIZE + 1)); 

  if (startAfterDoc) {
    petsQuery = query(petRef, orderBy("name"), startAfter(startAfterDoc), limit(PAGE_SIZE + 1));
  }

  const snapshot = await getDocs(petsQuery);
  const docs = snapshot.docs;

  const hasMore = docs.length > PAGE_SIZE;
  const pets = docs.slice(0, PAGE_SIZE).map((doc) => ({ ...doc.data() })) as Pet[];
  const lastDoc = pets.length > 0 ? docs[Math.min(PAGE_SIZE - 1, docs.length - 1)] : null;

  return { pets, lastDoc, hasMore };
};


export const updatePetFoundStatus = async (petId: string, found: boolean) => {
  const ref = doc(db, TABLE_NAME, petId);
  await updateDoc(ref, { found });
};

export const deletePet = async (petId: string) => {
  const ref = doc(db, TABLE_NAME, petId);
  await deleteDoc(ref);
};

export const getPetsForUser = async (userId: string): Promise<Pet[]> => {
  const petRef = collection(db, TABLE_NAME);
  const petsQuery = query(petRef, where("userId", "==", userId));
  const snapshot = await getDocs(petsQuery);
  return snapshot.docs.map((doc) => doc.data() as Pet).sort((a, b) => a.name.localeCompare(b.name));
};

export const countPetsForUser = async (userId: string): Promise<number> => {
  const petsForUser = await getPetsForUser(userId);
  return petsForUser.length;
}

