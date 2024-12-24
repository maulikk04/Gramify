import Layout from '@/components/layout/index';
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserAuth } from '@/context/userAuthContext';
import { getAllUsers } from '@/repository/user.service';
import { ProfileResponse } from '@/types';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageTransition from '@/components/PageTransition';

const Users = () => {
    const [users, setUsers] = useState<ProfileResponse[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const { user } = useUserAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            if (user) {
                const allUsers = await getAllUsers(user.uid);
                if (allUsers) {
                    setUsers(allUsers);
                }
            }
        };
        fetchUsers();
    }, [user]);

    const filteredUsers = users.filter(user => 
        user.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.userBio.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <Layout>
            <PageTransition>
                <div className="max-w-3xl mx-auto">
                    <Card className="overflow-hidden backdrop-blur-sm bg-white/90">
                        <CardHeader>
                            <CardTitle className="text-2xl font-satisfy bg-gradient-to-r from-purple-400 to-pink-600 
                                               bg-clip-text text-transparent text-center">
                                Users
                            </CardTitle>
                            <div className="relative mt-4">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 
                                             focus:ring-purple-400 focus:border-transparent"
                                />
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                            </div>
                        </CardHeader>
                        <div className="p-8">
                            {filteredUsers.length === 0 ? (
                                <p className="text-center text-gray-500">No users found</p>
                            ) : (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        onClick={() => navigate(`/profile/${user.userId}`)}
                                        className="flex items-center gap-4 p-4 hover:bg-gray-50 border-b last:border-b-0 
                                                 cursor-pointer transition-colors duration-200"
                                    >
                                        <img
                                            src={user.photoUrl || "/default-avatar.png"}
                                            alt={user.displayName}
                                            className="w-12 h-12 rounded-full object-cover"
                                        />
                                        <div>
                                            <h3 className="font-semibold">{user.displayName}</h3>
                                            <p className="text-sm text-gray-500">{user.userBio}</p>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </Card>
                </div>
            </PageTransition>
        </Layout>
    );
};

export default Users;
