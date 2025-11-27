import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CreditCard, Bank, Money, QrCode } from "@phosphor-icons/react";
import axios from "axios";
import BookingSuccessModal from "./BookingSuccessModal.jsx";
import { toast } from "react-toastify";

const API_BASE = "http://localhost:4000/api";
const BOOKING_URL = `${API_BASE}/booking/place`;

const ContinuePay = () => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [paymentOption, setPaymentOption] = useState("partial"); // "partial" or "full"
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get data from location state
  const { venue, selectedServices = [], eventDetails, prices, bookingType } = location.state || {};

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Check if we have the required data based on booking type
    const isServiceOnly = bookingType === "service";
    
    if (!eventDetails || !prices) {
      toast.error("No booking data found. Please start again", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(-1);
      return;
    }
    
    // For non-service-only bookings, venue is required
    if (!isServiceOnly && !venue) {
      toast.error("No venue data found. Please start from venue page", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate(-1);
    }
  }, [bookingType, venue, eventDetails, prices, navigate]);

  // Format price
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price || 0);
  };

  // Format date
  const formatDate = (dateObj) => {
    if (!dateObj) return "N/A";
    return dateObj.toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format event dates array for API
  const getEventDatesArray = () => {
    // Handle different date structures
    if (eventDetails?.eventDates) {
      const { startDate, endDate } = eventDetails.eventDates;
      const dates = [];
      const current = new Date(startDate);
      const end = new Date(endDate);
      
      while (current <= end) {
        dates.push(current.toLocaleDateString('en-IN'));
        current.setDate(current.getDate() + 1);
      }
      
      return dates;
    } else if (eventDetails?.dateRange) {
      const { startDate, endDate } = eventDetails.dateRange;
      const dates = [];
      const current = new Date(startDate);
      const end = new Date(endDate);
      
      while (current <= end) {
        dates.push(current.toLocaleDateString('en-IN'));
        current.setDate(current.getDate() + 1);
      }
      
      return dates;
    }
    
    return [];
  };

  // Calculate payment amounts
  const partialAmount = Math.round(prices.totalAmount * 0.2); // 20%
  const remainingAmount = prices.totalAmount - partialAmount;

  // Handle booking submission
  const handleBookNow = async () => {
    try {
      // Check authentication
      const storedUser = localStorage.getItem("auth_user");
      if (!storedUser) {
        toast.error("Please log in to complete booking", {
          position: "top-right",
          autoClose: 3000,
        });
        navigate("/");
        return;
      }

      setLoading(true);
      setError(null);

      // Prepare booking data
      const bookingData = {
        venueId: venue?._id || null,
        eventTitle: eventDetails.eventTitle || eventDetails.title,
        eventType: eventDetails.eventType || eventDetails.type,
        eventDates: getEventDatesArray(),
        eventTime: eventDetails.eventTime || eventDetails.time,
        basePrice: prices.basePrice,
        totalDays: prices.totalDays,
        serviceFee: prices.serviceFee,
        taxes: prices.taxes,
        discount: prices.discount,
        totalAmount: prices.totalAmount,
        bookingType: bookingType || "venue",
        selectedServices: selectedServices.map(s => ({
          serviceId: s.id,
          name: s.name || s.title,
          price: s.price
        })),
        paymentType: paymentMethod,
        paymentStatus: paymentOption === "full" ? "paid" : "partiallyPaid",
      };

      console.log("=== BOOKING SUBMISSION ===");
      console.log("Booking Type:", bookingType);
      console.log("Is Service Only:", bookingType === "service");
      console.log("Venue:", venue);
      console.log("Selected Services:", selectedServices);
      console.log("Event Details:", eventDetails);
      console.log("Prices:", prices);
      console.log("Final Booking Data:", JSON.stringify(bookingData, null, 2));

      const response = await axios.post(BOOKING_URL, bookingData, {
        withCredentials: true,
      });

      console.log("=== BOOKING RESPONSE ===");
      console.log("Response:", response.data);

      if (response.data?.success) {
        setShowSuccessModal(true);
      } else {
        throw new Error(response.data?.message || "Booking failed");
      }
    } catch (err) {
      console.error("Booking error:", err);
      
      let errorMsg = "Failed to complete booking. Please try again.";
      if (err?.response?.status === 401) {
        errorMsg = "Please log in to complete booking";
        setTimeout(() => navigate("/"), 2000);
      } else if (err?.response?.data?.message) {
        errorMsg = err.response.data.message;
      } else if (err?.message) {
        errorMsg = err.message;
      }
      
      setError(errorMsg);
      toast.error(errorMsg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  if (!eventDetails || !prices) {
    return (
      <div className="max-w-[1200px] pt-[150px] mt-10 mx-auto px-4 sm:px-6 py-10">
        <p className="text-center text-gray-600">Loading...</p>
      </div>
    );
  }
  
  const isServiceOnly = bookingType === "service";

  return (
    <div className="max-w-[1200px] pt-[150px] mt-10 mx-auto px-4 sm:px-6 py-10 bg-white font-['Plus Jakarta Sans']">
      {/* Back Button */}
      <div className="flex items-center gap-3 mb-6 cursor-pointer" onClick={() => navigate(-1)}>
        <ArrowLeft size={24} weight="bold" className="text-[#181375]" />
        <h2 className="text-2xl sm:text-5xl font-semibold text-[#181375]">Continue & Pay</h2>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Booking Summary Section */}
        <div className="flex-1 w-full">
          <h3 className="text-xl sm:text-2xl font-semibold text-[#181375] mb-1">
            Booking Summary
          </h3>
          <p className="text-sm text-[#555] mb-4">
            You are about to confirm the following services:
          </p>

          <div className="space-y-2 text-sm text-[#333] mb-4">
            <p><span className="font-medium">Event Title:</span> {eventDetails.eventTitle || eventDetails.title}</p>
            {!isServiceOnly && venue && (
              <p><span className="font-medium">Venue Name:</span> {venue.name}</p>
            )}
            <p><span className="font-medium">Event Type:</span> {eventDetails.eventType || eventDetails.type}</p>
            <p><span className="font-medium">Event Date:</span> {formatDate(eventDetails.eventDates?.startDate || eventDetails.dateRange?.startDate)} {(eventDetails.eventDates?.endDate || eventDetails.dateRange?.endDate) && (eventDetails.eventDates?.startDate || eventDetails.dateRange?.startDate).getTime() !== (eventDetails.eventDates?.endDate || eventDetails.dateRange?.endDate).getTime() && `- ${formatDate(eventDetails.eventDates?.endDate || eventDetails.dateRange?.endDate)}`}</p>
            <p><span className="font-medium">Duration:</span> {prices.totalDays} {prices.totalDays === 1 ? 'day' : 'days'}</p>
            <p><span className="font-medium">Event Time:</span> {eventDetails.eventTime || eventDetails.time}</p>
            {!isServiceOnly && venue && (
              <p><span className="font-medium">Location:</span> {venue.address?.city}, {venue.address?.state}</p>
            )}
          </div>

          {/* Services */}
          {selectedServices.length > 0 && (
            <>
              <h4 className="text-xl sm:text-2xl py-5 font-semibold text-[#181375] mb-1">
                {isServiceOnly ? "Selected Services" : "Selected Other Services"}
              </h4>

              <div className="space-y-1 text-sm text-[#4F4F4F]">
                {selectedServices.map((service, idx) => (
                  <p key={idx}>✅ {service.name || service.title} - ₹{formatPrice(service.price)}</p>
                ))}
              </div>

              {!isServiceOnly && (
                <p className="text-xs text-[#828282] mt-1 mb-6">
                  Note: Our team will reach out to discuss these services.
                  <span className="text-[#9C27B0] font-medium underline cursor-pointer ml-1">
                    No extra payment required now.
                  </span>
                </p>
              )}
            </>
          )}

          {/* Payment Option */}
          <div className="mt-6">
            <h4 className="text-xl sm:text-2xl font-semibold text-[#181375] mb-2">
              Choose Payment Option
            </h4>
            <div className="space-y-3 text-sm text-[#181375]">
              <label className="flex items-start gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentOption" 
                  checked={paymentOption === "partial"}
                  onChange={() => setPaymentOption("partial")}
                />
                <div>
                  <p>Partial Payment (20%) - Pay ₹{formatPrice(partialAmount)} now</p>
                  <p className="text-[#828282] text-xs">
                    Rest ₹{formatPrice(remainingAmount)} will be due later
                  </p>
                </div>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentOption" 
                  checked={paymentOption === "full"}
                  onChange={() => setPaymentOption("full")}
                />
                <span>Full Payment - Pay ₹{formatPrice(prices.totalAmount)} now</span>
              </label>
            </div>
          </div>

          {/* Payment Method */}
          <div className="mt-6">
            <h4 className="text-xl sm:text-2xl font-semibold text-[#181375] mb-2">
              Choose Payment Method
            </h4>
            <div className="space-y-3 text-sm text-[#181375]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  checked={paymentMethod === "Credit Card"}
                  onChange={() => setPaymentMethod("Credit Card")}
                />
                <CreditCard size={20} /> Credit Card
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  checked={paymentMethod === "Debit Card"}
                  onChange={() => setPaymentMethod("Debit Card")}
                />
                <Money size={20} /> Debit Card
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  checked={paymentMethod === "UPI"}
                  onChange={() => setPaymentMethod("UPI")}
                />
                <QrCode size={20} /> UPI
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="radio" 
                  name="paymentMethod" 
                  checked={paymentMethod === "Net Banking"}
                  onChange={() => setPaymentMethod("Net Banking")}
                />
                <Bank size={20} /> Net Banking
              </label>
            </div>
          </div>

          <button
            onClick={handleBookNow}
            disabled={loading}
            className="mt-8 text-white text-sm font-semibold rounded 
             px-[20px] py-[8px] w-[123px] h-[44px]
             bg-gradient-to-b from-[#9C27B0] to-[#7B1FA2]
             shadow-[0px_3px_1px_-2px_rgba(0,0,0,0.2),0px_2px_2px_0px_rgba(0,0,0,0.14),0px_1px_5px_0px_rgba(0,0,0,0.12)]
             hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Processing..." : "Book Now"}
          </button>
        </div>

        {/* Price Summary */}
        <div className="w-full lg:w-[340px] border border-gray-200 shadow-md rounded-xl p-4 h-fit sticky top-24">
          {!isServiceOnly && venue ? (
            <div className="flex gap-4 items-start">
              {venue.images && venue.images.length > 0 ? (
                <img
                  src={`http://localhost:4000${venue.images[0]}`}
                  alt={venue.name}
                  className="rounded-lg w-[60px] h-[60px] object-cover"
                />
              ) : (
                <div className="rounded-lg w-[60px] h-[60px] bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-400 text-xs">No Image</span>
                </div>
              )}
              <div>
                <h4 className="text-sm font-semibold text-[#181375]">
                  {venue.name}
                </h4>
                <p className="text-xs text-[#828282]">{venue.address?.city}</p>
                {venue.rating && (
                  <p className="text-xs text-[#FFA500]">★ {venue.rating} · Reviews</p>
                )}
              </div>
            </div>
          ) : (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-[#181375]">Service Booking</h4>
              <p className="text-xs text-[#828282]">{selectedServices.length} service(s) selected</p>
            </div>
          )}

          <h5 className="mt-4 mb-2 text-sm font-semibold">Price Details</h5>

          <div className="text-sm text-[#333] space-y-2">
            <div className="flex justify-between">
              <span>Base Price × {prices.totalDays} {prices.totalDays === 1 ? 'day' : 'days'}</span>
              <span>₹{formatPrice(prices.basePrice)}</span>
            </div>
            <div className="flex justify-between">
              <span>Service Fee</span>
              <span>₹{formatPrice(prices.serviceFee)}</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & GST (18%)</span>
              <span>₹{formatPrice(prices.taxes)}</span>
            </div>
            <div className="flex justify-between text-green-600">
              <span>Special Discount</span>
              <span>-₹{formatPrice(prices.discount)}</span>
            </div>
            <hr className="my-2" />
            <div className="flex justify-between font-bold text-black">
              <span>Total Amount</span>
              <span>₹{formatPrice(prices.totalAmount)}</span>
            </div>
            {paymentOption === "partial" && (
              <>
                <hr className="my-2" />
                <div className="flex justify-between font-semibold text-purple-700">
                  <span>Pay Now (20%)</span>
                  <span>₹{formatPrice(partialAmount)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-600">
                  <span>Due Later</span>
                  <span>₹{formatPrice(remainingAmount)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      
      <BookingSuccessModal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} />
    </div>
  );
};

export default ContinuePay;
