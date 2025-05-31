import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";

const TABLE_NAME = 'message';

export type Message = {
    id: string;
    sentByUser: boolean;
    text: string;
    sentAt: Date;
    picture: string;
}