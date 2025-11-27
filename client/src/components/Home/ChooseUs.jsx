import React from "react";
import sampleImage from "../../assets/MasonaryGrid/image (12).png";
import {
  CalendarCheck,
  MagicWand,
  CircleWavyCheck,
  Smiley,
} from  'phosphor-react';
; 
import './ChooseUs.css';

const WhyChooseUs = () => {
  const features = [
    {
      icon: <CalendarCheck size={32} color="#9C27B0" weight="regular" />,
      title: "Simplified Bookings",
      desc: "Our platform is designed to make finding and booking venues fast and hassle-free.",
    },
    {
      icon: <MagicWand size={32} color="#9C27B0" weight="regular" />,
      title: "Unmatched Variety",
      desc: "From luxurious wedding halls to cozy party spaces—we have something for every occasion.",
    },
    {
      icon: <CircleWavyCheck size={32} color="#9C27B0" weight="regular" />,
      title: "Complete Transparency",
      desc: "Know exactly what you're paying for with clear pricing and real-time availability updates.",
    },
    {
      icon: <Smiley size={32} color="#9C27B0" weight="regular" />,
      title: "Customer-Centric Approach",
      desc: "Our dedicated support team ensures a smooth experience, so you can focus on your special day.",
    },
  ];

  return (
    <section
      className="w-full flex flex-col items-center justify-center px-4 sm:px-10 lg:px-[96px] py-20"
      style={{ maxWidth: "1440px", margin: "0 auto" }}
    >
      {/* Heading */}
      <div className="flex flex-col items-center text-center gap-3 max-w-[850px] mb-10">
        <h2
          style={{
            fontFamily: "Abhaya Libre, serif",
            fontWeight: 400,
            fontSize: "48px",
            lineHeight: "117%",
            letterSpacing: "-1.5px",
            color: "#211C6A",
          }}
        >
          Why Choose Us?
        </h2>
        <p
          style={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 400,
            fontSize: "20px",
            lineHeight: "160%",
            letterSpacing: "0.15px",
            color: "#444",
          }}
        >
          We simplify event planning with top venues, transparent pricing, and customer-first
          features, ensuring your special moments are stress-free and memorable.
        </p>
      </div>

      {/* Image + Features */}
      <div className="flex flex-col lg:flex-row w-full gap-10 items-center lg:items-start">
        {/* Image */}
        <img
          src={sampleImage}
          alt="Event"
          className="w-full max-w-[389px] h-[390px] rounded-[40px] object-cover"
        />

        {/* Features */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-8 w-full">
          {features.map((feature, index) => (
            <div key={index} className="feature-box">
              <div className="feature-icon">{feature.icon}</div>
              <div>
                <h3 className="feature-title  py-3">{feature.title}</h3>
                <p className="feature-description">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

