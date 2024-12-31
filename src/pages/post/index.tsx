import FileUploader from '@/components/fileUploader';
import Layout from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useUserAuth } from '@/context/userAuthContext';
import { createPost } from '@/repository/post.service';
import { FileEntry, PhotoMeta, Post } from '@/types';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface ICreatePostProps {

}

const CreatePost: React.FunctionComponent<ICreatePostProps> = () => {
  const {user} = useUserAuth();
  const navigate = useNavigate();
  const [fileEntry,setFileEntry] = React.useState<FileEntry>({
    files:[],
  })
  const [post,setPost] = React.useState<Post>({
    caption:'',
    photos:[],
    likes:0,
    userlikes:[],
    userId: null,
    username:user?.displayName || "Guest_User",
    photoUrl:user?.photoURL || "",
    date:new Date(),
  })
  const [error, setError] = React.useState<string>('');

 const handleSubmit = async (e:React.MouseEvent<HTMLFormElement>)=>{
    e.preventDefault();
    setError('');

    if (!user) {
      navigate('/login');
      return;
    }

    if (!fileEntry.files.length) {
      setError('Please select at an image');
      return;
    }

    try {
      const photoMeta: PhotoMeta[] = fileEntry.files.map((file) => ({
        cdnUrl: file.cdnUrl,
        uuid: file.uuid,
      }));

      const newPost: Post = {
        caption: post.caption,
        photos: photoMeta,
        likes: 0,
        userlikes: [],
        userId: user.uid,
        username: user.displayName || "Guest_User",
        photoUrl: user.photoURL || "",
        date: new Date()
      };

      await createPost(newPost);
    
      navigate('/');
    } catch (error) {
      console.error("Error creating post:", error);
      setError('Failed to create post. Please try again.');
    }
 }

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
                    Create Post
                  </CardTitle>
                </CardHeader>
                <div className='p-8'>
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="mb-4 p-2 text-sm text-red-500 bg-red-50 rounded text-center">
                        {error}
                      </div>
                    )}
                    <div className='flex flex-col'>
                      <Label className='mb-4' htmlFor='caption'>Photo Caption</Label>
                      <Textarea className='mb-8' id="caption" placeholder="What's in your photo!" value={post.caption} onChange={(e:React.ChangeEvent<HTMLTextAreaElement>)=>setPost({...post, caption:e.target.value})} />
                    </div>
                    <div className='flex flex-col'>
                      <Label className='mb-4' htmlFor='photo'>Photos *</Label>
                      <FileUploader fileEntry={fileEntry} onChange={setFileEntry} preview={true}/>
                    </div>
                    <Button 
                      className='bg-gradient-to-r from-purple-400 to-pink-600 text-white mt-8 w-32' 
                      type='submit'
                      disabled={!fileEntry.files.length} 
                    >
                      Post
                    </Button>
                  </form>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </Layout>
  );
}

export default CreatePost;