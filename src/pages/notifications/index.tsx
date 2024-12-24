import Layout from "@/components/layout";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserAuth } from "@/context/userAuthContext";
import { markNotificationAsRead, subscribeToNotifications } from "@/repository/notification.service";
import { Notification, NotificationType } from "@/types";
import { formatMessageDate } from "@/utils/dateUtils";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageTransition from "@/components/PageTransition";

const NotificationsPage = () => {
    const { user } = useUserAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (!user) return;

        const unsubscribe = subscribeToNotifications(user.uid, (newNotifications) => {
            setNotifications(newNotifications);
        });

        return () => unsubscribe();
    }, [user]);

    const handleNotificationClick = async (notification: Notification) => {
        if (!notification.read && notification.id) {
            await markNotificationAsRead(notification.id);
            
            setNotifications(prev => 
                prev.map(n => 
                    n.id === notification.id ? { ...n, read: true } : n
                )
            );
        }
    };

    const getNotificationContent = (notification: Notification) => {
        switch (notification.type) {
            case NotificationType.LIKE:
                return (
                    <Link to={`/post/${notification.postId}`} className="hover:underline">
                        liked your post
                    </Link>
                );
            case NotificationType.COMMENT:
                return (
                    <Link to={`/post/${notification.postId}`} className="hover:underline">
                        commented on your post
                    </Link>
                );
            case NotificationType.FOLLOW:
                return (
                    <Link to={`/profile/${notification.senderId}`} className="hover:underline">
                        started following you
                    </Link>
                );
            case NotificationType.UNFOLLOW:
                return "unfollowed you";
            case NotificationType.NEW_POST:
                return (
                    <Link to={`/post/${notification.postId}`} className="hover:underline">
                        created a new post
                    </Link>
                );
        }
    };

    return (
        <Layout>
            <PageTransition>
                <div className="max-w-3xl mx-auto">
                    <Card className="overflow-hidden backdrop-blur-sm bg-white/90">
                        <CardHeader>
                            <CardTitle className="text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                                               bg-clip-text text-transparent text-center">
                                Notifications
                            </CardTitle>
                        </CardHeader>
                        <div className="p-8">
                            {notifications.length === 0 ? (
                                <p className="text-center text-gray-500">No notifications yet</p>
                            ) : (
                                <div className="space-y-4">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleNotificationClick(notification)}
                                            className={`p-4 rounded-lg border ${
                                                notification.read ? 'bg-white' : 'bg-blue-50'
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <img
                                                    src={notification.senderPhoto}
                                                    alt={notification.senderName}
                                                    className="w-10 h-10 rounded-full object-cover"
                                                />
                                                <div className="flex-1">
                                                    <p>
                                                        <Link to={`/profile/${notification.senderId}`} className="font-semibold">
                                                            {notification.senderName}
                                                        </Link>{" "}
                                                        {getNotificationContent(notification)}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {formatMessageDate(notification.timestamp)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </PageTransition>
        </Layout>
    );
};

export default NotificationsPage;
