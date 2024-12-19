import { useUserAuth } from '@/context/userAuthContext';
import { CommentResponse, DocumentResponse } from '@/types';
import { useState, useEffect } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { HeartIcon, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { updateLikesOnPost } from '@/repository/post.service';
import { motion } from 'framer-motion';
import { createComment, getCommentsByPostId } from '@/repository/comment.service';
import CommentsDrawer from '../comments/CommentsDrawer';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import { followUser, unfollowUser, getUserProfile } from '@/repository/user.service';

interface IPostCardProps{
    data: DocumentResponse;
}

const PostCard: React.FunctionComponent<IPostCardProps> = ({data}) => {
    const {user} = useUserAuth();
    const [comments, setComments] = useState<CommentResponse[]>([]);
    const [newComment, setNewComment] = useState('');
    const [showComments, setShowComments] = useState(false);
    const navigate = useNavigate();
    const [likesInfo, setLikesInfo] = useState<{
        likes:number,
        isLike:boolean
    }>({ likes:data.likes, 
        isLike: user?.uid ? data.userlikes.includes(user.uid) : false});
    const [isFollowed, setIsFollowed] = useState(false);

    useEffect(() => {
        const checkFollowStatus = async () => {
            if (user?.uid && data.userId) {
                const userProfile = await getUserProfile(user.uid);
                console.log(userProfile);
                
                if (userProfile && userProfile.following) {
                    setIsFollowed(userProfile.following.includes(data.userId));
                }
            }
        };
        checkFollowStatus();
    }, [user?.uid, data.userId]);

    const handleFollowToggle = async () => {
        if (!user?.uid || !data.userId) return;

        try {
            if (isFollowed) {
                await unfollowUser(user.uid, data.userId);
            } else {
                await followUser(user.uid, data.userId);
            }
            
            const userProfile = await getUserProfile(user.uid);
            if (userProfile && userProfile.following) {
                setIsFollowed(userProfile.following.includes(data.userId));
            }
        } catch (error) {
            console.error("Error toggling follow:", error);
        }
    };

    const updateLike= async (isVal:boolean)=>{
        if(!user?.uid) return ;
        setLikesInfo({
            likes: isVal? likesInfo.likes+1:likesInfo.likes-1,
            isLike : !likesInfo.isLike
        })

        if(isVal){
            data.userlikes.push(user?.uid);
        } else {
            data.userlikes?.splice(data.userlikes.indexOf(user?.uid),1);
        }

        await updateLikesOnPost(data.id , data.userlikes, isVal?likesInfo.likes+1 : likesInfo.likes-1)
    }

    const loadComments = async () => {
        const postComments = await getCommentsByPostId(data.id);
        setComments(postComments);
    };

    const handleOpenComments = () => {
        setShowComments(true);
        loadComments();
    };

    const handleAddComment = async () => {
        if (!user || !newComment.trim()) return;

        const comment = {
            postId: data.id,
            userId: user.uid,
            username: user.displayName || '',
            userPhotoUrl: user.photoURL || '',
            text: newComment,
            date: new Date()
        };

        await createComment(comment);
        setNewComment('');
        loadComments();
    };

    return (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-5xl mx-auto px-4"
        >
          <Card className='mb-6 card-gradient'>
            <CardHeader className='flex flex-col p-3'>
                <CardTitle className='text-sm text-center flex justify-between items-center'>
                    <div className='flex items-center'>
                        <span className='mr-2'>
                            <img src={data.photoUrl} className='w-10 h-10 rounded-full border-2 border-slate-800 object-cover'/>
                        </span>
                        <span className='cursor-pointer' onClick={(e)=>{
                            e.preventDefault(); 
                            navigate(`/profile/${data.userId}`);
                        }}>
                            {data.username}
                        </span>
                    </div>
                    {user?.uid && user.uid !== data.userId && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleFollowToggle}
                        >
                            {isFollowed ? 'Unfollow' : 'Follow'}
                        </Button>
                    )}
                </CardTitle>
                
            </CardHeader>
            <CardContent className='p-0 h-[500px]'>
                <div className="relative w-full h-full">
                    <img 
                        src={data.photos? data.photos[0].cdnUrl : ""} 
                        alt={data.caption}
                        className="absolute inset-0 w-full h-full object-cover"
                    />
                </div>
            </CardContent>
            <CardFooter className='flex flex-col p-3'>
                <div className='flex justify-between w-full mb-3'>
                    <div className='flex'>
                        <HeartIcon 
                            className={cn("mr-3", "cursor-pointer", 
                            likesInfo.isLike ? "fill-red-500":"fill-none")} 
                            onClick={()=>updateLike(!likesInfo.isLike)}
                        />
                        <MessageCircle 
                            className="mr-3 cursor-pointer" 
                            onClick={handleOpenComments}
                        />
                    </div>
                </div>
                <div className='w-full text-sm font-semibold'>{likesInfo.likes} likes</div>
                <div className='w-full text-sm'>
                    <span className='font-semibold'>{data.username}</span> : {data.caption}
                </div>
                {comments.length > 0 && (
                    <div 
                        className="w-full text-sm text-gray-500 cursor-pointer mt-1"
                        onClick={handleOpenComments}
                    >
                        View all {comments.length} comments
                    </div>
                )}
            </CardFooter>
          </Card>

          <CommentsDrawer 
            open={showComments}
            onOpenChange={setShowComments}
            post={data}
            comments={comments}
            newComment={newComment}
            onCommentChange={setNewComment}
            onCommentSubmit={handleAddComment}
          />
        </motion.div>
    );
}

export default PostCard;