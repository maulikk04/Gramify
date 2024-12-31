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
    bookmarkedBy?: string[];  
}

export interface ProfileInfo {
    user: User;
    displayName: string;
    photoUrl: string;
}

export interface UserProfile {
    userId: string;
    email: string;  
    displayName: string;
    photoUrl: string;
    userBio: string;
    followers?: string[];
    following?: string[];
    bookmarks?: string[];  
    notificationSettings?: NotificationSettings;
    isPrivate?: boolean; 
    followRequests?: string[];
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

export interface ChatMessage {
  id?: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: number;
}

export interface ChatRoom {
  id?: string;
  participants: string[];
  lastMessage?: string;
  lastMessageTimestamp?: number;
  unreadCount?: { [userId: string]: number }; 
}

export interface NotificationBadge {
  count: number;
  lastMessage: string;
  timestamp: number;
}

export enum NotificationType {
    LIKE = 'LIKE',
    COMMENT = 'COMMENT',
    FOLLOW = 'FOLLOW',
    UNFOLLOW = 'UNFOLLOW',
    NEW_POST = 'NEW_POST',
    FOLLOW_REQUEST = 'FOLLOW_REQUEST',
    FOLLOW_ACCEPT = 'FOLLOW_ACCEPT',
    FOLLOW_REJECT = 'FOLLOW_REJECT'
}

export interface Notification {
    id?: string;
    type: NotificationType;
    senderId: string;
    receiverId: string;
    postId?: string;
    senderName: string;
    senderPhoto: string;
    message: string;
    read: boolean;
    timestamp: number;
}

export interface NotificationSettings {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    newPosts: boolean;
}