import { addDoc, collection, deleteDoc, doc, DocumentData, getDoc, getDocs, limit, orderBy, query, QueryDocumentSnapshot, setDoc, startAfter, updateDoc, where } from 'firebase/firestore';
import { db } from "../firebase/firebaseConfig";
import { removeDiacritics } from '@/util/HelperFunctions';

const TABLE_NAME = 'post';

export type Post = {
    id: string;
    userId: string;
    petId: string;
    title: string;
    details: string;
    picture?: string | null;
    createdAt: Date;
    county: string;
    found: boolean;
    userPicture: string;
    userFirstName: string;
    userLastName: string;
};


export const addPost = async (post: Post) => {
    const postCollectionRef = collection(db, TABLE_NAME);
    const newPostRef = doc(postCollectionRef);
    const dateNow = new Date();
    const postWithId = { ...post, id: newPostRef.id, createdAt: dateNow, found: false };

    await setDoc(newPostRef, postWithId);
};

export const getPostById = async (id: string): Promise<Post | null> => {
    const postDoc = await getDoc(doc(db, TABLE_NAME, id));
    if (postDoc.exists()) {
        return postDoc.data() as Post;
    }
    return null;
};

export const getPosts = async (county?: string): Promise<Post[]> => {
    try {
        const postRef = collection(db, TABLE_NAME);
        let postsQuery;
        if (county) {
            const c = removeDiacritics(county);
            postsQuery = query(postRef, where('county', '==', c), orderBy('createdAt', 'desc'));
        } else {
            postsQuery = query(postRef, orderBy('createdAt', 'desc'));
        }
        const snapshot = await getDocs(postsQuery);
        return snapshot.docs.map((doc) => {
            const data = doc.data() as Record<string, any>;
            return {
                ...data,
                createdAt: (data.createdAt as any)?.toDate?.() ?? new Date(data.createdAt)
            } as Post;
        });

    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
};

export const markLatestPostByPetIdAsFound = async (petId: string) => {
    try {
        const postRef = collection(db, TABLE_NAME);
        const postQuery = query(
            postRef,
            where('petId', '==', petId),
            orderBy('createdAt', 'desc'),
            limit(1)
        );
        const querySnapshot = await getDocs(postQuery);
        if (querySnapshot.empty) {
            console.log("No post found for this pet.");
            return;
        }

        const latestDoc = querySnapshot.docs[0];
        const docRef = doc(db, TABLE_NAME, latestDoc.id);
        await updateDoc(docRef, {
            found: true
        });
    }catch (error) {
        console.error("Error fetching post:", error);
        return [];
    }
};

export const updatePost = async (id: string, data: Partial<Post>) => {
    await updateDoc(doc(db, TABLE_NAME, id), data);
};

export const deletePost = async (id: string) => {
    await deleteDoc(doc(db, TABLE_NAME, id));
};
