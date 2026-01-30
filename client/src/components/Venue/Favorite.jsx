import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import eventFallback from "../../assets/venue/image (11).png";
import {
  FAVORITES_URL,
  PRODUCT_LIST_URL,
  TOGGLE_FAVORITE_URL,
} from "../../config/apiConfig";

const Favorite = () => {
  const navigate = useNavigate();
  const [favoriteVenues, setFavoriteVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currency = (n) =>
    (Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // Fetch favorites and venue details
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setLoading(true);
        setError("");

        // Check if user is logged in
        const storedUser = localStorage.getItem("auth_user");
        if (!storedUser) {
          setError("Please log in to view your favorites");
          setLoading(false);
          return;
        }

        // Get user's favorite IDs
        const favResponse = await axios.get(FAVORITES_URL, {
          withCredentials: true,
        });

        if (!favResponse.data?.success) {
          throw new Error("Failed to load favorites");
        }

        const favoriteIds = favResponse.data.favorites || [];
        
        if (favoriteIds.length === 0) {
          setFavoriteVenues([]);
          setLoading(false);
          return;
        }

        // Get all venues
        const venuesResponse = await axios.get(PRODUCT_LIST_URL);
        
        if (!venuesResponse.data?.success) {
          throw new Error("Failed to load venues");
        }

        const allVenues = venuesResponse.data.products || [];
        
        // Filter to only favorite venues
        const favorites = allVenues
          .filter(venue => favoriteIds.includes(venue._id))
          .map(venue => ({
            id: venue._id,
            title: venue.name,
            image: venue.image?.[0] || eventFallback,
            location: `${venue.address?.area || ""}, ${venue.address?.city || ""}`.trim(),
            tags: [
              `${venue.capacities?.hall || 0} Capacity`,
              `${venue.capacities?.guestRooms || 0} Rooms`,
              venue.venueType || "Indoor"
            ],
            price: venue.offerPrice || venue.price || 0,
            rating: 5.0,
            badge: venue.isFeatured ? "Most Viewed" : null,
          }));

        setFavoriteVenues(favorites);
      } catch (err) {
        console.error("Error loading favorites:", err);
        if (err.response?.status === 401) {
          setError("Please log in to view your favorites");
        } else {
          setError("Failed to load favorites. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    loadFavorites();
  }, []);

  const removeFavorite = async (venueId) => {
    try {
      const response = await axios.post(
        TOGGLE_FAVORITE_URL,
        { venueId },
        { withCredentials: true }
      );

      if (response.data?.success) {
        // Remove from UI
        setFavoriteVenues(prev => prev.filter(v => v.id !== venueId));
      }
    } catch (error) {
      console.error("Error removing favorite:", error);
      toast.error("Failed to remove favorite. Please try again", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-[100px] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8F24AB] mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your favorites...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-[100px] flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">{error}</h2>
          <button
            onClick={() => navigate("/")}
            className="mt-4 px-5 py-2 rounded-md bg-[#8F24AB] text-white hover:bg-[#741a92]"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-[100px] px-4 sm:px-6 md:px-10 xl:px-20 py-8 max-w-screen-2xl mx-auto">
      {/* Page Heading */}
      <div className="mb-6">
        <h2
          className="text-2xl sm:text-3xl font-semibold text-[#212121]"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          Your Favorite Venues
        </h2>
        <p
          className="text-sm text-gray-500 mt-1"
          style={{ fontFamily: "Plus Jakarta Sans, sans-serif" }}
        >
          {favoriteVenues.length > 0 
            ? `${favoriteVenues.length} saved favorite venue${favoriteVenues.length !== 1 ? 's' : ''}`
            : "No favorites yet. Start adding venues you love!"}
        </p>
      </div>

      {/* Venue Grid or Empty State */}
      {favoriteVenues.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💜</div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No favorites yet</h3>
          <p className="text-gray-500 mb-6">Start exploring venues and add your favorites!</p>
          <button
            onClick={() => navigate("/venues")}
            className="px-6 py-3 bg-[#8F24AB] text-white rounded-lg hover:bg-[#741a92] transition-colors"
          >
            Browse Venues
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
          {favoriteVenues.map((venue) => (
            <div
              key={venue.id}
              className="rounded-xl bg-white border border-[#E0E0E0] shadow-sm min-h-[380px] w-full max-w-full mx-auto cursor-pointer hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <img
                  src={venue.image}
                  alt={venue.title}
                  onClick={() => navigate(`/venues/${venue.id}`)}
                  className="w-full h-[180px] object-cover rounded-t-xl"
                />
                {venue.badge && (
                  <span className="absolute top-2 left-2 bg-white text-[10px] font-medium px-2 py-1 rounded-full shadow-sm">
                    👑 {venue.badge}
                  </span>
                )}
                <span
                  className="absolute top-2 right-2 text-xl text-red-500 cursor-pointer hover:scale-110 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFavorite(venue.id);
                  }}
                  title="Remove from favorites"
                >
                  ❤️
                </span>
              </div>

              <div
                className="px-4 pt-2 pb-3"
                onClick={() => navigate(`/venues/${venue.id}`)}
              >
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span className="text-[15px] sm:text-[16px]">{venue.title}</span>
                  <div className="flex items-center text-yellow-500 text-sm gap-1">
                    <span>⭐</span>
                    <span className="font-medium">{venue.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">{venue.location}</p>
                <div className="flex gap-2 mt-2 flex-wrap text-xs text-gray-700">
                  {venue.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="px-2 py-[2px] bg-gray-100 border border-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="pt-2 text-md font-bold text-black">
                  ₹{currency(venue.price)}{" "}
                  <span className="text-sm font-normal text-gray-500">Per Day</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorite;
