import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, CalendarBlank, Clock, CaretRight } from "@phosphor-icons/react";
import EventModal from "../Venue/EventModal";
import EventDateModal from "../Venue/EventDateModal";
import EventTimeModal from "../Venue/EventTimeModal";
import { toast } from "react-toastify";

const ServiceBookingForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { selectedServices = [] } = location.state || {};

  const [eventTitle, setEventTitle] = useState("");
  const [selectedEventType, setSelectedEventType] = useState("");
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [showTimeModal, setShowTimeModal] = useState(false);

  // Price calculations
  const [totalDays, setTotalDays] = useState(1);
  const [basePrice, setBasePrice] = useState(0);
  const [serviceFee, setServiceFee] = useState(0);
  const [taxes, setTaxes] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // If no services selected, redirect back
    if (!selectedServices || selectedServices.length === 0) {
      toast.error("Please select at least one service to proceed", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/services");
    }
  }, [selectedServices, navigate]);

  // Calculate prices whenever dependencies change
  useEffect(() => {
    calculatePrices();
  }, [selectedServices, selectedDateRange]);

  const calculatePrices = () => {
    // Calculate base price from selected services
    const servicesTotal = selectedServices.reduce((sum, service) => sum + (service.price || 0), 0);
    
    // Calculate number of days
    let days = 1;
    if (selectedDateRange) {
      const diffTime = Math.abs(selectedDateRange.endDate - selectedDateRange.startDate);
      days = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 to include both start and end dates
    }
    
    const base = servicesTotal * days;
    const fee = base * 0.05; // 5% service fee
    const tax = base * 0.18; // 18% GST
    const disc = 0; // No discount for now
    const total = base + fee + tax - disc;

    setBasePrice(base);
    setServiceFee(fee);
    setTaxes(tax);
    setDiscount(disc);
    setTotalAmount(total);
    setTotalDays(days);
  };

  const handleSecureBooking = () => {
    // Check if user is logged in
    const authUser = localStorage.getItem("auth_user");
    if (!authUser) {
      toast.error("Please login to make a booking", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate required fields
    if (!eventTitle.trim()) {
      toast.error("Please enter an event title", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!selectedEventType) {
      toast.error("Please select an event type", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!selectedDateRange) {
      toast.error("Please select event date(s)", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!selectedTime) {
      toast.error("Please select event time", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Prepare booking data
    const bookingData = {
      bookingType: "service",
      venue: null,
      selectedServices: selectedServices,
      eventDetails: {
        title: eventTitle,
        type: selectedEventType,
        dateRange: selectedDateRange,
        time: selectedTime,
      },
      prices: {
        basePrice,
        serviceFee,
        taxes,
        discount,
        totalAmount,
        totalDays,
      },
    };

    // Navigate to payment page
    navigate("/services/continue&pay", { state: bookingData });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN").format(price || 0);
  };

  const handleEventTypeSelect = (eventType) => {
    setSelectedEventType(eventType);
    setShowEventModal(false);
  };

  const handleDateSelect = (range) => {
    // EventDateModal passes { startDate, endDate, key }
    setSelectedDateRange({
      startDate: range.startDate,
      endDate: range.endDate
    });
    setShowDateModal(false);
  };

  const handleTimeSelect = (time) => {
    // EventTimeModal passes a string
    setSelectedTime(time);
    setShowTimeModal(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <button
          onClick={() => navigate("/services")}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-6"
        >
          <ArrowLeft size={20} />
          <span>Back to Services</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Complete Your Service Booking</h2>

              <div className="space-y-4">
                {/* Event Title */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-700">Event Title*</label>
                  <input
                    type="text"
                    placeholder="e.g., Wedding Reception, Birthday Party"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                {/* Event Type */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-xs font-medium text-gray-700">Event Type*</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Select Event Type"
                    value={selectedEventType}
                    onClick={() => setShowEventModal(true)}
                    className="w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-600 cursor-pointer"
                  />
                  <CaretRight
                    size={20}
                    weight="regular"
                    className="absolute right-3 top-9 text-gray-500"
                  />
                </div>

                {/* Event Date(s) */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-xs font-medium text-gray-700">Event Date(s)*</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Select Date(s)"
                    value={
                      selectedDateRange
                        ? `${selectedDateRange.startDate.toLocaleDateString()} - ${selectedDateRange.endDate.toLocaleDateString()}`
                        : ""
                    }
                    onClick={() => setShowDateModal(true)}
                    className="w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-600 cursor-pointer"
                  />
                  <CalendarBlank
                    size={20}
                    weight="regular"
                    className="absolute right-3 top-9 text-gray-500"
                  />
                </div>

                {/* Event Time */}
                <div className="flex flex-col gap-1 relative">
                  <label className="text-xs font-medium text-gray-700">Event Time*</label>
                  <input
                    type="text"
                    readOnly
                    placeholder="Select Time"
                    value={selectedTime}
                    onClick={() => setShowTimeModal(true)}
                    className="w-full border border-gray-300 rounded px-4 py-2 pr-10 text-sm text-gray-600 cursor-pointer"
                  />
                  <Clock
                    size={20}
                    weight="regular"
                    className="absolute right-3 top-9 text-gray-500"
                  />
                </div>

                {/* Additional Notes */}
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-gray-700">Additional Requirements (Optional)</label>
                  <textarea
                    placeholder="Any specific requirements or notes..."
                    rows={3}
                    className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Price Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Summary</h3>

              {/* Selected Services */}
              <div className="mb-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Selected Services:</p>
                <div className="space-y-2">
                  {selectedServices.map((service, index) => (
                    <div key={index} className="flex justify-between text-sm">
                      <span className="text-gray-600">{service.title}</span>
                      <span className="font-medium text-gray-800">₹{formatPrice(service.price)}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium text-gray-800">{totalDays} {totalDays === 1 ? 'day' : 'days'}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium text-gray-800">₹{formatPrice(basePrice)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service Fee (5%)</span>
                  <span className="font-medium text-gray-800">₹{formatPrice(serviceFee)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">GST (18%)</span>
                  <span className="font-medium text-gray-800">₹{formatPrice(taxes)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="font-medium text-green-600">-₹{formatPrice(discount)}</span>
                  </div>
                )}
              </div>

              <div className="border-t mt-4 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-base font-semibold text-gray-800">Total Amount</span>
                  <span className="text-xl font-bold text-purple-600">₹{formatPrice(totalAmount)}</span>
                </div>
              </div>

              <button
                onClick={handleSecureBooking}
                className="w-full mt-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-300 shadow-md"
              >
                Proceed to Payment
              </button>

              <p className="text-xs text-gray-500 text-center mt-3">
                You won't be charged yet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showEventModal && (
        <EventModal
          onClose={() => setShowEventModal(false)}
          onSelect={handleEventTypeSelect}
        />
      )}

      {showDateModal && (
        <EventDateModal
          onClose={() => setShowDateModal(false)}
          onSelect={handleDateSelect}
        />
      )}

      {showTimeModal && (
        <EventTimeModal
          onClose={() => setShowTimeModal(false)}
          onSelect={handleTimeSelect}
        />
      )}
    </div>
  );
};

export default ServiceBookingForm;

