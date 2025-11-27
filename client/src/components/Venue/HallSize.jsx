import React, { useState } from "react";
import { MdClose } from "react-icons/md";

const hallSizeOptions = [
  "Small (< 50 guests)",
  "Medium (50 - 200 guests)",
  "Large (200 - 500 guests)",
  "Extra large (500+ guests)",
];

const HallSizeModal = ({ onClose }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const isSelected = (option) => selectedOptions.includes(option);

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)] px-4 sm:px-6 py-6">
      <div className="bg-white w-full max-w-[700px] max-h-[90vh] rounded-3xl p-4 sm:p-6 md:p-[60px_30px] relative flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 text-xl"
        >
          <MdClose />
        </button>

        {/* Title */}
        <h2 className="text-center font-[Plus_Jakarta_Sans] text-[20px] sm:text-[24px] leading-[133%] text-[#000] mb-4 sm:mb-6">
          Select Hall Size
        </h2>

        {/* Options */}
        <div className="flex-1 overflow-y-auto space-y-4 px-1 sm:px-4">
          {hallSizeOptions.map((option) => (
            <label
              key={option}
              className="flex items-center gap-3 cursor-pointer text-sm sm:text-base text-gray-800"
            >
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${isSelected(option)
                    ? "border-purple-600 ring-2 ring-purple-300"
                    : "border-purple-600"
                  }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${isSelected(option) ? "bg-purple-600" : ""
                    }`}
                />
              </div>
              <input
                type="checkbox"
                checked={isSelected(option)}
                onChange={() => toggleOption(option)}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6">
          <button
            onClick={() => setSelectedOptions([])}
            className="px-6 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition"
          >
            Clear Selection
          </button>
          <button
            onClick={() => {
              console.log("Selected Hall Sizes:", selectedOptions);
            }}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md shadow-md hover:brightness-110 transition"
          >
            Show Results
          </button>
        </div>
      </div>
    </div>
  );
};

export default HallSizeModal;
