import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import BlogCard from '../components/BlogCard'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Bookmarks = () => {

    const { axios, user, userToken, navigate } = useAppContext()

    const [blogs, setBlogs] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchBookmarks = async () => {
        try {

            if (!userToken) {
                navigate('/login')
                return
            }

            const { data } = await axios.get('/api/blog/bookmarks', {
                headers: {
                    Authorization: userToken
                }
            })

            if (data.success) {
                setBlogs(data.blogs)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchBookmarks()
    }, [userToken])

    return (
        <>
            <Navbar />

            <div className='min-h-[70vh] px-6 sm:px-10 xl:px-32 py-10'>

                <h1 className='text-3xl md:text-4xl font-semibold text-gray-800 text-center mb-3'>
                    My Bookmarks
                </h1>

                <p className='text-center text-gray-500 mb-10'>
                    Blogs you have saved for later
                </p>

                {loading ? (

                    <div className='flex justify-center items-center py-20'>
                        <p className='text-gray-500'>Loading bookmarks...</p>
                    </div>

                ) : blogs.length === 0 ? (

                    <div className='text-center py-20'>
                        <div className='text-6xl mb-4'>🔖</div>

                        <h2 className='text-xl font-medium text-gray-700'>
                            No bookmarked blogs
                        </h2>

                        <p className='text-gray-500 mt-2'>
                            Bookmark blogs you want to read later.
                        </p>

                        <button
                            onClick={() => navigate('/')}
                            className='mt-6 bg-primary text-white px-6 py-2 rounded cursor-pointer hover:bg-primary/90'
                        >
                            Explore Blogs
                        </button>
                    </div>

                ) : (

                    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-8'>
                        {blogs.map((blog) => (
                            <BlogCard
                                key={blog._id}
                                blog={blog}
                            />
                        ))}
                    </div>

                )}

            </div>

            <Footer />
        </>
    )
}

export default Bookmarks