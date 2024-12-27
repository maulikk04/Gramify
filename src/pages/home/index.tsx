import Layout from '@/components/layout';
import PostCard from '@/components/postCard';
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

const Home: React.FunctionComponent<IHomeProps> = () => {
  const {user} = useUserAuth();
  const [data, setData] = React.useState<DocumentResponse[]>([]);
  const [searchQuery, setSearchQuery] = React.useState('');
  
  const getAllPost = React.useCallback(async () => {
    const response: DocumentResponse[] = await getPosts(user?.uid) || [];
    setData(response);
  }, [user?.uid]);

  React.useEffect(() => {
    if (user != null) {
      getAllPost();
    }
  }, [user, getAllPost]);

  React.useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        getAllPost();
      }, 10000);

      return () => clearInterval(interval);
    }
  }, [user, getAllPost]);

  const filteredPosts = React.useMemo(() => {
    if (!searchQuery.trim()) return data;
    
    const query = searchQuery.toLowerCase();
    return data.filter(post => 
      post.username.toLowerCase().includes(query) ||
      post.caption.toLowerCase().includes(query)
    );
  }, [data, searchQuery]);

  const renderPost = () => {
    return filteredPosts.map((item) => {
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
            className='flex flex-col max-w-2xl mx-auto space-y-6 px-4 sm:px-0'
          >
            <div className='relative mb-8 w-full lg:mt-0 mt-10'>
              <div className='relative group'>
                <Input 
                  className='border border-gray-200 bg-white/80 h-12 pl-12 pr-4 rounded-xl
                            text-base focus:outline-none focus:border-purple-400 transition-all duration-200
                            backdrop-blur-sm shadow-sm hover:shadow-md'
                  placeholder='Search posts and users...'
                  type='search'
                  name='search'
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 
                                  w-5 h-5 text-gray-400 group-hover:text-purple-400 transition-colors duration-200'/>
              </div>
            </div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className='mb-8 space-y-6'
            >
              <h2 className='mb-6 text-3xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                            bg-clip-text text-transparent'>Feed</h2>
              <div className='w-full flex justify-center'>
                <div className='flex flex-col w-full gap-6'>
                  {filteredPosts.length > 0 ? renderPost() : (
                    <div className="flex items-center justify-center h-40 bg-white/80 rounded-xl 
                                  backdrop-blur-sm shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)]">
                      <p className="text-gray-500">
                        {data.length === 0 ? "Loading..." : "No posts found"}
                      </p>
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