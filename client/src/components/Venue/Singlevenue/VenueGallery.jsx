
import React from "react";
import { Squares2X2Icon } from "@heroicons/react/24/solid";
import fallbackImg from "../../../assets/venue/image (11).png";

export default function VenueGallery({ mainImage, thumbnails = [] }) {
  // Calculate total images (main + thumbnails)
  const totalImages = 1 + thumbnails.length;
  const hasMultiplePhotos = totalImages > 1;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-5 rounded-xl">
        {/* Left: Main Image */}
        <div className="w-full lg:w-[60%] h-[250px] sm:h-[350px] lg:h-[400px] overflow-hidden rounded-xl">
          <img
            src={mainImage || fallbackImg}
            alt="Main Venue"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        {/* Right: Side Images - Only show if there are thumbnails */}
        {thumbnails.length > 0 && (
          <div className="w-full lg:w-[40%] grid grid-cols-2 gap-3 relative">
            {thumbnails.slice(0, 4).map((img, index) => (
              <div key={index} className="relative">
                <img
                  src={img || fallbackImg}
                  alt={`Venue ${index + 2}`}
                  className="w-full h-[140px] sm:h-[170px] lg:h-[190px] object-cover rounded-xl"
                />

                {/* Show All Button only on last image and only if there are multiple photos */}
                {index === Math.min(thumbnails.length - 1, 3) && hasMultiplePhotos && (
                  <button
                    className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-3 sm:px-4 py-1.5 sm:py-2 rounded-md sm:rounded-lg border border-gray-300 bg-white text-gray-900 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm shadow-sm hover:shadow-md transition"
                    style={{
                      fontFamily: "Plus Jakarta Sans",
                      fontWeight: 500,
                      letterSpacing: "0.4px",
                      background: "#FFFFFF",
                      lineHeight: "20px",
                    }}
                  >
                    <Squares2X2Icon className="h-4 w-4 text-gray-700" />
                    <span className="hidden xs:inline">Show all photos</span>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
