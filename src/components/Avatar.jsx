import React from 'react';
import { LuUserCircle } from 'react-icons/lu';
import { useSelector } from 'react-redux';

const Avatar = ({ userId, imageUrl, name, width, height }) => {

    const onlineUser = useSelector(state => state?.user?.onlineUser)

    let avatarName = ''

    if (name) {
        const splitName = name?.split(' ')
        // console.log(splitName)

        if (splitName.length > 1) {
            avatarName = splitName[0][0] + splitName[1][0]
        } else {
            avatarName = splitName[0][0]
        }
    }

    const bgColor = [
        'bg-slate-200',
        'bg-red-200',
        'bg-green-200',
        'bg-sky-200',
        'bg-purple-200',
        'bg-blue-200',
        'bg-teal-200',
        'bg-cyan-200',
        'bg-gray-200',
    ]

    const randomNumber = Math.floor(Math.random() * bgColor.length)
    // console.log(randomNumber)


    const isOnline = onlineUser.includes(userId)


    return (
        <div className={`text-slate-800 rounded-full relative`} style={{ width: width + "px", height: height + "px" }}>
            {
                imageUrl ? (
                    <img
                        src={imageUrl}
                        width={width}
                        height={height}
                        alt={name}
                        className='rounded-full overflow-hidden'
                    />
                )
                    :
                    (
                        <div>
                            {
                                name ? (
                                    <div style={{ width: width + "px", height: height + "px" }} className={`rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold shadow border ${bgColor[randomNumber]}`}>
                                        {avatarName}
                                    </div>
                                ) : (
                                    <div style={{ width: width + "px", height: height + "px" }} className='text-7xl flex items-center justify-center font-bold'>
                                        <LuUserCircle className='w-full  h-full flex justify-center items-center' />
                                    </div>

                                )
                            }
                        </div>
                    )
            }

            {
                isOnline && (
                    <div className='bg-green-500 p-1.5 rounded-full absolute bottom-0.5 right-0.5 z-10'></div>
                )
            }



        </div>
    );
};

export default Avatar;