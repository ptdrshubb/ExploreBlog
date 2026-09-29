import React from 'react'
import { footer_data, assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {

    const navigate = useNavigate()

    const handleLinkClick = (link) => {

        const routes = {
            "Home": "/",
            "Best Sellers": "/best-sellers",
            "Offers & Deals": "/offers",
            "Contact Us": "/contact",
            "FAQs": "/faqs",
            "Delivery Information": "/delivery-information",
            "Return & Refund Policy": "/return-refund",
            "Payment Methods": "/payment-methods",
            "Track your Order": "/track-order"
        }

        if (routes[link]) {
            navigate(routes[link])
        }
    }


    const socialLinks = {
        Instagram: "https://www.instagram.com/ptdr_shubb",
        Twitter: "https://twitter.com/ptdr_shubbu",
        Facebook: "https://www.facebook.com/profile.php?id=100081468930677",
        YouTube: "https://www.youtube.com/@shubhpatidar5057"
    }


    return (
        <div className='px-6 md:px-16 lg:px-24 xl:px-32 bg-primary/3'>

            <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30 text-gray-500'>

                {/* Logo and Description */}
                <div>
                    <img
                        src={assets.logo}
                        alt="logo"
                        className='w-32 sm:w-44 cursor-pointer'
                        onClick={() => navigate('/')}
                    />

                    <p className='max-w-[410px] mt-6'>
                        ExploreBlog is a platform where you can discover
                        technology, programming, development and other
                        interesting articles.
                    </p>
                </div>


                {/* Footer Links */}
                <div className='flex flex-wrap justify-between w-full md:w-[55%] gap-8'>

                    {footer_data.map((section, index) => (

                        <div key={index}>

                            <h3 className='font-semibold text-base text-gray-900 md:mb-5 mb-2'>
                                {section.title}
                            </h3>

                            <ul className='text-sm space-y-2'>

                                {section.links.map((link, i) => (

                                    <li key={i}>

                                        {section.title === "Follow Us" ? (

                                            <a
                                                href={socialLinks[link]}
                                                target='_blank'
                                                rel='noopener noreferrer'
                                                className='hover:text-primary hover:underline transition'
                                            >
                                                {link}
                                            </a>

                                        ) : (

                                            <button
                                                type='button'
                                                onClick={() => handleLinkClick(link)}
                                                className='hover:text-primary hover:underline transition text-left cursor-pointer'
                                            >
                                                {link}
                                            </button>

                                        )}

                                    </li>

                                ))}

                            </ul>

                        </div>

                    ))}

                </div>

            </div>


            <p className='py-4 text-center text-sm md:text-base text-gray-500/80'>
                Copyright 2026 © ExploreBlog ptdrshubb - All rights reserved.
            </p>

        </div>
    )
}

export default Footer