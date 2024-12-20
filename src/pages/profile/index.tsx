import Layout from '@/components/layout';
import { useUserAuth } from '@/context/userAuthContext';
import { DocumentResponse, Post, ProfileResponse } from '@/types';
import * as React from 'react';
import image1 from "@/assets/images/image1.png";
import { Button } from '@/components/ui/button';
import { Edit2Icon, HeartIcon } from 'lucide-react';
import { getPostsByUserId } from '@/repository/post.service';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser } from '@/repository/user.service';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = (props) => {
  const { user } = useUserAuth();
  const { userId } = useParams<{ userId: string }>();
  const [data, setData] = React.useState<DocumentResponse[]>([]);
  const navigate = useNavigate();
  const initialUserInfo: ProfileResponse = {
    id: "",
    userId: userId || user?.uid || "",
    userBio: "Please update your bio",
    photoUrl: user?.photoURL ? user.photoURL : "",
    displayName: user?.displayName ? user.displayName : "Guest_User",
    followers: [],
    following: []
  };
  const [userInfo, setUserInfo] = React.useState<ProfileResponse>(initialUserInfo);
  const isFollowing = userInfo.followers?.includes(user?.uid || '');

  const getAllPost = async (id: string) => {
    const posts = await getPostsByUserId(id);
    setData(posts);
  };

  const getUserProfileInfo = async (userId: string) => {
    const data: ProfileResponse = (await getUserProfile(userId)) || initialUserInfo;
    if (data) {
      setUserInfo(data);
    }
  };

  const handleFollowClick = async () => {
    if (!user || !userId) return;
    if (isFollowing) {
      await unfollowUser(user.uid, userId);
    } else {
      await followUser(user.uid, userId);
    }
    getUserProfileInfo(userId);
  };

  React.useEffect(() => {
    if (userId) {
      getAllPost(userId);
      getUserProfileInfo(userId);
    }
  }, [userId]);

  const renderPost = () => {
    return data.map((item) => {
      return (
        <div key={item.id} className='relative'>
          <div className='absolute group transition-all duration-200 bg-transparent hover:bg-slate-950 hover:bg-opacity-75 top-0 bottom-0 left-0 right-0 w-full h-full '>
            <div className='flex flex-col justify-center items-center w-full h-full'>
              <HeartIcon className='hidden group-hover:block fill-white' />
              <div className='hidden group-hover:block text-white'>{item.likes} likes</div>
            </div>
          </div>
          <img src={`${item.photos[0].cdnUrl}/-/format/auto/-/quality/smart/-/resize/300x300/`} />
        </div>
      );
    });
  };

  const editProfile = () => {
    navigate('/edit-profile', { state: userInfo });
  };

  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <AnimatedBackground />
          <motion.div 
            className='container mx-auto px-4 py-8'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className='max-w-3xl mx-auto'>
              <Card className="overflow-hidden backdrop-blur-sm bg-white/90">
                <CardHeader>
                  <CardTitle className="text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                                      bg-clip-text text-transparent text-center">
                    Profile
                  </CardTitle>
                </CardHeader>
                <div className='p-8 pb-4  border-b'>
                  <div className='flex felx-row items-center pb-2 mb-2'>
                    <div className='mr-2'>
                      <img src={userInfo.photoUrl ? userInfo.photoUrl : image1} alt="avatar" className='w-28 h-28 rounded-full border=2 border-slate-800 object-cover'></img>
                    </div>
                    <div>
                      <div className='text-xl ml-3'>{userInfo.displayName ? userInfo.displayName : "Guest_User"}</div>
                      {user?.uid === userId && (
                        <div className='text-xl ml-3'>{user?.email ? user.email : ""}</div>
                      )}
                    </div>
                  </div>
                  <div className='flex gap-4 mb-4'>
                    <Button variant="link" onClick={() => navigate(`/profile/${userId}/followers`)}>
                      {userInfo.followers?.length || 0} Followers
                    </Button>
                    <Button variant="link" onClick={() => navigate(`/profile/${userId}/following`)}>
                      {userInfo.following?.length || 0} Following
                    </Button>
                  </div>
                  <div className='mb-4'>{userInfo.userBio}</div>
                  {user?.uid === userId && (
                    <div>
                      <Button onClick={editProfile}>
                        <Edit2Icon className='mr-2 h-4 w-4' />Edit Profile
                      </Button>
                    </div>
                  )}
                  {user?.uid !== userId && (
                    <Button onClick={handleFollowClick}>
                      {isFollowing ? 'Unfollow' : 'Follow'}
                    </Button>
                  )}
                </div>
                <div className='p-8'>
                  <h2 className='mb-5'>My Posts</h2>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-2'>
                    {data ? renderPost() : <div>...Loading</div>}
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </Layout>
  );
};

export default Profile;