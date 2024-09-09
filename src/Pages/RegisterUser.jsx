import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { Link, useNavigate } from 'react-router-dom';
import uploadFile from '../helpers/UploadFile';
import axios from 'axios';
import { toast } from 'react-toastify';

const RegisterUser = () => {

    const [uploadPhoto, setUploadPhoto] = useState('')
    const navigate = useNavigate()


    const handleUploadPhoto = async (event) => {
        const file = event.target.files[0]

        const uploaded = await uploadFile(file)
        // console.log(uploaded)
        setUploadPhoto(uploaded)
    }

    const handleRemoveUploadPhoto = (e) => {
        e.preventDefault()
        setUploadPhoto(null)
    }

    const handleSubmit = async (event) => {
        event.preventDefault()
        const form = event.target

        const name = form.name.value;
        const email = form.email.value;
        const password = form.password.value;
        const profile_pic = uploadPhoto?.url

        const registerDetails = { name, email, password, profile_pic }
        // console.log(registerDetails)


        try {
            const response = await axios.post(`/api/register`, registerDetails)
            // console.log("response", response)
            if (response?.data?.success) {
                toast.success(response?.data?.message)

                navigate('/email')
            }

        } catch (error) {
            toast.error(error?.response?.data?.message)
            // console.log("res err", error?.response?.data?.message)

        }

    }

    return (
        <div className='w-full h-[100vh] flex items-center justify-center'>
            <div className='bg-white w-full max-w-md rounded overflow-hidden p-6 mx-2'>
                <h1 className='text-xl md:text-2xl my-2 text-center font-bold text-blue-500'>Register Now</h1>

                <form onSubmit={handleSubmit} className='space-y-2'>
                    <div className='flex flex-col'>
                        <label className='' htmlFor="name">Name*</label>
                        <input
                            type="text"
                            name="name"
                            id="name"
                            placeholder='Enter your name'
                            className='bg-slate-100 p-1.5 focus:outline-blue-500 rounded'
                            required
                        />
                    </div>
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
                    <div className='flex flex-col'>
                        <label className='' htmlFor="profile_pic">
                            <p>Profile photo*</p>
                            <div className='bg-slate-100 h-14 rounded flex items-center justify-center hover:outline-blue-500 outline-none cursor-pointer'>
                                <p className='text-sm text-slate-700 max-w-[300px] text-ellipsis line-clamp-1'>
                                    {
                                        uploadPhoto?.original_filename ? (
                                            <div>
                                                {uploadPhoto?.original_filename}
                                                <button onClick={handleRemoveUploadPhoto} className='px-2 text-lg hover:text-red-500 '>
                                                    <IoClose />
                                                </button>
                                            </div>

                                        ) : "Upload profile photo"

                                    }
                                </p>
                            </div>
                            <input
                                type="file"
                                name="profile_pic"
                                id="profile_pic"
                                className='bg-slate-100 p-1.5 rounded hidden'
                                onChange={handleUploadPhoto}
                            />
                        </label>
                    </div>

                    <div className='pt-5 w-full flex justify-center'>
                        <button className='bg-blue-500 w-full hover:bg-blue-700 font-bold transition-all text-white rounded  outline-none px-4 py-1.5'>Register</button>
                    </div>
                </form>
                <p className='my-3'>Already have account? <Link to={'/email'} className='text-blue-500 hover:underline font-semibold'>Login</Link></p>
            </div >
        </div >
    );
};

export default RegisterUser;