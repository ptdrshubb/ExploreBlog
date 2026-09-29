import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useAppContext } from '../context/AppContext'

const Newsletter = () => {

    const { axios } = useAppContext()

    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    const onSubmitHandler = async (e) => {
        e.preventDefault()

        if (!email.trim()) {
            toast.error('Please enter your email')
            return
        }

        try {

            setLoading(true)

            const { data } = await axios.post(
                '/api/subscriber/subscribe',
                { email }
            )

            if (data.success) {
                toast.success(data.message)
                setEmail('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Something went wrong. Please try again.'
            )

        } finally {
            setLoading(false)
        }
    }

    return (
        <div className='flex flex-col items-center justify-center text-center space-y-2 my-32'>

            <h1 className='md:text-4xl text-2xl font-semibold'>
                Never Miss a Blog!
            </h1>

            <p className='md:text-lg text-gray-500/70 pb-8'>
                Subscribe to get the latest blog, new tech, and exclusive news.
            </p>

            <form
                onSubmit={onSubmitHandler}
                className='flex items-center justify-between max-w-2xl w-full md:h-13 h-12'
            >

                <input
                    className='border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500'
                    type='email'
                    placeholder='Enter your email id'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <button
                    type='submit'
                    disabled={loading}
                    className='md:px-12 px-8 h-full text-white bg-primary/80 hover:bg-primary transition-all cursor-pointer rounded-md rounded-1-none disabled:opacity-60'
                >
                    {loading ? 'Subscribing...' : 'Subscribe'}
                </button>

            </form>

        </div>
    )
}

export default Newsletter