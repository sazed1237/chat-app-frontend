import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from './Avatar';
import uploadFile from '../helpers/UploadFile';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Divider from './Divider';
import { fetchUserDetails } from '../helpers/userDetails';


const EditProfile = () => {
    const user = useSelector(state => state.user)
    const dispatch = useDispatch()
    const [uploadPhoto, setUploadPhoto] = useState(user?.profile_pic)
    const navigate = useNavigate()
    const [errorMessage, setErrorMessage] = useState()


    const handleUploadPhoto = async (event) => {
        const file = event?.target?.files[0]
        // console.log('upload image', file)

        const uploaded = await uploadFile(file)
        setUploadPhoto(uploaded.url)
        // console.log("upload", uploaded.url)
    }

    const cancelEdit = (e) => {
        e.preventDefault()
        navigate('/profile')
    }


    const handleSubmit = async (e) => {
        e.preventDefault()

        const form = e.target
        const name = form.name.value;
        const email = form.email.value
        const profile_pic = uploadPhoto

        const userDetails = { name, email, profile_pic }

        console.log('user edit', userDetails)

        try {
            const response = await axios.post('/api/updated-user', userDetails, { withCredentials: true })
            console.log(response?.data)

            if (response?.data?.success) {
                fetchUserDetails(dispatch)
                navigate('/profile')
            }

        } catch (error) {
            console.log('error', error)
            setErrorMessage(error?.response?.data?.message)
        }

    }

    return (
        <div className='w-full'>
            <h2 className='bg-white p-4 border-b border-blue-600 border-opacity-40 text-xl font-bold text-blue-600 flex items-center'>Profile</h2>


            <div className='mt-4 md:w-2/3 mx-auto bg-white py-4'>
                <form onSubmit={handleSubmit}>
                    <div className='flex flex-col justify-center items-center'>
                        <label htmlFor='profile_pic' className='w-24 flex items-center justify-center relative'>
                            <img src={uploadPhoto} width={90} height={90} className='rounded-full overflow-hidden relative' alt="" />
                            <p className='bg-slate-600 rounded-b-full absolute bottom-0 px-1 z-10 -mt-10 pb-4 bg-opacity-80 text-white cursor-pointer'><small>change photo</small></p>
                        </label>
                        <input
                            type="file"
                            name="profile_pic"
                            id="profile_pic"
                            className='bg-slate-100 p-1.5 rounded hidden'
                            onChange={handleUploadPhoto}
                        />
                    </div>

                    <div className='mt-5 px-4'>
                        <div className='flex flex-col'>
                            <label className='' htmlFor="name">Name</label>
                            <input
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={user?.name}
                                placeholder='Enter your name'
                                className='bg-slate-100 p-1.5 focus:outline-blue-500 rounded'
                                required
                            />
                        </div>
                        <div className='flex flex-col'>
                            <label className='' htmlFor="email">Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                defaultValue={user?.email}
                                placeholder='Enter your email'
                                className='bg-slate-100 p-1.5 focus:outline-blue-500 rounded'
                                required
                            />
                        </div>
                        {
                            errorMessage && <p className='text-red-400'><small>{errorMessage}</small></p>
                        }



                        <Divider></Divider>

                        <div className='gap-3 flex justify-end'>
                            <button onClick={cancelEdit} className='border-2 border-blue-500  hover:bg-blue-500 hover:text-white font-semibold transition-all text-blue-500 rounded  px-4 py-1'>Cancel</button>
                            <button className='bg-blue-500  hover:bg-white hover:text-blue-500 hover:border-blue-500 border font-semibold transition-all text-white rounded outline-none px-4 py-1'>Save</button>

                        </div>
                    </div>
                </form>

            </div>
        </div>
    );
};

export default EditProfile;