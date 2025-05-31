import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { Message } from './Message';

const TABLE_NAME = 'chat';

export type Chat = {
    id: string;
    users: string[];
    chatKet: string; // ids joined by |
    lastMessage: string;
    lastMessageSentAt: Date;
    messages: Message[];
}

export const getOrCreateChat = async (userA: string, userB: string, initialMessage: string): Promise<{ chatId: string, chatKey: string }> => {
    const ids = [userA, userB].sort();
    const chatKey = ids.join('|');
    const chatQuery = query(collection(db, TABLE_NAME), where('chatKey', '==', chatKey));
    const chatSnapshot = await getDocs(chatQuery);
    let chatId;
    if (!chatSnapshot.empty) {
        chatId = chatSnapshot.docs[0].id;
    } else {
        const chatDocRef = doc(collection(db, TABLE_NAME));
        chatId = chatDocRef.id;
        await setDoc(chatDocRef, {
            id: chatId,
            chatKey,
            users: ids,
            lastMessage: initialMessage,
            lastMessageSentAt: new Date(),
        });
    }
    return { chatId, chatKey };
};

export const updateChatLastMessage = async (chatId: string, lastMessage: string) => {
    await updateDoc(doc(db, TABLE_NAME, chatId), {
        lastMessage,
        lastMessageSentAt: new Date(),
    });
};

export const getChatsForUser = async (userId: string) => {
    try {
        const chatQuery = query(collection(db, TABLE_NAME), where('users', 'array-contains', userId), orderBy('lastMessageSentAt', 'desc'));
        const snapshot = await getDocs(chatQuery);
        return snapshot.docs.map(doc => {
            const data = doc.data();
            if (data.lastMessageSentAt && data.lastMessageSentAt.seconds) {
                data.lastMessageSentAt = new Date(data.lastMessageSentAt.seconds * 1000);
            }
            return data;
        });
    } catch (err) {
        console.error("Error fetching chats:", err);
        return [];
    }

};