import { db } from "@/firebaseConfig";
import { ChatMessage, ChatRoom } from "@/types";
import { 
    collection, 
    addDoc, 
    query, 
    where, 
    orderBy, 
    onSnapshot,
    getDocs,
    serverTimestamp,
    doc,
    updateDoc,
    increment 
} from "firebase/firestore";

const CHAT_ROOMS = "chatRooms";
const MESSAGES = "messages";

export const createChatRoom = async (participants: string[]) => {
    try {
        const chatRoomRef = await addDoc(collection(db, CHAT_ROOMS), {
            participants,
            lastMessageTimestamp: serverTimestamp()
        });
        return chatRoomRef.id;
    } catch (error) {
        console.error("Error creating chat room:", error);
        throw error;
    }
};

export const getChatRoom = async (user1Id: string, user2Id: string) => {
    try {
        const q = query(
            collection(db, CHAT_ROOMS),
            where('participants', 'array-contains', user1Id)
        );
        const querySnapshot = await getDocs(q);
        const room = querySnapshot.docs.find(doc => 
            doc.data().participants.includes(user2Id)
        );
        return room ? { id: room.id, ...room.data() as ChatRoom } : null;
    } catch (error) {
        console.error("Error getting chat room:", error);
        throw error;
    }
};

export const sendMessage = async (roomId: string, message: ChatMessage) => {
    try {
        // Send the message
        const messageRef = await addDoc(collection(db, CHAT_ROOMS, roomId, MESSAGES), {
            ...message,
            timestamp: Date.now()
        });

        // Update chat room with last message
        const roomRef = doc(db, CHAT_ROOMS, roomId);
        await updateDoc(roomRef, {
            lastMessage: message.content,
            lastMessageTimestamp: Date.now(),
            [`unreadCount.${message.receiverId}`]: increment(1)
        });

        return messageRef.id;
    } catch (error) {
        console.error("Error sending message:", error);
        throw error;
    }
};

export const subscribeToMessages = (
    roomId: string,
    callback: (messages: ChatMessage[]) => void
) => {
    const q = query(
        collection(db, CHAT_ROOMS, roomId, MESSAGES),
        orderBy('timestamp', 'asc')
    );

    return onSnapshot(q, (querySnapshot) => {
        const messages: ChatMessage[] = [];
        querySnapshot.forEach((doc) => {
            messages.push({ id: doc.id, ...doc.data() as ChatMessage });
        });
        callback(messages);
    });
};

export const markMessagesAsRead = async (roomId: string, userId: string) => {
    try {
        const roomRef = doc(db, CHAT_ROOMS, roomId);
        await updateDoc(roomRef, {
            [`unreadCount.${userId}`]: 0
        });
    } catch (error) {
        console.error("Error marking messages as read:", error);
    }
};

export const getUnreadMessageCount = async (userId: string) => {
    try {
        const q = query(
            collection(db, CHAT_ROOMS),
            where('participants', 'array-contains', userId)
        );
        const querySnapshot = await getDocs(q);
        let totalUnread = 0;

        querySnapshot.forEach((doc) => {
            const room = doc.data();
            totalUnread += (room.unreadCount?.[userId] || 0);
        });

        return totalUnread;
    } catch (error) {
        console.error("Error getting unread count:", error);
        return 0;
    }
};
