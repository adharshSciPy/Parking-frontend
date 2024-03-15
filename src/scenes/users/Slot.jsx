import React from "react";
import {
  convertTimestampToTime,
  convertTimestampToDate,
} from "../../utils/Uihelpers";

const isParkedorNot = (givenTime, date) => {
  const [day, month, year] = date?.split("-");
  const [hours, minutes, seconds] = givenTime.split(':');
  
  const givenDateTime = new Date(year, parseInt(month, 10) - 1, day, hours, minutes, seconds);
  const currentDateTime = new Date();

  if (givenDateTime >= currentDateTime) {
    return 'Reserved';
  } else {
    return 'Parked';
  }
};



const Slot = ({ item, floorData, setIsOpen, setModalData, index }) => {
  const handleOnClick = (slot) => {
    setIsOpen(true);
    document.body.style.overflow = "hidden";
    let data = {
      floor: floorData?.floorNumber,
      _id: floorData?._id,
      slotDetails: slot,
    };
    setModalData(data);
  };

  return (
    <div
      key={index}
      className={`h-20 w-40 rounded-md ${
        item?.isReserved ? "bg-red-200" : "bg-blue-200"
      } relative`}
    >
      <div className="flex items-center justify-between px-2">
        <p className="text-xs font-bold text-zinc-500 mt-1">
          {" "}
          <span className="font-thin">Slot</span> {item?.slotNumber}
        </p>

        {item?.isReserved && (
          <>
            <p className="text-xs bg-red-50 px-1 text-red-800 rounded-md">
              {/* {isParkedorNot(item?.startTime, item?.date)} */}
            </p>
          </>
        )}
      </div>

      {item?.isReserved ? (
        <>
          <div className="flex text-xs mt-3 px-2 gap-1 text-zinc-700 font-bold">
            <p>{convertTimestampToTime(item?.startTime)}</p>
            <p>to</p>
            <p>{convertTimestampToTime(item?.endTime)}</p>
          </div>

          <p className="px-2 text-xs text-zinc-500 font-semibold">
            {item?.date}
          </p>
        </>
      ) : (
        <button
          onClick={() => handleOnClick(item)}
          className="absolute bottom-0 left-0 w-full h-7 text-sm bg-blue-400 hover:bg-blue-600 text-white"
        >
          Book
        </button>
      )}
    </div>
  );
};

export default Slot;
