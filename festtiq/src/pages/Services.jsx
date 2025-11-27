import React from 'react'
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import service1 from "../assets/services/service1.png";
import service2 from "../assets/services/service2.png";
import service3 from "../assets/services/service3.png";
import service4 from "../assets/services/service4.png";
import service5 from "../assets/services/service.5.png";
import service6 from "../assets/services/service6.png";


const serviceImages = [
  { id: 1, src: service1 },
  { id: 2, src: service2 },
  { id: 3, src: service3 },
  { id: 4, src: service4 },
  { id: 5, src: service5 },
  { id: 6, src: service6 },
];
function Services() {
  return (
   <section className="py-16 px-24 max-w-screen-xl mx-auto">
      {/* …header… */}

      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={40}
        slidesPerView={3}
        navigation
        pagination={{ clickable: true }}
        loop
        autoplay={{ delay: 3000 }}
        breakpoints={{
          320:  { slidesPerView: 1, spaceBetween: 20 },
          640:  { slidesPerView: 2, spaceBetween: 30 },
          1024: { slidesPerView: 3, spaceBetween: 40 },
        }}
      >
        {serviceImages.map(({ id, src, alt }) => (
          <SwiperSlide key={id} className="overflow-hidden rounded-2xl shadow-lg">
            <img src={src} alt={alt} className="w-full h-auto object-cover" />
          </SwiperSlide>
        ))}
      </Swiper>

      {/* …button… */}
    </section>
  )
}

export default Services
