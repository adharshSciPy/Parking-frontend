import React, { useEffect, useState } from "react";
import { DatePicker, TimePicker, Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { motion } from "framer-motion";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { useBookSlotMutation } from "../../slices/api/bookingSlice";
import { setUserFloor } from "../../slices/state/userFloorslice";
import toast from 'react-hot-toast';
import img1 from '../../assests/payments/pay-1.png'
import img2 from '../../assests/payments/pay-2.png'
import img3 from '../../assests/payments/pay-3.png'
import img4 from '../../assests/payments/pay-4.png'


const BookingModal = ({ isOpen, setIsOpen, modalData, refetch }) => {

  const dispatch = useDispatch();
  const dateFormat = "DD-MM-YYYY";
  const today = moment(Date.now());

  const [date, setDate] = useState(today);
  const formattedDate = moment(date).format(dateFormat);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [price, setPrice] = useState(modalData?.price)
  const [grandTotal, setGrandTotal] = useState('')
  const [duration, setDuration] = useState('')
  const [isDisabled, setIsDisabled] = useState(true);
  const [time, setTime] = useState([])
  const [isWorthyToEnableFromTime, setIsWorthyToEnableFromTime] = useState(false);

  useEffect(() => {
    setPrice(modalData?.price)
  }, [modalData])

  const handleDate = (changedDate) => {
    setDate(changedDate?.$d);
  };

  const handleTimeRange = (timeRange) => {
    if (timeRange) {
      setStartTime(timeRange[0]?.$d);
      setEndTime(timeRange[1]?.$d);
    }
  };

  useEffect(() => {
    if (!date || !endTime || !endTime) {
      setIsDisabled(true);
      setDuration(0)
      setGrandTotal(0);
    }
    else if (date && isWorthyToEnableFromTime) {
      setIsDisabled(false)
    }
  }, [date, startTime, endTime])

  // booking POST api handling
  const [booking, { isLoading }] = useBookSlotMutation();
  const { userId } = useSelector((state) => state?.auth);

  const handleBooking = async () => {
    let floorId = modalData?._id;
    let slotId = modalData?.slotDetails?._id;

    const parsedStartTime = moment(startTime, "h:mm a");
    const parsedEndTime = moment(endTime, "h:mm a");

    const formattedStartTime = parsedStartTime.format("HH:mm:ss");
    const formattedEndTime = parsedEndTime.format("HH:mm:ss");

    let payloadData = {
      date: formattedDate,
      startTime: formattedStartTime,
      endTime: formattedEndTime,
    };
    if (floorId && slotId && payloadData) {
      const res = await booking({ floorId, slotId, userId, payloadData });
      if (res) {
        let floorData = res?.data?.data;
        dispatch(setUserFloor({ floorData }));
        setIsDisabled(true);
        setIsOpen(false);
        document.body.style.overflow = "";
        refetch()
        setTime([])
        setGrandTotal('')
        setDuration('')
      }
      else {
        setTime([])
        setGrandTotal('')
        setDuration('')
      }
    }
  };

  const handleClose = () => {
    document.body.style.overflow = "";
    setIsOpen(false)
    setTime([])
    setGrandTotal('')
    setDuration('')
  }

  const handleOK = (time) => {
    if (time?.[0] === null && time?.[1]) {
      setTime([])
      toast.error('Please provide a start time')
    } else if (time?.[0]) {
      const currentTime = new Date();
      const givenDate = new Date(date);
      const givenTime = time?.[0]?.$d;

      // Combine given date and given time
      const combinedDateTime = new Date(givenDate);
      combinedDateTime.setHours(givenTime.getHours(), givenTime.getMinutes(), givenTime.getSeconds());

      if (combinedDateTime < currentTime) {
        setTime([])
        toast.error('The given time is less than the current time.')
      }

      const secondTime = time?.[1]?.$d
      if (secondTime) {

        const combinedSecondTimeWithDate = new Date(givenDate);
        combinedSecondTimeWithDate.setHours(secondTime?.getHours(), secondTime?.getMinutes(), secondTime?.getSeconds());

        if (combinedSecondTimeWithDate) {

          const timeDifference = combinedSecondTimeWithDate?.getTime() - combinedDateTime?.getTime();
          const hoursDifference = timeDifference / (1000 * 60 * 60);
          if (hoursDifference < 0) {
            toast.error('End time should be higher than Start time')
            setTime([])
          }
          if (hoursDifference > 3) {
            toast.error('End time should be within 3 hours')
            setTime([])
          }
          else {
            let startTime = time?.[0]?.$d
            let endTime = time?.[1]?.$d
            let timeDiff = endTime.getTime() - startTime.getTime();
            let totalHours = Math.floor(timeDiff / (1000 * 3600)); // Total hours
            let totalMinutes = Math.round((timeDiff % (1000 * 3600)) / (1000 * 60));
            let totalPrice = totalHours * price;
            totalPrice = parseFloat(totalPrice.toFixed(2));
            setDuration(`${totalHours} hours ${totalMinutes} mins`)
            setGrandTotal(totalPrice)
            setTime(time)
            setIsWorthyToEnableFromTime(true)
          }
        }
      }
    }
  }

  if (!isOpen) {
    return null;
  }
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 3 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
    >
      <div className="overflow-y-auto bg-blue-200 backdrop-blur-sm bg-opacity-50 overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full h-full max-h-full">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-2 px-5 border-b rounded-t">
              <p className="text-sm font-medium text-gray-600 m-0">
                Confirm Booking
              </p>

              <div className="flex items-center flex-between gap-2">
                <p className="text-md font-medium  text-sm">Price : <span className="text-blue-700"><i className="fa fa-inr text-blue-600 text-xs"></i> {price}{price && '/-'}</span></p>
                <button
                  onClick={() => handleClose()}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
            </div>

            {/* modal body */}
            <div className="flex items-center justify-between">
              <div className="p-4 pb-0 md:p-5 md:pb-0 flex gap-5">
                <div className="w-50 flex items-center justify-between gap-1">
                  <p className="text-sm font-medium text-gray-600">Floor No</p>
                  <p className="text-sm font-medium text-blue-700">
                    {modalData?.floor}
                  </p>
                </div>

                <div className="w-50 flex items-center justify-between gap-1">
                  <p className="text-sm font-medium text-gray-600">Slot No</p>
                  <p className="text-sm font-medium text-blue-700">
                    {modalData?.slotDetails?.slotNumber}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 p-4 pb-0 md:p-5 md:pb-0">
                <img src={img1} alt="" className="h-9" />
                <img src={img2} alt="" className="h-9" />
                <img src={img3} alt="" className="h-9" />
                <img src={img4} alt="" className="h-9" />
              </div>

            </div>
            <div className="p-4 md:p-5 block md:flex">
              <div className="w-full mb-5 md:m-0">
                <label
                  for="large-input"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  Select Date
                </label>
                <DatePicker
                  className="text-gray-600"
                  defaultValue={dayjs(today)}
                  onChange={handleDate}
                  format={dateFormat}
                  minDate={dayjs(today)}
                  maxDate={dayjs(today).add(2, "day")}
                />
              </div>
              <div className="w-full">
                <label
                  for="large-input"
                  className="mb-2 block text-sm font-medium text-gray-600"
                >
                  Select Time Range
                </label>
                <TimePicker.RangePicker
                  className="text-sm"
                  use12Hours
                  format="h:mm a"
                  onChange={handleTimeRange}
                  value={time}
                  onOk={(e) => handleOK(e)}
                />


              </div>
            </div>

            <div className="flex items-center gap-3 justify-between w-full p-4 md:p-5 border-t border-gray-200 rounded-b">
              <div>
                <p className="text-zinc-600 text-sm">Total Duration: <span className="font-bold">{duration}{duration ? '' : '00: 00'}</span></p>
                <p className="text-zinc-600 text-sm">Grand Total: <span className="font-bold">{grandTotal}{grandTotal ? '/-' : '0 /-'}</span></p>
              </div>

              <div className="flex items-center gap-3 justify-between">
                <button
                  type="button"
                  onClick={() => handleClose()}
                  className="text-gray-800 bg-gray-200 hover:bg-gray-300 active:bg-gray-400 text-sm rounded-md px-4 py-2 flex items-center justify-center"
                >
                  Decline
                </button>

                <button
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleBooking()}
                  className={`text-white ${isDisabled
                    ? "bg-zinc-300"
                    : "bg-blue-500 hover:bg-blue-600 active:bg-blue-400"
                    } text-white text-sm rounded-md px-4 py-2 flex items-center justify-center`}
                >{
                    isLoading ? <div className="flex align-items-center gap-3"><Spin indicator={<LoadingOutlined style={{ fontSize: 18, color: 'violet' }} spin />} /> <p>Booking...</p></div> : 'Book' 
                  }

                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingModal;
