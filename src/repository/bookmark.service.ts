import { db } from "@/firebaseConfig";
import { DocumentResponse } from "@/types";
import { 
    doc, 
    updateDoc, 
    arrayUnion, 
    arrayRemove,
    collection,
    query,
    where,
    getDocs,
    getDoc
} from "firebase/firestore";
import { getUserDocIdByUserId } from './user.service';

const USERS_COLLECTION = "users";
const POSTS_COLLECTION = "posts";

export const toggleBookmark = async (userId: string, postId: string, isBookmarked: boolean) => {
    try {
        const userDocId = await getUserDocIdByUserId(userId);
        if (!userDocId) {
            throw new Error("User document not found");
        }

        const userRef = doc(db, USERS_COLLECTION, userDocId);
        console.log("UserRef: ", userRef);
        
        const postRef = doc(db, POSTS_COLLECTION, postId);

        if (isBookmarked) {
            await updateDoc(userRef, {
                bookmarks: arrayRemove(postId)
            });
            await updateDoc(postRef, {
                bookmarkedBy: arrayRemove(userId)
            });
        } else {
            await updateDoc(userRef, {
                bookmarks: arrayUnion(postId)
            });
            await updateDoc(postRef, {
                bookmarkedBy: arrayUnion(userId)
            });
        }
    } catch (error) {
        console.error("Error toggling bookmark:", error);
    }
};

export const getBookmarkedPosts = async (userId: string): Promise<DocumentResponse[]> => {
    try {
        
        const q = query(collection(db, POSTS_COLLECTION), where("bookmarkedBy", "array-contains", userId));
        const querySnapshot = await getDocs(q);
        
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as DocumentResponse));
    } catch (error) {
        console.error("Error getting bookmarked posts:", error);
        return [];
    }
};

export const isPostBookmarked = async (userId: string, postId: string): Promise<boolean> => {
    try {
        const userDocId = await getUserDocIdByUserId(userId);
        if (!userDocId) {
            return false;
        }

        const userSnapshot = await getDoc(doc(db, USERS_COLLECTION, userDocId));
        const userData = userSnapshot.data();
        return userData?.bookmarks?.includes(postId) || false;
    } catch (error) {
        console.error("Error checking bookmark status:", error);
        return false;
    }
};
