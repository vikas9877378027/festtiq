

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileModal = ({ show, onBackToOtp, onClose }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [location, setLocation] = useState("");

  const navigate = useNavigate()
  const isFormComplete = name && email && location;

  const cities = [
    "Ahmedabad", "Bangalore", "Bhopal", "Chandigarh", "Chennai",
    "Delhi", "Goa", "Hyderabad", "Indore", "Jaipur", "Kolkata",
    "Lucknow", "Mumbai", "Nagpur", "Pune", "Surat", "Vadodara", "Visakhapatnam"
  ].sort();

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-center items-center px-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(4px)",
      }}
    >
      <div
        className="bg-white shadow-xl relative flex flex-col w-full max-w-[700px] rounded-[24px] px-4 sm:px-[30px] py-[40px] sm:py-[60px] gap-6 sm:gap-[40px]"
      >
        {/* Back button */}
        <button
          onClick={onBackToOtp}
          className="absolute top-4 left-4 text-xl text-gray-500 hover:text-black"
        >
          ←
        </button>

        {/* Heading */}
        <h2
          className="text-center text-2xl font-semibold"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Finish Signing Up
        </h2>

        {/* Form */}
        <div
          className="flex flex-col gap-4 mx-auto w-full max-w-sm"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {/* Full Name */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Full Name*
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="border border-gray-300 w-full h-11 rounded-md px-4 py-2"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Email*
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="border border-gray-300 w-full h-11 rounded-md px-4 py-2"
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Location*
            </label>
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="border border-gray-300 w-full h-11 rounded-md px-4 py-2"
            >
              <option value="">Select your location</option>
              {cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>

          {/* Agreement text */}
          <p className="text-xs text-gray-500 mt-2 text-left w-full">
            By selecting <strong>Agree and Continue</strong>, you acknowledge and agree to our{" "}
            <span className="text-[#8F24AB] underline cursor-pointer">Terms of Service</span> and{" "}
            <span className="text-[#8F24AB] underline cursor-pointer">Privacy Policy</span>.
          </p>

          {/* Submit Button */}
          <button
            disabled={!isFormComplete}
            onClick={() => {
              if (isFormComplete) {
                onClose();
                navigate("/venues");
              }
            }}
            className={`w-full mt-2 font-semibold text-white py-2 rounded ${isFormComplete ? "bg-[#8F24AB] hover:bg-[#741a92]" : "bg-gray-300 cursor-not-allowed"
              }`}
            style={{
              fontFamily: "Plus Jakarta Sans, sans-serif",
              fontSize: "16px",
            }}
          >
            Agree and Continue
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
