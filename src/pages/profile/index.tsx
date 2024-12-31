import Layout from '@/components/layout';
import { useUserAuth } from '@/context/userAuthContext';
import { DocumentResponse,ProfileResponse } from '@/types';
import * as React from 'react';
import image1 from "@/assets/images/image1.png";
import { Button } from '@/components/ui/button';
import { Edit2Icon, HeartIcon } from 'lucide-react';
import { getPostsByUserId } from '@/repository/post.service';
import { useNavigate, useParams } from 'react-router-dom';
import { getUserProfile, followUser, unfollowUser, sendFollowRequest } from '@/repository/user.service';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { getBookmarkedPosts } from '@/repository/bookmark.service';

interface IProfileProps {}

const Profile: React.FunctionComponent<IProfileProps> = () => {
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
    following: [],
    followRequests: [], 
    isPrivate: false,
    email: user?.email ? user.email : ""
  };
  const [userInfo, setUserInfo] = React.useState<ProfileResponse>(initialUserInfo);
  const isFollowing = userInfo.followers?.includes(user?.uid || '');
  const isOwnProfile = user?.uid === userId;
  const canViewPosts = isOwnProfile || !userInfo.isPrivate || isFollowing;
  const [activeTab, setActiveTab] = React.useState<'posts' | 'bookmarks'>('posts');
  const [bookmarkedPosts, setBookmarkedPosts] = React.useState<DocumentResponse[]>([]);
  const isRequested = userInfo.followRequests?.includes(user?.uid || '') || false;

  const getAllPost = async (id: string) => {
    const posts = await getPostsByUserId(id);
    setData(posts);
  };

  const getUserProfileInfo = async (userId: string) => {
    const data: ProfileResponse = (await getUserProfile(userId)) || initialUserInfo;
   // console.log("User Profile Data:", data);
    if (data) {
      setUserInfo(data);
    }
  };

  const handleFollowClick = async () => {
    if (!user || !userId) return;
    if (isFollowing) {
      await unfollowUser(user.uid, userId);
    } else if (userInfo.isPrivate) {
      await sendFollowRequest(user.uid, userId);
    } else {
      await followUser(user.uid, userId);
    }
    getUserProfileInfo(userId);
  };

  const fetchBookmarkedPosts = async () => {
    if (user?.uid) {
      const posts = await getBookmarkedPosts(user.uid);
      setBookmarkedPosts(posts);
    }
  };

  React.useEffect(() => {
    if (userId) {
      getAllPost(userId);
      getUserProfileInfo(userId);
    }
  }, [userId]);

  React.useEffect(() => {
    if (activeTab === 'bookmarks') {
      fetchBookmarkedPosts();
    }
  }, [activeTab]);

  const renderPost = () => {
    return data.map((item) => {
      // Add null check for photos array
      if (!item.photos || !item.photos.length || !item.photos[0].cdnUrl) {
        return (
          <div key={item.id} className='relative cursor-pointer'>
            <div className='w-full h-full aspect-square bg-gray-100 flex items-center justify-center'>
              <span className="text-gray-400">No image available</span>
            </div>
          </div>
        );
      }

      return (
        <div key={item.id} className='relative cursor-pointer' onClick={()=>navigate(`/post/${item.id}`)}>
          <div className='absolute group transition-all duration-200 bg-transparent hover:bg-slate-950 hover:bg-opacity-75 top-0 bottom-0 left-0 right-0 w-full h-full '>
            <div className='flex flex-col justify-center items-center w-full h-full'>
              <HeartIcon className='hidden group-hover:block fill-white' />
              <div className='hidden group-hover:block text-white'>{item.likes} likes</div>
            </div>
          </div>
          <img 
            src={item.photos[0].cdnUrl} 
            alt={item.caption || 'Post image'}
            className="w-full h-full object-cover aspect-square"
          />
        </div>
      );
    });
  };

  const renderBookmarkedPosts = () => {
    return bookmarkedPosts.map((item) => {
      // Add the same null check for bookmarked posts
      if (!item.photos || !item.photos.length || !item.photos[0].cdnUrl) {
        return (
          <div key={item.id} className='relative cursor-pointer'>
            <div className='w-full h-full aspect-square bg-gray-100 flex items-center justify-center'>
              <span className="text-gray-400">No image available</span>
            </div>
          </div>
        );
      }

      return (
        <div key={item.id} className='relative cursor-pointer' onClick={()=>navigate(`/post/${item.id}`)}>
          <div className='absolute group transition-all duration-200 bg-transparent hover:bg-slate-950 hover:bg-opacity-75 top-0 bottom-0 left-0 right-0 w-full h-full '>
            <div className='flex flex-col justify-center items-center w-full h-full'>
              <HeartIcon className='hidden group-hover:block fill-white' />
              <div className='hidden group-hover:block text-white'>{item.likes} likes</div>
            </div>
          </div>
          <img 
            src={item.photos[0].cdnUrl}
            alt={item.caption || 'Post image'}
            className="w-full h-full object-cover aspect-square"
          />
        </div>
      );
    });
  };

  const renderPrivacyNotice = () => {
    if (!userInfo.isPrivate || isOwnProfile || isFollowing) return null;
    return (
      <div className="text-center p-8">
        <p className="text-gray-500">This account is private.</p>
        <p className="text-gray-500">Follow this account to see their posts.</p>
      </div>
    );
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
            className='container mx-auto px-2 sm:px-4 py-4 sm:py-8' 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className='max-w-3xl mx-auto'>
              <Card className="overflow-hidden backdrop-blur-sm bg-white/90">
                <CardHeader>
                  <CardTitle className="text-xl sm:text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                                      bg-clip-text text-transparent text-center">
                    Profile
                  </CardTitle>
                </CardHeader>
                <div className='p-4 sm:p-8 pb-4 border-b'>
                  <div className='flex flex-col sm:flex-row items-center pb-2 mb-2'>
                    <div className='mb-4 sm:mb-0 sm:mr-2'>
                      <img src={userInfo.photoUrl ? userInfo.photoUrl : image1} 
                           alt="avatar" 
                           className='w-20 h-20 sm:w-28 sm:h-28 rounded-full border-2 border-slate-800 object-cover' />
                    </div>
                    <div className='text-center sm:text-left'>
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
                      <Button className='bg-gradient-to-r from-purple-400 to-pink-600 text-white' onClick={editProfile}>
                        <Edit2Icon className='mr-2 h-4 w-4' />Edit Profile
                      </Button>
                    </div>
                  )}
                  {user?.uid !== userId && (
                    <Button 
                      onClick={handleFollowClick}
                      disabled={isRequested}
                    >
                      {isFollowing ? 'Unfollow' : 
                      isRequested ? 'Requested' : 
                      userInfo.isPrivate ? 'Request to Follow' : 'Follow'}
                    </Button>
                  )}
                </div>
                <div className='p-4 sm:p-8'>
                  <div className="flex gap-4 mb-6">
                    <Button 
                      variant={activeTab === 'posts' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('posts')}
                    >
                      Posts
                    </Button>
                    {user?.uid === userId && (
                    <Button 
                      variant={activeTab === 'bookmarks' ? 'default' : 'outline'}
                      onClick={() => setActiveTab('bookmarks')}
                    >
                      Bookmarks
                    </Button> )}
                  </div>
                  {!canViewPosts ? renderPrivacyNotice() : (
                    <div className='grid grid-cols-2 sm:grid-cols-3 gap-1 sm:gap-2'>
                      {activeTab === 'posts' ? renderPost() : renderBookmarkedPosts()}
                    </div>
                  )}
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