import React from "react";

const SlideOver = ({ show, onClose, children }) => {
  return (
    <div
      className={`fixed inset-0 z-50 transition-all duration-500 ${show ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-20 transition-opacity"
        onClick={onClose}
      />

      {/* Slide-in panel */}
      <div
        className={`absolute right-0 top-0 h-full w-full sm:w-[500px] lg:w-[800px] bg-white shadow-lg z-50 
          transform transition-transform duration-500 rounded-l-none sm:rounded-l-2xl 
          ${show ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 relative">
          <h2
            className="text-2xl sm:text-3xl font-medium leading-[117%] tracking-[-1.5px] text-[#181375] font-['Plus Jakarta Sans']"
          >
            Other Services
          </h2>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-[#333] text-xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 h-[calc(100%-80px)] overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

export default SlideOver;
