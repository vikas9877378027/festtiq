// src/pages/Bookings.jsx
import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  CalendarBlank,
  MapPin,
  Buildings,
  Clock,
  PaperPlaneTilt,
  Receipt,
  ChatCircleDots,
} from "@phosphor-icons/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BOOKING_USER_URL, getImageUrl } from "../config/apiConfig";

const Bookings = () => {
  const navigate = useNavigate();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's bookings
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(BOOKING_USER_URL, {
        withCredentials: true,
      });

      console.log("Bookings response:", response.data);

      if (response.data?.success && Array.isArray(response.data.orders)) {
        setBookings(response.data.orders);
      } else {
        setBookings([]);
      }
    } catch (err) {
      console.error("Error fetching bookings:", err);

      let errorMsg = "Failed to load bookings";
      if (err?.response?.status === 401) {
        errorMsg = "Please log in to view your bookings";
        // Optionally redirect to login
        setTimeout(() => navigate("/"), 2000);
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      }

      setError(errorMsg);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Format date array
  const formatEventDates = (dates) => {
    if (!dates || dates.length === 0) return "N/A";
    if (dates.length === 1) return dates[0];
    return `${dates[0]} - ${dates[dates.length - 1]}`;
  };

  // Format booking ID
  const formatBookingId = (id) => {
    return `#${id.slice(-6).toUpperCase()}`;
  };

  // Get status display
  const getStatusDisplay = (booking) => {
    const { paymentStatus, status } = booking;

    if (paymentStatus === "pending") {
      return { text: "Booked", color: "bg-orange-500" };
    } else if (paymentStatus === "partiallyPaid") {
      return { text: "Partially Paid", color: "bg-orange-500" };
    } else if (paymentStatus === "paid" && status === "booked") {
      return { text: "Confirmed", color: "bg-green-500" };
    } else if (status === "requestedServices") {
      return { text: "Requested Services", color: "bg-blue-500" };
    } else if (status === "completed") {
      return { text: "Completed", color: "bg-gray-500" };
    }

    return { text: "Booked", color: "bg-green-500" };
  };

  // Get venue image
  const getVenueImage = (booking) => {
    if (booking.venueId?.images && booking.venueId.images.length > 0) {
      return getImageUrl(booking.venueId.images[0]);
    }
    // Fallback to service image if only services booked
    if (
      booking.selectedServices &&
      booking.selectedServices.length > 0 &&
      booking.selectedServices[0].serviceId?.image
    ) {
      return booking.selectedServices[0].serviceId.image;
    }
    // Default placeholder
    return "https://via.placeholder.com/120x120?text=Event";
  };

  // Get venue name
  const getVenueName = (booking) => {
    if (booking.venueId?.name) {
      return booking.venueId.name;
    }
    if (booking.selectedServices && booking.selectedServices.length > 0) {
      return "Services Only";
    }
    return "Event Venue";
  };

  // Get venue address
  const getVenueAddress = (booking) => {
    if (booking.venueId?.address) {
      const addr = booking.venueId.address;
      return `${addr.line1 || ""}, ${addr.area || ""}, ${addr.city || ""}, ${
        addr.state || ""
      } - ${addr.pincode || ""}`.replace(/,\s*,/g, ",");
    }
    return "Address not available";
  };

  // Open Google Maps
  const openGoogleMaps = (booking) => {
    if (booking.venueId?.address) {
      const addr = booking.venueId.address;
      const query = encodeURIComponent(
        `${addr.line1}, ${addr.area}, ${addr.city}, ${addr.state} ${addr.pincode}`
      );
      window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
    }
  };

  return (
    <div className="font-['Plus Jakarta Sans'] pt-[100px] bg-[#FAFAFA] min-h-screen py-6 px-4 sm:px-6 lg:px-10 flex flex-col items-center">
      {/* Back Button */}
      <div
        className="self-start mb-4 flex items-center text-[#181375] gap-2 cursor-pointer hover:text-[#9C27B0] transition-colors"
        onClick={() => navigate(-1)}
      >
        <ArrowLeft size={20} />
        <span className="text-sm font-medium">Back</span>
      </div>

      {/* Alert */}
      <p className="text-sm text-center bg-[#F3E5F5] text-[#9C27B0] rounded-md py-2 px-4 font-medium mb-6">
        📞 For Food Waste Management – Call Toll-Free number 1800–123–4567
      </p>

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-semibold text-[#181375] mb-2 text-center">
        My Bookings
      </h2>
      <p className="text-[#4F4F4F] mb-6 text-sm text-center">
        Keep track of your upcoming bookings
      </p>

      {/* Loading State */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-gray-600 text-lg">Loading your bookings...</p>
        </div>
      )}

      {/* Error State */}
      {error && !loading && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 max-w-md text-center">
            <svg
              className="w-12 h-12 text-red-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchBookings}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && bookings.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-8 max-w-md text-center">
            <CalendarBlank size={64} className="text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No bookings yet</p>
            <p className="text-gray-500 text-sm mb-6">
              Start exploring venues and services to make your first booking!
            </p>
            <button
              onClick={() => navigate("/venues")}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
            >
              Browse Venues
            </button>
          </div>
        </div>
      )}

      {/* Booking Cards */}
      {!loading &&
        !error &&
        bookings.map((booking, index) => {
          const statusDisplay = getStatusDisplay(booking);

          return (
            <div
              key={booking._id || index}
              className="bg-white border border-gray-200 shadow-md rounded-xl w-full max-w-[740px] p-4 sm:p-6 mb-8 hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div className="flex flex-col sm:flex-row gap-4">
                  <img
                    src={getVenueImage(booking)}
                    alt="Event"
                    className="w-full sm:w-[120px] h-[120px] object-cover rounded-lg"
                  />
                  <div className="flex flex-col justify-center">
                    <p className="text-xs text-[#9C27B0] font-medium mb-1">
                      Booking ID: {formatBookingId(booking._id)}
                    </p>
                    <h3 className="text-lg font-semibold text-[#181375] leading-5">
                      {booking.eventTitle}
                    </h3>
                    <p className="text-sm text-[#555] mt-1">
                      {booking.eventType}
                    </p>
                    <p className="text-xs text-[#9C27B0] mt-1 font-medium">
                      {booking.bookingType === "venue"
                        ? "Venue Only"
                        : booking.bookingType === "service" || booking.bookingType === "service-only"
                        ? "Services Only"
                        : "Venue + Services"}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-[#4F4F4F] font-medium ml-auto mt-2 sm:mt-0 flex items-center gap-1">
                  <span
                    className={`w-2 h-2 ${statusDisplay.color} rounded-full`}
                  ></span>
                  {statusDisplay.text}
                </span>
              </div>

              <div className="my-4 border-t border-gray-200"></div>

              {/* Event Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm text-[#181818]">
                <div className="flex items-center gap-2">
                  <CalendarBlank size={18} color="#9C27B0" />
                  <span>{formatEventDates(booking.eventDates)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} color="#9C27B0" />
                  <span>{booking.eventTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Buildings size={18} color="#9C27B0" />
                  <span>{getVenueName(booking)}</span>
                </div>
              </div>

              {/* Address (if venue booked) */}
              {booking.venueId && (
                <div className="flex flex-col sm:flex-row justify-between gap-2 text-sm text-[#4F4F4F] mb-4 items-start">
                  <div className="flex gap-2">
                    <MapPin size={18} className="flex-shrink-0 mt-1" />
                    <p className="max-w-full sm:max-w-[550px]">
                      {getVenueAddress(booking)}
                    </p>
                  </div>
                  <button
                    onClick={() => openGoogleMaps(booking)}
                    className="w-[44px] h-[44px] p-[10px] rounded-[8px] bg-gradient-to-b from-[#9C27B0] to-[#7B1FA2] flex items-center justify-center hover:brightness-110 transition-all"
                  >
                    <PaperPlaneTilt size={20} className="text-white" />
                  </button>
                </div>
              )}

              {/* Services List */}
              {booking.selectedServices && booking.selectedServices.length > 0 && (
                <>
                  <div className="my-4 border-t border-gray-200"></div>
                  <div className="mb-4">
                    <p className="text-xs font-semibold text-gray-700 mb-2">
                      Selected Services:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {booking.selectedServices.map((service, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 text-sm border border-gray-300 rounded-full text-[#181375] bg-white"
                        >
                          {service.name} - ₹{service.price?.toLocaleString()}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Price */}
              <div className="bg-purple-50 rounded-lg p-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-700">Total Amount:</span>
                  <span className="text-lg font-bold text-purple-700">
                    ₹{booking.totalAmount?.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Actions based on status */}
              {booking.status === "completed" ? (
                <>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/booking/${booking._id}`)}
                      className="flex items-center gap-2 border border-[#9C27B0] text-[#9C27B0] font-medium px-5 py-2 rounded-md text-sm hover:bg-[#F3E5F5] transition-all"
                    >
                      <Receipt size={18} />
                      View Invoice
                    </button>
                    <button
                      onClick={() => navigate("/contact")}
                      className="flex items-center gap-2 bg-[#9C27B0] text-white font-medium px-5 py-2 rounded-md text-sm hover:brightness-110 transition-all"
                    >
                      <ChatCircleDots size={18} />
                      Leave Review
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex gap-4">
                    <button
                      onClick={() => navigate(`/booking/${booking._id}`)}
                      className="flex items-center gap-2 border border-[#9C27B0] text-[#9C27B0] font-medium px-5 py-2 rounded-md text-sm hover:bg-[#F3E5F5] transition-all"
                    >
                      <Receipt size={18} />
                      View Details
                    </button>
                    <button
                      onClick={() => navigate("/contact")}
                      className="flex items-center gap-2 bg-[#9C27B0] text-white font-medium px-5 py-2 rounded-md text-sm hover:brightness-110 transition-all"
                    >
                      <ChatCircleDots size={18} />
                      Contact Us
                    </button>
                  </div>
                </>
              )}

              {/* Timeline (for non-completed bookings) */}
              {booking.status !== "completed" && (
                <>
                  <div className="my-4 border-t border-gray-200"></div>
                  <div className="flex items-center justify-between mt-6 px-2 relative">
                    <div className="absolute top-3 left-10 right-10 h-[2px] bg-[#E0E0E0] z-0"></div>
                    
                    {/* Step 1: Booked */}
                    <div className="flex flex-col items-center z-10 w-1/3">
                      <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold">
                        ✓
                      </div>
                      <p className="text-[13px] font-semibold text-[#181375] mt-2">
                        Booked
                      </p>
                      <p className="text-xs text-[#555]">
                        {new Date(booking.createdAt).toLocaleDateString("en-GB")}
                      </p>
                    </div>

                    {/* Step 2: Confirmed */}
                    <div className="flex flex-col items-center z-10 w-1/3">
                      <div
                        className={`w-6 h-6 rounded-full ${
                          booking.paymentStatus === "paid" ||
                          booking.paymentStatus === "partiallyPaid"
                            ? "bg-green-600"
                            : "bg-[#BDBDBD]"
                        } flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {booking.paymentStatus === "paid" ||
                        booking.paymentStatus === "partiallyPaid"
                          ? "✓"
                          : "2"}
                      </div>
                      <p className="text-[13px] font-semibold text-[#181375] mt-2">
                        Confirmed
                      </p>
                      <p className="text-xs text-[#555]">
                        {booking.paymentStatus !== "pending"
                          ? new Date(booking.updatedAt).toLocaleDateString("en-GB")
                          : "Pending"}
                      </p>
                    </div>

                    {/* Step 3: Final Payment */}
                    <div className="flex flex-col items-center z-10 w-1/3">
                      <div
                        className={`w-6 h-6 rounded-full ${
                          booking.paymentStatus === "paid"
                            ? "bg-green-600"
                            : "bg-[#BDBDBD]"
                        } flex items-center justify-center text-white text-xs font-bold`}
                      >
                        {booking.paymentStatus === "paid" ? "✓" : "3"}
                      </div>
                      <p className="text-[13px] font-semibold text-[#181375] mt-2">
                        Final Payment
                      </p>
                      <p className="text-xs text-[#555]">
                        {booking.paymentStatus === "paid"
                          ? "Completed"
                          : "Pending"}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          );
        })}
    </div>
  );
};

export default Bookings;
