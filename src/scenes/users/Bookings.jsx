import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion'
import { useGetUserBookingsQuery } from '../../slices/api/bookingSlice';
import BookingCard from './BookingCard';
import { useSelector } from 'react-redux';


const Bookings = () => {

  const { userId } = useSelector((state) => state?.auth);
  const { data, isLoading, isSuccess, isError, refetch } = useGetUserBookingsQuery({ userId });
  const [bookings, setBookings] = useState([])

  useEffect(() => {
    setBookings(data?.data)
  }, [data])

  console.log(bookings)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='h-full min-h-screen bg-red-100 bg-gradient-to-b from-white to-blue-200 py-2 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 xl:text-xl'>
      <p className='mt-10 text-stone-600 font-semibold'>Bookings</p>
      {/* <p className="text-stone-600 text-md font-light">You dont have any active bookings to show</p> */}
      {
        bookings?.length === 0 &&
        <>
          <div className="h-[60vh] text-center flex items-center justify-center w-full">
            <p className="text-stone-600 text-md font-light">You don't have active bookings to show</p>
          </div>
        </>

      }

      <div className='h-100 w-100 flex flex-wrap items-center justify-center md:justify-start gap-3'>
        {
          bookings?.map((booking, index) => {
            return (
              <BookingCard booking={booking} key={index} refetch={refetch} />
            )
          })
        }
      </div>
    </motion.div>
  )
}

export default Bookings