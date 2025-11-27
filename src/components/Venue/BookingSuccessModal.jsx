import React from "react";
import { useNavigate } from "react-router-dom";

const BookingSuccessModal = ({ show, onClose }) => {
  const navigate = useNavigate();
  
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center">
      <div className="bg-white p-8 rounded-xl shadow-lg text-center w-[90%] max-w-md font-['Plus Jakarta Sans']">
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-[#F3E5F5] rounded-full flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9C27B0"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-semibold text-[#181375] mb-2">Booking Successful</h2>
        <p className="text-sm text-[#4F4F4F] mb-6">
          Your venue booking has been successfully completed!
        </p>
        <div className="flex justify-center gap-4">
          <button
            className="border border-[#9C27B0] text-[#9C27B0] px-4 py-2 rounded hover:bg-[#f3e8f5]"
            onClick={() => {
              onClose();
              navigate("/mybookings");
            }}
          >
            View Bookings
          </button>
          <button
            className="bg-[#9C27B0] text-white px-4 py-2 rounded shadow-md hover:brightness-110"
            onClick={() => {
              onClose();
              navigate("/contact");
            }}
          >
            Contact Us
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingSuccessModal;
