import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
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

export const getTasksForPets = async (petIds: string[], date: Date): Promise<Task[]> => {
  if (!petIds.length) return [];
  const taskRef = collection(db, TABLE_NAME);
  const startOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 0, 0, 0, 0));
  const endOfDay = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 23, 59, 59, 999));

  try {
    const tasksQuery = query(
      taskRef,
      where("petId", "in", petIds),
      where("taskDate", ">=", startOfDay),
      where("taskDate", "<=", endOfDay)
    );
    const snapshot = await getDocs(tasksQuery);
    return snapshot.docs.map((doc) => doc.data() as Task);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    return [];
  }
};

export const getTasksByPetId = async (petId: string) => {
    const taskRef = collection(db, TABLE_NAME);

    try {
        const tasksQuery = query(
            taskRef,
            where("petId", "==", petId),
            orderBy('taskDate', 'desc')
        );
        const snapshot = await getDocs(tasksQuery);
        return snapshot.docs.map((doc) => doc.data() as Task);
    } catch (err) {
        console.error("Error fetching tasks:", err);
        return [];
    }
};

