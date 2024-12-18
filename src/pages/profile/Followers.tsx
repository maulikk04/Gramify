import Layout from '@/components/layout';
import { getUserProfile } from '@/repository/user.service';
import { ProfileResponse } from '@/types';
import * as React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import UserCard from '@/components/UserCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Followers: React.FC = () => {
    const [followers, setFollowers] = React.useState<ProfileResponse[]>([]);
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();

    const fetchFollowers = async () => {
        if (!userId) return;
        const userProfile = await getUserProfile(userId);
        if (userProfile?.followers) {
            const followerProfiles = await Promise.all(
                userProfile.followers.map(id => getUserProfile(id))
            );
            setFollowers(followerProfiles.filter((profile): profile is ProfileResponse => profile !== null));
        }
    };

    React.useEffect(() => {
        fetchFollowers();
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
                        Followers
                    </CardTitle>
                </CardHeader>
                <div className="p-6">
                    {followers.map(follower => (
                        <UserCard key={follower.userId} user={follower} />
                    ))}
                </div>
            </Card>
        </Layout>
    );
};

export default Followers;
