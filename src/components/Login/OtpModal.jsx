import React, { useState, useEffect } from "react";

const OtpModal = ({ show, onClose, phoneNumber, onContinue }) => {
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (!show) return;
    setOtp(["", "", "", ""]);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [show]);

  const handleChange = (value, index) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 3) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const isComplete = otp.every((digit) => digit !== "");

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center px-4 sm:px-0"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
        WebkitBackdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white relative flex flex-col items-center text-center shadow-xl w-full max-w-[700px] md:h-[444px] rounded-[24px] px-4 sm:px-[30px] py-[40px] sm:py-[60px] gap-6 sm:gap-[40px]"
      >
        {/* Back Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 text-xl text-gray-500 hover:text-black"
        >
          ←
        </button>

        {/* Heading */}
        <h2 className="text-2xl font-semibold" style={{ fontFamily: "Plus Jakarta Sans" }}>
          Confirm Your Number
        </h2>

        {/* Subtitle */}
        <p className="text-gray-600 text-base sm:text-lg font-medium leading-relaxed px-2">
          Enter the code we’ve sent via SMS to <br />
          <span className="font-semibold">+91 {phoneNumber}</span>
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(e.target.value, index)}
              className="w-12 sm:w-14 h-12 sm:h-14 border border-gray-300 rounded text-center text-xl font-medium"
              style={{ fontFamily: "Plus Jakarta Sans" }}
            />
          ))}
        </div>

        {/* Timer */}
        <p className="text-xs text-gray-500" style={{ fontFamily: "Plus Jakarta Sans" }}>
          Resend OTP in 0:{timer < 10 ? `0${timer}` : timer}
        </p>

        {/* Continue Button */}
        <button
          disabled={!isComplete}
          onClick={() => {
            if (isComplete) onContinue();
          }}
          className={`w-full max-w-xs sm:max-w-[400px] font-semibold text-white py-2 rounded ${isComplete ? "bg-[#8F24AB] hover:bg-[#741a92]" : "bg-gray-300 cursor-not-allowed"
            }`}
          style={{
            fontFamily: "Plus Jakarta Sans",
            fontSize: "16px",
            padding: "12px 20px",
          }}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default OtpModal;
