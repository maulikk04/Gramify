import { db } from "@/firebaseConfig";
import { Comment, CommentResponse } from "@/types";
import { addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";

const COLLECTION_NAME = "comments";

export const createComment = async (comment: Comment) => {
    return addDoc(collection(db, COLLECTION_NAME), comment);
}

export const getCommentsByPostId = async (postId: string) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME), 
            where("postId", "==", postId),
            orderBy("date", "desc")
        );
        const querySnapshot = await getDocs(q);
        const comments: CommentResponse[] = [];
        
        querySnapshot.forEach((doc) => {
            comments.push({
                id: doc.id,
                ...(doc.data() as Comment)
            });
        });
        
        return comments;
    } catch (error) {
        console.error("Error fetching comments:", error);
        return [];
    }
}
