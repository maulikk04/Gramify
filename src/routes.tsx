import { createBrowserRouter } from "react-router-dom";
import Home from "./pages/home";
import Error from "./pages/error";
import Login from "./pages/login";
import Signup from "./pages/signup";
import CreatePost from "./pages/post";
import Profile from "./pages/profile";
import MyPhotos from "./pages/myPhotos";
import ProtectedRoutes from "./components/ProtectedRoutes";
import EditProfile from "./pages/profile/editProfile";
import Followers from "./pages/profile/Followers";
import Following from "./pages/profile/Following";
import Chat from "./pages/chat";
import DirectMessages from "./pages/direct";
import NotificationsPage from "./pages/notifications";
import SinglePost from "./pages/post/[id]"; 
import Users from "./pages/users";

export const router = createBrowserRouter([
    {
        element: <ProtectedRoutes />,
        children: [
            {
                path: "/",
                element: <Home />,
                errorElement: <Error />,
            },
            {
                path: "/post",
                element: <CreatePost />,
                errorElement: <Error />,
            },
            {
                path: "/profile",
                element: <Profile />,
                errorElement: <Error />,
            },
            {
                path: "/profile/:userId",
                element: <Profile />,
                errorElement: <Error />,
            },
            {
                path: "/profile/:userId/followers",
                element: <Followers />,
                errorElement: <Error />,
            },
            {
                path: "/profile/:userId/following",
                element: <Following />,
                errorElement: <Error />,
            },
            {
                path: "/edit-profile",
                element: <EditProfile />,
                errorElement: <Error />,
            },
            {
                path: "/myphotos",
                element: <MyPhotos />,
                errorElement: <Error />,
            },
            {
                path: "/chat/:userId",
                element: <Chat />,
                errorElement: <Error />,
            },
            {
                path: "/direct",
                element: <DirectMessages />,
                errorElement: <Error />,
            },
            {
                path: "/notifications",
                element: <NotificationsPage />,
                errorElement: <Error />,
            },
            {
                path: "/post/:id",  
                element: <SinglePost />,
                errorElement: <Error />,
            },
            {
                path: "/users",
                element: <Users />,
                errorElement: <Error />,
            }
        ]
    },
    {
        path: "/login",
        element: <Login />,
        errorElement: <Error />,
    },
    {
        path: "/signup",
        element: <Signup />,
        errorElement: <Error />,
    }
]);

export default router;