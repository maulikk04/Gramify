import Layout from '@/components/layout';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUserAuth } from '@/context/userAuthContext';
import { useEffect, useState } from 'react';
import { getUserProfile, updateUserProfile } from '@/repository/user.service';
import { NotificationSettings } from '@/types';
import PageTransition from '@/components/PageTransition';

const Settings = () => {
    const { user } = useUserAuth();
    const [settings, setSettings] = useState<NotificationSettings>({
        likes: true,
        comments: true,
        follows: true,
        newPosts: true
    });
    const [userDocId, setUserDocId] = useState<string>("");

    useEffect(() => {
        const loadSettings = async () => {
            if (user) {
                const profile = await getUserProfile(user.uid);
                if (profile) {
                    setUserDocId(profile.id);
                    setSettings(profile.notificationSettings || {
                        likes: true,
                        comments: true,
                        follows: true,
                        newPosts: true
                    });
                }
            }
        };
        loadSettings();
    }, [user]);

    const handleToggle = async (key: keyof NotificationSettings) => {
        const newSettings = {
            ...settings,
            [key]: !settings[key]
        };
        setSettings(newSettings);

        try {
            await updateUserProfile(userDocId, {
                notificationSettings: newSettings
            } as any);
        } catch (error) {
            console.error("Error updating settings:", error);
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
                                Notification Settings
                            </CardTitle>
                        </CardHeader>
                        <div className="p-8">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="likes" className="text-base">
                                        Like Notifications
                                        <p className="text-sm text-gray-500">
                                            Get notified when someone likes your post
                                        </p>
                                    </Label>
                                    <Switch
                                        id="likes"
                                        checked={settings.likes}
                                        onCheckedChange={() => handleToggle('likes')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="comments" className="text-base">
                                        Comment Notifications
                                        <p className="text-sm text-gray-500">
                                            Get notified when someone comments on your post
                                        </p>
                                    </Label>
                                    <Switch
                                        id="comments"
                                        checked={settings.comments}
                                        onCheckedChange={() => handleToggle('comments')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="follows" className="text-base">
                                        Follow Notifications
                                        <p className="text-sm text-gray-500">
                                            Get notified when someone follows/unfollows you
                                        </p>
                                    </Label>
                                    <Switch
                                        id="follows"
                                        checked={settings.follows}
                                        onCheckedChange={() => handleToggle('follows')}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="newPosts" className="text-base">
                                        New Post Notifications
                                        <p className="text-sm text-gray-500">
                                            Get notified when someone you follow posts
                                        </p>
                                    </Label>
                                    <Switch
                                        id="newPosts"
                                        checked={settings.newPosts}
                                        onCheckedChange={() => handleToggle('newPosts')}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </PageTransition>
        </Layout>
    );
};

export default Settings;
