import Layout from '@/components/layout';
import PostCard from '@/components/postCard';
import Stories from '@/components/stories';
import { Input } from '@/components/ui/input';
import { useUserAuth } from '@/context/userAuthContext';
import { getPosts } from '@/repository/post.service';
import { DocumentResponse } from '@/types';
import { Search } from 'lucide-react';
import * as React from 'react';
import { motion } from "framer-motion";
import PageTransition from '@/components/PageTransition';

interface IHomeProps {

}

const Home: React.FunctionComponent<IHomeProps> = (props) => {
  const {user} = useUserAuth();
  const [data,setData] = React.useState<DocumentResponse[]>([]);
  const getAllPost = React.useCallback(async () => {
    const response: DocumentResponse[] = await getPosts() || [];
    setData(response);
  }, []);

  React.useEffect(() => {
    if (user != null) {
      getAllPost();
    }
  }, [user, getAllPost]);

  React.useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        getAllPost();
      }, 10000); // Refresh every 10 seconds

      return () => clearInterval(interval);
    }
  }, [user, getAllPost]);

  const renderPost = () => {
    return data.map((item)=>{
      return <PostCard data={item} key={item.id}/>
    })
  }
  return (
    <Layout>
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className='flex flex-col max-w-2xl mx-auto space-y-6'
          >
            <div className='relative mb-8 w-full'>
              <div className='relative group'>
                <Input 
                  className='border border-gray-200 bg-white/80 h-12 pl-12 pr-4 rounded-xl
                            text-base focus:outline-none focus:border-purple-400 transition-all duration-200
                            backdrop-blur-sm shadow-sm hover:shadow-md'
                  placeholder='Search posts, people & more...'
                  type='search'
                  name='search'
                />
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 
                                  w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200'/>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className='mb-8 bg-white/90 backdrop-blur-sm rounded-xl p-6 
                        shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.1)]
                        transition-all duration-300'
            >
              <h2 className='mb-4 text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                            bg-clip-text text-transparent'>Stories</h2>
              <Stories/>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='mb-8 space-y-6'
            >
              <h2 className='mb-6 text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                            bg-clip-text text-transparent'>Feed</h2>
              <div className='w-full flex justify-center'>
                <div className='flex flex-col w-full gap-6'>
                  {data ? renderPost() : (
                    <div className="flex items-center justify-center h-40 bg-white/80 rounded-xl 
                                  backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"/>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </PageTransition>
    </Layout>

  );
}

export default Home;