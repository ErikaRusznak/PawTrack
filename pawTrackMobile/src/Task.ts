import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";

const TABLE_NAME = 'task';

export type Task = {
    id: string;
    petId: string;
    taskTitle: string;
    taskDate: Date | null;
    details: string;
    completed: boolean;
};

export const addTask = async (task: Task) => {
  const taskCollectionRef = collection(db, TABLE_NAME);
  const newTaskRef = doc(taskCollectionRef);
  const taskWithId = { ...task, id: newTaskRef.id, completed: false };
  await setDoc(newTaskRef, taskWithId);
};

