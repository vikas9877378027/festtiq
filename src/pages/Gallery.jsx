import React, { useEffect, useState } from "react";
import { ArrowUpRight } from "@phosphor-icons/react";
import axios from "axios";

// Service image removed - using API data

const API_BASE = "http://localhost:4000/api";
const GALLERY_LIST_URL = `${API_BASE}/gallery-section/list`;

// Default placeholder if gallery has no images
const fallbackImage = "https://via.placeholder.com/400x300?text=Gallery+Image";

export default function Gallery() {
  const [gallerySections, setGallerySections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSections, setExpandedSections] = useState({}); // Track which sections are expanded

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchGallerySections();
  }, []);

  // Toggle view more for a specific section
  const toggleViewMore = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Fetch gallery sections from API
  const fetchGallerySections = async () => {
    try {
      setLoading(true);
      const response = await axios.get(GALLERY_LIST_URL);
      
      console.log("Gallery sections response:", response.data);
      
      if (response.data?.success && Array.isArray(response.data.sections)) {
        // Filter only active sections
        const activeSections = response.data.sections.filter(section => section.isActive);
        
        // Map to the format needed for display
        const mappedSections = activeSections.map(section => ({
          title: section.heading,
          description: section.description,
          images: section.images.map((url, index) => ({
            src: url,
            // Alternate between wide (614x297) and square (297x297) for masonry effect
            width: index % 3 === 0 ? 614 : 297,
            height: 297,
          })),
        }));
        
        setGallerySections(mappedSections);
      } else {
        setGallerySections([]);
      }
    } catch (err) {
      console.error("Error fetching gallery sections:", err);
      setError("Failed to load gallery sections");
      setGallerySections([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1440px] mx-auto px-4 pt-[172px] pb-20 bg-white text-black">
      {/* Intro */}
      <div className="w-full max-w-[850px] flex flex-col items-center justify-center gap-3 text-center mx-auto mb-16 px-4">
        <h2
          className="text-[#181375] font-abhaya font-normal text-[58px] leading-[117%] tracking-[-1.5px]"
          style={{ fontFamily: "Abhaya Libre" }}
        >
          Unveiling the Beauty of Cherished Celebrations
        </h2>
        <p
          className="text-[#212121] font-plusjakarta font-normal text-[20px] leading-[160%] tracking-[0.15px]"
          style={{ fontFamily: "Plus Jakarta Sans" }}
        >
          Discover stunning moments of our venues and services, showcasing unforgettable moments and perfect settings tailored for your event. Get inspired for your next event!
        </p>
        <button
          className="mt-6 w-[225px] h-[44px] px-3 py-2 rounded-[7px] text-white font-medium text-lg flex items-center justify-center gap-2 transition-all duration-300 ease-in-out hover:brightness-90"
          style={{
            background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
            boxShadow: `
              0px 3px 1px -2px rgba(0, 0, 0, 0.2),
              0px 2px 2px 0px rgba(0, 0, 0, 0.14),
              0px 1px 5px 0px rgba(0, 0, 0, 0.12)
            `,
            fontFamily: "Plus Jakarta Sans",
          }}
        >
          Explore All Services
          <ArrowUpRight size={16} />
        </button>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-600 text-lg">Loading gallery sections...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-red-600 text-lg mb-4">{error}</p>
          <button
            onClick={fetchGallerySections}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && gallerySections.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <p className="text-gray-600 text-lg mb-2">No gallery sections available yet.</p>
          <p className="text-gray-500 text-sm">Check back soon for amazing event photos!</p>
        </div>
      )}

      {/* Masonry Style Layout Per Section */}
      {!loading && !error && gallerySections.map((section, index) => {
        const isExpanded = expandedSections[index];
        const displayImages = isExpanded ? section.images : section.images.slice(0, 6);
        const hasMoreImages = section.images.length > 6;

        return (
          <div key={index} className="mb-20 px-4 sm:px-6 md:px-20">
            <h2 className="font-abhaya font-medium text-[32px] sm:text-[36px] md:text-[60px] leading-[117%] tracking-[-1.2px] text-left text-[#181375] mb-2">
              {section.title}
            </h2>
            <p
              className="text-left mb-6 "
              style={{
                fontFamily: "Plus Jakarta Sans",
                fontWeight: 400,
                fontStyle: "normal",
                fontSize: "20px",
                lineHeight: "160%",
                letterSpacing: "0.15px",
                color: "#212121",
              }}
            >
              {section.description}
            </p>

            {/* Desktop View */}
            <div className="space-y-[35px] hidden md:block">
              <div className="flex gap-[10px]">
                {displayImages.slice(0, 3).map((img, i) => (
                <div
                  key={`row1-${i}`}
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                  style={{ borderRadius: 12, overflow: "hidden" }}
                >
                  <img
                    src={img.src}
                    alt={`img-${i}`}
                    style={{
                      width: img.width,
                      height: img.height,
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>

            <div className="flex gap-[10px] flex-wrap">
              {displayImages.slice(3).map((img, i) => (
                <div
                  key={`row2-${i}`}
                  className="transition-transform duration-300 ease-in-out hover:scale-105"
                  style={{ borderRadius: 12, overflow: "hidden" }}
                >
                  <img
                    src={img.src}
                    alt={`img-${i + 3}`}
                    style={{
                      width: img.width,
                      height: img.height,
                      objectFit: "cover",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile View */}
          <div className="md:hidden grid grid-cols-2 gap-4 mt-6">
            {displayImages.map((img, i) => (
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

          {/* View More/Less Button */}
          {hasMoreImages && (
            <div className="mt-6 flex">
              <button
                className="text-white font-semibold text-[16px] leading-[26px] transition-all duration-300 hover:brightness-90"
                style={{
                  width: isExpanded ? 125 : 125,
                  height: 44,
                  paddingTop: 8,
                  paddingRight: 20,
                  paddingBottom: 8,
                  paddingLeft: 20,
                  borderRadius: 7,
                  fontFamily: "Plus Jakarta Sans",
                  background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
                  boxShadow: `
                    0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                    0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                    0px 1px 5px 0px rgba(0, 0, 0, 0.12)
                  `,
                }}
                onClick={() => toggleViewMore(index)}
              >
                {isExpanded ? "View Less" : "View More"}
              </button>
              {!isExpanded && (
                <span className="ml-3 text-gray-600 text-sm self-center">
                  +{section.images.length - 6} more images
                </span>
              )}
            </div>
          )}
        </div>
        );
      })}
    </div>
  );
}
