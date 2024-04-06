import React, { useState, useEffect } from "react";
import Floor from "./Floor";
import { motion } from "framer-motion";
import BookingModal from "./BookingModal";
import { useGetFloorDesignQuery } from "../../slices/api/floorApiSlice";
import { useSelector, useDispatch } from "react-redux";
import { setUserFloor } from "../../slices/state/userFloorslice";
import { useGetUserBookingsQuery } from "../../slices/api/bookingSlice";


const HomePage = () => {
  const dispatch = useDispatch();

  const { floor } = useSelector((state) => state?.userFloor);
  const { userId } = useSelector((state) => state?.auth);

  const { data, refetch } = useGetFloorDesignQuery();
  const { refetch: BookingRefetch } = useGetUserBookingsQuery({ userId });

  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState([]);

  // floor data fecthing initially
  useEffect(() => {
    if (data?.data?.length > 0) {
      let floorData = data?.data;
      dispatch(setUserFloor({ floorData }));
      BookingRefetch()
    }
  }, [data]);

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="h-full min-h-screen bg-red-100 bg-gradient-to-b from-white to-blue-200 py-2 px-4 sm:px-8 md:px-12 lg:px-20 xl:px-48 xl:text-xl"
    >
      <p className="mt-10 text-stone-600 text-md font-semibold">Parking Slots</p>

      {floor?.map((item, index) => {
        return (
          <Floor
            item={item}
            setIsOpen={setIsOpen}
            setModalData={setModalData}
            key={index}
          />
        );
      })}

      {
        floor?.length === 0 &&
        <>
          <div className="h-[60vh] text-center flex items-center justify-center w-full">
            <p className="mt-10 text-stone-600 text-md font-light">No parking slots have been created by Administrators</p>
          </div>
        </>
      }

      <BookingModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        modalData={modalData}
        refetch={refetch}
      />
    </motion.section>
  );
};

export default HomePage;
