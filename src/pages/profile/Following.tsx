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
    const { user: currentUser } = useUserAuth(); // Add this line

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
            <Card>
                <CardHeader className="flex flex-row items-center">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/profile/${userId}`)}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <CardTitle className="text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                                    bg-clip-text text-transparent text-center flex-grow">
                        Following
                    </CardTitle>
                </CardHeader>
                <div className="p-6">
                    {following.map(user => (
                        <UserCard 
                            key={user.userId} 
                            user={user} 
                            onUnfollow={handleUnfollow}
                            isOwnProfile={userId === currentUser?.uid} 
                        />
                    ))}
                </div>
            </Card>
        </Layout>
    );
};

export default Following;
