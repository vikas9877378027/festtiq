import React from 'react';
import gallerybackground from '../../assets/gallery/gallerybackground.png';
import { ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GallerySection = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full flex justify-center my-2 relative px-4 sm:px-6 md:px-0">
      {/* Background Image Wrapper */}
      <div className="w-full max-w-[1440px] relative flex items-center justify-center min-h-[500px] sm:min-h-[600px] md:min-h-[700px]">
        {/* Background Image */}
        <img
          src={gallerybackground}
          alt="Gallery Background"
          className="w-full h-full object-cover"
        />

        {/* Glass Card */}
        <div
          className="absolute flex flex-col items-center justify-center text-center px-4 sm:px-6 md:px-20 py-6 sm:py-10 md:py-12 rounded-[20px] border-[4px] border-transparent backdrop-blur-[20px] bg-gradient-to-br from-[#9C27B059] to-[#7B1FA259] shadow-lg z-10 w-[90%] max-w-[776px]"
          style={{
            borderImageSource:
              'linear-gradient(250.6deg, #9C27B0 5.62%, #7B1FA2 95.85%)',
            borderImageSlice: 1,
          }}
        >
          {/* Title */}
          <h2
            style={{
              fontFamily: 'Abhaya Libre',
              fontWeight: 100,
              fontStyle: 'normal',
              fontSize: '40px', // smaller on mobile
              lineHeight: '117%',
              letterSpacing: '-1.5px',
              textAlign: 'center',
              color: '#FFFFFF',
            }}
            className="sm:text-[48px] md:text-[60px]"
          >
            Explore Event Highlights
          </h2>

          {/* Description */}
          <p
            className="pt-4 mb-6"
            style={{
              fontFamily: 'Plus Jakarta Sans',
              fontWeight: 400,
              fontStyle: 'normal',
              fontSize: '16px',
              lineHeight: '160%',
              letterSpacing: '0.15px',
              textAlign: 'center',
              color: '#FFFFFF',
              maxWidth: '600px',
            }}
          >
            From elegant setups to lively crowds, our gallery reflects the{' '}
            <span style={{ color: '#B9AFFF', fontWeight: 500 }}>dedication</span> we bring to every event.
          </p>

          {/* Button */}
          <button
            onClick={() => navigate('/gallery')}
            className="mt-2 flex items-center gap-2 px-5 py-2 rounded-md bg-white text-[#7B1FA2] font-semibold text-sm hover:bg-gray-100 transition"
          >
            Explore Gallery
            <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GallerySection;
