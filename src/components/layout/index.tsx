import * as React from 'react';
import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import Sidebar from '../sidebar';
import UserList from '../userList';
import AnimatedBackground from '../AnimatedBackground';
import { motion } from 'framer-motion';
import { Menu } from 'lucide-react';

interface ILayoutProps {
    children: React.ReactNode;
}

const Layout: React.FunctionComponent<ILayoutProps> = ({children}) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const { pathname } = useLocation();
  const isChatPage = pathname.includes('/chat/'); 

  return (
    <div className='flex bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen'>
      <AnimatedBackground />
      
      {!isChatPage && (
        <button 
          onClick={() => setShowSidebar(!showSidebar)}
          className={`lg:hidden fixed top-4 left-6 z-50 p-2 bg-gradient-to-r from-blue-950 to-purple-950 rounded-md
                     transition-opacity duration-300 ${showSidebar ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
        >
          <Menu className="w-6 h-6 text-white" />
        </button>
      )}

      <aside className={`fixed flex gap-x-4 bg-gradient-to-b from-blue-950 to-purple-950 
                       top-0 left-0 z-40 lg:w-60 h-screen shadow-xl transition-transform duration-300
                       ${showSidebar ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <Sidebar onClose={() => setShowSidebar(false)} />
      </aside>

      <main className='lg:ml-60 lg:mr-60 p-4 sm:p-8 flex-1 relative'>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
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