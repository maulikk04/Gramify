import { createUserWithEmailAndPassword, GoogleAuthProvider, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut, updateProfile, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebaseConfig"
import { ProfileInfo } from "@/types";
import { createUserProfile } from "@/repository/user.service";

interface IUserAuthProviderProps {
    children: React.ReactNode;
}

type AuthContextData = {
    user: User | null;
    logIn: typeof logIn;
    signUp: typeof signUp;
    logOut: typeof logOut;
    googleSignIn: typeof googleSignIn;
    updateProfileInfo: typeof updateProfileInfo
}

const logIn = (email: string, password: string) => {
    return signInWithEmailAndPassword(auth, email, password);
}

const createInitialUserProfile = async (user: User) => {
    return createUserProfile({
        userId: user.uid,
        displayName: user.displayName || "",
        photoUrl: user.photoURL || "",
        userBio: "Please update your bio",
        followers: [],
        following: [],
        bookmarks: [] 
    });
};

const signUp = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await createInitialUserProfile(user);
    return userCredential;
}

const logOut = () => {
    signOut(auth);
}

const googleSignIn = async () => {
    const googleAuthProvider = new GoogleAuthProvider();
    const userCredential = await signInWithPopup(auth, googleAuthProvider);
    const user = userCredential.user;
    await createInitialUserProfile(user);
    return userCredential;
}

const updateProfileInfo = (profileInfo: ProfileInfo)=>{
    console.log("Profile Info: ", profileInfo);
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
    updateProfileInfo 
})

export const UserAuthProvider: React.FunctionComponent<IUserAuthProviderProps> = ({ children }) => {
    const [user,setUser] = useState<User|null>(null);
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user)=>{
            if(user){
                console.log("The logged in user state is: " , user);
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
        updateProfileInfo
    }
    return <userAuthContext.Provider value={value}>
        {children}
    </userAuthContext.Provider>
}


export const useUserAuth = ()=>{
    return useContext(userAuthContext);
}