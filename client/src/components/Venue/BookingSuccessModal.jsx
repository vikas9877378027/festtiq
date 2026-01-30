import React from "react";
import { useNavigate } from "react-router-dom";

const BookingSuccessModal = ({ show, onClose, bookingData }) => {
  const navigate = useNavigate();
  
  if (!show) return null;

  // Generate a simple booking reference number (you can make this more sophisticated)
  const bookingRef = bookingData?.orderId 
    ? `FTQ-${bookingData.orderId.slice(-8).toUpperCase()}` 
    : `FTQ-${Date.now().toString().slice(-8)}`;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl text-center w-full max-w-md font-['Plus Jakarta Sans'] animate-scale-in">
        {/* Success Icon */}
        <div className="flex justify-center mb-4">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-50 rounded-full flex items-center justify-center animate-bounce-once">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#9C27B0"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>

        {/* Title */}
        <h2 className="text-3xl font-bold text-purple-600 mb-2">
          Booking Confirmed! 🎉
        </h2>
        
        {/* Booking Reference */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
          <p className="text-xs text-gray-600 mb-1">Booking Reference</p>
          <p className="text-xl font-bold text-purple-600 tracking-wider">
            {bookingRef}
          </p>
        </div>

        {/* Success Message */}
        <p className="text-sm text-gray-600 mb-6">
          Your booking has been successfully placed! Our team will review and confirm your booking shortly. 
          You'll receive a confirmation email with all the details.
        </p>

        {/* Status Timeline Info */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-left">
          <p className="text-xs font-semibold text-amber-800 mb-2">📋 Next Steps:</p>
          <ul className="text-xs text-amber-700 space-y-1">
            <li>✓ Booking received and under review</li>
            <li>⏳ Admin will confirm within 24 hours</li>
            <li>📧 You'll receive email confirmation</li>
            <li>💬 Our team may contact you for final details</li>
          </ul>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <button
            className="flex-1 border-2 border-purple-600 text-purple-600 px-6 py-3 rounded-xl hover:bg-purple-50 transition-all font-medium"
            onClick={() => {
              onClose();
              navigate("/mybookings");
            }}
          >
            View My Bookings
          </button>
          <button
            className="flex-1 bg-purple-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-purple-700 transition-all font-medium"
            onClick={() => {
              onClose();
              navigate("/");
            }}
          >
            Back to Home
          </button>
        </div>

        {/* Contact Support */}
        <button
          onClick={() => {
            onClose();
            navigate("/contact");
          }}
          className="mt-4 text-sm text-gray-500 hover:text-purple-600 transition-colors underline"
        >
          Need help? Contact Support
        </button>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            transform: scale(0.9);
            opacity: 0;
          }
          to {
            transform: scale(1);
            opacity: 1;
          }
        }
        
        @keyframes bounce-once {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        
        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }
        
        .animate-bounce-once {
          animation: bounce-once 0.6s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default BookingSuccessModal;
