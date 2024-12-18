import { useUserAuth } from '@/context/userAuthContext';
import { getAllUsers } from '@/repository/user.service';
import { ProfileResponse } from '@/types';
import image1 from "@/assets/images/image1.png";
import * as React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../ui/button';

interface IUserListProps {}

const UserList: React.FunctionComponent<IUserListProps> = () => {
  const { user } = useUserAuth();
  const [suggestedUser, setSuggestedUser] = React.useState<ProfileResponse[]>([]);
  const navigate = useNavigate();

  const getSuggestedUser = async (userId: string) => {
    const response = (await getAllUsers(userId)) || [];
    setSuggestedUser(response);
  };

  React.useEffect(() => {
    if (user?.uid != null) {
      getSuggestedUser(user.uid);
    }
  }, [user]);

  const renderUsers = () => {
    return suggestedUser.map((suggestedUser) => (
      <div key={String(suggestedUser.userId)} className='flex flex-row items-center mb-4 border-gray-400 justify-start'>
        <span className='mr-2'>
          <img src={suggestedUser.photoUrl ? suggestedUser.photoUrl : image1} className='w-8 h-8 rounded-full border-2 border-slate-800 object-cover'></img>
        </span>
        <span className='text-xs'>{suggestedUser.displayName ? suggestedUser.displayName : "Guest_User"}</span>
        <Button className='text-xs p-3 py-2 h-6 bg-slate-900 last-of-type:ml-auto' onClick={() => navigate(`/profile/${suggestedUser.userId}`)}>View Profile</Button>
      </div>
    ));
  };

  return (
    <div className='text-white py-8 px-3'>
      <Link to={`/profile/${user!.uid}`}>
        <div className='flex flex-rox items-center border-b pb-4 mb-4 border-gray-400 curser-pointer'>
          <span className='mr-2'>
            <img src={user?.photoURL ? user.photoURL : image1} className='w-10 h-10 rounded-full border-2 border-slate-800 object-cover'></img>
          </span>
          <span className='text-xs'>{user?.displayName ? user.displayName : "Guest_User"}</span>
        </div>
      </Link>
      <h3 className='text-sm text-slate-300'>Suggested Friends</h3>
      <div className='my-4'>{suggestedUser.length > 0 ? renderUsers() : ""}</div>
    </div>
  );
};

export default UserList;