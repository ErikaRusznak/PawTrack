import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";

const TABLE_NAME = 'post';

export type Post = {
    id: string;
    userId: string;
    petId: string;
    title: string;
    details: string;
    picture?: string | null;
    createdAt: Date | null;
    county: string;
    found: boolean;
};


export const addPost = async (post: Post) => {
    const postCollectionRef = collection(db, TABLE_NAME);
    const newPostRef = doc(postCollectionRef);
    const dateNow = new Date();
    const postWithId = { ...post, id: newPostRef.id, createdAt: dateNow, found: false };

    await setDoc(newPostRef, postWithId);
};
