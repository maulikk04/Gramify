import { User } from "firebase/auth";

export interface UserLogIn {
    email: string;
    password: string;
}

export interface UserSignIn {
    email: string;
    password: string;
    confirmPassword: string;
}

export interface FileEntry {
    files: FileInfo[];
}

export interface FileInfo {
    uuid: string;
    name: string;
    size: number;
    cdnUrl: string;
    source: null;
}

export interface Post{
    caption: string;
    photos: PhotoMeta[];
    likes:number;
    userlikes: string[];
    userId: string|null;
    username:string;
    photoUrl:string;
    date:Date;
}

export interface PhotoMeta{
    cdnUrl: string;
    uuid: string;
}

export interface DocumentResponse{
    id:string;
    caption: string;
    photos: PhotoMeta[];
    likes:number;
    userlikes: string[];
    username:string;
    photoUrl:string;
    userId: string|null;
    date:Date;

}

export interface ProfileInfo {
    user: User;
    displayName: string;
    photoUrl: string;
}

export interface UserProfile {
    userId: String;
    displayName: string;
    photoUrl: string;
    userBio: string;
}

export interface ProfileResponse {
    id:string;
    userId: String;
    displayName: string;
    photoUrl: string;
    userBio: string;
}