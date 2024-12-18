import { ProfileResponse } from '@/types';
import { useUserAuth } from '@/context/userAuthContext';
import { Button } from './ui/button';
import { followUser, unfollowUser } from '@/repository/user.service';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import image1 from '@/assets/images/image1.png';

interface UserCardProps {
    user: ProfileResponse;
    onUnfollow?: (userId: string) => void;
    isOwnProfile?: boolean; 
}

const UserCard: React.FC<UserCardProps> = ({ user, onUnfollow, isOwnProfile }) => {
    const { user: currentUser } = useUserAuth();
    const navigate = useNavigate();
    const [isFollowing, setIsFollowing] = useState(true);

    const handleFollowAction = async () => {
        if (!currentUser) return;
        
        try {
            if (isFollowing) {
                await unfollowUser(currentUser.uid, user.userId);
                setIsFollowing(false);
                onUnfollow?.(user.userId);
            } else {
                await followUser(currentUser.uid, user.userId);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error updating follow status:', error);
        }
    };

    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4 cursor-pointer" 
                 onClick={() => navigate(`/profile/${user.userId}`)}>
                <img 
                    src={user.photoUrl || image1} 
                    alt={user.displayName} 
                    className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                    <h3 className="font-semibold">{user.displayName}</h3>
                    <p className="text-sm text-gray-500">{user.userBio}</p>
                </div>
            </div>
            {isOwnProfile && onUnfollow && (
                <Button
                    variant="default"
                    onClick={handleFollowAction}
                >
                    Unfollow
                </Button>
            )}
        </div>
    );
};

export default UserCard;
