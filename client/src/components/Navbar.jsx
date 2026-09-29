import React from 'react'
import { assets } from '../assets/assets'
import { useAppContext } from '../context/AppContext';

const Navbar = () => {

    const {
        navigate,
        token,
        user,
        logoutUser
    } = useAppContext();

    return (
        <div className='flex justify-between items-center py-5 mx-8 sm:mx-20 xl:mx-32'>

            {/* Logo */}
            <img
                onClick={() => navigate('/')}
                src={assets.logo}
                alt="logo"
                className='w-32 sm:w-44 cursor-pointer'
            />

            <div className='flex items-center gap-3'>

                {/* Admin logged in */}
                {token ? (

                    <button
                        onClick={() => navigate('/admin')}
                        className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-6 py-2.5'
                    >
                        Dashboard

                        <img
                            src={assets.arrow}
                            alt="arrow"
                            className='w-3'
                        />
                    </button>

                ) : user ? (

                    /* Normal user logged in */
                    <>


        {/* Bookmarks */}
        <button
            onClick={() => navigate('/bookmarks')}
            className='px-5 py-2 rounded-full border border-primary text-primary text-sm cursor-pointer'
        >
            🔖 Bookmarks
        </button>

        <button
            onClick={() => navigate('/profile')}
            className='px-5 py-2 rounded-full border border-gray-300 text-sm cursor-pointer'
        >
            {user.name}
        </button>

        <button
            onClick={logoutUser}
            className='px-5 py-2 rounded-full bg-gray-100 text-sm cursor-pointer'
        >
            Logout
        </button>

    </>

) : (

                    /* Nobody logged in */
                    <button
                        onClick={() => navigate('/login')}
                        className='flex items-center gap-2 rounded-full text-sm cursor-pointer bg-primary text-white px-8 py-2.5'
                    >
                        Login

                        <img
                            src={assets.arrow}
                            alt="arrow"
                            className='w-3'
                        />
                    </button>

                )}

            </div>

        </div>
    )
}

export default Navbar