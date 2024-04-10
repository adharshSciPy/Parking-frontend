import React from "react";
import Slot from "./Slot";


const Floor = ({ item, setIsOpen, setModalData, index: floorIndex }) => {
  let floorData = {
    floorNumber: item?.floorNumber,
    price: item?.price,
    _id: item?._id,
  };

  return (
    <div className="min-h-44 h-auto mt-6 border rounded-lg border-black-100 hover:shadow-md transition duration-100 ease-in delay-200 p-2" key={floorIndex}>
      <span className="inline-block bg-blue-300 px-2 py-1 text-xs font-medium text-blue-600 rounded-t-lg">
        Floor no {item?.floorNumber}
      </span>
      <div className="mt-2 flex items-center justify-center md:justify-start flex-wrap gap-1" key={floorIndex}>
        {item?.slots?.map((item, index) => (
          <Slot
            item={item}
            floorData={floorData}
            setIsOpen={setIsOpen}
            setModalData={setModalData}
            index={index}
          />
        ))}
      </div>
    </div>
  );
};

export default Floor;
