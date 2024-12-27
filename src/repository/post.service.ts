import { auth, db } from "@/firebaseConfig";
import { DocumentResponse, NotificationType, Post, ProfileInfo } from "@/types";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, orderBy, query, updateDoc, where } from "firebase/firestore";
import { createNotification } from './notification.service';
import { getUserProfile } from './user.service';

const COLLECTION_NAME = "posts";

export const createPost = async (post: Post) => {
    try {
        const docRef = await addDoc(collection(db, COLLECTION_NAME), post);
        //console.log("Post created with ID:", docRef.id);

        const userDocRef = query(collection(db, 'users'), where('userId', '==', post.userId));
        const userSnapshot = await getDocs(userDocRef);
        
        if (!userSnapshot.empty) {
            const userData = userSnapshot.docs[0].data();
            const followers = userData.followers || [];
            //console.log("Found followers:", followers);

            // Send notifications to all followers
            for (const followerId of followers) {
                try {
                    await createNotification({
                        type: NotificationType.NEW_POST,
                        senderId: post.userId!,
                        receiverId: followerId,
                        postId: docRef.id,
                        senderName: post.username,
                        senderPhoto: post.photoUrl,
                        message: "created a new post"
                    });
                    //console.log("Notification sent to follower:", followerId);
                } catch (notifError) {
                    console.error("Error sending notification to follower:", followerId, notifError);
                }
            }
        }
        
        return docRef;
    } catch (error) {
        console.error("Error in createPost:", error);
        throw error;
    }
};

export const getPosts = async (currentUserId?: string) => {
    try {
        const q = query(collection(db, COLLECTION_NAME), orderBy("date", "desc"));
        const querySnapshot = await getDocs(q);
        const tempArr: DocumentResponse[] = [];
        
        if (querySnapshot.size > 0) {
            const usersQuery = query(collection(db, 'users'));
            const usersSnapshot = await getDocs(usersQuery);
            const userPrivacyMap = new Map();
            
            usersSnapshot.forEach((doc) => {
                const userData = doc.data();
                userPrivacyMap.set(userData.userId, {
                    isPrivate: userData.isPrivate,
                    followers: userData.followers || []
                });
            });

            for (const doc of querySnapshot.docs) {
                const postData = doc.data() as Post;
                const userPrivacy = userPrivacyMap.get(postData.userId);
                
                // Include post if:
                // 1. Account is not private
                // 2. It's the current user's post
                // 3. Current user follows the private account
                if (!userPrivacy?.isPrivate || 
                    postData.userId === currentUserId ||
                    userPrivacy?.followers?.includes(currentUserId)) {
                    tempArr.push({
                        id: doc.id,
                        ...postData
                    } as DocumentResponse);
                }
            }
            return tempArr;
        }
        
        return [];
    } catch (error) {
        console.error("Error getting posts:", error);
        return [];
    }
};

export const getPostsByUserId = async (userId: string, requesterId?: string) => {
    try {
        const userProfile = await getUserProfile(userId);
        
        // If profile is private and requester is not a follower, return empty array
        if (userProfile?.isPrivate && requesterId && requesterId !== userId) {
            const isFollower = userProfile.followers?.includes(requesterId);
            if (!isFollower) {
                return [];
            }
        }

        const q = query(collection(db, COLLECTION_NAME), 
            where("userId", "==", userId),
            orderBy("date", "desc")
        );
        
        const querySnapshot = await getDocs(q);
        const tempArr: DocumentResponse[] = [];
        
        querySnapshot.forEach((doc) => {
            tempArr.push({
                id: doc.id,
                ...doc.data()
            } as DocumentResponse);
        });
        
        return tempArr;
    } catch (error) {
        console.error("Error getting posts:", error);
        return [];
    }
};

export const getPost = (id: string) => {
    const docRef = doc(db, COLLECTION_NAME, id);
    return getDoc(docRef);
}

export const deletePost = (id: string) => {
    return deleteDoc(doc(db, COLLECTION_NAME, id));
}

export const updateLikesOnPost = async (id: string, newUserlikes: string[], newLikes: number, currentPost: DocumentResponse) => {
    try {
        const currentUser = auth.currentUser;
        if (!currentUser || currentPost.userId === currentUser.uid) return;

        // Determine if this is a new like
        const wasLiked = currentPost.userlikes.includes(currentUser.uid);
        const isNowLiked = newUserlikes.includes(currentUser.uid);

        // Update the database
        await updateDoc(doc(db, COLLECTION_NAME, id), {
            likes: newLikes,
            userlikes: newUserlikes
        });

        // Only send notification for new likes
        if (!wasLiked && isNowLiked) {
            await createNotification({
                type: NotificationType.LIKE,
                senderId: currentUser.uid,
                receiverId: currentPost.userId!,
                postId: id,
                senderName: currentUser.displayName || "",
                senderPhoto: currentUser.photoURL || "",
                message: "liked your post"
            });
        }
    } catch (error) {
        console.error("Error updating likes:", error);
    }
};

export const updateUserInfoOnPosts = async(ProfileInfo: ProfileInfo)=>{
    const q = query(collection(db, COLLECTION_NAME), where("userId", "==", ProfileInfo.user.uid));
    const querySnapshot = await getDocs(q);
    if(querySnapshot.size > 0){
        querySnapshot.forEach(async(document)=>{
            const docRef = doc(db,COLLECTION_NAME,document.id);
            await updateDoc(docRef, {
                username:ProfileInfo.displayName,
                photoUrl:ProfileInfo.photoUrl
            })
        })
    } else{
        console.log("No posts")
    }
}