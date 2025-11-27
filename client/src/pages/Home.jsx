// src/pages/Home.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import background from "../assets/image1.png";
// Casserole images removed - now using dynamic venue images from API

import event1 from "../assets/events/event1.png";
import event2 from "../assets/events/event2.png";
import event3 from "../assets/events/event3.png";
import event4 from "../assets/events/event4.png";
import event5 from "../assets/events/event5.png";
import event6 from "../assets/events/event6.png";

// Service images removed - now using dynamic data from API

import gallerybackground from '../assets/gallery/gallerybackground.png';
import MasonaryGrid from "../components/MasonaryGrid";
import GallerySection from "../components/Home/Highlight";
import WhyChooseUs from "../components/Home/ChooseUs";
import Question from "../components/Home/Question";
import EventCover from "../components/Home/EventCover";
import { useNavigate } from "react-router-dom";
import { MdArrowOutward } from "react-icons/md";

const API_BASE = "http://localhost:4000/api";
const VENUE_LIST_URL = `${API_BASE}/product/list`;

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

// Placeholder for fallback - will use first venue image if API fails
const images = [];

// Service images removed - now loaded dynamically from API
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  const [venueImages, setVenueImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use venue images from API, or show loading if not yet fetched
  const displayImages = venueImages.length > 0 ? venueImages : [];
  const len = displayImages.length;

  // Debug log
  useEffect(() => {
    console.log("🔍 displayImages:", displayImages);
    console.log("📊 venueImages.length:", venueImages.length);
    console.log("🎨 Using:", venueImages.length > 0 ? "API images" : "fallback images");
  }, [displayImages, venueImages]);

  const handleExploreClick = () => {
    navigate('/venues');
  };

  // Fetch venue images from API
  useEffect(() => {
    const fetchVenueImages = async () => {
      try {
        setLoading(true);
        console.log("🎯 Fetching venue images from:", VENUE_LIST_URL);
        const response = await axios.get(VENUE_LIST_URL);
        
        console.log("📦 API Response:", response.data);
        
        if (response.data?.success && Array.isArray(response.data.products)) {
          console.log("✅ Found", response.data.products.length, "venues");
          
          // Extract images from venues
          const allImages = [];
          response.data.products.forEach(venue => {
            console.log("🏛️ Venue:", venue.name, "Images:", venue.image);
            
            // Filter: Only include venues that have proper venue data (address and capacities)
            // This helps exclude test/invalid entries
            const isValidVenue = venue.address && (venue.capacities?.hall > 0 || venue.price > 0);
            
            if (!isValidVenue) {
              console.log("⚠️ Skipping venue (no valid venue data):", venue.name);
              return; // Skip this venue
            }
            
            // The field is 'image' not 'images' in the database
            if (venue.image && venue.image.length > 0) {
              // Add first image from each venue (not all images to avoid duplicates)
              const img = venue.image[0]; // Take only first image per venue
              
              // Check if image is already a full URL (Cloudinary) or local path
              const imageUrl = img.startsWith('http') 
                ? img  // Use as is if it's already a full URL
                : `http://localhost:4000${img}`; // Add localhost for local images
              console.log("🖼️ Adding image:", imageUrl);
              allImages.push(imageUrl);
            }
          });
          
          console.log("📸 Total images collected:", allImages.length);
          
          // Limit to 5 images for carousel (to match original design)
          const selectedImages = allImages.slice(0, 5);
          console.log("🎨 Selected images for carousel:", selectedImages);
          
          if (selectedImages.length > 0) {
            setVenueImages(selectedImages);
            console.log("✅ Venue images set successfully!");
          } else {
            console.log("⚠️ No images found, using fallback");
          }
        } else {
          console.log("❌ Invalid response structure");
        }
      } catch (error) {
        console.error("❌ Error fetching venue images:", error);
        // Will use fallback images
      } finally {
        setLoading(false);
      }
    };

    fetchVenueImages();
  }, []);


  // Auto advance
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % len);
    }, 3000);
    return () => clearInterval(timer);
  }, [len]);

  // Listen to window resize for responsive logic
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const getSlideStyle = (index) => {
    const position = (index - currentIndex + len) % len;

    const styles = {
      0: {
        transform: isMobile ? "translateX(-160px) scale(0.8)" : "translateX(-380px) scale(0.85)",
        zIndex: 10,
        opacity: 0.6,
        top: isMobile ? "20px" : "60px",
        width: isMobile ? "100px" : "220px",
        height: isMobile ? "120px" : "240px",
      },
      1: {
        transform: isMobile ? "translateX(-80px) scale(0.9)" : "translateX(-200px) scale(0.95)",
        zIndex: 20,
        opacity: 0.85,
        top: isMobile ? "10px" : "30px",
        width: isMobile ? "140px" : "300px",
        height: isMobile ? "160px" : "320px",
      },
      2: {
        transform: isMobile ? "translateX(0px) scale(1)" : "translateX(0px) scale(1.05)",
        zIndex: 30,
        opacity: 1,
        top: "0px",
        width: isMobile ? "180px" : "380px",
        height: isMobile ? "200px" : "380px",
      },
      3: {
        transform: isMobile ? "translateX(80px) scale(0.9)" : "translateX(200px) scale(0.95)",
        zIndex: 20,
        opacity: 0.85,
        top: isMobile ? "10px" : "30px",
        width: isMobile ? "140px" : "300px",
        height: isMobile ? "160px" : "320px",
      },
      4: {
        transform: isMobile ? "translateX(160px) scale(0.8)" : "translateX(380px) scale(0.85)",
        zIndex: 10,
        opacity: 0.6,
        top: isMobile ? "20px" : "60px",
        width: isMobile ? "100px" : "220px",
        height: isMobile ? "120px" : "240px",
      },
    };

    return styles[position] || { display: "none" };
  };

  return (
    <div>
      <div className="w-full min-h-screen pt-[100px] overflow-x-hidden relative bg-gray-50">
        {/* Background Image */}
        <img
          src={background}
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover z-0"
          style={{ filter: "blur(2px)" }}
        />

        {/* Dark Overlay */}
        <div
          className="absolute inset-0 z-10"
          style={{
            background: "#00000099",
            backdropFilter: "blur(12px)",
            WebkitBackdropFilter: "blur(12px)",
          }}
        />

        {/* Content Section */}
        <div className="relative z-20 flex flex-col items-center text-center px-4 sm:px-6 md:px-12 lg:px-[96px] pt-24">
          {/* Hero Text */}
          <div className="max-w-[860px] w-full space-y-6">
            <h1 className="py-5"
              style={{
                fontFamily: "Abhaya Libre, serif",
                fontWeight: 400,
                fontSize: "64px",
                lineHeight: "117%",
                letterSpacing: "-1.5px",
                color: "white",
              }}
            >
              Find Your Perfect Venue,
              <br />
              Hassle-Free!
            </h1>

            <p
              className="text-white"
              style={{
                fontFamily: "Plus Jakarta Sans, sans-serif",
                fontWeight: 400,
                fontSize: "20px",
                lineHeight: "160%",
                letterSpacing: "0.15px",
              }}
            >

              Discover, compare, and book the best venues for weddings, parties and corporate events-all in one place.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleExploreClick}
                className="group flex items-center  justify-center gap-2 text-[#9C27B0] border-2 border-[#9C27B0] rounded-lg px-5 py-2 text-xl sm:text-lg font-medium bg-white transition duration-200 hover:text-white hover:border-transparent hover:bg-gradient-to-r hover:from-[#9C27B0] hover:to-[#7B1FA2]"
              >
                Explore Venues
                <MdArrowOutward size={20} />

              </button>

            </div>
          </div>

          {/* Carousel Section */}
          <div
            className="relative flex items-center justify-center overflow-visible mt-20"
            style={{ width: "100%", maxWidth: "1300px", height: isMobile ? "240px" : "420px", zIndex: 20 }}
          >
            {loading ? (
              <div className="absolute flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : (
              displayImages.map((src, i) => {
                console.log(`🖼️ Rendering image ${i}:`, src);
                return (
                  <img
                    key={`carousel-${i}-${src}`}
                    src={src}
                    alt={`Venue ${i + 1}`}
                    className="absolute object-cover transition-all duration-700 ease-in-out"
                    style={{
                      ...getSlideStyle(i),
                      borderRadius: "28px",
                      boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                    }}
                    onLoad={() => console.log(`✅ Image ${i} loaded:`, src)}
                    onError={(e) => {
                      console.log(`❌ Image ${i} failed to load:`, src);
                      // Hide broken images
                      e.target.style.display = 'none';
                    }}
                  />
                );
              })
            )}

            {/* Controls */}
            <button
              onClick={() => setCurrentIndex((currentIndex - 1 + len) % len)}
              className="absolute left-4 text-white text-3xl focus:outline-none z-40"
            >
              ‹
            </button>
            <button
              onClick={() => setCurrentIndex((currentIndex + 1) % len)}
              className="absolute right-4 text-white text-3xl focus:outline-none z-40"
            >
              ›
            </button>
          </div>


        </div>


      </div>
      <EventCover />


      <MasonaryGrid />
      <GallerySection />
      <WhyChooseUs />
      <Question />
    </div>

  );
}
