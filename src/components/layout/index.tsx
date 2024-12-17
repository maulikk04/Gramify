import * as React from 'react';
import Sidebar from '../sidebar';
import UserList from '../userList';
import AnimatedBackground from '../AnimatedBackground';
import { motion } from 'framer-motion';
interface ILayoutProps {
    children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({children}) => {
  return (
    <div className='flex bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
      <AnimatedBackground />
      <aside className='fixed flex gap-x-4 bg-gradient-to-b from-blue-950 to-purple-950 
                       top-0 left-0 z-40 lg:w-60 h-screen shadow-xl'>
        <Sidebar />
      </aside>
      <main className='lg:ml-60 lg:mr-60 p-8 flex-1 ml-36 relative'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
      <aside className='fixed hidden lg:block bg-gradient-to-b from-blue-950 to-purple-950 
                       top-0 right-0 z-40 lg:w-60 h-screen shadow-xl'>
        <UserList />
      </aside>
    </div>
  );
}
 
export default Layout;