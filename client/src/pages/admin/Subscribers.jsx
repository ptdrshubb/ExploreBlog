import React, { useEffect, useState } from 'react'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const Subscribers = () => {

    const { axios } = useAppContext()

    const [subscribers, setSubscribers] = useState([])
    const [loading, setLoading] = useState(true)

    const fetchSubscribers = async () => {
        try {

            setLoading(true)

            const { data } = await axios.get('/api/subscriber/all')

            if (data.success) {
                setSubscribers(data.subscribers)
            } else {
                toast.error(data.message)
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                error.message ||
                'Failed to load subscribers'
            )

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchSubscribers()
    }, [])

    return (
        <div className='flex-1 pt-5 px-5 sm:pt-12 sm:pl-16 bg-blue-50/50 min-h-screen'>

            <div className='max-w-5xl'>

                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6'>

                    <div>
                        <h1 className='text-2xl font-semibold text-gray-800'>
                            Newsletter Subscribers
                        </h1>

                        <p className='text-sm text-gray-500 mt-1'>
                            People who subscribed to your newsletter
                        </p>
                    </div>

                    <div className='bg-white px-5 py-3 rounded-lg shadow-sm'>
                        <p className='text-xs text-gray-500'>
                            Total Subscribers
                        </p>

                        <p className='text-2xl font-semibold text-primary'>
                            {subscribers.length}
                        </p>
                    </div>

                </div>


                <div className='bg-white shadow rounded-lg overflow-hidden'>

                    {loading ? (

                        <div className='flex items-center justify-center py-20'>
                            <p className='text-gray-500'>
                                Loading subscribers...
                            </p>
                        </div>

                    ) : subscribers.length === 0 ? (

                        <div className='flex items-center justify-center py-20'>
                            <p className='text-gray-500'>
                                No subscribers yet.
                            </p>
                        </div>

                    ) : (

                        <div className='overflow-x-auto'>

                            <table className='w-full text-sm text-gray-600'>

                                <thead className='text-xs text-gray-700 uppercase bg-gray-50 border-b'>

                                    <tr>

                                        <th className='px-6 py-4 text-left'>
                                            #
                                        </th>

                                        <th className='px-6 py-4 text-left'>
                                            Email
                                        </th>

                                        <th className='px-6 py-4 text-left'>
                                            Subscribed Date
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {subscribers.map((subscriber, index) => (

                                        <tr
                                            key={subscriber._id}
                                            className='border-b hover:bg-gray-50 transition'
                                        >

                                            <td className='px-6 py-4'>
                                                {index + 1}
                                            </td>

                                            <td className='px-6 py-4 font-medium text-gray-800'>
                                                {subscriber.email}
                                            </td>

                                            <td className='px-6 py-4'>
                                                {new Date(
                                                    subscriber.createdAt
                                                ).toLocaleDateString('en-IN', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    year: 'numeric'
                                                })}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

                        </div>

                    )}

                </div>

            </div>

        </div>
    )
}

export default Subscribers