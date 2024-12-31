import { auth, db } from "@/firebaseConfig";
import { ProfileResponse, UserProfile } from "@/types";
import { addDoc, collection, doc, getDocs, query, updateDoc, where, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";
import { createNotification } from './notification.service';
import { NotificationType } from '@/types';

const COLLECTION_NAME = "users";

export const createUserProfile = (user: UserProfile) => {
    try {
        return addDoc(collection(db, COLLECTION_NAME), {
            ...user,
            followers: [],
            following: [],
            followRequests: [],
            isPrivate: false,
            email: user.email // Make sure email is included
        });
    } catch (error) {
        console.log(error);
    }
}

export const getUserProfile = async (userId: string) => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        
        if (querySnapshot.size > 0) {
            const doc = querySnapshot.docs[0];
            const userData = doc.data() as UserProfile;
            // console.log("Retrieved user profile:", {
            //     id: doc.id,
            //     ...userData
            // });
            return {
                id: doc.id,
                ...userData
            } as ProfileResponse;
        }
        //console.log("No user profile found for:", userId);
        return null;
    } catch (error) {
        console.error("Error getting user profile:", error);
        return null;
    }
};

export const updateUserProfile = (id:string, user:UserProfile) =>{
    const docRef = doc(db, COLLECTION_NAME, id);
    return updateDoc(docRef, {
        ...user
    });
}

export const getAllUsers = async (userId:string) =>{
    try {
        const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
        const tempArr : ProfileResponse[] = [];
        if(querySnapshot.size>0){
            querySnapshot.forEach((doc) => {
                const userData = doc.data() as UserProfile;
                const resObj: ProfileResponse = {
                    id:doc.id,
                    ...userData
                }
                tempArr.push(resObj);
            })
            //console.log("temp Arr" , tempArr);
            
            return tempArr.filter((item) => item.userId !== userId);
        } else {
            console.log("No such document");
        }
    } catch (error) {
        console.log(error);
    }
}

export const getUserDocIdByUserId = async (userId: string) => {
    try {
        const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        //console.log("querySnapshot", querySnapshot);
        
        if (!querySnapshot.empty) {
            return querySnapshot.docs[0].id;
        }
        return null;
    } catch (error) {
        console.error("Error getting user doc id:", error);
        return null;
    }
};

export const followUser = async (currentUserId: string, targetUserId: string) => {
    try {
        const currentUserDocId = await getUserDocIdByUserId(currentUserId);
        const targetUserDocId = await getUserDocIdByUserId(targetUserId);

        if (!currentUserDocId || !targetUserDocId) {
            throw new Error("User document not found");
        }

        const currentUserRef = doc(db, COLLECTION_NAME, currentUserDocId);
        const targetUserRef = doc(db, COLLECTION_NAME, targetUserDocId);

        await Promise.all([
            updateDoc(currentUserRef, {
                following: arrayUnion(targetUserId)
            }),
            updateDoc(targetUserRef, {
                followers: arrayUnion(currentUserId)
            })
        ]);

        const currentUser = auth.currentUser;
        if (currentUser) {
            await createNotification({
                type: NotificationType.FOLLOW,
                senderId: currentUserId,
                receiverId: targetUserId,
                senderName: currentUser.displayName || "",
                senderPhoto: currentUser.photoURL || "",
                message: "started following you"
            });
        }

        return true;
    } catch (error) {
        console.error("Error following user:", error);
        return false;
    }
};

export const unfollowUser = async (currentUserId: string, targetUserId: string) => {
    try {
        const currentUserDocId = await getUserDocIdByUserId(currentUserId);
        const targetUserDocId = await getUserDocIdByUserId(targetUserId);

        if (!currentUserDocId || !targetUserDocId) {
            throw new Error("User document not found");
        }

        const currentUserRef = doc(db, COLLECTION_NAME, currentUserDocId);
        const targetUserRef = doc(db, COLLECTION_NAME, targetUserDocId);

        await updateDoc(currentUserRef, {
            following: arrayRemove(targetUserId)
        });

        await updateDoc(targetUserRef, {
            followers: arrayRemove(currentUserId)
        });

        const currentUser = auth.currentUser;
        if (currentUser) {
            await createNotification({
                type: NotificationType.UNFOLLOW,
                senderId: currentUserId,
                receiverId: targetUserId,
                senderName: currentUser.displayName || "",
                senderPhoto: currentUser.photoURL || "",
                message: "unfollowed you"
            });
        }
    } catch (error) {
        console.error("Error unfollowing user:", error);
    }
};

export const isFollowing = async (currentUserId: string, targetUserId: string) => {
    try {
        const userDoc = await getDoc(doc(db, 'users', currentUserId));
        const userData = userDoc.data();
        return userData?.following?.includes(targetUserId) || false;
    } catch (error) {
        console.error("Error checking follow status:", error);
        return false;
    }
};

export const sendFollowRequest = async (currentUserId: string, targetUserId: string) => {
    try {
        const targetUserDocId = await getUserDocIdByUserId(targetUserId);
        if (!targetUserDocId) throw new Error("User document not found");

        const targetUserRef = doc(db, COLLECTION_NAME, targetUserDocId);
        
        await updateDoc(targetUserRef, {
            followRequests: arrayUnion(currentUserId)
        });

        // Get current user's profile data first
        const currentUserProfile = await getUserProfile(currentUserId);
        if (!currentUserProfile) throw new Error("Current user profile not found");
        
        await createNotification({
            type: NotificationType.FOLLOW_REQUEST,
            senderId: currentUserId,
            receiverId: targetUserId,
            senderName: currentUserProfile.displayName || "",
            senderPhoto: currentUserProfile.photoUrl || "",
            message: "wants to follow you"
        });
    } catch (error) {
        console.error("Error sending follow request:", error);
    }
};

export const handleFollowRequest = async (currentUserId: string, requesterId: string, accept: boolean) => {
    try {
        const currentUserDocId = await getUserDocIdByUserId(currentUserId);
        const requesterDocId = await getUserDocIdByUserId(requesterId);

        if (!currentUserDocId || !requesterDocId) throw new Error("User document not found");

        const currentUserRef = doc(db, COLLECTION_NAME, currentUserDocId);
        const requesterRef = doc(db, COLLECTION_NAME, requesterDocId);

        await updateDoc(currentUserRef, {
            followRequests: arrayRemove(requesterId)
        });

        if (accept) {
            await updateDoc(currentUserRef, {
                followers: arrayUnion(requesterId)
            });
            await updateDoc(requesterRef, {
                following: arrayUnion(currentUserId)
            });
        }

        const currentUser = auth.currentUser;
        if (currentUser) {
            await createNotification({
                type: accept ? NotificationType.FOLLOW_ACCEPT : NotificationType.FOLLOW_REJECT,
                senderId: currentUserId,
                receiverId: requesterId,
                senderName: currentUser.displayName || "",
                senderPhoto: currentUser.photoURL || "",
                message: accept ? "accepted your follow request" : "rejected your follow request"
            });
        }
    } catch (error) {
        console.error("Error handling follow request:", error);
    }
};