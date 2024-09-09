import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import Avatar from './Avatar';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { IoMdArrowBack, IoMdAttach, IoMdSend } from 'react-icons/io';
import { MdContactPage, MdOutlineCall, MdOutlineEmojiEmotions, MdOutlineVideocam } from 'react-icons/md';
import { FaImages, FaPlus, FaRegImages } from 'react-icons/fa';
import { FiPlus } from 'react-icons/fi';
import { IoCamera, IoClose, IoDocumentTextSharp } from 'react-icons/io5';
import uploadFile from '../helpers/UploadFile';
import Loading from './Loading';
import wellPaperDesktop from '../assets/wellpepar.png'
import wellPaperMobile from '../assets/wellpaperMobile.jpg'
import moment from 'moment';


const MessagePage = () => {

    const params = useParams()
    const socketConnection = useSelector(state => state?.user?.socketConnection)
    const user = useSelector(state => state?.user)
    const [userData, setUserData] = useState({})
    const [openAttach, setOpenAttach] = useState(false)
    const [textMessage, setTextMessage] = useState([])
    const [uploadMedia, setUploadMedia] = useState('')
    const [videoUrl, setVideoUrl] = useState('')
    const [imageUrl, setImageUrl] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [allMessage, setAllMessage] = useState([])
    const currentMessage = useRef(null)


    useEffect(() => {
        if (currentMessage.current) {
            currentMessage.current.scrollIntoView({ behavior: "smooth", block: "end" })
        }
    }, [allMessage])


    useEffect(() => {
        if (socketConnection) {
            socketConnection.emit("message-page", params?.userId)

            socketConnection.emit('seen', params?.userId)

            socketConnection.on('message-user', (data) => {
                // console.log("user details", data)
                setUserData(data)
            })

            socketConnection.on('message', (data) => {
                // console.log(' message data', data)
                setAllMessage(data)
            })
        }
    }, [socketConnection, params?.userId, user])

    // console.log("massage page user", userData)


    // upload photo and video
    const handlePhotoAndVideoUpload = async (event) => {
        const file = event.target.files[0]

        setLoading(true)
        const uploaded = await uploadFile(file)
        setLoading(false)
        console.log('media uploaded', uploaded)


        if (uploaded?.error) {
            // console.log('error', uploaded?.error?.message)
            setError(uploaded?.error?.message)
        }


        if (uploaded?.format === "mp4") {
            setVideoUrl(uploaded?.url)
        } else {
            setImageUrl(uploaded?.url)
        }

        setUploadMedia(uploaded)
        setOpenAttach(false) // after upload media attach will close
    }

    // console.log('image url', imageUrl)
    // console.log('video url', videoUrl)

    const handleSubmit = (event) => {
        event.preventDefault()


        if (textMessage || imageUrl || videoUrl) {
            if (socketConnection) {
                socketConnection.emit('new message', {
                    sender: user?._id,
                    receiver: params?.userId,
                    msgByUserId: user?._id,
                    text: textMessage,
                    imageUrl: imageUrl,
                    videoUrl: videoUrl
                })
            }
            setTextMessage('')
            setImageUrl('')
            setVideoUrl('')
            setUploadMedia('')
        }

    }

    return (
        <div>
            <header className='sticky top-0 h-16 bg-white flex justify-between items-center px-4'>
                <div className='flex items-center h-full '>

                    <Link to={'/'} className='text-3xl md:hidden'>
                        <IoMdArrowBack />
                    </Link>

                    <Link to={'/profile'} className='pr-3'>
                        <Avatar
                            width={50}
                            height={50}
                            imageUrl={userData?.profile_pic}
                            name={userData?.name}
                            userId={userData?._id}
                        ></Avatar>
                    </Link>

                    <div className=''>
                        <h1 className='font-semibold my-0 text-lg text-ellipsis line-clamp-1'>{userData?.name}</h1>
                        <p className='-mt-1'>
                            {
                                userData?.online ? <span className='text-green-500'>online</span> : <span className='text-slate-400'>offline</span>
                            }
                        </p>
                    </div>
                </div>

                <div className='space-x-2 text-2xl'>
                    <button className='hover:text-blue-500'><MdOutlineVideocam /></button>
                    <button className='hover:text-blue-500'><MdOutlineCall /> </button>
                    <button className='hover:text-blue-500'><BsThreeDotsVertical /></button>
                </div>
            </header>

            {/* all conversation */}
            <section style={{ background: `url(${wellPaperDesktop})`, backgroundSize: 'contain' }} className='h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative'>


                {/* all conversation show here */}
                <div ref={currentMessage} className='flex flex-col space-y-1 my-2'>
                    {
                        allMessage.map((msg, index) => (
                            <div key={index} className={`w-fit rounded mx-2  ${user._id === msg.msgByUserId ? "ml-auto bg-blue-500 text-white" : "bg-slate-500 text-white"}`}>
                                <div className='w-full max-w-[280px]'>
                                    {
                                        msg?.imageUrl && (
                                            <img
                                                src={msg?.imageUrl}
                                                alt=""
                                                className='w-full h-full object-scale-down'
                                            />

                                        )
                                    }
                                    {
                                        msg?.videoUrl && (
                                            <video
                                                src={msg?.videoUrl}
                                                controls
                                                className=''
                                            />
                                        )
                                    }
                                </div>
                                <div className='px-2 py-1 -space-y-1 '>
                                    <p className='' >{msg?.text}</p>
                                    <p className='text-right text-xs'><small>{moment(msg.createdAt).format('hh:mm a')}</small></p>
                                </div>
                            </div>
                        ))
                    }
                </div>



                {/* upload media */}
                {
                    uploadMedia && (

                        uploadMedia?.format === "mp4" ? (
                            <div className='w-full h-full sticky bottom-0 bg-slate-600 bg-opacity-30 flex justify-center items-center overflow-hidden'>

                                {/* close media */}
                                <div className='w-fit absolute top-0 right-0 p-2'>
                                    <button onClick={() => setUploadMedia(prev => !prev)} ><IoClose size={30} /> </button>
                                </div>

                                <div className='bg-white  rounded'>
                                    <video
                                        src={uploadMedia?.url}
                                        alt={uploadMedia?.name}
                                        className='aspect-video w-full h-full max-w-sm object-scale-down'
                                        controls
                                        autoPlay
                                        muted
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className='w-full h-full sticky bottom-0 bg-slate-600 bg-opacity-30 flex justify-center items-center overflow-hidden'>

                                {/* close media */}
                                <div className='w-fit absolute top-0 right-0 p-2'>
                                    <button onClick={() => setUploadMedia(prev => !prev)} ><IoClose size={30} /> </button>
                                </div>

                                {
                                    error && <p>{error}</p>
                                }


                                <div className='bg-white rounded'>
                                    <img
                                        src={uploadMedia?.url}
                                        alt={uploadMedia?.name}
                                        className='aspect-square w-full h-full max-w-sm object-scale-down'
                                    />

                                </div>
                            </div>
                        )
                    )
                }

                {
                    loading && (
                        <div className='w-full h-full flex items-center justify-center'>
                            <Loading></Loading>
                        </div>
                    )
                }

            </section>



            {/* sent message */}
            <section className='h-16 bg-white flex items-center px-4'>

                <div className='text-slate-600 hover:text-yellow-500 cursor-pointer'>
                    <MdOutlineEmojiEmotions size={30} />
                </div>

                <div className='relative'>
                    {/* open attach modal and close  */}
                    {
                        openAttach ? (
                            <button onClick={() => setOpenAttach(prev => !prev)} className='flex items-center justify-center h-12 w-12 hover:text-red-400 '>
                                <IoClose size={30} title='attach' />
                            </button>
                        ) : (
                            <button onClick={() => setOpenAttach(prev => !prev)} className='flex items-center justify-center h-12 w-12 text-slate-600  hover:text-blue-500 '>
                                <FiPlus size={30} title='attach' />
                            </button>
                        )
                    }

                    {/* attach modal items */}
                    {
                        openAttach && (
                            <div className='bg-white shadow rounded p-2 absolute bottom-14 w-48'>
                                <form>
                                    <label htmlFor='document' >
                                        <div className='flex items-center gap-2 p-2 hover:bg-slate-200'>
                                            <IoDocumentTextSharp size={24} className='text-purple-400' />
                                            <p className='text-lg'>Document</p>
                                        </div>
                                    </label>

                                    <label htmlFor='photosVideo'>
                                        <div className='flex items-center gap-2 p-2 hover:bg-slate-200'>
                                            <FaImages size={24} className='text-blue-600' />
                                            <p>Photos & videos</p>
                                        </div>
                                    </label>

                                    <label htmlFor='camera'>
                                        <div className='flex items-center gap-2 p-2 hover:bg-slate-200'>
                                            <IoCamera size={24} className='text-rose-500' />
                                            <p>Camera</p>
                                        </div>
                                    </label>

                                    <label htmlFor='contact'>
                                        <div className='flex items-center gap-2 p-2 hover:bg-slate-200'>
                                            <MdContactPage size={24} className='text-blue-400' />
                                            <p>Contact</p>
                                        </div>
                                    </label>

                                    <input
                                        type="file"
                                        id='photosVideo'
                                        onChange={handlePhotoAndVideoUpload}
                                        className='hidden'
                                    />
                                </form>
                            </div>
                        )
                    }
                </div>

                {/* type message */}
                <form onSubmit={handleSubmit} className='w-full flex items-center gap-4'>
                    <input
                        type="text"
                        value={textMessage}
                        onChange={(e) => setTextMessage(e.target.value)}
                        placeholder='Type a Message'
                        className='py-2 px-4 outline-none w-full h-full bg-slate-200 rounded '
                    />
                    <div className='text-slate-600 hover:text-blue-600'>
                        <button>
                            <IoMdSend size={30} />
                        </button>
                    </div>
                </form>

            </section>
        </div>
    );
};

export default MessagePage;