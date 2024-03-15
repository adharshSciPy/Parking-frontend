import React, { useState, useEffect } from 'react';
import { DatePicker, TimePicker } from "antd";
import { DeleteModal } from '../../components';
import clock from '../../assests/clock.png';
import { useCancelBookingMutation, useExtendBookingMutation } from '../../slices/api/bookingSlice';
import { useGetFloorDesignQuery } from '../../slices/api/floorApiSlice';
import { convertTimestampToTime, isParkedOrNot, calculateDurationWithEndTimeAndCurrentTime } from '../../utils/Uihelpers';
import dayjs from "dayjs";
import moment from "moment";

import toast from 'react-hot-toast';

const BookingCard = ({ booking, refetch }) => {

    const [cancelBooking, { isLoading, isSuccess, isError }] = useCancelBookingMutation()
    const [extendBooking, { isLoading: isExtendLoading, isSuccess: isExtendSuccess, isError: isExtendError }] = useExtendBookingMutation()
    const { refetch: FloorDesingRefetch } = useGetFloorDesignQuery();

    const [isDelete, setIsDelete] = useState(false)
    const [isExtend, setIsExtend] = useState(false)
    const [isExtendButtonDisable, setIsExtendButtonDisable] = useState(false)

    const handleDelete = () => {
        cancelBooking({ floorId: booking?.floorId, slotId: booking?.slotId })
    }

    useEffect(() => {
        if (isSuccess) {
            setIsDelete(false);
            refetch();
            FloorDesingRefetch()

            toast.success('Booking Cancelled');
        } else if (isError) {
            setIsDelete(false);
            toast.error('Failed to cancel booking!');
        }
    }, [isSuccess, isError]);

    //handling extend time
    const dateFormat = "DD-MM-YYYY";
    const today = moment(Date.now());

    const [extendDate, setExtendDate] = useState(today);
    const [extendedTime, setIsExtendedTime] = useState("");

    // handle extending date and time
    const handleDate = (changedDate) => {
        setExtendDate(changedDate?.$d);
    };

    const handleTimeRange = (timeRange) => {
        setIsExtendedTime(timeRange?.$d);
    };

    // enabling save button for extending date and time
    useEffect(() => {
        if (extendDate && extendedTime) {
            setIsExtendButtonDisable(false);
        } else {
            setIsExtendButtonDisable(true);
        }
    }, [extendDate, extendedTime]);

    const handleSaveExtendedDateAndTime = async () => {
        //preparing payload with corrected date and time format
        const parsedExtendedTime = moment(extendedTime, "h:mm a");

        let payload = {
            date: moment(extendDate)?.format(dateFormat),
            endTime: parsedExtendedTime.format("HH:mm:ss")
        }

        if (payload && payload?.endTime !== 'Invalid date') {
            extendBooking({ floorId: booking?.floorId, slotId: booking?.slotId, payload })
            setIsExtend(true)
        }
        else {
            toast.error('Please provide correct time')
        }
    }
    //after succesfull or error extending api call
    useEffect(() => {
        if (isExtendSuccess) {
            toast.success('Booking Extended Succesfully');
            refetch();
            FloorDesingRefetch()
            setIsExtend(false)
            setIsExtendButtonDisable(true)
            setExtendDate(today)
            setIsExtendedTime("")
        } else if (isError) {
            toast.error('Failed to cancel booking!');
            setIsExtendButtonDisable(true)
            setExtendDate(today)
            setIsExtendedTime("")
            setIsExtend(false)
        }
    }, [isExtendSuccess, isExtendError]);

    return (
        <>
            {booking && (
                <div className={`${booking?.parked ? 'bg-green-50 ring-1 ring-white border-none' : 'bg-white'} min-h-44 min-w-80 md:min-w-40 w-[40%] md:w-[30%] h-auto mt-6 border rounded-lg border-black-100 hover:shadow-md transition duration-100 ease-in delay-200 p-2 flex flex-col items-start justify-between`}>
                    <div className='w-full flex items-center justify-between'>
                        <div className={`px-2 inline-flex items-center rounded-md ${isParkedOrNot(booking?.date, booking?.startTime) ? 'bg-blue-50 text-blue-700 ring-blue-700/10' : 'bg-red-50 text-red-700 ring-red-700/10'} px-2 py-1 text-xs font-medium ring-1 ring-inset ring-blue-700/10`}>
                            {isParkedOrNot(booking?.date, booking?.startTime) ? 'You Parked' : 'Reserved'}
                        </div>
                        {!isParkedOrNot(booking?.date, booking?.startTime) && (
                            <button className='h-5 w-5 ring-1 bg-blue-50 rounded-sm ring-blue-200 flex p-1 items-center justify-between overflow-hidden'>
                                <i className="fa fa-pen text-xs text-blue-300 hover:text-blue-600"></i>
                            </button>
                        )}
                    </div>

                    <div className='flex gap-2 items-center justify-between'>
                        <div className='flex items-baseline gap-2'>
                            <p className='text-sm text-gray-600'>Floor</p>
                            <p className='text-xl text-blue-500 font-bold'>{booking?.floorNumber}</p>
                        </div>

                        <div className='flex items-baseline gap-2'>
                            <p className='text-sm text-gray-600'>Slot</p>
                            <p className='text-xl text-blue-500 font-bold'>{booking?.slotNumber}</p>
                        </div>
                    </div>

                    <div className='flex flex-col items-baseline'>
                        <p className='text-sm font-bold text-gray-500'>{convertTimestampToTime(booking?.startTime)} to {convertTimestampToTime(booking?.endTime)}</p>
                        <p className='text-xs font-extralight text-gray-600'>{booking?.date}</p>
                    </div>

                    {isParkedOrNot(booking?.date, booking?.startTime) ? (
                        <>
                            {
                                !isExtend ?
                                    <div className='flex items-center gap-2'>
                                        <img src={clock} alt="clock-icon" className='h-4' />
                                        <p className='text-xs text-blue-900'>{calculateDurationWithEndTimeAndCurrentTime(booking?.endTime, booking?.date)}</p>
                                    </div>
                                    :
                                    <div className="flex items-center justify-between gap-2 w-full">
                                        <DatePicker
                                            className="text-gray-600 w-full"
                                            size='small'
                                            defaultValue={dayjs(today)}
                                            onChange={handleDate}
                                            format={dateFormat}
                                            minDate={dayjs(today)}
                                            maxDate={dayjs(today).add(2, "day")}
                                        />

                                        <TimePicker
                                            className="text-sm w-full"
                                            size='small'
                                            use12Hours
                                            format="h:mm a"
                                            onChange={handleTimeRange}
                                        />
                                    </div>

                            }

                            {
                                !isExtend ?
                                    <button
                                        onClick={() => setIsExtend(true)}
                                        className='w-full bg-blue-400 hover:bg-blue-500 text-white p-1 text-xs rounded mt-1'>Extend Time</button>
                                    :
                                    <button
                                        onClick={() => handleSaveExtendedDateAndTime()}
                                        disabled={isExtendButtonDisable}
                                        className={`w-full ${isExtendButtonDisable ? 'bg-blue-200 hover:bg-blue-200' : 'bg-blue-400 hover:bg-blue-500'}  text-white p-1 text-xs rounded mt-1`}>Save</button>
                            }
                        </>
                    ) : (
                        <button
                            onClick={() => setIsDelete(true)}
                            className='w-full bg-red-400 hover:bg-red-500 text-white p-1 text-xs rounded mt-1'>Cancel Booking</button>
                    )}
                </div>

            )}
            <DeleteModal
                isDelete={isDelete}
                setIsDelete={setIsDelete}
                handleDelete={handleDelete}
                isLoading={isLoading}
                isError={isError}
                message={'Are you sure you want to cancel booking ?'}
            />
        </>
    );
};

export default BookingCard;
