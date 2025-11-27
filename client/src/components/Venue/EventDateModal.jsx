import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { DateRange } from "react-date-range";
import { format } from "date-fns";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

const EventDateModal = ({ onClose, onSelect }) => {
  const [range, setRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: "selection",
    },
  ]);

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(0,0,0,0.6)] flex justify-center items-center px-4 py-6">
      <div className="bg-white w-full max-w-[550px] rounded-[20px] px-6 py-8 relative shadow-xl flex flex-col items-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 text-2xl"
        >
          <MdClose />
        </button>

        {/* Title */}
        <h2 className="text-center text-[20px] sm:text-[22px] font-semibold text-black mb-4">
          Select Event Date Range
        </h2>

        {/* Selected Range */}
        <div className="text-sm font-medium text-[#333] bg-[#F2F2F2] rounded-full px-4 py-1 mb-5">
          {format(range[0].startDate, "MMM d")} – {format(range[0].endDate, "MMM d")}
        </div>

        {/* Calendar */}
        <div className="w-full flex justify-center">
          <div className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
            <DateRange
              ranges={range}
              onChange={(item) => setRange([item.selection])}
              moveRangeOnFirstSelection={false}
              showMonthAndYearPickers={false}
              showDateDisplay={false}
              rangeColors={["#9C27B0"]}
              staticRanges={[]}
              inputRanges={[]}
              months={1}
              direction="horizontal"
              className="custom-date-range"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6 w-full">
          <button
            onClick={() =>
              setRange([
                {
                  startDate: new Date(),
                  endDate: new Date(),
                  key: "selection",
                },
              ])
            }
            className="text-[#9C27B0] border border-[#9C27B0] px-6 py-2 rounded-md font-medium hover:bg-purple-50 w-full sm:w-auto"
          >
            Clear Selection
          </button>
          <button
            onClick={() => {
              onSelect(range[0]);
              onClose();
            }}
            className="bg-gradient-to-b from-[#9C27B0] to-[#7B1FA2] text-white px-6 py-2 rounded-md font-medium shadow w-full sm:w-auto"
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventDateModal;
