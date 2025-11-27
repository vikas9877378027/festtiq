import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const timeOptions = [
  "Morning (06:00 AM - 02:00 PM)",
  "Evening (04:00 AM - 11:00 PM)",
  "Full Day 1 (06:00 AM - 11:00 PM)",
  "Full Day 2 (02:00 PM - 02:00 PM)",
];

const EventTimeModal = ({ onClose, onSelect }) => {
  const [selected, setSelected] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)] px-4 py-6">
      <div className="bg-white w-full max-w-[700px] max-h-full overflow-y-auto rounded-[20px] px-4 py-6 sm:p-[60px_30px] relative shadow-xl flex flex-col justify-between gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 text-gray-500 text-2xl"
        >
          <MdClose />
        </button>

        {/* Title */}
        <h2 className="text-center font-semibold text-lg sm:text-xl text-[#000] leading-[133%]">
          Select Event Time
        </h2>

        {/* Radio Options */}
        <div className="flex flex-col gap-4 sm:gap-6 px-1 sm:px-2">
          {timeOptions.map((option, index) => (
            <label
              key={index}
              className="flex items-center gap-3 cursor-pointer text-sm sm:text-base text-gray-800"
            >
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center 
                ${selected === option
                    ? "border-purple-600 ring-2 ring-purple-300"
                    : "border-purple-600"
                  }`}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full ${selected === option ? "bg-purple-600" : "bg-transparent"
                    }`}
                ></span>
              </span>
              <input
                type="radio"
                checked={selected === option}
                onChange={() => setSelected(option)}
                className="hidden"
              />
              {option}
            </label>
          ))}
        </div>

        {/* Select Button */}
        <div className="flex justify-center mt-2">
          <button
            onClick={() => {
              if (selected) {
                onSelect(selected);
                onClose();
              }
            }}
            disabled={!selected}
            className={`w-full max-w-[140px] py-2 rounded text-white text-base font-semibold shadow-md transition 
              ${selected
                ? "bg-gradient-to-b from-[#9C27B0] to-[#7B1FA2] hover:brightness-110"
                : "bg-[#D9D9D9] cursor-not-allowed"
              }`}
          >
            Select
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventTimeModal;
