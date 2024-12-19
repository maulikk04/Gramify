import { db } from "@/firebaseConfig";
import { ProfileResponse, UserProfile } from "@/types";
import { addDoc, collection, doc, getDocs, query, updateDoc, where, arrayUnion, arrayRemove, getDoc } from "firebase/firestore";

const COLLECTION_NAME = "users";

export const createUserProfile = (user:UserProfile) =>{
    try {
        return addDoc(collection(db, COLLECTION_NAME), user);
    } catch (error) {
        console.log(error);
    }
}

export const getUserProfile = async (userId:string) =>{
    try {
        const q = query(collection(db, COLLECTION_NAME), where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        let tempData: ProfileResponse = {
            id:"",
            userId:"",
            displayName:"",
            photoUrl:"",
            userBio:""
        };
        if (querySnapshot.size > 0) {
            querySnapshot.forEach((doc) => {
                const userData = doc.data() as UserProfile;
                tempData = {
                    id:doc.id,
                    ...userData
                }
            })
            return tempData
        } else {
            console.log("No such document");
            return null;
        }
    } catch (error) {
        console.log(error);
    }
}

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
            console.log("temp Arr" , tempArr);
            
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
        console.log("querySnapshot", querySnapshot);
        
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

        await updateDoc(currentUserRef, {
            following: arrayUnion(targetUserId)
        });

        await updateDoc(targetUserRef, {
            followers: arrayUnion(currentUserId)
        });
    } catch (error) {
        console.error("Error following user:", error);
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