import React from 'react';
import image1 from '../assets/MasonaryGrid/image (10).png';
import image2 from '../assets/MasonaryGrid/image (11).png';
import image3 from '../assets/MasonaryGrid/image (12).png';
import image4 from '../assets/MasonaryGrid/image (13).png';
import image5 from '../assets/MasonaryGrid/image (14).png';
import image6 from '../assets/MasonaryGrid/image (11).png';
import ExploreAllServicesButton from './ExportServiceButton';

const imageConfig = [
  { src: image1, width: 614, height: 297 },
  { src: image2, width: 297, height: 297 },
  { src: image3, width: 297, height: 297 },
  { src: image4, width: 297, height: 297 },
  { src: image5, width: 614, height: 297 },
  { src: image6, width: 297, height: 297 },
];

const MasonaryGrid = () => {
  return (
    <div
      className="mx-auto py-10 text-center bg-white px-4 sm:px-6 md:px-[96px]"
      style={{ maxWidth: '1440px' }}
    >
      {/* Title */}
      <h2
        className="text-[32px] md:text-[40px] mb-4"
        style={{
          fontFamily: 'Abhaya Libre',
          fontWeight: 400,
          fontSize: '48px',
          lineHeight: '117%',
          letterSpacing: '-1.5px',
          textAlign: 'center',
          color: '#211C6A',
        }}
      >
        Services, Made for You
      </h2>

      {/* Description */}
      <p
        className="max-w-[800px] mx-auto mb-10"
        style={{
          fontFamily: 'Plus Jakarta Sans',
          fontWeight: 400,
          fontSize: '20px',
          lineHeight: '160%',
          letterSpacing: '0.15px',
          textAlign: 'center',
          color: '#222',
        }}
      >
        Discover a wide range of services designed to simplify your event planning journey. From
        venue bookings to curated packages—we’ve got everything you need to create unforgettable
        memories.
      </p>

      {/* Desktop View */}
      <div className="space-y-[35px] hidden md:block">
        {/* Row 1 */}
        <div className="flex gap-[10px] justify-center">
          {imageConfig.slice(0, 3).map((img, i) => (
            <div
              key={`row1-${i}`}
              className="transition-transform duration-300 ease-in-out hover:scale-105"
              style={{ borderRadius: 12, overflow: 'hidden' }}
            >
              <img
                src={img.src}
                alt={`img-${i}`}
                style={{
                  width: img.width,
                  height: img.height,
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>

        {/* Row 2 */}
        <div className="flex gap-[10px] justify-center">
          {imageConfig.slice(3, 6).map((img, i) => (
            <div
              key={`row2-${i}`}
              className="transition-transform duration-300 ease-in-out hover:scale-105"
              style={{ borderRadius: 12, overflow: 'hidden' }}
            >
              <img
                src={img.src}
                alt={`img-${i + 3}`}
                style={{
                  width: img.width,
                  height: img.height,
                  objectFit: 'cover',
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile View (No hover scaling) */}
    {/* Mobile View (No hover scaling, full image shown) */}
<div className="md:hidden grid grid-cols-2 gap-4">
  {imageConfig.map((img, i) => (
    <div
      key={`mobile-${i}`}
      className="w-full"
      style={{
        borderRadius: 12,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <img
        src={img.src}
        alt={`mobile-img-${i}`}
        style={{
          width: "100%",
          height: "auto",
          objectFit: "cover",
          borderRadius: 12,
        }}
      />
    </div>
  ))}
</div>


      <ExploreAllServicesButton />
    </div>
  );
};

export default MasonaryGrid;
