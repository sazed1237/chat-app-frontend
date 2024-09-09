import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import { BsFillKeyFill } from 'react-icons/bs';
import { MdLock } from 'react-icons/md';
import { IoIosNotifications } from 'react-icons/io';
import { TbHelpTriangleFilled } from 'react-icons/tb';
import { BiSolidEdit } from 'react-icons/bi';
import { Link, NavLink } from 'react-router-dom';
import { logout } from '../redux/userSlice';
import { CiLogout } from 'react-icons/ci';
import { FaArrowLeft, FaLeftRight } from 'react-icons/fa6';

const WonProfile = () => {
    const dispatch = useDispatch()

    const user = useSelector(state => state.user)

    const handleLogout = async () => {
        dispatch(logout())
        navigate('/email')
        localStorage.clear()
    }

    return (
        <div className='w-full'>
            <Link to={'/'} className=' bg-white p-4 border-b border-blue-600 border-opacity-40 text-xl font-bold text-blue-600 flex items-center gap-1'><FaArrowLeft size={16} /> Profile</Link>

            <div className='mt-4 md:w-2/3 mx-auto bg-white py-4'>
                <div className='flex flex-col justify-center items-center'>
                    <Avatar imageUrl={user.profile_pic} name={user.name} width={90} height={90} userId={user?._id}></Avatar>
                    <h3 className='mt-1 font-semibold text-blue-600 text-xl'>{user.name}</h3>
                    <p className='text-gray-600'>{user.email}</p>

                    <Link to={`/edit-profile`}>
                        <p className='my-1 flex items-center gap-1 text-blue-700 text-sm'>
                            <BiSolidEdit />
                            Edit Profile
                        </p>
                    </Link>
                </div>

                <div className='mt-5'>
                    <div className=' py-3 px-4  font-semibold flex text-lg border-y items-center gap-6'>
                        <BsFillKeyFill />
                        <h4 className=''>Account setting</h4>
                    </div>

                    <div className=' py-3 px-4  font-semibold flex text-lg border-b items-center gap-6'>
                        <MdLock />
                        <h4 className=''>Privacy policy</h4>
                    </div>
                    <div className=' py-3 px-4  font-semibold flex text-lg border-b items-center gap-6'>
                        <IoIosNotifications />
                        <h4 className=''>Notification</h4>
                    </div>
                    <div className=' py-3 px-4  font-semibold flex text-lg border-b items-center gap-6'>
                        <TbHelpTriangleFilled />
                        <h4 className=''>Help</h4>
                    </div>
                    <div className=' py-3 px-4  font-semibold flex text-lg border-b items-center gap-6'>
                        <NavLink onClick={handleLogout} className='flex items-center text-red-500 gap-2 p-2 transition-all hover:scale-105'>
                            <CiLogout size={24} />
                            <p className='text-lg'>Log Out</p>
                        </NavLink>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default WonProfile;