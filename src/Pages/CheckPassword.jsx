import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Avatar from '../components/Avatar';
import { useDispatch } from 'react-redux';
import { setToken, setUser } from '../redux/userSlice';


const CheckPassword = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()

    const user = location?.state;

    console.log("user in password", typeof (user?._id))


    useEffect(() => {
        if (!user?._id) {
            navigate('/email')
        }
    }, [])


    const handleSubmit = async (event) => {
        event.preventDefault()
        const form = event.target

        const password = form.password.value;
        const userId = user?._id
        // console.log(typeof(userId))

        try {
            const response = await axios.post(`/api/password`, { userId, password }, { withCredentials: true })
            console.log("response in password", response)

            if (response?.data?.success) {
                // set data in redux
                dispatch(setToken(response?.data?.token))
                localStorage.setItem("token", response?.data?.token)

                console.log("response in password", response)
                toast.success(response?.data?.message)
                navigate('/')
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
            // console.log("res err", error?.response?.data?.message)

        }

    }

    return (
        <div className='w-full h-[100vh] flex items-center justify-center'>
            <div className='bg-white w-full max-w-md rounded overflow-hidden p-6 mx-2'>
                {/* <h1 className='text-xl md:text-2xl my-2 text-center font-bold text-blue-500'>Welcome back!!</h1> */}

                <div className='w-fit mx-auto flex flex-col items-center justify-center my-3'>
                    <Avatar
                        name={user?.name}
                        imageUrl={user?.profile_pic}
                        height={70}
                        width={70}
                    />
                    <h3 className='text-xl font-semibold mt-1  ' >{user?.name}</h3>
                </div>




                <form onSubmit={handleSubmit} className='space-y-2'>

                    <div className='flex flex-col'>
                        <label className='' htmlFor="password">Password*</label>
                        <input
                            type="password"
                            name="password"
                            id="password"
                            placeholder='Enter your password'
                            className='bg-slate-100 p-1.5 focus:outline-blue-500 rounded'
                            required
                        />
                    </div>

                    <div className='pt-5 w-full flex justify-center'>
                        <button className='bg-blue-500 w-full hover:bg-blue-700 font-bold transition-all text-white rounded  outline-none px-4 py-1.5'>Login</button>
                    </div>
                </form>
                <p className='my-3'><Link to={'/forgot-password'} className='text-blue-500 hover:underline font-semibold'>Forgot Password</Link></p>
            </div >
        </div >
    );
};

export default CheckPassword;