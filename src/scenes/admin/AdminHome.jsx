import React, { useState, useEffect } from 'react'
import { motion } from "framer-motion";
import { useCreateFloorAndSlotMutation, useGetFloorDesignQuery, useUpdateFloorAndSlotMutation } from '../../slices/api/floorApiSlice';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const navigate = useNavigate()

  const [createFloorAndSlot, { isLoading: isSaveLoading }] = useCreateFloorAndSlotMutation()
  const [updateFloorAndSlot, { isLoading: isUpdateLoading }] = useUpdateFloorAndSlotMutation()

  const [floor, setFloor] = useState([])
  const [cacheFloor, setCacheFloor] = useState([])
  const [isSaveBtnDisabled, setIsSaveBtnDisabled] = useState(false)
  const [isUpdateBtnDisabled, setIsUpdateBtnDisabled] = useState(false)

  // getting park info if already park area created
  const { data, refetch } = useGetFloorDesignQuery()

  useEffect(() => {
    if (data?.data?.length > 0) {
      setFloor(data?.data)
      setCacheFloor(data?.data)
      setIsSaveBtnDisabled(false)
    }
    else {
      setIsSaveBtnDisabled(false)
    }
  }, [data])

  // is update worthy
  useEffect(() => {
    if (data?.data?.length > 0 && floor?.length > 0) {
      if (data?.data !== floor) {
        setIsUpdateBtnDisabled(true)
      }
      else {
        setIsUpdateBtnDisabled(false)
      }
    }
  }, [data, floor])

  // visiblity of save cancel buttons
  useEffect(() => {
    if (data?.data?.length === 0 && floor?.length > 0) {
      if (floor?.length > 0 && cacheFloor?.length === 0) {
        setIsSaveBtnDisabled(true)
      }
      else {
        setIsSaveBtnDisabled(false)
        setIsUpdateBtnDisabled(true)
        setIsUpdateBtnDisabled(true)
      }
    }
  }, [data, floor])

  const AddFloor = (floorNumber) => {
    setFloor((prevFloors) => [
      ...prevFloors,
      { floorNumber: floorNumber !== undefined ? floorNumber : null, slots: [] }
    ]);
  };

  const RemoveFloor = (index) => {
    setFloor((prevFloor) => {
      let updatedFloor = prevFloor?.filter((_, i) => i !== index)
      return updatedFloor;
    })
  }

  const AddSlot = (floorNumber) => {
    setFloor((prevFloors) => {
      const updatedFloors = prevFloors.map((floor) => {
        if (floor.floorNumber === floorNumber) {
          const newSlotNo = floor?.slots?.length + 1;
          return {
            ...floor,
            slots: [...floor.slots, { slotNumber: newSlotNo }]
          };
        }
        return floor;
      });
      return updatedFloors;
    });
  };

  const RemoveSlot = (floorNumber, slotNumber) => {
    setFloor((prevFloors) => {
      const updatedFloors = prevFloors.map((floor) => {
        if (floor?.floorNumber === floorNumber) {
          const updatedSlots = floor?.slots?.filter((slot) => slot?.slotNumber !== slotNumber);
          return {
            ...floor,
            slots: updatedSlots
          };
        }
        return floor;
      });
      return updatedFloors;
    });
  };

  const cancel = () => {
    setFloor([])
    setIsSaveBtnDisabled(false)
    setIsUpdateBtnDisabled(false)
  }

  const onUpdateCancel = () => {
    setFloor(cacheFloor)
    setIsUpdateBtnDisabled(false)
    setIsSaveBtnDisabled(false)
  }

  const save = async () => {
    if (floor.length > 0) {
      try {
        const res = await createFloorAndSlot({ floorArray: floor }).unwrap()
        if (res.error) {
          toast.error('An error occurred while saving.');
        }
        if (res) {
          toast.success('Saved Succesfull');
          setIsSaveBtnDisabled(false)
          setCacheFloor(floor)
          refetch()
        }
      } catch (error) {
        toast.error('An error occurred while saving.');
      }
    } else {
      toast.warning('Please create at least one floor to save');
    }
  };

  const update = async () => {
    if (floor.length > 0) {
      try {
        const res = await updateFloorAndSlot({ floorArray: floor }).unwrap()
        if (res.error) {
          toast.error('An error occurred while updating.');
        }
        if (res) {
          toast.success('Updated Succesfull');
          refetch()
          setIsSaveBtnDisabled(false)
          setIsUpdateBtnDisabled(false)
          setCacheFloor(floor)
        }
      } catch (error) {
        toast.error('An error occurred while updating.');
      }
    } else {
      toast.warning('Please create at least one floor to save');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className='h-full min-h-screen bg-red-100 bg-gradient-to-b from-white to-blue-200 py-2 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 xl:text-xl'>
      <p className='mt-5 text-stone-600 mb-5 font-extralight text-md'>Analytics</p>

      {/* admin header section */}
      <div className="flex items-center justify-between gap-2 mb-10">
        <div
          onClick={() => navigate('/admin/users')}
          className="h-20 w-[30%] bg-blue-200 rounded-xl p-3 cursor-pointer hover:bg-blue-100 flex items-center justify-between gap-2 overflow-hidden">
          <p className='text-sm font-semibold text-zinc-500'>USERS</p>
          <i className="fa-solid fa-users text-zinc-400 text-8xl"></i>
        </div>
        <div
          onClick={() => navigate('/admin/bookings')}
          className="h-20 w-[30%] bg-blue-200 rounded-xl p-3 cursor-pointer hover:bg-blue-100 flex items-center justify-between gap-2 overflow-hidden">
          <p className='text-sm font-semibold text-zinc-500'>BOOKINGS</p>
          <i className="fa-solid fa-book text-zinc-400 text-8xl"></i>
        </div>
        <div  
          onClick={() => navigate('/admin/home')}
          className="h-20 w-[30%] bg-blue-200 rounded-xl p-3 cursor-pointer hover:bg-blue-100 flex items-center justify-between gap-2 overflow-hidden">
          <p className='text-sm font-semibold text-zinc-500'>FREE SLOTS</p>
          <i className="fa-solid fa-car text-zinc-400 text-8xl"></i>
        </div>
      </div>

      {/* admin slot manager */}
      <div className="flex items-center justify-start gap-10">
        <p className='text-xl font-semibold text-zinc-400 hover:text-zinc-300'>Manage Slots</p>
        <button
          onClick={() => AddFloor(floor?.length + 1)}
          className='bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-xs rounded-md px-2 py-1 flex items-center justify-center'>Add Floor</button>
      </div>


      {
        floor && floor?.map((item, index) => {
          return (
            <>
              <div key={index} className="relative min-h-48 h-auto max-h-44 mt-6 border rounded-lg hover:shadow-md hover:bg-blue-100 transition duration-100 ease-in delay-200">
                <div className="overflow-hidden h-48">
                  <div className="sticky top-0 bg-blue left-0 right-0 z-10">
                    <div className="flex items-center justify-between gap-2 p-2">
                      <div className="flex items-center gap-2">
                        <span className="inline-block bg-blue-300 px-2 py-1 text-xs font-medium text-blue-600 rounded-t-lg">Floor no {item?.floorNumber}</span>
                        <button onClick={() => AddSlot(item?.floorNumber)} className="bg-blue-800 hover:bg-blue-600 active:bg-blue-700 text-white text-xs rounded-md px-3 py-1 flex items-center justify-center">Add Slot</button>
                      </div>
                      {
                        (floor?.length === index + 1) &&
                        <button onClick={() => RemoveFloor(index)}><i className="fa-regular fa-circle-xmark text-zinc-400 hover:text-blue-500"></i></button>
                      }
                    </div>
                  </div>
                  <div className="overflow-y-scroll h-full p-2">
                    <div className='mt-2 flex items-center justify-center md:justify-start flex-wrap gap-2 pb-16'>
                      {item?.slots?.map((slot, index) => (
                        <div key={index} className={`h-20 w-40 rounded-md ${slot?.userId ? 'bg-red-200' : 'bg-green-200'} relative`}>
                          <div className="flex items-center justify-between gap-1 px-1">
                            <p className='text-sm mx-2 mt-1 font-semibold text-zinc-500'> Slot no {slot?.slotNumber}</p>
                            {
                              (item?.slots?.length === index + 1) &&
                              <button onClick={() => RemoveSlot(item?.floorNumber, slot?.slotNumber)}><i className="fa-regular fa-circle-xmark text-sm text-zinc-400 hover:text-red-500"></i></button>
                            }
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

            </>
          )

        })
      }

      {
        floor?.length === 0 &&
        <>
          <div className="h-[50vh] text-center flex items-center justify-center w-full">
            <p className="text-stone-600 text-md font-light">Create new parking slots</p>
          </div>
        </>
      }

      {
        isSaveBtnDisabled && !isUpdateBtnDisabled &&
        (
          <>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => cancel()} className='text-sm bg-blue-200 px-4 py-1 text-blue-800 rounded-md hover:bg-blue-300 active:bg-blue-400'>cancel</button>
              <button onClick={() => save()} className='text-sm bg-blue-500 px-4 py-1 text-white rounded-md hover:bg-blue-400 active:bg-blue-600'>{isSaveLoading ? 'Saving...' : 'Save'}</button>
            </div>
          </>
        )
      }
      {
        isUpdateBtnDisabled &&
        (
          <>
            <div className="flex items-center justify-end gap-3 mt-4">
              <button onClick={() => onUpdateCancel()} className='text-sm bg-blue-200 px-4 py-1 text-blue-800 rounded-md hover:bg-blue-300 active:bg-blue-400'>cancel</button>
              <button onClick={() => update()} className='text-sm bg-blue-500 px-4 py-1 text-white rounded-md hover:bg-blue-400 active:bg-blue-600'>{isUpdateLoading ? 'Updating...' : 'Update'}</button>
            </div>
          </>

        )
      }


    </motion.div >
  )
}

export default AdminHome