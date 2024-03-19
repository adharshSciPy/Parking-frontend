import React from 'react'
import { motion } from "framer-motion";
import hero from '../../assests/hero.png'
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='h-screen md:h-screen min-h-screen bg-red-100 bg-gradient-to-b from-white to-blue-200 py-2 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 xl:text-xl'>
      <div className="hidden mt-0 h-full w-full md:flex flex-col-reverse md:flex-row items-center justify-between">

        {/* hero text */}
        <div className='hidden h-full flex-1 md:flex flex-col items-center md:items-start justify-center'>
          <p className='text-6xl md:text-7xl  text-blue-500 font-semibold hover:text-blue-600'>Reserve Your Spot</p>
          <p className='md:text-4xl text-zinc-700 font-bold mb-16'>Drive Stress-Free</p>
          <p className='text-md hover:text-blue-600'>Navigate Your Parking Destiny Effortlessly, Ensuring Hassle-Free Reservations</p>
          <p className='text-sm font-semibold text-zinc-700'>Secure Spaces Your Peace of Mind, Guaranteed.</p>
        </div>

        {/* hero image */}
        <div className="flex-1 flex flex-col items-center md:items-start justify-center">
          <img src={hero} alt="hero-section" />
        </div>

        <div className="md:hidden w-full flex items-center justify-center mt-24">
          <button className='p-3 rounded-lg bg-blue-400 w-full text-white'>Get Started</button>
        </div>
      </div>

      <div className="md:hidden h-full">

        {/* hero text */}
        <div className="md:hidden text-center flex flex-col h-[30%]">
          <p className='text-6xl text-blue-500 font-semibold'>Reserve</p>
          <p className='text-4xl text-blue-500 font-semibold'>your spot</p>
          <p className='mt-4 text-2xl text-zinc-700 font-bold'>Drive Stress-Free</p>
          <p className='text-md hover:text-blue-600'>Navigate Your Parking Destiny Effortlessly, Ensuring Hassle-Free Reservations</p>
        </div>

        {/* hero image */}
        <div className="flex-1 flex flex-col items-center justify-center h-[30%] overflow-hidden">
          <img src={hero} alt="hero-section" className='h-full w-full' />
        </div>

        <div className="md:hidden w-full flex items-center justify-center mt-24 h-0">
          <button
            onClick={() => navigate('/login')}
            className='p-3 rounded-lg bg-blue-400 w-full text-white text-xl font-bold'>Get Started</button>
        </div>
      </div>
    </motion.div>
  )
}

export default LandingPage