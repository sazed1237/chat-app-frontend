import React, { useEffect, useRef, useState } from 'react';
import { BiLogOut } from 'react-icons/bi';
import { BsChatRightDotsFill, BsChatTextFill } from 'react-icons/bs';
import { FaImages, FaUserFriends, FaUserPlus, FaVideo } from 'react-icons/fa';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import Avatar from './Avatar';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { fetchUserDetails } from '../helpers/userDetails';
import { MdContactPage, MdFindReplace } from 'react-icons/md';
import SearchFriend from './SearchFriend';
import Loading from './Loading';
import { logout } from '../redux/userSlice';
import { HiOutlineDotsVertical } from 'react-icons/hi';
import { IoMdSearch } from 'react-icons/io';
import { CiLogout } from 'react-icons/ci';

const Sidebar = () => {

    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const user = useSelector(state => state?.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [recentConversation, setRecentConversation] = useState([])
    const [openSearch, setOpenSearch] = useState(false)
    const [loading, setLoading] = useState(false)
    const [openAttach, setOpenAttach] = useState(false)
    const modalRef = useRef()
    const [isActive, setIsActive] = useState(false);

    console.log("is active", user)


    const handleRecentConversation = async () => {
        if (socketConnection) {
            socketConnection.emit('sidebar', user?._id)
            // console.log('i am here2')

            setLoading(true)

            socketConnection.on('conversation', async (data) => {
                // console.log('conversation', data)

                const conversationUserData = await data.map((conversationUser, index) => {
                    if (conversationUser?.sender?._id === conversationUser?.receiver?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.sender
                        }
                    } else if (conversationUser?.receiver?._id !== user?._id) {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.receiver
                        }
                    } else {
                        return {
                            ...conversationUser,
                            userDetails: conversationUser?.sender
                        }
                    }
                })
                setRecentConversation(conversationUserData)
                setLoading(false)
            })
        }
    }


    useEffect(() => {
        handleRecentConversation()
    }, [socketConnection, user?._id, setRecentConversation])


    // To close the modal when clicking outside of it
    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setOpenAttach(false)
        }
    }

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside)
        document.addEventListener('scroll', handleClickOutside)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
            document.removeEventListener('scroll', handleClickOutside)
        }
    }, [])

    const handleActive = () => {
        setIsActive(true);
        navigate('/')

        if ('/') {
            handleRecentConversation()
            console.log("clicked")
        }
    };


    const handleLogout = async () => {
        dispatch(logout())
        navigate('/email')
        localStorage.clear()
    }
    // console.log(openSearch)


    return (
        <div className='flex h-full w-full '>
            <div className='w-16 bg-blue-400 h-full py-6 text-blue-200 md:flex flex-col justify-between rounded-l-xl hidden'>
                <div>
                    <div className={`w-full h-10 flex items-center justify-center cursor-pointer `} title={user?.name}>
                        <Link to={`profile`} className='-ml-2'>
                            <Avatar name={user.name} imageUrl={user.profile_pic} userId={user?._id} width={38} height={38} ></Avatar>
                        </Link>
                    </div>

                    <div className='mt-20'>


                        <NavLink to={'/'} onClick={handleActive} className={({ isActive }) => `w-20 p-2 text-center cursor-pointer hover:text-white  ${isActive && 'text-white  '}`} title='chats' >
                            <BsChatTextFill size={20} className='w-full' />
                        </NavLink>

                        <NavLink onClick={() => setOpenSearch(true)} className={({ isActive }) => `w-full h-10 flex items-center justify-center cursor-pointer  hover:text-white ${isActive && ''}`} title='add friend'>
                            <FaUserPlus size={20} />
                        </NavLink>

                    </div>
                </div>

                <div>
                    <div className={`w-full h-10 flex items-center justify-center cursor-pointer hover:bg-blue-500 `} title='logout'>
                        <button onClick={handleLogout} className='-ml-2'>
                            <BiLogOut size={25} />
                        </button>
                    </div>
                </div>

            </div>

            {/* list of user */}
            <div className='w-full'>
                <h2 className='p-4 text-xl md:text-2xl font-bold h-16 text-slate-800 hidden md:flex'>Chats</h2>


                <div className={`w-full h-16 flex items-center justify-between bg-blue-100 px-2 md:hidden`} >
                    {/* self */}
                    <div className='flex items-center gap-x-2'>
                        <Link to={`profile`} className=' cursor-pointer ' title={user?.name}>
                            <Avatar name={user.name} imageUrl={user.profile_pic} userId={user?._id} width={38} height={38} ></Avatar>
                        </Link>
                        <div>
                            <h1 className='font-semibold my-0 text-lg text-ellipsis line-clamp-1'>{user?.name}</h1>
                            <p className='-mt-1'>
                                {
                                    user ? <span className='text-green-500'>online</span> : <span className='text-slate-400'>offline</span>
                                }
                            </p>
                        </div>
                    </div>


                    <div className='flex gap-3 text-3xl'>
                        <button onClick={() => setOpenSearch(true)} className={({ isActive }) => `w-full h-10 flex items-center justify-center cursor-pointer hover:bg-blue-500 ${isActive && ''}`} title='Search'>
                            <IoMdSearch />
                        </button>


                        <div className='relative' ref={modalRef}>
                            {/* open attach modal and close  */}

                            <button onClick={() => setOpenAttach(prev => !prev)} className=' hover:text-blue-500 '>
                                <HiOutlineDotsVertical size={30} title='attach' />
                            </button>


                            {/* attach modal items */}
                            {
                                openAttach && (
                                    <div className='bg-white shadow rounded p-2 absolute top-12 w-48 right-0 '>
                                        <NavLink onClick={handleLogout} className='flex items-center gap-2 p-2 hover:bg-slate-200'>
                                            <CiLogout size={24} className='text-red-500' />
                                            <p className='text-lg'>Log Out</p>
                                        </NavLink>
                                    </div>
                                )
                            }

                        </div>
                    </div>
                </div>


                {/* divider */}
                <div className='bg-slate-200 p-[0.5px]'></div>

                <div className='h-[calc(100vh-120px)] overflow-x-hidden overflow-y-auto scrollbar'>

                    {
                        loading && (
                            <div className='mt-4'>
                                <Loading></Loading>
                            </div>
                        )
                    }

                    {
                        recentConversation?.length === 0 ? (
                            <div className='h-full flex flex-col items-center justify-center'>
                                <div className='flex items-center justify-center text-slate-600'>
                                    <MdFindReplace size={50} />
                                </div>
                                <div>
                                    <h3 className='text-slate-400 text-lg text-center'>Find a friend to start conversations</h3>
                                </div>
                            </div>
                        )
                            :
                            (
                                recentConversation.map((recent, index) => {
                                    return (
                                        <NavLink to={'/' + recent?.userDetails?._id} key={index} className='flex items-center gap-3 px-2 py-2 cursor-pointer hover:bg-slate-300 '>
                                            <div>
                                                <Avatar
                                                    imageUrl={recent?.userDetails?.profile_pic}
                                                    name={recent?.userDetails?.name}
                                                    userId={recent?.userDetails?._id}
                                                    height={40}
                                                    width={40}
                                                ></Avatar>
                                            </div>
                                            <div>
                                                <h3 className='text-ellipsis line-clamp-1 font-semibold'>{recent?.userDetails?.name}</h3>
                                                <div className='flex items-center gap-1'>
                                                    <div>
                                                        {
                                                            recent?.lastMsg?.imageUrl && (
                                                                <span className='flex items-center gap-1 text-slate-500'><FaImages /> {!recent?.lastMsg?.text && "Photo"} </span>
                                                            )
                                                        }
                                                        {
                                                            recent?.lastMsg?.videoUrl && (
                                                                <span className='flex items-center gap-1 text-slate-500'><FaVideo /> {!recent?.lastMsg?.text && "Video"} </span>
                                                            )
                                                        }
                                                    </div>
                                                    <p className='text-ellipsis line-clamp-1 text-sm text-slate-500'>{recent?.lastMsg?.text}</p>
                                                </div>

                                            </div>
                                            {
                                                Boolean(recent?.unseenMsg) && (
                                                    <span className='text-xs w-5 h-5 items-center justify-center text-white flex ml-auto p-1 bg-blue-400 rounded-full'>{recent?.unseenMsg}</span>
                                                )
                                            }

                                        </NavLink>
                                    )
                                })
                            )
                    }

                </div>


                <div className='bg-blue-200 md:hidden flex items-center justify-between py-2 px-4'>

                    <NavLink to={'/'} onClick={handleActive} className={({ isActive }) => `w-20 p-2 text-center cursor-pointer hover:text-blue-500 ${isActive && 'text-blue-500'}`} >
                        <BsChatTextFill size={30} className='w-full' />
                        <p className='font-semibold text-lg'>Chats</p>
                    </NavLink>

                    <NavLink to={'/people'} onClick={handleActive} className={({ isActive }) => `w-20 p-2 text-center cursor-pointer hover:text-blue-500 ${isActive && 'text-blue-500'}`} >
                        <FaUserFriends size={30} className='w-full' />
                        <p className='font-semibold text-lg'>People</p>
                    </NavLink>


                </div>
            </div>

            {/* open search */}

            {
                openSearch && (
                    <SearchFriend onClose={() => setOpenSearch(false)}></SearchFriend>
                )
            }

        </div>
    );
};

export default Sidebar;