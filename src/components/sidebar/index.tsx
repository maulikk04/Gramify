import * as React from 'react';
import homeIcon from "@/assets/icons/home.svg";
import addIcon from "@/assets/icons/add.svg";
import directIcon from "@/assets/icons/direct.svg";
import myphotoIcon from "@/assets/icons/myphoto.svg";
import settingIcon from "@/assets/icons/setting.svg";
import notificationIcon from "@/assets/icons/notification.svg";
import profileIcon from "@/assets/icons/profile.svg";
import logoutIcon from "@/assets/icons/logout.svg";
import { Link, useLocation } from 'react-router-dom';
import { buttonVariants } from '../ui/button';
import { cn } from '@/lib/utils';
import { useUserAuth } from '@/context/userAuthContext';

interface ISidebarProps {

}

const Sidebar: React.FunctionComponent<ISidebarProps> = (props) => {
  const { pathname } = useLocation();
  const { logOut, user } = useUserAuth();  
  
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
      link: "#",
      icon: notificationIcon
    },
    {
      name: "Direct",
      link: "#",
      icon: directIcon
    },
    {
      name: "Settings",
      link: "#",
      icon: settingIcon
    }
  ]
  return (
    <nav className='flex flex-col space-x-2 relative h-screen max-w-sw w-full '>
      <div className='flex justify-center m-5'>
      <div className='text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 
                       text-3xl font-bold tracking-wider hover:scale-105 transition-transform
                       duration-200 cursor-pointer font-satisfy'>
          Gramify
        </div>
      </div>

      {navItems.map((item) => (
        <div className={cn(buttonVariants({ variant: "default" }),
          pathname === item.link ? "bg-white text-white-800 hover:bg-white rounded-none"
            : "hover:bg-slate-950 hover:text-white bg-transparent rounded-none",
          "justify-start"
        )} key={item.name}>
          <Link to={item.link} className='flex'>
            <span><img src={item.icon} className='w-5 h-5 mr-2' alt={item.name} style={
              { filter: `${pathname === item.link ? "invert(0}" : "invert(1)"}` }}></img> </span>
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