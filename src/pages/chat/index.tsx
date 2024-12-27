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
import { SmileIcon } from 'lucide-react';
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
    };

    const isImageMessage = (content: string) => {
        return content.includes('ucarecdn.com');
    };

    return (
        <Layout>
            <PageTransition>
                <div className="fixed inset-0 lg:relative lg:inset-auto min-h-[100dvh] lg:h-auto lg:min-h-[85vh]">
                    <Card className="h-full lg:h-auto lg:max-w-4xl mx-auto overflow-hidden backdrop-blur-sm bg-white/90">
                        <CardHeader className="sticky top-0 z-10 p-3 sm:p-6 border-b shadow-sm bg-white/95">
                            <div className="flex items-center justify-between relative">
                                <button 
                                    onClick={() => navigate('/direct')}
                                    className="p-2 hover:bg-gray-100 rounded-full flex-shrink-0"
                                >
                                    <ArrowLeft className="h-5 w-5" />
                                </button>
                                <CardTitle className="absolute left-1/2 -translate-x-1/2 text-lg font-satisfy 
                                                   bg-gradient-to-r from-purple-400 to-pink-600 
                                                   bg-clip-text text-transparent">
                                    Chat with {receiverName}
                                </CardTitle>
                                <div className="w-9"></div>
                            </div>
                        </CardHeader>
                        <div className="flex flex-col h-[calc(100dvh-120px)] lg:h-[70vh]">
                            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 scrollbar-thin 
                                          scrollbar-thumb-gray-300 pb-6 mt-4">
                                <div className="h-2"></div> 
                                {messages.map((message) => (
                                    <div
                                        key={message.id}
                                        className={`flex flex-col ${
                                            message.senderId === user?.uid ? "items-end" : "items-start"
                                        }`}
                                    >
                                        <div className={`p-2 rounded-2xl bg-white border shadow-sm 
                                                       max-w-[85%] sm:max-w-[70%] ${
                                            message.senderId === user?.uid 
                                                ? "rounded-tr-none bg-blue-50" 
                                                : "rounded-tl-none"
                                        }`}>
                                            {isImageMessage(message.content) ? (
                                                <img 
                                                    src={`${message.content}/-/preview/400x400/`}
                                                    alt="Shared image" 
                                                    className="rounded-lg max-w-full h-auto cursor-pointer"
                                                    onClick={() => window.open(message.content, '_blank')}
                                                />
                                            ) : (
                                                <p className="break-words text-sm">{message.content}</p>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-500 mt-1 px-2">
                                            {formatMessageDate(message.timestamp)}
                                        </span>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} className="pt-2" />
                            </div>
                            <div className="relative p-2 border-t bg-white mt-auto">
                                {showEmojiPicker && (
                                    <div className="absolute bottom-full right-0 mb-2 z-50">
                                        <EmojiPicker 
                                            onEmojiClick={handleEmojiClick} 
                                            width={window.innerWidth < 640 ? 280 : 320}
                                            height={300}
                                        />
                                    </div>
                                )}
                                <form onSubmit={handleSendMessage} className="flex flex-col gap-2">
                                    {pendingImage && pendingImage.files.length > 0 && (
                                        <div className="p-2 border rounded-lg mb-2">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-xs text-gray-500">Selected Image</span>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPendingImage(null);
                                                        setFileEntry({ files: [] });
                                                    }}
                                                    className="text-red-500 hover:text-red-600 text-xs"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                            <img 
                                                src={pendingImage.files[0].cdnUrl}
                                                alt="Selected" 
                                                className="max-h-20 rounded-lg"
                                            />
                                        </div>
                                    )}
                                    <div className="flex items-center gap-1">
                                        <div className="flex gap-1 flex-shrink-0">
                                            <button
                                                type="button"
                                                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                                                className="p-1.5 hover:bg-gray-100 rounded-full"
                                            >
                                                <SmileIcon className="h-5 w-5 text-gray-500" />
                                            </button>
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
                                            className="flex-1 min-w-0 border rounded-full px-3 py-1.5 text-sm"
                                            placeholder={pendingImage ? "Add caption..." : "Message..."}
                                        />
                                        <button
                                            type="submit"
                                            className="flex-shrink-0 bg-gradient-to-r from-purple-400 to-pink-600 
                                                     text-white px-3 py-1.5 rounded-full text-sm"
                                        >
                                            Send
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </Card>
                </div>
            </PageTransition>
        </Layout>
    );
};

export default Chat;
