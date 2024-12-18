import FileUploader from '@/components/fileUploader'
import Layout from '@/components/layout'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileEntry, ProfileInfo, UserProfile } from '@/types'
import * as React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import image1 from '@/assets/images/image1.png'
import { Input } from '@/components/ui/input'
import { createUserProfile, updateUserProfile } from '@/repository/user.service'
import { useUserAuth } from '@/context/userAuthContext'
import { updateUserInfoOnPosts } from '@/repository/post.service'
import PageTransition from '@/components/PageTransition';
import { motion } from 'framer-motion';
import AnimatedBackground from '@/components/AnimatedBackground';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';

interface IEditProfileProps { }

const EditProfile: React.FC<IEditProfileProps> = (props) => {
    const { user, updateProfileInfo } = useUserAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const { id, userId, userBio, displayName, photoUrl } = location.state;
    console.log("loc state ", location.state);

    const [data, setData] = React.useState<UserProfile>({
        userId,
        userBio,
        displayName,
        photoUrl
    })
    const [fileEntry, setFileEntry] = React.useState<FileEntry>({
        files: [],
    })
    const updateProfile = async (e: React.MouseEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (id) {
                const response = await updateUserProfile(id, data);
                console.log("updated user profile", response);

            } else {
                const response = await createUserProfile(data);
                console.log("created user profile", response);

            }
            const profileInfo: ProfileInfo = {
                user: user!,
                displayName: data.displayName,
                photoUrl: data.photoUrl
            }
            updateProfileInfo(profileInfo)
            updateUserInfoOnPosts(profileInfo)
            navigate(`/profile/${user?.uid}`);
        } catch (error) {
            console.log(error);

        }
    }
    React.useEffect(() => {
        if (fileEntry.files.length > 0) {
            setData(prev => ({
                ...prev,
                photoUrl: fileEntry.files[0].cdnUrl
            }));
        }
    }, [fileEntry.files]);
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
                                        Edit Profile
                                    </CardTitle>
                                </CardHeader>
                                <div className='p-8'>
                                    <form onSubmit={updateProfile}>
                                        <div className='flex flex-col'>
                                            <Label className='mb-4' htmlFor='photo'>Profile Picture</Label>
                                            <div className='mb-4'>
                                                <img src={data.photoUrl ? data.photoUrl : image1} alt="avatar"
                                                    className='w-28 h-28 rounded-full border=2 border-slate-800 object-cover'></img>
                                            </div>
                                            <FileUploader fileEntry={fileEntry} onChange={setFileEntry} preview={false} />
                                        </div>
                                        <div className='flex flex-col'>
                                            <Label className='mb-4' htmlFor='displayName'>Display Name</Label>
                                            <Input className='mb-8'
                                                id="displayName"
                                                placeholder="Enter your username"
                                                value={data.displayName}
                                                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                                                    setData({ ...data, displayName: e.target.value })} />
                                        </div>
                                        <div className='flex flex-col'>
                                            <Label className='mb-4' htmlFor='userBio'>Profile Bio</Label>
                                            <Textarea className='mb-8'
                                                id="userBio"
                                                placeholder="What's in your mind!"
                                                value={data.userBio}
                                                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                                                    setData({ ...data, userBio: e.target.value })} />
                                        </div>

                                        <Button className='mt-4 w-32 mr-8' type='submit'>Update</Button>
                                        <Button variant="destructive" className='mt-4 w-32 mr-8' onClick={() => navigate(`/profile/${user?.uid}`)}>Cancel</Button>
                                    </form>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                </div>
            </PageTransition>
        </Layout>
    )
}

export default EditProfile