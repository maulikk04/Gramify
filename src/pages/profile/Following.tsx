import Layout from '@/components/layout';
import { getUserProfile } from '@/repository/user.service';
import { ProfileResponse } from '@/types';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserCard from '@/components/UserCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUserAuth } from '@/context/userAuthContext';

const Following: React.FC = () => {
    const [following, setFollowing] = React.useState<ProfileResponse[]>([]);
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const { user: currentUser } = useUserAuth();

    const fetchFollowing = async () => {
        if (!userId) return;
        const userProfile = await getUserProfile(userId);
        if (userProfile?.following) {
            const followingProfiles = await Promise.all(
                userProfile.following.map(id => getUserProfile(id))
            );
            setFollowing(followingProfiles.filter((profile) : profile is ProfileResponse => profile !== null));
        }
    };

    const handleUnfollow = (unfollowedUserId: string) => {
        setFollowing(prev => prev.filter(user => user.userId !== unfollowedUserId));
    };

    React.useEffect(() => {
        fetchFollowing();
    }, [userId]);

    return (
        <Layout>
            <div className="container mx-auto px-2 sm:px-4">
                <Card className="max-w-3xl mx-auto">
                    <CardHeader className="flex flex-row items-center p-4 sm:p-6">
                        <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={() => navigate(`/profile/${userId}`)}
                            className="mr-2"
                        >
                            <ArrowLeft className="h-5 w-5 sm:h-6 sm:w-6" />
                        </Button>
                        <CardTitle className="text-xl sm:text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                                        bg-clip-text text-transparent text-center flex-grow">
                            Following
                        </CardTitle>
                    </CardHeader>
                    <div className="p-4 sm:p-6 space-y-4">
                        {following.length === 0 ? (
                            <p className="text-center text-gray-500 py-8">No following users yet</p>
                        ) : (
                            following.map(user => (
                                <UserCard 
                                    key={user.userId} 
                                    user={user} 
                                    onUnfollow={handleUnfollow}
                                    isOwnProfile={userId === currentUser?.uid} 
                                />
                            ))
                        )}
                    </div>
                </Card>
            </div>
        </Layout>
    );
};

export default Following;
