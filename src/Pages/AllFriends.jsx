import React from 'react';
import { Link } from 'react-router-dom';

const AllFriends = () => {
    return (
        <div>
            <Link className='text-lg p-2 bg-white  text-blue-500 ' to={'/'} >Back</Link>
            <h1 className='text-center font-semibold text-3xl mt-10'>all friends</h1>
        </div>
    );
};

export default AllFriends;