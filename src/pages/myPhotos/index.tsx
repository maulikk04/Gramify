import Layout from '@/components/layout';
import { useUserAuth } from '@/context/userAuthContext';
import { getPostsByUserId } from '@/repository/post.service';
import { DocumentResponse } from '@/types';
import * as React from 'react';
import { HeartIcon} from "lucide-react";
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';

interface IMyPhotosProps {

}

const MyPhotos: React.FunctionComponent<IMyPhotosProps> = () => {
  const {user} = useUserAuth();
  const navigate = useNavigate();
  const [data,setData] = React.useState<DocumentResponse[]>([]);

  const getAllPost = async (id:string) => {
    try {
      const posts = await getPostsByUserId(id);
      if (posts && posts.length > 0) {
        setData(posts);
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    if(user != null) {
      getAllPost(user.uid);
    }
  },[user]);

  const renderPost = () => {
    return data.map((item) => {
      return <div key={item.photos[0].uuid} className='relative cursor-pointer' onClick={()=>navigate(`/post/${item.id}`)}>
          <div className='absolute group transition-all duration-200 bg-transparent hover:bg-slate-950 hover:bg-opacity-75 top-0 bottom-0 left-0 right-0 w-full h-full'>
            <div className='flex flex-col justify-center items-center w-full h-full'>
              <HeartIcon className='hidden group-hover:block fill-white'/>
              <div className='hidden group-hover:block text-white'>{item.likes} likes</div>
            </div>
          </div>
          <img src={`${item.photos[0].cdnUrl}/-/format/auto/-/quality/smart/-/resize/300x300/`} />
      </div>
    });
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
                    My Photos
                  </CardTitle>
                </CardHeader>
                <div className='p-8'>
                  <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
                    {data? renderPost(): <div>...Loading</div>}
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </div>
      </PageTransition>
    </Layout>
  );
}

export default MyPhotos;