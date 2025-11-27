import React, { useState } from "react";
import { SocialIcon } from "react-social-icons";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

const LoginModal = ({ show, onClose, onContinue }) => {
  console.log("object",show,onClose)
  const [phone, setPhone] = useState("");

  if (!show) return null;

  const buttonStyle = {
    fontFamily: "Plus Jakarta Sans, sans-serif",
    fontWeight: 500,
    fontSize: "14px",
    height: "44px",
    padding: "0 20px",
  };

  const iconContainer = {
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center px-2"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(1px)",
        WebkitBackdropFilter: "blur(1px)",
      }}
    >
      <div className="bg-white relative flex flex-col items-center shadow-xl w-full max-w-[700px] rounded-[24px] px-[20px] sm:px-[30px] py-[60px] gap-[40px]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-black text-xl"
        >
          ×
        </button>

        {/* Inner Container */}
        <div className="flex flex-col items-center w-full gap-6 rounded-[12px] max-w-[400px]">
          <h2 className="text-[24px] leading-[133%] font-semibold text-center font-jakarta">
            Log in or Sign up
          </h2>

          {/* Phone Input */}
          <div className="w-full text-left">
            <label className="text-sm font-medium">Phone Number*</label>
            <div className="flex gap-2 mt-1">
              <select className="border rounded p-2 w-1/4">
                <option value="IN">IN</option>
              </select>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="border rounded p-2 w-3/4"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">
              We'll send you a code to confirm your number
            </p>
          </div>

          {/* Continue Button */}
          {phone ? (
            <button
              className="w-full max-w-[400px] h-[44px] text-white text-[16px] font-semibold font-jakarta rounded-[8px] transition-all duration-300 shadow-md"
              style={{
                background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
                padding: "12px 20px",
                boxShadow: `
                  0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                  0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                  0px 1px 5px 0px rgba(0, 0, 0, 0.12)
                `,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(180deg, #7B1FA2 0%, #6A1B9A 100%)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)";
              }}
              onClick={() => {
                onClose();
                onContinue(phone);
              }}
            >
              Continue
            </button>
          ) : (
            <button
              className="w-full max-w-[400px] h-[44px] text-gray-500 cursor-not-allowed rounded-[8px] text-[16px] font-semibold font-jakarta"
              disabled
              style={{
                background: "#0000001F",
                padding: "12px 20px",
              }}
            >
              Continue
            </button>
          )}

          {/* Divider */}
          <div className="flex items-center w-full text-sm text-gray-400">
            <div className="flex-1 border-t border-gray-300" />
            <span className="px-2">OR</span>
            <div className="flex-1 border-t border-gray-300" />
          </div>

          {/* Social Buttons */}
          <div className="flex flex-col gap-2 w-full">
            {/* Google */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded px-4 h-11"
              style={buttonStyle}
            >
              <div style={iconContainer}>
                <FcGoogle size={24} />
              </div>
              <span>Continue with Google</span>
            </button>

            {/* Facebook */}
            <button
              type="button"
              className="w-full flex items-center justify-center gap-3 border border-gray-300 rounded px-4 h-11"
              style={buttonStyle}
            >
              <SocialIcon
                network="facebook"
                bgColor="#1877F2"
                fgColor="#FFFFFF"
                style={{ width: 24, height: 24 }}
              />
              <span>Continue with Facebook</span>
            </button>

            {/* Apple */}
            <button
              className="w-full flex items-center justify-center gap-2 border rounded px-4 h-11"
              style={buttonStyle}
            >
              <FaApple size={20} />
              <span>Continue with Apple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
