import React from 'react';
import Avatar from './Avatar';
import { Link } from 'react-router-dom';

const SearchCard = ({ result, onClose }) => {
    return (
        <div className='md:space-y-2'>
            <Link to={`/${result?._id}`} onClick={onClose} className='flex items-center border border-transparent border-b-slate-700 p-2 gap-4 hover:bg-slate-600 cursor-pointer' >
                <Avatar
                    width={50}
                    height={50}
                    name={result?.name}
                    imageUrl={result?.profile_pic}
                    userId={result?._id}
                ></Avatar>

                <div className=''>
                    <h3 className='font-semibold text-lg text-slate-300 text-ellipsis line-clamp-1'>{result?.name}</h3>
                    <p className='text-sm text-slate-500 text-ellipsis line-clamp-1'>{result?.email}</p>
                </div>
            </Link>
        </div>
    );
};

export default SearchCard;