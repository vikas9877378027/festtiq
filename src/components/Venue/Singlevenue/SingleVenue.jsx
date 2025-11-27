import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import VenueGallery from "./VenueGallery";
import { FiMapPin } from "react-icons/fi";
import { toast } from "react-toastify";

import fallbackImg from "../../../assets/venue/image (11).png";
import VenueHighlight from "./VenueHighlight";
import Rating from "./Rating";

const API_BASE = "http://localhost:4000/api";
const FAVORITES_URL = `${API_BASE}/user/favorites`;
const TOGGLE_FAVORITE_URL = `${API_BASE}/user/favorites/toggle`;

const SingleVenue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const shareMenuRef = useRef(null);

  // Fetch venue details
  useEffect(() => {
    const fetchVenue = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/product/${id}`);
        const data = await response.json();
        
        if (response.ok && data?.success && data?.product) {
          setVenue(data.product);
        } else {
          setError("Venue not found");
        }
      } catch (err) {
        console.error("Error fetching venue:", err);
        setError("Failed to load venue details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchVenue();
    }
  }, [id]);

  // Check if venue is in favorites
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const storedUser = localStorage.getItem("auth_user");
        if (!storedUser) return;

        const response = await axios.get(FAVORITES_URL, {
          withCredentials: true,
        });

        if (response.data?.success) {
          const favorites = response.data.favorites || [];
          setIsFavorite(favorites.includes(id));
        }
      } catch (error) {
        console.error("Error checking favorite status:", error);
      }
    };

    if (id) {
      checkFavorite();
    }
  }, [id]);

  // Close share menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (shareMenuRef.current && !shareMenuRef.current.contains(event.target)) {
        setShowShareMenu(false);
      }
    };

    if (showShareMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showShareMenu]);

  // Toggle favorite status
  const handleFavoriteToggle = async () => {
    try {
      const storedUser = localStorage.getItem("auth_user");
      if (!storedUser) {
        toast.error("Please log in to save favorites", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      setFavoriteLoading(true);

      const response = await axios.post(
        TOGGLE_FAVORITE_URL,
        { venueId: id },
        { withCredentials: true }
      );

      if (response.data?.success) {
        setIsFavorite(!isFavorite);
        console.log(response.data.message);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      if (error.response?.status === 401) {
        toast.error("Please log in to save favorites", {
          position: "top-right",
          autoClose: 3000,
        });
      } else {
        toast.error("Failed to update favorite. Please try again", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } finally {
      setFavoriteLoading(false);
    }
  };

  // Share functionality
  const handleShare = async (platform) => {
    const shareUrl = window.location.href;
    const shareTitle = `Check out ${venue.name}`;
    const shareText = `${venue.name} - ${fullAddress}`;

    try {
      switch (platform) {
        case 'whatsapp':
          window.open(`https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`, '_blank');
          break;
        case 'facebook':
          window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank');
          break;
        case 'twitter':
          window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`, '_blank');
          break;
        case 'copy':
          await navigator.clipboard.writeText(shareUrl);
          toast.success('Link copied to clipboard!', {
            position: "top-right",
            autoClose: 2500,
          });
          break;
        case 'native':
          if (navigator.share) {
            await navigator.share({
              title: shareTitle,
              text: shareText,
              url: shareUrl
            });
          }
          break;
        default:
          break;
      }
      setShowShareMenu(false);
    } catch (error) {
      console.error('Error sharing:', error);
      if (platform === 'copy') {
        toast.error('Failed to copy link. Please try again', {
          position: "top-right",
          autoClose: 3000,
        });
      }
    }
  };

  // Format address
  const fullAddress = [
    venue?.address?.line1,
    venue?.address?.area,
    venue?.address?.city,
    venue?.address?.state,
    venue?.address?.pincode
  ].filter(Boolean).join(", ");

  // Open Google Maps
  const handleViewMap = () => {
    if (!venue?.address) {
      toast.error("Address not available for this venue", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Create Google Maps URL with the address
    const address = fullAddress || `${venue.name}, ${venue.address.city}`;
    const encodedAddress = encodeURIComponent(address);
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    
    // Open in new tab
    window.open(googleMapsUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="w-full px-4 pt-[150px] sm:px-6 lg:px-24 py-10 bg-white font-['Plus_Jakarta_Sans']">
        <div className="flex justify-center items-center h-64">
          <p className="text-lg text-gray-600">Loading venue details...</p>
        </div>
      </div>
    );
  }

  if (error || !venue) {
    return (
      <div className="w-full px-4 pt-[150px] sm:px-6 lg:px-24 py-10 bg-white font-['Plus_Jakarta_Sans']">
        <div className="flex flex-col justify-center items-center h-64 gap-4">
          <p className="text-lg text-red-600">{error || "Venue not found"}</p>
          <button
            onClick={() => navigate("/venues")}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
          >
            Back to Venues
          </button>
        </div>
      </div>
    );
  }

  // Prepare images for gallery
  const mainImage = venue.image?.[0] || fallbackImg;
  const sideImages = venue.image?.slice(1, 5) || [];

  return (
    <div className="w-full px-4 pt-[150px] sm:px-6 lg:px-24 py-10 bg-white font-['Plus_Jakarta_Sans']">
      {/* Title + Address + Buttons */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6 w-full">
        {/* Left: Title + Address */}
        <div className="max-w-full lg:max-w-[606px]">
          <h1
            className="font-['Abhaya_Libre'] text-[32px] sm:text-[40px] lg:text-[48px] leading-[117%] tracking-[-1.5px] font-normal text-[#181375]"
            style={{ verticalAlign: "middle" }}
          >
            {venue.name}
          </h1>
          <div className="flex items-start gap-2 mt-2 text-gray-600 text-sm sm:text-[12px] leading-[160%] tracking-[0.15px] flex-wrap">
            <FiMapPin size={16} className="text-gray-500 mt-1" />
            <span className="max-w-[90%]">
              {fullAddress || "Address not available"}
            </span>
          </div>
        </div>

        {/* Right: Buttons */}
        <div className="flex flex-col sm:flex-row sm:flex-wrap lg:flex-nowrap gap-3 w-full lg:w-auto">
          {/* Share Button with Dropdown */}
          <div ref={shareMenuRef} className="relative flex-1 sm:flex-none">
            <button
              onClick={() => setShowShareMenu(!showShareMenu)}
              className="w-full sm:w-[113px] h-[44px] px-[20px] py-[8px] flex items-center justify-center gap-[6px]
                text-gray-700 text-[16px] font-semibold leading-[26px] tracking-[0.46px] 
                border border-[#BDBDBD] rounded-xl shadow-sm hover:bg-gray-50 transition-colors"
            >
              Share
              <svg xmlns="http://www.w3.org/2000/svg" className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
            </button>

            {/* Share Dropdown Menu */}
            {showShareMenu && (
              <div className="absolute top-full mt-2 right-0 w-[200px] bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="py-2">
                  {/* WhatsApp */}
                  <button
                    onClick={() => handleShare('whatsapp')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </button>

                  {/* Facebook */}
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                    Facebook
                  </button>

                  {/* Twitter */}
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                    </svg>
                    Twitter
                  </button>

                  {/* Copy Link */}
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Link
                  </button>

                  {/* Native Share (Mobile) */}
                  {navigator.share && (
                    <button
                      onClick={() => handleShare('native')}
                      className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3"
                    >
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                      More Options
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Favorite Button */}
          <button
            onClick={handleFavoriteToggle}
            disabled={favoriteLoading}
            className={`flex-1 sm:flex-none sm:w-[113px] h-[44px] px-[20px] py-[8px] flex items-center justify-center gap-[6px]
              text-[16px] font-semibold leading-[26px] tracking-[0.46px]
              border rounded-xl shadow transition-all
              ${isFavorite 
                ? 'bg-red-50 border-red-300 text-red-600 hover:bg-red-100' 
                : 'bg-white border-[#BDBDBD] text-gray-700 hover:bg-gray-50'}
              ${favoriteLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isFavorite ? 'Favorited' : 'Favorite'}
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className="w-[18px] h-[18px]" 
              fill={isFavorite ? 'currentColor' : 'none'} 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 21l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 
                   2 5.42 4.42 3 7.5 3c1.74 0 3.41 1.01 4.5 
                   2.09C13.09 4.01 14.76 3 16.5 3 19.58 3 22 
                   5.42 22 8.5c0 3.78-3.4 6.86-8.55 
                   11.18L12 21z"
              />
            </svg>
          </button>

          {/* View Map Button */}
          <button
            onClick={handleViewMap}
            className="flex-1 sm:flex-none sm:w-[145px] h-[44px] px-[20px] py-[8px] flex items-center justify-center gap-[8px]
              text-white text-[16px] font-semibold leading-[26px] tracking-[0.46px]
              rounded-md shadow-md bg-gradient-to-b from-[#9C27B0] to-[#7B1FA2] hover:brightness-110 transition-all"
          >
            View Map
            <svg xmlns="http://www.w3.org/2000/svg" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Venue Gallery */}
      <VenueGallery mainImage={mainImage} thumbnails={sideImages} />

      {/* Highlights and Ratings */}
      <VenueHighlight venue={venue} />
      <Rating venue={venue} />
    </div>
  );
};

export default SingleVenue;
