import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import Avatar from '../components/Avatar';
import icon from '../assets/chat-app-icon.jpg'


const CheckEmail = () => {
    const navigate = useNavigate()


    const handleSubmit = async (event) => {
        event.preventDefault()
        const form = event.target

        const email = form.email.value;



        try {
            const response = await axios.post(`/api/email`, { email })
            if (response?.data?.success) {
                console.log("response", response?.data?.data)
                const userData = response?.data?.data
                // toast.success(response?.data?.message)

                navigate('/password', { state: userData })
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
            // console.log("res err", error?.response?.data?.message)

        }

    }


    return (
        <div className='w-full h-[100vh] flex items-center justify-center'>
            <div className='bg-white w-full max-w-md rounded overflow-hidden p-6 mx-2'>
                <h1 className='text-3xl md:text-4xl my-2 text-center font-bold text-blue-500'>MessageMe</h1>

                <div className='w-fit mx-auto flex flex-col items-center justify-center my-3'>
                   <img src={icon} className='w-16' alt="" />
                </div>

                <form onSubmit={handleSubmit} className='space-y-2'>

                    <div className='flex flex-col'>
                        <label className='' htmlFor="email">Email*</label>
                        <input
                            type="email"
                            name="email"
                            id="email"
                            placeholder='Enter your email'
                            className='bg-slate-100 p-1.5 focus:outline-blue-500 rounded'
                            required
                        />
                    </div>

                    <div className='pt-5 w-full flex justify-center'>
                        <button className='bg-blue-500 w-full hover:bg-blue-700 font-bold transition-all text-white rounded  outline-none px-4 py-1.5'>Next</button>
                    </div>
                </form>
                <p className='my-3'>Don't have account? <Link to={'/register'} className='text-blue-500 hover:underline font-semibold'>Create account</Link></p>
            </div >
        </div >
    );
};

export default CheckEmail;