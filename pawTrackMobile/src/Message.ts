import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";

const TABLE_NAME = 'message';

export type Message = {
    id: string;
    sentByUser: boolean;
    text: string;
    sentAt: Date;
    picture: string;
    chatKey: string;
}

export const addMessage = async (message: Omit<Message, 'id'>) => {
    const messageDocRef = doc(collection(db, TABLE_NAME));
    const messageData = {
        ...message,
        id: messageDocRef.id,
        sentAt: new Date(),
    };
    await setDoc(messageDocRef, messageData);
    const chatQuery = query(collection(db, 'chat'), where('chatKey', '==', message.chatKey));
    const chatSnapshot = await getDocs(chatQuery);
    if (!chatSnapshot.empty) {
        const chatId = chatSnapshot.docs[0].id;
        await updateDoc(doc(db, 'chat', chatId), {
            messages: (await getMessagesForChatByKey(message.chatKey)).map(m => m.id)
        });
    }
    return messageDocRef.id;
};

export const getMessagesForChatByKey = async (chatKey: string) => {

    try {
        const messagesQuery = query(collection(db, TABLE_NAME), where('chatKey', '==', chatKey), orderBy('sentAt', 'asc'));
        const snapshot = await getDocs(messagesQuery);
        return snapshot.docs.map(doc => doc.data() as Message);
    } catch (err) {
        console.error("Error fetching messages:", err);
        return [];
    }
};