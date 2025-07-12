// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import background from "../assets/image1.png";
import casserole1 from "../assets/casserole/carousel.png";
import casserole2 from "../assets/casserole/casserole2.png";
import casserole3 from "../assets/casserole/casserole3.png";
import casserole4 from "../assets/casserole/casserole4.png";
import casserole5 from "../assets/casserole/casserole5.png";   

import event1 from "../assets/events/event1.png";
import event2 from "../assets/events/event2.png";
import event3 from "../assets/events/event3.png";
import event4 from "../assets/events/event4.png";
import event5 from "../assets/events/event5.png";
import event6 from "../assets/events/event6.png";

import service1 from "../assets/services/service1.png";
import service2 from "../assets/services/service2.png";
import service3 from "../assets/services/service3.png";
import service4 from "../assets/services/service4.png";
import service5 from "../assets/services/service.5.png";
import service6 from "../assets/services/service6.png";

import gallerybackground from '../assets/gallery/gallerybackground.png';   

export const eventCategories = [
  {
    id: "wedding",
    title: "Wedding",
    image: event1,
    tags: ["Engagement", "Mehndi", "Sangeet", "Wedding Ceremony", "Reception"],
  },
  {
    id: "parties",
    title: "Parties",
    image: event2,
    tags: [
      "Birthday Parties",
      "Anniversary Celebrations",
      "Baby Showers",
      "Farewell Parties",
      "Dinner Parties",
    ],
  },
  {
    id: "corporate",
    title: "Corporate Events",
    image: event3,
    tags: [
      "Conferences",
      "Team Outings",
      "Product Launches",
      "Annual General Meetings",
      "Training Sessions",
    ],
  },
  {
    id: "family",
    title: "Family Celebrations",
    image: event4,
    tags: [
      "Family Reunion",
      "Naming Ceremonies",
      "Pet Parties",
      "Get-Together",
      "Retirement Parties",
    ],
  },
  {
    id: "entertainment",
    title: "Entertainment Shows",
    image: event5,
    tags: [
      "Live Concerts",
      "Stand-up Comedy Shows",
      "Movie Screenings",
      "Fashion & Talent Shows",
    ],
  },
  {
    id: "cultural",
    title: "Cultural Events",
    image: event6,
    tags: [
      "Festivals",
      "Community Gatherings",
      "Spiritual Retreats",
      "Traditional Dance or Music Shows",
    ],
  },
];

const images = [casserole1, casserole2, casserole3, casserole4, casserole5];

// src/data/eventCategories.js

const serviceImages = [
  { id: 1, src: service1 },
  { id: 2, src: service2 },
  { id: 3, src: service3 },
  { id: 4, src: service4 },
  { id: 5, src: service5 },
  { id: 6, src: service6 },
];

