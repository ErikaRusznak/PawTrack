import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { Message } from './Message';

const TABLE_NAME = 'chat';

export type Chat = {
    id: string;
    senderRecipient: string; // a string between userId that sent the message and the user that received the message; something like 1|2
    recipientSender: string;
    lastMessage: string;
    lastMessageSentAt: Date;
    messages: Message[];
}