import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { assets, blog_data, comments_data } from '../assets/assets'
import Navbar from '../components/Navbar'
import Moment from 'moment'
import Footer from '../components/Footer'
import Loader from '../components/Loader'
import { useAppContext } from '../context/AppContext'
import toast from 'react-hot-toast'

const Blog = () => {

  const { id } = useParams();

  const {
    axios,
    navigate,
    user,
    userToken
  } = useAppContext()

  const [data, setData] = useState(null)
  const [comments, setComments] = useState([])
  const [name, setName] = useState('')
  const [content, setContent] = useState('')
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(0)
  const [bookmarked, setBookmarked] = useState(false)

  const fetchBlogData = async () => {
    try {
      const { data } = await axios.get(`/api/blog/${id}`)

      if (data.success) {
        setData(data.blog)

        setLikesCount(data.blog.likes?.length || 0)

        if (user) {
          const userId = user.id || user._id

          setLiked(
            data.blog.likes?.some(
              (likeId) => likeId.toString() === userId.toString()
            ) || false
          )

          setBookmarked(
            data.blog.bookmarks?.some(
              (bookmarkId) =>
                bookmarkId.toString() === userId.toString()
            ) || false
          )
        }
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleLike = async () => {

    if (!user) {
      toast.error("Please login to like this blog")
      navigate("/login")
      return
    }

    try {

      const { data } = await axios.post(
        `/api/blog/${id}/like`,
        {},
        {
          headers: {
            Authorization: userToken
          }
        }
      )

      if (data.success) {
        setLiked(data.liked)
        setLikesCount(data.likesCount)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to like blog"
      )
    }
  }

  const handleBookmark = async () => {

    if (!user) {
      toast.error("Please login to bookmark this blog")
      navigate("/login")
      return
    }

    try {

      const { data } = await axios.post(
        `/api/blog/${id}/bookmark`,
        {},
        {
          headers: {
            Authorization: userToken
          }
        }
      )

      if (data.success) {
        setBookmarked(data.bookmarked)
        toast.success(data.message)
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        "Failed to bookmark blog"
      )
    }
  }

  const fetchComments = async () => {
    try {
      const { data } = await axios.post('/api/blog/comments', { blogId: id })
      if (data.success) {
        setComments(data.comments)
      } else {
        toast.error(data.message);
      }
    }
    catch (error) {
      toast.error(error.message);

    }
  }

  const addComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post('/api/blog/add-comment', { blog: id, name, content })
      if (data.success) {
        toast.success(data.message)
        setName('')
        setContent('')
      }
      else {
        toast.error(data.message)
      }
    }
    catch (error) {
      toast.error(error.message)

    }
  }

  useEffect(() => {
    fetchBlogData()
    fetchComments()
  }, [id, user])

  return data ? (
    <div className='relative'>
      <img src={assets.gradientBackground} alt="" className='absolute -top-50 -z-1 opacity-50' />

      <Navbar />

      <div className='text-center mt-20 text-gray-600'>
        <p className='text-primary py-4 font-medium'>Published on {Moment(data.createdAt).format('MMMM Do YYYY')}</p>
        <h1 className='text-2xl sm:text-5xl font-semibold max-w-2xl mx-auto text-gray-800'>{data.title}</h1>
        <h2 className='my-5 max-w-lg truncate mx-auto'>{data.subTitle}</h2>
        <p className='inline-block py-1 px-4 rounded-full mb-6 border text-sm border-primary/35 bg-primary/5 font-medium text-primary'>Sam</p>
      </div>

      <div className='mx-5 max-w-5xl md:mx-auto my-10 mt-6'>
        <img src={data.image} alt="" className='rounded-3xl mb-5 ' />
        <div className='rich-text max-w-3xl mx-auto' dangerouslySetInnerHTML={{ __html: data.description }}></div>

        {/* Like & Bookmark Section */}
        <div className="max-w-3xl mx-auto flex items-center justify-between mt-8 mb-10">

          <div className="flex items-center gap-4">

            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all cursor-pointer ${liked
                  ? "bg-red-50 border-red-300 text-red-500"
                  : "border-gray-300 text-gray-600 hover:border-red-300 hover:text-red-500"
                }`}
            >
              <span className="text-xl">
                {liked ? "❤️" : "🤍"}
              </span>

              <span>
                {likesCount} {likesCount === 1 ? "Like" : "Likes"}
              </span>
            </button>

          </div>


          <button
            onClick={handleBookmark}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-full border transition-all cursor-pointer ${bookmarked
                ? "bg-yellow-50 border-yellow-300 text-yellow-600"
                : "border-gray-300 text-gray-600 hover:border-yellow-300 hover:text-yellow-600"
              }`}
          >

            <span className="text-xl">
              {bookmarked ? "🔖" : "📑"}
            </span>

            <span>
              {bookmarked ? "Bookmarked" : "Bookmark"}
            </span>

          </button>

        </div>

        {/* {Comments Section} */}
        <div className='mt-14 mb-10 max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Comments ({comments.length})</p>
          <div className='flex flex-col gap-4'>
            {comments.map((item, index) => (
              <div key={index} className='relative bg-primary/2 border border-primary/5 max-w-xl p-4 rounded text-gray-600'>
                <div className='flex items-center gap-2 mb-2'>
                  <img src={assets.user_icon} alt="" className='w-6' />
                  <p className='font-medium'>{item.name}</p>
                </div>
                <p className='text-sm max-w-md ml-8'>{item.content}</p>
                <div className='absolute right-4 bottom-3 flex items-center gap-2 text-xs'>{Moment(item.createdAt).fromNow()}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Add Comment Section  */}
        <div className='max-w-3xl mx-auto'>
          <p className='font-semibold mb-4'>Add your comment</p>
          <form onSubmit={addComment} className='flex flex-col items-start gap-4 max-w-lg'>

            <input onChange={(e) => setName(e.target.value)} value={name} type="text" placeholder='Name' required className='w-full p-2 border border-gray-300 rounded  outline-none' />

            <textarea onChange={(e) => setContent(e.target.value)} value={content} placeholder='Write your comment here...' required className='w-full p-2 border border-gray-300 rounded outline-none h-48'></textarea>

            <button type='submit' className='bg-primary text-white rounded p-2 px-8 hover:scale-102 transition-all cursor-pointer'>Submit</button>

          </form>
        </div>

        {/* Share Button */}
        <div className='my-24 max-w-3xl mx-auto'>
          <p className='font-semibold my-4'>Share this article on social media</p>
          <div className='flex gap-2'>

            {/* Facebook */}
            <a
              href={`https://www.facebook.com/${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.facebook_icon}
                width={50}
                alt="Share on Facebook"
                className="cursor-pointer hover:scale-105 transition-all"
              />
            </a>

            {/* Twitter */}
            <a
              href={`https://twitter.com/${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.twitter_icon}
                width={50}
                alt="Share on Twitter"
                className="cursor-pointer hover:scale-105 transition-all"
              />
            </a>

            {/* Google+ */}
            <a
              href={`https://mail.google.com/mail/u/0/#inbox${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={assets.googleplus_icon}
                width={50}
                alt="Share"
                className="cursor-pointer hover:scale-105 transition-all"
              />
            </a>

          </div>
        </div>

      </div>
      <Footer />
    </div>
  ) : <Loader />
}

export default Blog
