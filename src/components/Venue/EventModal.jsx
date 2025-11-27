import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";
import "./EventModal.css"; // For hiding scrollbar

const eventGroups = [
  {
    title: "Wedding Ceremonies",
    options: ["Engagement", "Wedding", "Reception"],
  },
  {
    title: "Family Celebrations",
    options: ["Birthday Party", "Baby Shower", "Anniversary"],
  },
  {
    title: "Corporate Events",
    options: [
      "Conference / Seminar",
      "Product Launch",
      "Networking Event",
      "Company Anniversary",
      "Trade Show / Exhibition",
    ],
  },
  {
    title: "Entertainment Shows",
    options: ["Live Concert", "Stand-up Comedy Show", "DJ Night"],
  },
  {
    title: "Cultural Events",
    options: ["Festival", "Spiritual Retreats", "Community Gatherings"],
  },
];

const EventModal = ({ onClose, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const toggleOption = (option) => {
    setSelectedOptions((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const isSelected = (option) => selectedOptions.includes(option);

  const handleShowResults = () => {
    if (selectedOptions.length === 0) {
      toast.error("Please select at least one event type", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    // Pass the first selected option (or join multiple if needed)
    const eventType = selectedOptions.join(", ");
    if (onSelect) {
      onSelect(eventType);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-[rgba(0,0,0,0.5)] p-4 sm:p-8">
      <div className="bg-white w-full max-w-[700px] max-h-[90vh] rounded-3xl p-6 sm:p-[60px_30px] relative overflow-hidden flex flex-col">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 text-xl"
        >
          <MdClose />
        </button>

        {/* Modal Title */}
        <h2 className="text-center text-[20px] sm:text-[24px] leading-[133%] text-[#000] mb-6 sm:mb-8  font-[Plus_Jakarta_Sans]">
          Select Your Event Type
        </h2>

        {/* Event Groups */}
        <div className="mx-auto w-full max-w-[500px] flex-1 overflow-y-auto px-1 space-y-6 hide-scrollbar">
          {eventGroups.map((group) => (
            <div key={group.title}>
              <h3 className="font-bold text-base sm:text-lg text-[#181375] mb-2">
                {group.title}
              </h3>
              <div className="space-y-2">
                {group.options.map((option) => (
                  <label
                    key={option}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected(option)}
                      onChange={() => toggleOption(option)}
                      className={`appearance-none w-4 h-4 border-2 rounded-full ${isSelected(option)
                          ? "border-purple-600 ring-2 ring-purple-300 bg-white"
                          : "border-purple-600"
                        } relative before:content-[''] before:absolute before:top-1/2 before:left-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:w-2 before:h-2 before:rounded-full ${isSelected(option)
                          ? "before:bg-purple-600"
                          : "before:bg-transparent"
                        }`}
                    />
                    <span className="text-gray-800 text-sm sm:text-base">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-8 sm:pt-10">
          <button
            onClick={() => setSelectedOptions([])}
            className="px-6 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-50 transition"
          >
            Clear Selection
          </button>
          <button 
            onClick={handleShowResults}
            className="px-6 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-md shadow-md hover:brightness-110 transition"
          >
            Confirm ({selectedOptions.length})
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventModal;
