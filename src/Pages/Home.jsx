import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { io } from 'socket.io-client';
import { logout, setOnlineUser, setSocketConnection, setUser } from '../redux/userSlice';
import axios from 'axios';

const Home = () => {

    const user = useSelector(state => state?.user)
    const dispatch = useDispatch()
    const location = useLocation()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);
    const [socketConnected, setSocketConnected] = useState(false); // socket connects once


    console.log("user in home", user)

    const token = localStorage.getItem('token')
    console.log('token from local storage', token)

    const fetchUserDetails = async () => {
        try {
            console.log("Fetching user details...");
            const response = await axios.post("/api/user-details", {
                token
            }, {
                withCredentials: true
            });

            if (response?.data?.data) {
                dispatch(setUser(response?.data?.data));
                console.log('Fetched user details:', response?.data?.data);

                if (response?.data?.data?.logout) {
                    dispatch(logout());
                    return; // Stop further execution if user is logged out
                }
            }
        } catch (error) {
            console.error("Error fetching user details:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        fetchUserDetails();
    }, []);



    useEffect(() => {
        if (!loading && user?._id) {

            // Socket connection
            // console.log("Setting up socket connection...");

            setLoading(true)

            const socketConnection = io(import.meta.env.VITE_BACKEND_URL, {
                auth: {
                    token: localStorage.getItem('token')
                },
                transports: ["websocket", "polling"]
            });

            console.log("connection", socketConnection)

            socketConnection.on("connect", () => {
                // console.log("Socket connected:", socketConnection?.id);
                setSocketConnected(true);
            });

            socketConnection.on("onlineUser", (data) => {
                console.log('Received online user data from socket:', data);
                dispatch(setOnlineUser(data));
            });

            dispatch(setSocketConnection(socketConnection));

            setLoading(false)
            return () => {
                console.log("Disconnecting socket...");
                socketConnection.disconnect();
            };
        }
    }, [loading, user?._id, socketConnected, dispatch]);


    useEffect(() => {
        if (!loading && !user?._id) {
            console.log('click')
            console.log("User not found, navigating to /email...");
            navigate('/email');
        }
    }, [navigate, !user?._id]);



    const basePath = location.pathname === '/';


    return (
        <div className='w-full grid md:grid-cols-[280px,1fr]'>

            {/* sidebar */}
            <section className={`bg-white min-h-[100vh] ${!basePath && "hidden md:block"}`}>
                <Sidebar></Sidebar>
            </section>

            {/* message */}
            <section className={`${basePath && "hidden"}`}>
                <Outlet></Outlet>
            </section>


            <div className={`items-center justify-center hidden ${!basePath ? "hidden" : "md:flex"}`}>
                <h3 className='text-lg text-slate-500'>Select user to start conversation</h3>
            </div>

        </div>
    );
};

export default Home;