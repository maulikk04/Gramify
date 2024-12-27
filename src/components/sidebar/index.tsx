import * as React from 'react';
import { useEffect, useState } from 'react';
import homeIcon from "@/assets/icons/home.svg";
import addIcon from "@/assets/icons/add.svg";
import directIcon from "@/assets/icons/direct.svg";
import myphotoIcon from "@/assets/icons/myphoto.svg";
import settingIcon from "@/assets/icons/setting.svg";
import notificationIcon from "@/assets/icons/notification.svg";
import profileIcon from "@/assets/icons/profile.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import usersIcon from "@/assets/icons/icons8-users-30.png";
import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { useUserAuth } from '@/context/userAuthContext';
import { getUnreadMessageCount } from '@/repository/chat.service';
import { getUnreadNotificationCount } from '@/repository/notification.service';

interface ISidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FunctionComponent<ISidebarProps> = ({ onClose }) => {
  const { pathname } = useLocation();
  const { logOut, user } = useUserAuth();  
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  
  useEffect(() => {
    if (user) {
      const interval = setInterval(async () => {
        const messageCount = await getUnreadMessageCount(user.uid);
        const notificationCount = await getUnreadNotificationCount(user.uid);
        setUnreadMessages(messageCount);
        setUnreadNotifications(notificationCount);
      }, 5000); // Check every 5 seconds

      return () => clearInterval(interval);
    }
  }, [user]);

  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: homeIcon
    },
    {
      name: "Add Photos",
      link: "/post",
      icon: addIcon
    },
    {
      name: "My Photos",
      link: "/myphotos",
      icon: myphotoIcon
    },
    {
      name: "Profile",
      link: `/profile/${user?.uid}`,  
      icon: profileIcon
    },
    {
      name: "Notifications",
      link: "/notifications",
      icon: notificationIcon,
      badge: unreadNotifications > 0 ? unreadNotifications : undefined
    },
    {
      name: "Users",
      link: "/users",
      icon: usersIcon
    },
    {
      name: "Direct",
      link: "/direct",  
      icon: directIcon,
      badge: unreadMessages > 0 ? unreadMessages : undefined
    },
    {
      name: "Settings",
      link: "/settings",
      icon: settingIcon
    }
  ]
  return (
    <nav className='flex flex-col space-x-2 relative h-screen max-w-sw w-full '>
      <div className='flex justify-between items-center m-5 pl-8 lg:pl-0'>
        <div className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 
                       text-3xl font-bold tracking-wider hover:scale-105 transition-transform
                       duration-200 cursor-pointer font-satisfy'>
          Gramify
        </div>
        <button 
          onClick={onClose}
          className="lg:hidden text-white p-2 hover:bg-white/10 rounded-full"
        >
          ✕
        </button>
      </div>

      {navItems.map((item) => (
        <div className={cn(buttonVariants({ variant: "default" }),
          pathname === item.link ? "bg-white text-white-800 hover:bg-white rounded-none"
            : "hover:bg-slate-950 hover:text-white bg-transparent rounded-none",
          "justify-start relative"
        )} key={item.name}>
          <Link to={item.link} className='flex items-center w-full'>
            <span className="relative">
              <img src={item.icon} className='w-5 h-5 mr-2' alt={item.name} 
                style={{ filter: `${pathname === item.link ? "invert(0}" : "invert(1)"}` }} />
              {item.badge && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs 
                               rounded-full w-5 h-5 flex items-center justify-center">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </span>
            <span>{item.name}</span>
          </Link>
        </div>
      ))}
      <div className={cn(buttonVariants({ variant: "default" }),
        pathname === "/login" ? "bg-white text-white-800 hover:bg-white rounded-none"
          : "hover:bg-slate-950 hover:text-white bg-transparent rounded-none",
        "justify-start"
      )}>
        <Link to="/login" className='flex' onClick={logOut}>
          <span><img src={logoutIcon} className='w-5 h-5 mr-2' alt="logOut" style={
            { filter: `${pathname === "/login" ? "invert(0}" : "invert(1)"}` }}></img> </span>
          <span>Logout</span>
        </Link>
      </div>
    </nav>
  );
}

export default Sidebar;