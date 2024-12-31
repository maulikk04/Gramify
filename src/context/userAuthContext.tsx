import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig"
import { ProfileInfo } from "@/types";
import { createUserProfile } from "@/repository/user.service";
import { collection, getDocs, query, where, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";

interface IUserAuthProviderProps {
    children: React.ReactNode;
}

type AuthContextData = {
    user: User | null;
    logIn: typeof logIn;
    signUp: typeof signUp;
    logOut: typeof logOut;
    googleSignIn: typeof googleSignIn;
    updateProfileInfo: typeof updateProfileInfo;
    sendVerificationEmail: typeof sendVerificationEmail;
    resetPassword: typeof resetPassword;
}

const logIn = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    if (!user.emailVerified) {
        throw new Error("Please verify your email before logging in");
    }
    return userCredential;
}

const sendVerificationEmail = (user: User) => {
    return sendEmailVerification(user);
};

const resetPassword = (email: string) => {
    return sendPasswordResetEmail(auth, email);
};

const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    await createUserProfile({
        userId: user.uid,
        email: email,
        displayName: user.displayName || "",
        photoUrl: user.photoURL || "",
        userBio: "Please update your bio",
        followers: [],
        following: [],
        bookmarks: [],
        isPrivate: false,
        followRequests: []
    });
    
    await sendVerificationEmail(user);
    return userCredential;
}

const logOut = () => {
    signOut(auth);
}

const googleSignIn = async () => {
    try {
        const googleAuthProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, googleAuthProvider);
        const user = result.user;
        
        if (!user.email) {
            throw new Error("No email provided from Google");
        }

        // First check if there's an existing profile with this email
        const emailQuery = query(collection(db, 'users'), where('email', '==', user.email));
        const emailSnapshot = await getDocs(emailQuery);

        if (!emailSnapshot.empty) {
            // Found existing profile with this email
            const existingDoc = emailSnapshot.docs[0];

            // Update the existing profile with the new userId but keep other data
            await updateDoc(doc(db, 'users', existingDoc.id), {
                userId: user.uid,
                // DO NOT update displayName and photoUrl here
                // This preserves the user's custom profile
            });
        } else {
            // No existing profile, create new one
            await createUserProfile({
                userId: user.uid,
                email: user.email,
                displayName: user.displayName || "",
                photoUrl: user.photoURL || "",
                userBio: "Hello, I'm new here!",
                followers: [],
                following: [],
                isPrivate: false,
                followRequests: []
            });
        }

        return result;
    } catch (error) {
        console.error("Error in Google Sign In:", error);
        throw error;
    }
};

const updateProfileInfo = (profileInfo: ProfileInfo)=>{
    //console.log("Profile Info: ", profileInfo);
    return updateProfile(profileInfo.user , {
        displayName: profileInfo.displayName,
        photoURL: profileInfo.photoUrl
    })
    
}

export const userAuthContext = createContext<AuthContextData>({
    user: null,
    logIn,
    signUp,
    logOut,
    googleSignIn,
    updateProfileInfo,
    sendVerificationEmail,
    resetPassword
})

export const UserAuthProvider: React.FunctionComponent<IUserAuthProviderProps> = ({ children }) => {
    const [user,setUser] = useState<User|null>(null);
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            if(user){
                //console.log("The logged in user state is: " , user);
                setUser(user);
            }

            return ()=>{
                unsubscribe();
            }
        })
        
    })
    const value: AuthContextData = {
        user,
        logIn,
        signUp,
        logOut,
        googleSignIn,
        updateProfileInfo,
        sendVerificationEmail,
        resetPassword
    }
    return <userAuthContext.Provider value={value}>
        {children}
    </userAuthContext.Provider>
}


export const useUserAuth = ()=>{
    return useContext(userAuthContext);
}