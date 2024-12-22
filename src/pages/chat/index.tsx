import Layout from "@/components/layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserAuth } from "@/context/userAuthContext";
import { getChatRoom, createChatRoom, sendMessage, subscribeToMessages, markMessagesAsRead } from "@/repository/chat.service";
import { getUserProfile } from "@/repository/user.service";
import { ChatMessage } from "@/types";
import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft } from "lucide-react";
import EmojiPicker, { EmojiClickData } from 'emoji-picker-react';
import { SmileIcon, ImageIcon } from 'lucide-react';
import { formatMessageDate } from '@/utils/dateUtils';
import FileUploader from '@/components/fileUploader';
import { FileEntry } from '@/types';

const Chat = () => {
    const { userId } = useParams();
    const { user } = useUserAuth();
    const navigate = useNavigate();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [roomId, setRoomId] = useState<string | null>(null);
    const [receiverName, setReceiverName] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [fileEntry, setFileEntry] = useState<FileEntry>({ files: [] });
    const [pendingImage, setPendingImage] = useState<FileEntry | null>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        const initializeChat = async () => {
            if (user && userId) {
                const receiverProfile = await getUserProfile(userId);
                if (receiverProfile) {
                    setReceiverName(receiverProfile.displayName);
                }

                let room = await getChatRoom(user.uid, userId);
                if (!room) {
                    const newRoomId = await createChatRoom([user.uid, userId]);
                    setRoomId(newRoomId);
                } else {
                    setRoomId(room.id);
                }
            }
        };

        initializeChat();
    }, [user, userId]);

    useEffect(() => {
        if (!roomId) return;

        const unsubscribe = subscribeToMessages(roomId, (newMessages) => {
            setMessages(newMessages);
        });

        return () => unsubscribe();
    }, [roomId]);

    useEffect(() => {
        if (roomId && user && userId) {
            markMessagesAsRead(roomId, user.uid);
        }
    }, [roomId, messages, user, userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!roomId || !user || !userId) return;

        // Handle image message
        if (pendingImage && pendingImage.files.length > 0) {
            await sendMessage(roomId, {
                senderId: user.uid,
                receiverId: userId,
                content: pendingImage.files[0].cdnUrl,
                timestamp: Date.now()
            });
            setPendingImage(null);
            setFileEntry({ files: [] });
        }
        // Handle text message
        else if (newMessage.trim()) {
            await sendMessage(roomId, {
                senderId: user.uid,
                receiverId: userId,
                content: newMessage,
                timestamp: Date.now()
            });
            setNewMessage("");
        }
    };

    const handleEmojiClick = (emojiData: EmojiClickData) => {
        setNewMessage(prev => prev + emojiData.emoji);
    };

    const handleImageSelect = (newFileEntry: FileEntry) => {
        setPendingImage(newFileEntry);
        // Don't send immediately, just store the file entry
    };

    const isImageMessage = (content: string) => {
        // Check for Uploadcare CDN URL
        return content.includes('ucarecdn.com');
    };

    return (
        <Layout>
            <PageTransition>
                <div className="max-w-3xl mx-auto">
                    <Card className="overflow-hidden backdrop-blur-sm bg-white/90">
                        <CardHeader className="relative">
                            <button 
                                onClick={() => navigate('/direct')}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-2 hover:bg-gray-100 rounded-full"
                            >
                                <ArrowLeft className="h-6 w-6" />
                            </button>
                            <CardTitle className="text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                                               bg-clip-text text-transparent text-center">
                                Chat with {receiverName}
                            </CardTitle>
                        </CardHeader>
                        <div className="p-8">
                            <div className="h-[60vh] flex flex-col">
                                <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                                    {messages.map((message) => (
                                        <div
                                            key={message.id}
                                            className={`flex flex-col ${
                                                message.senderId === user?.uid ? "items-end" : "items-start"
                                            }`}
                                        >
                                            <div className={`p-3 rounded-2xl bg-white border shadow-sm max-w-[70%] ${
                                                message.senderId === user?.uid ? "rounded-tr-none" : "rounded-tl-none"
                                            }`}>
                                                {isImageMessage(message.content) ? (
                                                    <img 
                                                        src={`${message.content}/-/preview/600x600/`}
                                                        alt="Shared image" 
                                                        className="rounded-lg max-w-full h-auto cursor-pointer"
                                                        onClick={() => window.open(message.content, '_blank')}
                                                    />
                                                ) : (
                                                    <p>{message.content}</p>
                                                )}
                                            </div>
                                            <span className="text-xs text-gray-500 mt-1">
                                                {formatMessageDate(message.timestamp)}
                                            </span>
                                        </div>
                                    ))}
                                    <div ref={messagesEndRef} />
                                </div>
                                <div className="relative">
                                    {showEmojiPicker && (
                                        <div className="absolute bottom-full right-0 mb-2">
                                            <EmojiPicker onEmojiClick={handleEmojiClick} />
                                        </div>
                                    )}
                                    <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                                        {pendingImage && pendingImage.files.length > 0 && (
                                            <div className="p-2 border rounded-lg mb-2">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-sm text-gray-500">Selected Image</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            setPendingImage(null);
                                                            setFileEntry({ files: [] });
                                                        }}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        Cancel
                                                    </button>
                                                </div>
                                                <img 
                                                    src={pendingImage.files[0].cdnUrl}
                                                    alt="Selected" 
                                                    className="max-h-32 rounded-lg"
                                                />
                                            </div>
                                        )}
                                        <div className="flex gap-2 items-center">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="p-2 hover:bg-gray-100 rounded-full"
                                            >
                                                <SmileIcon className="h-6 w-6 text-gray-500" />
                                            </button>
                                            <div className="relative">
                                                <FileUploader 
                                                    fileEntry={fileEntry}
                                                    onChange={handleImageSelect}
                                                    preview={false}
                                                    customStyle="inline-block"
                                                />
                                            </div>
                                            <input
                                                type="text"
                                                value={newMessage}
                                                onChange={(e) => setNewMessage(e.target.value)}
                                                className="flex-1 border rounded-full px-4 py-2"
                                                placeholder={pendingImage ? "Add a caption..." : "Type your message..."}
                                            />
                                            <button
                                                type="submit"
                                                className="bg-gradient-to-r from-purple-400 to-pink-600 text-white px-4 py-2 rounded-full"
                                            >
                                                Send
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </PageTransition>
        </Layout>
    );
};

export default Chat;
