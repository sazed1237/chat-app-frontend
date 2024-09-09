import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../MainLayout/MainLayout";
import Home from "../Pages/Home";
import RegisterUser from "../Pages/RegisterUser";
import CheckEmail from "../Pages/CheckEmail";
import CheckPassword from "../Pages/CheckPassword";
import MessagePage from "../components/MessagePage";
import ForgotPassword from "../Pages/ForgotPassword";
import WonProfile from "../components/WonProfile";
import EditProfile from "../components/EditProfile";
import AllFriends from "../Pages/AllFriends";


const router = createBrowserRouter([
    {
        path: "/",
        element: <MainLayout></MainLayout>,
        children: [
            {
                path: '/',
                element: <Home></Home>,
                children: [
                    {
                        path: ':userId',
                        element: <MessagePage></MessagePage>
                    },
                    {
                        path: 'profile',
                        element: <WonProfile></WonProfile>
                    },
                    {
                        path: '/edit-profile',
                        element: <EditProfile></EditProfile>
                    },
                    {
                        path: '/people',
                        element: <AllFriends></AllFriends>
                    }
                ]
            },
            {
                path: 'register',
                element: <RegisterUser></RegisterUser>
            },
            {
                path: 'email',
                element: <CheckEmail></CheckEmail>
            },
            {
                path: 'password',
                element: <CheckPassword></CheckPassword>
            },
            {
                path: 'forgot-password',
                element: <ForgotPassword></ForgotPassword>
            }
        ]
    },

]);


export default router