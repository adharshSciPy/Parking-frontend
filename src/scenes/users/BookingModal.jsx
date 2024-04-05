import React, { useEffect, useState } from "react";
import { DatePicker, TimePicker, ConfigProvider } from "antd";
import { motion } from "framer-motion";
import moment from "moment";
import { useSelector, useDispatch } from "react-redux";
import dayjs from "dayjs";
import { useBookSlotMutation } from "../../slices/api/bookingSlice";
import { setUserFloor } from "../../slices/state/userFloorslice";


const BookingModal = ({ isOpen, setIsOpen, modalData, refetch }) => {

  const dispatch = useDispatch();
  const dateFormat = "DD-MM-YYYY";
  const today = moment(Date.now());

  const [date, setDate] = useState(today);
  const formattedDate = moment(date).format(dateFormat);

  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [isDisabled, setIsDisabled] = useState(true);

  const handleDate = (changedDate) => {
    setDate(changedDate?.$d);
  };

  const handleTimeRange = (timeRange) => {
    if (timeRange) {
      setStartTime(timeRange[0]?.$d);
      setEndTime(timeRange[1]?.$d);
    }
  };

  // validate submit button
  useEffect(() => {
    if (date && endTime && startTime) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [date, endTime, startTime]);

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
      }
    }
  };

  const handleClose = () => {
    document.body.style.overflow = "";
    setIsOpen(false)
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
            <div className="flex items-baseline justify-between p-2 px-5 border-b rounded-t">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Confirm Booking in
                </p>
              </div>

              <div className="ml-1 flex items-baseline justify-between gap-1">
                <p className="text-md font-medium text-blue-700">
                  {modalData?.slotDetails?.slotNumber}
                </p>
                <p className="text-sm font-medium text-gray-600">slot in</p>
              </div>

              <div className="ml-1 flex">
                <div className="w-50 flex items-baseline justify-between gap-1">
                  <p className="text-md font-medium text-blue-700">
                    {modalData?.floor}
                  </p>
                  <p className="text-sm font-medium text-gray-600">floor</p>
                </div>
              </div>

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

            {/* modal body */}
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
                    className="text-sm  "
                    use12Hours
                    format="h:mm a"
                    onChange={handleTimeRange}
                  />
              </div>
            </div>

            <div className="flex items-center gap-3 justify-end w-full p-4 md:p-5 border-t border-gray-200 rounded-b">
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
              >
                Book
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default BookingModal;
