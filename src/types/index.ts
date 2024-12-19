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
    userId: string;
    displayName: string;
    photoUrl: string;
    userBio: string;
    followers?: string[];
    following?: string[];
}

export interface ProfileResponse extends UserProfile {
    id: string;
}

export interface Comment {
    postId: string;
    userId: string;
    username: string;
    userPhotoUrl: string;
    text: string;
    date: Date;
}

export interface CommentResponse extends Comment {
    id: string;
}