import { db } from "@/firebaseConfig";
import { Notification, NotificationType } from "@/types";
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    getDocs,
    updateDoc,
    doc,
    onSnapshot 
} from "firebase/firestore";
import { getUserProfile } from './user.service';


const NOTIFICATIONS = "notifications";

export const createNotification = async (notification: Omit<Notification, 'id' | 'read' | 'timestamp'>) => {
    try {
        // Get receiver's profile
        const userProfile = await getUserProfile(notification.receiverId);
        if (!userProfile) return;

        // Default notification settings if not set
        const notificationSettings = userProfile.notificationSettings || {
            likes: true,
            comments: true,
            follows: true,
            newPosts: true
        };

        // Always send notifications for follow-related actions
        const isFollowAction = [
            NotificationType.FOLLOW_REQUEST,
            NotificationType.FOLLOW_ACCEPT,
            NotificationType.FOLLOW_REJECT
        ].includes(notification.type);

        if (isFollowAction) {
            await addDoc(collection(db, NOTIFICATIONS), {
                ...notification,
                read: false,
                timestamp: Date.now()
            });
            return;
        }

        // Check notification settings for other types
        let shouldSend = false;
        switch (notification.type) {
            case NotificationType.LIKE:
                shouldSend = notificationSettings.likes;
                break;
            case NotificationType.COMMENT:
                shouldSend = notificationSettings.comments;
                break;
            case NotificationType.FOLLOW:
            case NotificationType.UNFOLLOW:
                shouldSend = notificationSettings.follows;
                break;
            case NotificationType.NEW_POST:
                shouldSend = notificationSettings.newPosts;
                break;
            default:
                shouldSend = true;
        }

        if (shouldSend) {
            await addDoc(collection(db, NOTIFICATIONS), {
                ...notification,
                read: false,
                timestamp: Date.now()
            });
        }
    } catch (error) {
        console.error("Error creating notification:", error);
    }
};

export const getNotifications = async (userId: string) => {
    try {
        const q = query(
            collection(db, NOTIFICATIONS),
            where('receiverId', '==', userId),
            orderBy('timestamp', 'desc')
        );
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Notification));
    } catch (error) {
        console.error("Error getting notifications:", error);
        return [];
    }
};

export const subscribeToNotifications = (userId: string, callback: (notifications: Notification[]) => void) => {
    const q = query(
        collection(db, NOTIFICATIONS),
        where('receiverId', '==', userId),
        orderBy('timestamp', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
        const notifications = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as Notification));
        callback(notifications);
    });
};

export const markNotificationAsRead = async (notificationId: string) => {
    try {
        const notificationRef = doc(db, NOTIFICATIONS, notificationId);
        await updateDoc(notificationRef, { read: true });
    } catch (error) {
        console.error("Error marking notification as read:", error);
    }
};

export const getUnreadNotificationCount = async (userId: string) => {
    try {
        const q = query(
            collection(db, NOTIFICATIONS),
            where('receiverId', '==', userId),
            where('read', '==', false)
        );
        const snapshot = await getDocs(q);
        return snapshot.size;
    } catch (error) {
        console.error("Error getting unread notifications:", error);
        return 0;
    }
};