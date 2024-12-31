import { db, auth } from "@/firebaseConfig";
import { Comment, CommentResponse, NotificationType } from "@/types";
import { addDoc, collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { createNotification } from './notification.service';
import { getUserProfile } from "./user.service";

const COLLECTION_NAME = "comments";

export const createComment = async (comment: Comment, postUserId: string) => {
    try {
        // Create the comment first
        const commentRef = await addDoc(collection(db, "comments"), comment);

        // Send notification only if commenter is not the post owner
        const currentUser = auth.currentUser;
        if (currentUser && postUserId !== currentUser.uid) {
            // Get user's profile data
            const userProfile = await getUserProfile(currentUser.uid);
            if (!userProfile) return commentRef;

            try {
                await createNotification({
                    type: NotificationType.COMMENT,
                    senderId: currentUser.uid,
                    receiverId: postUserId,
                    postId: comment.postId,
                    senderName: userProfile.displayName,
                    senderPhoto: userProfile.photoUrl,
                    message: "commented on your post"
                });
            } catch (notifError) {
                console.error("Error sending comment notification:", notifError);
                // Don't throw here to prevent comment creation from failing
            }
        }

        return commentRef;
    } catch (error) {
        console.error("Error creating comment:", error);
        throw error;
    }
};

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
