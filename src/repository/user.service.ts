import { db } from "@/firebaseConfig";
import { ProfileResponse, UserProfile } from "@/types";
import { addDoc, collection, doc, getDocs, query, updateDoc, where } from "firebase/firestore";

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

export const followUser = async (followerId: string, followingId: string) => {
    try {
        const followerDoc = await getUserProfile(followerId);
        const followingDoc = await getUserProfile(followingId);

        if (followerDoc && followingDoc) {
            await updateUserProfile(followerDoc.id, {
                ...followerDoc,
                following: [...(followerDoc.following || []), followingId]
            });

            await updateUserProfile(followingDoc.id, {
                ...followingDoc,
                followers: [...(followingDoc.followers || []), followerId]
            });
        }
    } catch (error) {
        console.log(error);
    }
};

export const unfollowUser = async (followerId: string, followingId: string) => {
    try {
        const followerDoc = await getUserProfile(followerId);
        const followingDoc = await getUserProfile(followingId);

        if (followerDoc && followingDoc) {
            await updateUserProfile(followerDoc.id, {
                ...followerDoc,
                following: (followerDoc.following || []).filter(id => id !== followingId)
            });

            await updateUserProfile(followingDoc.id, {
                ...followingDoc,
                followers: (followingDoc.followers || []).filter(id => id !== followerId)
            });
        }
    } catch (error) {
        console.log(error);
    }
};