export default function Home() {
  const [current, setCurrent] = useState(0);
  const len = images.length;

  // auto-advance every 3s
  useEffect(() => {
    const iv = setInterval(() => {
      setCurrent((c) => (c + 1) % len);
    }, 3000);
    return () => clearInterval(iv);
  }, [len]);

  // compute minimal circular offset in range [-len/2…+len/2]
  function circularOffset(i) {
    let diff = i - current;
    if (diff < -len / 2) diff += len;
    if (diff > len / 2) diff -= len;
    return diff;
  }

  return (
    <div className="w-full min-h-screen bg-gray-50 flex justify-center">
      <div
        className="flex flex-col items-center"
        style={{
          maxWidth: "1440px",
          width: "100%",
          margin: "0 auto",
          gap: "40px",
        }}
      >
        {/* Hero Section */}
        <div
          className="relative w-full flex justify-center items-center"
          style={{ minHeight: "00px", maxWidth: "1440px", margin: "0 auto" }}
        >
          <img
            src={background}
            alt="Hero Section"
            className="absolute inset-0 w-full h-full object-cover z-0"
            style={{
              maxWidth: "1440px",
              minHeight: "600px",
              height: "auto",
              filter: "blur(12px)",
            }}
          />
          <div className="absolute inset-0 bg-black/60 z-10" />
          <div
            className="relative z-20 flex flex-col items-center justify-center w-full h-full py-32"
            style={{ gap: "20px" }}
          >
            <h1
              style={{
                fontFamily: "Abhaya Libre, serif",
                fontWeight: 400,
                fontSize: "64px",
                lineHeight: "117%",
                letterSpacing: "-1.5px",
                color: "#fff",
                width: "860px",
                textAlign: "center",
              }}
            >
              Find Your Perfect Venue,
              <br />
              Hassle-Free!
            </h1>
            <p
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "160%",
                letterSpacing: "0.15px",
                color: "#fff",
                width: "860px",
                textAlign: "center",
              }}
            >
              Discover, compare, and book the best venues for weddings, parties
              and corporate events—all in one place.
            </p>
            <button
              className="flex items-center justify-center font-medium"
              style={{
                background: "#fff",
                color: "#9C27B0",
                border: "2px solid #9C27B0",
                borderRadius: "8px",
                padding: "8px 20px",
                height: "44px",
                fontSize: "20px",
                fontWeight: 500,
                gap: "8px",
                cursor: "pointer",
              }}
            >
              Explore Venues
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                style={{ stroke: "#9C27B0" }}
              >
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>
        {/* Carousel Section (1300×400) */}
        <div
          className="relative mx-auto flex items-center justify-center overflow-hidden"
          style={{
            width: "1300px",
            height: "400px",
            marginTop: "-80px",
            zIndex: 30,
          }}
        >
          {images.map((src, i) => {
            const delta = circularOffset(i);
            if (Math.abs(delta) > 2) return null;

            // Center image (main)
            let width = 384,
              height = 400,
              borderRadius = 32,
              top = 0;
            if (Math.abs(delta) >= 1) {
              width = 230;
              height = 240;
              borderRadius = 40;
              top = 80;
            }
            const x = delta * (width + 24);
            const scale =
              delta === 0
                ? "scale-110"
                : Math.abs(delta) === 1
                ? "scale-95"
                : "scale-75";
            const opacity =
              delta === 0
                ? "opacity-100"
                : Math.abs(delta) === 1
                ? "opacity-80"
                : "opacity-50";
            const zIndex =
              delta === 0 ? "z-30" : Math.abs(delta) === 1 ? "z-20" : "z-10";

            return (
              <img
                key={i}
                src={src}
                alt={`Slide ${i + 1}`}
                className={`
                  absolute
                  object-cover
                  transition-all duration-500 ease-in-out
                  ${scale} ${opacity} ${zIndex}
                `}
                style={{
                  width: `${width}px`,
                  height: `${height}px`,
                  borderRadius: `${borderRadius}px`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.10)",
                  transform: `translateX(${x}px) translateY(${top}px)`,
                }}
              />
            );
          })}

          {/* Prev / Next controls */}
          <button
            onClick={() => setCurrent((current - 1 + len) % len)}
            className="absolute left-2 text-white text-3xl focus:outline-none"
          >
            ‹
          </button>
          <button
            onClick={() => setCurrent((current + 1) % len)}
            className="absolute right-2 text-white text-3xl focus:outline-none"
          >
            ›
          </button>
        </div>
        {/* Events We Cover For You Section */}
        <section style={{ width: "100%", textAlign: "center", marginTop: "0" }}>
          <h2
            style={{
              fontFamily: "serif",
              fontSize: "48px",
              color: "#211C6A",
              fontWeight: 500,
              marginBottom: "24px",
            }}
          >
            Events We Cover For You
          </h2>
          <p
            style={{
              fontFamily: "sans-serif",
              fontSize: "24px",
              color: "#222",
              maxWidth: "900px",
              margin: "0 auto",
              lineHeight: 1.3,
            }}
          >
            Find the Perfect Venue for Every Occasion. From life's biggest
            milestones to intimate gatherings, we have venues tailored for all
            your needs.
          </p>
        </section>
        <div className="flex flex-wrap justify-center gap-6">
          {eventCategories.map((cat) => (
            <div
              key={cat.id}
              className="
                    w-[403px]
                    bg-[#F4F4F5]
                    border
                    border-[rgba(0,0,0,0.12)]  
                    rounded-[32px]
                    flex flex-col
                    gap-4
                    pb-5
                  "
            >
              {/* Image with only top corners rounded */}
              <img
                src={cat.image}
                alt={cat.title}
                className="
                      w-full
                      h-[250px]
                      object-cover
                      rounded-t-[32px]
                    "
              />

              {/* Title styled per Figma */}
              <h3
                style={{
                  fontFamily: "Plus Jakarta Sans, sans-serif",
                  fontWeight: 600,
                  fontSize: "28px",
                  lineHeight: "124%",
                  letterSpacing: "0.25px",
                  color: "#181375",
                  width: "373px",
                  height: "35px",
                }}
              >
                {cat.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 px-4">
                {cat.tags.map((tag) => (
                  <span
                    key={tag}
                    className="
                          text-sm
                          bg-[#EDE0FF]
                          text-[#7B2CBF]
                          rounded-full
                          px-3
                          py-1
                        "
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="w-full flex justify-center my-12 relative" style={{ minHeight: '700px' }}>
          <div style={{ width: '100%', maxWidth: '1440px', height: '700px', paddingLeft: '96px', paddingRight: '96px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <img src={gallerybackground} alt="Gallery Background" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
            {/* Overlay Card */}
            <div style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '776px',
              padding: '80px',
              borderRadius: '5px',
              border: '4px solid',
              borderImage: 'linear-gradient(90deg, #9C27B0 0%, #7B1FA2 100%) 1',
              background: 'rgba(156,39,176,0.5)',
              backdropFilter: 'blur(60px)',
              WebkitBackdropFilter: 'blur(60px)',
              boxSizing: 'border-box',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '40px',
              zIndex: 2
            }}>
              <h2 style={{
                fontFamily: 'Abhaya Libre, serif',
                fontWeight: 400,
                fontSize: '48px',
                lineHeight: '117%',
                letterSpacing: '-1.5px',
                color: '#fff',
                width: '616px',
                height: '56px',
                textAlign: 'center',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: 0
              }}>
                Explore Event Highlights
              </h2>
              <p style={{
                fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: 400,
                fontSize: '20px',
                lineHeight: '160%',
                letterSpacing: '0.15px',
                color: '#fff',
                width: '616px',
                textAlign: 'center',
                marginTop: '24px',
                marginBottom: 0
              }}>
                From elegant setups to lively crowds, our gallery reflects the <span style={{ color: '#B9AFFF', fontWeight: 500 }}>dedication</span> we bring to every event.
              </p>
            </div>
          </div>
        </div>
      </div>
      
    </div>
  );
}
