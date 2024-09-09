import React, { useEffect, useState } from 'react';
import { IoArrowBackOutline, IoSearchOutline } from 'react-icons/io5';
import Divider from './Divider';
import Loading from './Loading';
import axios from 'axios';
import SearchCard from './SearchCard';

const SearchFriend = ({ onClose }) => {

    const [searchResult, setSearchResult] = useState([])
    const [loading, setLoading] = useState(false)
    const [searchInput, setSearchInput] = useState()


    const handleSearch = async () => {
        try {
            setLoading(true)
            const response = await axios.post("/api/search-friend", { search: searchInput }, { withCredentials: true })
            setLoading(false)
            // console.log("response", response?.data)
            setSearchResult(response?.data?.data)

        } catch (error) {
            console.log("error", error?.response?.data)
        }
    }

    useEffect(() => {
        handleSearch()
    }, [searchInput])


    console.log("search user", searchResult)


    return (
        <div className='fixed top-0 right-0 bottom-0 left-0 bg-slate-800 z-20'>
            <div className='w-full max-w-lg  mx-auto md:mt-5'>

                <div className='bg-slate-600 rounded-t mt-3 overflow-hidden h-10 flex items-center'>
                    <div onClick={onClose} className='px-2 text-2xl text-slate-200 cursor-pointer'>
                        <IoArrowBackOutline />
                    </div>

                    <input
                        onChange={(e) => setSearchInput(e.target.value)}
                        value={searchInput}
                        type="text"
                        placeholder='Search friend by name, email.....'
                        className='w-full outline-none py-1 h-full px-4 bg-slate-600'
                    />

                    <div className='px-2 text-2xl text-slate-500'>
                        <IoSearchOutline />
                    </div>
                </div>

                <div className='bg-slate-400 p-[0.5px]'></div>

                {/* search Results */}
                <div className='bg-slate-800 p-4'>
                    {
                        searchResult.length === 0 && !loading && (
                            <p className='text-center text-sm text-slate-500'>No results found</p>
                        )
                    }

                    {
                        loading && <Loading />
                    }

                    {
                        searchResult.length !== 0 && !loading && (
                            searchResult.map((result, index) => <SearchCard
                                key={result._id}
                                result={result}
                                onClose={onClose}
                            ></SearchCard>)
                        )
                    }

                </div>

            </div>
        </div>
    );
};

export default SearchFriend;