import React, { useEffect } from "react";
import heroBg from "../assets/venue/aboutus.png";
import numbersBg from "../assets/venue/aboutus1.png";
import testimonial1 from "../assets/venue/people1.png";
import testimonial2 from '../assets/venue/people2.png'


export default function AboutUs() {
     useEffect(() => {
      window.scrollTo(0, 0); 
    }, []);
  return (
    <>
      {/* 1) Hero section */}
      <div
        className="w-full pt-[100px] h-[435px] flex flex-col justify-center items-center px-4 text-white text-center"
        style={{
          backgroundImage: `url(${heroBg})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <h1 className="font-['Abhaya Libre'] text-[40px] sm:text-[64px] font-normal leading-[117%] tracking-[-1.5px] text-white">
          About Festtiq
        </h1>

        <p className="font-['Plus Jakarta Sans'] text-[16px] sm:text-[20px] font-normal leading-[160%] tracking-[0.15px] mt-4 max-w-[800px] text-white">
          Learn about our journey, our passion for creating memorable events, and our commitment to delivering exceptional services tailored to your needs.
        </p>
      </div>

      {/* 2) Our Story panel */}
      <div className="w-full max-w-[850px] mx-auto flex flex-col items-center gap-[12px] my-8 px-4">
        <h2 className="font-abhaya font-normal text-[36px] sm:text-[48px] leading-[117%] tracking-[-1.5px] text-[#181375] text-center">
          Our Story
        </h2>
        <p className="text-center text-[16px] sm:text-[18px] leading-[150%] text-gray-700">
          Founded with the vision to simplify event planning, we started our journey to bridge the gap between customers and event venues. Over the years, we've helped countless customers turn their dream events into reality.
        </p>
      </div>

      {/* 3) Numbers That Inspire Confidence */}
      <div className="w-full flex flex-col md:flex-row justify-center items-start gap-[40px] py-12 px-4 sm:px-8 max-w-[1240px] mx-auto">
        <img
          src={numbersBg}
          alt="Event Crowd"
          className="object-cover rounded-xl w-full md:w-[604px] h-auto"
        />

        <div className="flex flex-col gap-8 w-full md:w-[604px]">
          <div className="flex flex-col gap-2">
            <p className="font-['Plus Jakarta Sans'] text-[18px] sm:text-[20px] text-[#9C27B0]">
              Numbers That Inspire Confidence
            </p>
            <h2 className="font-['Abhaya Libre'] text-[28px] sm:text-[36px] md:text-[48px] font-normal leading-[117%] tracking-[-1.5px] text-[#181375]">
              We're only just getting started on our journey
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-6 mt-6">
            <div>
              <div className="text-[#9C27B0] text-[40px] sm:text-[48px] md:text-[64px] font-bold font-['Plus Jakarta Sans'] leading-none">
                1000+
              </div>
              <div className="text-[#222] text-[14px] sm:text-[16px] font-['Plus Jakarta Sans']">
                Events Successfully Organized
              </div>
            </div>
            <div>
              <div className="text-[#9C27B0] text-[40px] sm:text-[48px] md:text-[64px] font-bold font-['Plus Jakarta Sans'] leading-none">
                500+
              </div>
              <div className="text-[#222] text-[14px] sm:text-[16px] font-['Plus Jakarta Sans']">
                Verified Venues
              </div>
            </div>
            <div>
              <div className="text-[#9C27B0] text-[40px] sm:text-[48px] md:text-[64px] font-bold font-['Plus Jakarta Sans'] leading-none">
                95%
              </div>
              <div className="text-[#222] text-[14px] sm:text-[16px] font-['Plus Jakarta Sans']">
                Customer Satisfaction
              </div>
            </div>
            <div>
              <div className="text-[#9C27B0] text-[40px] sm:text-[48px] md:text-[64px] font-bold font-['Plus Jakarta Sans'] leading-none">
                1.5+
              </div>
              <div className="text-[#222] text-[14px] sm:text-[16px] font-['Plus Jakarta Sans']">
                Years of Excellence
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 4) Testimonials Section */}
      <div className="w-full bg-white py-16 px-4">
        <div className="max-w-[1240px] mx-auto text-center">
          <h2 className="text-[#181375] font-['Abhaya Libre'] text-[28px] sm:text-[36px] md:text-[40px] font-normal">
            Hear from Our Happy Customers
          </h2>
          <p className="text-[#333] text-[14px] sm:text-[16px] md:text-[18px] font-['Plus Jakarta Sans'] mt-2">
            See what our customers say about our seamless planning and exceptional service.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
            <div className="border border-[#9C27B0] rounded-xl p-6 text-left shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img src={testimonial1} alt="Priya & Arjun" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-[#222]">Priya & Arjun</p>
                  <p className="text-sm text-gray-500">Chennai</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                “Planning our wedding was so much easier with their services. The venue suggestions were perfect, and everything was handled professionally.”
              </p>
              <div className="text-[#FFC107] mt-3 text-lg">★★★★★</div>
            </div>

            <div className="border border-[#9C27B0] rounded-xl p-6 text-left shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <img src={testimonial2} alt="Meera" className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-[#222]">Meera</p>
                  <p className="text-sm text-gray-500">Birthday Party Host</p>
                </div>
              </div>
              <p className="text-gray-700 text-sm">
                “From the booking process to the event execution, everything was smooth and stress-free. Their team truly knows how to create memorable experiences.”
              </p>
              <div className="text-[#FFC107] mt-3 text-lg">★★★★★</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

