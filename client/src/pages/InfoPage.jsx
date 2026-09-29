import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const pageData = {

    "/best-sellers": {
        title: "Best Sellers",
        description: "Explore some of the most popular and interesting articles on ExploreBlog.",
        content: "Discover articles that are getting attention from our readers. Browse our latest and most popular technology and programming content."
    },

    "/offers": {
        title: "Offers & Deals",
        description: "Discover the latest offers and special updates from ExploreBlog.",
        content: "Stay connected with ExploreBlog for upcoming offers, special content and announcements."
    },

    "/contact": {
        title: "Contact Us",
        description: "Have a question or need help? Get in touch with us.",
        content: "For any questions, suggestions or feedback, please contact us through our support email.",
        email: "shubhpatidar953@gmail.com"
    },

    "/faqs": {
        title: "Frequently Asked Questions",
        description: "Find answers to some common questions.",
        content: "Q: How can I subscribe to the newsletter?\n\nA: Enter your email address in the newsletter section and click Subscribe.\n\nQ: Can I bookmark blogs?\n\nA: Yes. Login to your account and use the bookmark option on a blog.\n\nQ: Can I like blogs?\n\nA: Yes. Login to your account and use the like option."
    },

    "/delivery-information": {
        title: "Delivery Information",
        description: "Information about delivery and orders.",
        content: "ExploreBlog is primarily a digital blogging platform. Any future physical product or delivery-related service will include specific delivery information at the time of purchase."
    },

    "/return-refund": {
        title: "Return & Refund Policy",
        description: "Information about returns and refunds.",
        content: "For any future paid products or services, the applicable return and refund terms will be clearly provided before purchase."
    },

    "/payment-methods": {
        title: "Payment Methods",
        description: "Information about available payment methods.",
        content: "Payment methods will be displayed during checkout whenever paid products or services are introduced on ExploreBlog."
    },

    "/track-order": {
        title: "Track Your Order",
        description: "Track your order information.",
        content: "Order tracking information will be available for applicable orders. If you have an order-related question, please contact our support team."
    }
}


const InfoPage = () => {

    const location = useLocation()
    const navigate = useNavigate()

    const data = pageData[location.pathname]

    if (!data) {
        return (
            <div className='min-h-screen flex items-center justify-center'>
                <div className='text-center'>
                    <h1 className='text-3xl font-semibold'>
                        Page Not Found
                    </h1>

                    <button
                        onClick={() => navigate('/')}
                        className='mt-5 px-6 py-2 bg-primary text-white rounded cursor-pointer'
                    >
                        Go Home
                    </button>
                </div>
            </div>
        )
    }


    return (
        <div className='min-h-screen bg-gray-50 px-6 md:px-16 lg:px-24 py-16'>

            <div className='max-w-4xl mx-auto bg-white rounded-xl shadow-sm p-8 md:p-12'>

                <button
                    onClick={() => navigate(-1)}
                    className='text-sm text-primary hover:underline mb-6 cursor-pointer'
                >
                    ← Go Back
                </button>

                <h1 className='text-3xl md:text-4xl font-semibold text-gray-900'>
                    {data.title}
                </h1>

                <p className='mt-3 text-gray-500'>
                    {data.description}
                </p>

                <div className='mt-8 text-gray-600 leading-7 whitespace-pre-line'>
                    {data.content}
                </div>

                {data.email && (
                    <a
                        href={`mailto:${data.email}`}
                        className='inline-block mt-6 px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/80 transition'
                    >
                        Email Support
                    </a>
                )}

            </div>

        </div>
    )
}

export default InfoPage