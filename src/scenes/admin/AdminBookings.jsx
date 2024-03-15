import React, { useEffect, useState } from 'react'
import { motion } from "framer-motion";
import { GroupButton } from '../../components';
import { useGetAllBookingsQuery } from '../../slices/api/bookingSlice';
import { convertTimestampToTime } from '../../utils/Uihelpers';

const AdminBookings = () => {

  const [page, setPage] = useState(1)
  const { data, isLoading, isSuccess, isError, refetch } = useGetAllBookingsQuery(page);
  const [bookings, setBookings] = useState([])

  const [isNext, setIsNext] = useState(false)
  const [isPrev, setIsPrev] = useState(false)

  useEffect(() => {
    if (data) {
      setBookings(data?.data)
    }
    if (!data?.hasMore) {
      setIsNext(false)
    }
    else {
      setIsNext(true)
    }
  }, [data])

  useEffect(() => {
    if (page === 1) {
      setIsPrev(false)
    }
    else {
      setIsPrev(true)
    }
  }), [page]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='h-full min-h-screen bg-red-100 bg-gradient-to-b from-white to-blue-200 py-2 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 xl:text-xl'>
      <p className='mt-5 text-stone-600'>Total Bookings</p>


      <div className='min-h-[70vh] h-auto w-full mx-auto mt-4'>

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-[90%] overflow-y-scroll">
          <table className="w-full text-sm text-left rtl:text-right text-gray-400">
            <thead className="text-xs text-white-700 uppercase bg-gray-700">
              <tr>
                <th scope="col" className="px-6 py-3">
                  Sl no
                </th>
                <th scope="col" className="px-6 py-3">
                  Customer Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Email
                </th>
                <th scope="col" className="px-6 py-3">
                  Floor
                </th>
                <th scope="col" className="px-6 py-3">
                  Slot
                </th>
                <th scope="col" className="px-6 py-3">
                  Time
                </th>
                <th scope="col" className="px-6 py-3">
                  Date
                </th>
                <th scope="col" className="px-6 py-3">
                  Duration
                </th>
                <th scope="col" className="px-6 py-3">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {
                bookings?.map((booking, index) => {
                  return (
                    <>
                      {
                        isLoading ? 'Loading...' :
                          <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                            <th scope="col" className="px-6 py-3">
                              {index + 1}
                            </th>
                            <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                              {booking?.fullName[0]}
                            </th>
                            <td className="px-6 py-4">
                              {booking?.email[0]}
                            </td>
                            <td className="px-6 py-4">
                              {booking?.floorNumber}
                            </td>
                            <td className="px-6 py-4">
                              {booking?.slotNumber}
                            </td>
                            <td className="px-6 py-4">
                              {convertTimestampToTime(booking?.startTime)} - {convertTimestampToTime(booking?.endTime)}
                            </td>
                            <td className="px-6 py-4">
                              {booking?.date}
                            </td>
                            <td className="px-6 py-4">
                              {booking?.duration}
                            </td>
                            <td className="px-6 py-4 m-1">
                              <GroupButton />
                            </td>
                          </tr>
                      }

                    </>
                  )
                })
              }
            </tbody>
          </table>
        </div>
      </div>

      {/* next button */}
      <div className="h-10 w-full mt-1 flex items-center justify-center">
        <div className="h-full w-auto">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              disabled={!isPrev}
              onClick={() => setPage((prev) => prev - 1)}
              className={`px-4 min-w-[5vw] py-2 text-xs font-medium text-white cursor-pointer rounded-s-lg ${isPrev ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-500 cursor-default'} border-2 border-white-100 border-s-4`}>
              Previous
            </button>
            <button
              disabled={!isNext}
              onClick={() => setPage((prev) => prev + 1)}
              className={`px-4 min-w-[5vw] py-2 text-xs font-medium text-white cursor-pointer  rounded-r-lg ${isNext ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-500 hover:bg-gray-500 cursor-default'} border-2 border-white-100 border-r-4`}>
              {isLoading ? 'Loading...' : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </motion.section>
  )
}

export default AdminBookings