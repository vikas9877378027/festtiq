import React, { useState, useEffect } from "react";
import SlideOver from "./Slideover";
import { useNavigate } from "react-router-dom";
import EventTimeModal from "../EventTimeModal";
import EventDateModal from "../EventDateModal";
import EventModal from "../EventModal";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Armchair,
  Car,
  Door,
  HouseLine,
  Confetti,
  Camera,
  FilmSlate,
  MagicWand,
  HandPalm,
  MicrophoneStage,
  CalendarBlank,
  Clock,
  CaretRight,
} from "@phosphor-icons/react";

const amenities = [
  "Wi-Fi Access",
  "Car Parking",
  "Air Conditioning",
  "Seating Arrangements",
  "Catering Services",
  "Kitchen Access",
  "Dining Area",
  "Stage & Podium",
  "Lighting & Decoration Setup",
  "Sound System",
  "First Aid Kits",
  "Lounge & Waiting Area",
  "Restroom & Changing Rooms",
  "Power Backup",
  "Bridal Room",
  "Outdoor Spaces",
];

const extraServices = [
  { label: "Décor", Icon: Confetti },
  { label: "Photography", Icon: Camera },
  { label: "Videography", Icon: FilmSlate },
  { label: "Makeup & Hairstyle", Icon: MagicWand },
  { label: "Mehndi", Icon: HandPalm },
  { label: "Entertainment", Icon: MicrophoneStage },
];

// Icon mapping for dynamic services
const getIconForService = (serviceName) => {
  const lowerName = serviceName.toLowerCase();
  if (lowerName.includes("décor") || lowerName.includes("decor") || lowerName.includes("decoration")) return Confetti;
  if (lowerName.includes("photo")) return Camera;
  if (lowerName.includes("video")) return FilmSlate;
  if (lowerName.includes("makeup") || lowerName.includes("hair")) return MagicWand;
  if (lowerName.includes("mehndi") || lowerName.includes("mehendi") || lowerName.includes("henna")) return HandPalm;
  if (lowerName.includes("entertainment") || lowerName.includes("dj") || lowerName.includes("music")) return MicrophoneStage;
  return MicrophoneStage; // default icon
};

import { SERVICE_LIST_URL } from "../../../config/apiConfig";

const VenueHighlight = ({ venue }) => {
  const [showSlider, setShowSlider] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showTimeModal, setShowTimeModal] = useState(false);
  const [selectedTime, setSelectedTime] = useState("");
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState(null);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEventType, setSelectedEventType] = useState("");
  const [dynamicServices, setDynamicServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const navigate = useNavigate();

  // Fetch services from API
  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setServicesLoading(true);
      const response = await axios.get(SERVICE_LIST_URL);
      
      if (response.data?.success && Array.isArray(response.data.services)) {
        // Filter only active services
        const activeServices = response.data.services.filter(s => s.isActive);
        
        // Map to format with icons
        const mappedServices = activeServices.map(service => ({
          id: service._id,
          label: service.name,
          price: service.price,
          image: service.image,
          Icon: getIconForService(service.name),
          data: service, // Keep original data for reference
        }));
        
        setDynamicServices(mappedServices);
        console.log("Fetched services:", mappedServices);
      }
    } catch (error) {
      console.error("Error fetching services:", error);
      // Fallback to static services if API fails
      setDynamicServices(extraServices.map(s => ({ ...s, id: s.label })));
    } finally {
      setServicesLoading(false);
    }
  };

  const toggleService = (serviceId) => {
    setSelectedServices((prev) => {
      const exists = prev.find(s => s.id === serviceId);
      if (exists) {
        return prev.filter((s) => s.id !== serviceId);
      } else {
        const service = dynamicServices.find(s => s.id === serviceId);
        return [...prev, { 
          id: service.id, 
          name: service.label,
          price: service.price || 0,
          image: service.image 
        }];
      }
    });
  };

  // Format price with Indian number system
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN').format(price || 0);
  };

  const displayPrice = venue?.offerPrice || venue?.price || 0;
  const hallCapacity = venue?.capacities?.hall || 0;
  const parkingSlots = venue?.capacities?.parkingSlots || 0;
  const guestRooms = venue?.capacities?.guestRooms || 0;
  const venueType = venue?.venueType || "Indoor";
  const venueBestFor = venue?.bestForEvents || [];
  const venueAmenities = venue?.amenities || amenities;

  // Calculate prices dynamically
  const calculatePrices = () => {
    const totalDays = selectedDateRange ? 
      Math.ceil((selectedDateRange.endDate - selectedDateRange.startDate) / (1000 * 60 * 60 * 24)) + 1 : 
      1;
    
    const basePrice = displayPrice * totalDays;
    const servicesTotal = selectedServices.reduce((sum, s) => sum + (s.price || 0), 0);
    const serviceFee = Math.round((basePrice + servicesTotal) * 0.05); // 5% service fee
    const subtotal = basePrice + servicesTotal + serviceFee;
    const taxes = Math.round(subtotal * 0.18); // 18% GST
    const discount = Math.round(subtotal * 0.02); // 2% discount
    const totalAmount = subtotal + taxes - discount;

    return {
      basePrice,
      totalDays,
      serviceFee,
      taxes,
      discount,
      totalAmount,
      servicesTotal,
    };
  };

  const prices = calculatePrices();

  // Handle Secure Booking - Check if user is logged in
  const handleSecureBooking = () => {
    const storedUser = localStorage.getItem("auth_user");
    if (!storedUser) {
      toast.error("Please log in to make a booking", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    // Validate form data
    if (!eventTitle.trim()) {
      toast.error("Please enter event title", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!selectedEventType) {
      toast.error("Please select event type", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    if (!selectedDateRange) {
      toast.error("Please select event dates", {
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

    // Open services selection modal
    setShowSlider(true);
  };

  return (
    <>
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-24 py-10 bg-white font-['Plus_Jakarta_Sans'] flex flex-col lg:flex-row gap-6">
        <div className="w-full lg:w-2/3 flex flex-col gap-8">
          <div>
            <h2 className="text-[#181375] text-2xl md:text-3xl font-semibold tracking-[-0.4px]">
              Venue Highlights
            </h2>
            <p className="text-[#4F4F4F] text-sm md:text-lg mt-1">
              Guest Ratings <span className="text-yellow-400">★</span> 5.0
            </p>
          </div>

          {venueBestFor.length > 0 && (
            <div className="flex flex-wrap gap-2 text-sm items-center">
              <span className="text-gray-500">Venue Best for:</span>
              {venueBestFor.map((tag, i) => (
                <span key={i} className="px-3 py-1 border border-gray-400 rounded-full text-xs bg-[#FAFAFA] text-[#424242]">
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap sm:flex-nowrap text-sm mt-4 border-b border-gray-200 divide-x divide-gray-200">
            {[
              { label: "Hall Capacity", value: hallCapacity, Icon: Armchair },
              { label: "Parking Slots", value: parkingSlots, Icon: Car },
              { label: "Guest Rooms", value: guestRooms, Icon: Door },
              { label: "Venue Type", value: venueType, Icon: HouseLine },
            ].map((item, i) => (
              <div key={i} className="w-1/2 sm:w-full py-4 px-4 flex flex-col items-center gap-1">
                <span className="text-gray-500 text-xs">{item.label}</span>
                <span className="text-[#181818] font-semibold text-sm">{item.value}</span>
                <item.Icon size={20} color="#9C27B0" weight="regular" />
              </div>
            ))}
          </div>

          <div>
            <h2 className="text-[#181375] font-semibold text-lg tracking-[0.4px] mb-3">
              Amenities & Facilities
            </h2>
            <ul className="flex flex-col gap-3 text-sm text-[#4F4F4F]">
              {venueAmenities.map((item, i) => (
                <li key={i} className="flex items-start gap-2 leading-5">
                  <span className="text-lg">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="w-full max-w-[440px]  sm:h-screen rounded-xl border border-gray-300 p-6 flex flex-col gap-5 shadow-md bg-white">
          <h3 className="text-xl font-semibold">
            ₹{formatPrice(displayPrice)} <span className="text-sm font-normal text-gray-500">per day</span>
          </h3>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">Event Title*</label>
            <input
              type="text"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Ex: Arun Weds Priya, Meera's B'day"
              className="border border-gray-300 rounded px-4 py-2 text-sm placeholder:text-gray-400"
            />
          </div>

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

          <div className="text-sm text-gray-700 space-y-1">
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
            <div className="flex justify-between text-green-600 font-medium">
              <span>Special Discount</span>
              <span>-₹{formatPrice(prices.discount)}</span>
            </div>
            <hr />
            <div className="flex justify-between font-semibold text-black">
              <span>Total Amount</span>
              <span>₹{formatPrice(prices.totalAmount)}</span>
            </div>
          </div>

          <button
            onClick={handleSecureBooking}
            className="w-full text-white text-sm font-semibold rounded-md py-3 bg-gradient-to-b from-[#9C27B0] to-[#7B1FA2] shadow-md hover:brightness-110 transition"
          >
            Secure Your Booking
          </button>

          <p className="text-xs text-[#4F4F4F] text-center">
            <span className="text-[#F44336] font-semibold">ⓘ</span> You can pay only 20% with our
            <span className="text-[#9C27B0] underline cursor-pointer ml-1">Partial Payment Option</span>
          </p>

          <p className="text-[11px]  text-gray-500 text-center">
            Need more details about the venue? <span className="text-[#9C27B0] underline cursor-pointer">Contact us</span> before booking.
          </p>
        </div>
      </div>

      <SlideOver show={showSlider} onClose={() => setShowSlider(false)}>
        <div className="text-left">
          <h2 className="text-2xl font-medium text-[#181375] font-['Plus Jakarta Sans']">
            Plan Your Event, Stress-Free!
          </h2>
          <p className="text-[#4F4F4F] text-sm mt-2 mb-4">
            Need décor, photography or other services? Select the services and let our experts help you.
            <span className="text-[#9C27B0] font-medium underline cursor-pointer"> — no extra payment now.</span>
          </p>
        </div>

        {servicesLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-purple-600"></div>
          </div>
        ) : dynamicServices.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <p>No services available at the moment.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {dynamicServices.map((service) => {
                const isSelected = selectedServices.find(s => s.id === service.id);
                return (
                  <button
                    key={service.id}
                    onClick={() => toggleService(service.id)}
                    className={`flex flex-col items-center justify-center border rounded-xl p-4 text-sm font-medium gap-2 transition relative ${
                      isSelected ? "border-[#9C27B0] bg-purple-50 text-[#9C27B0]" : "border-[#D9D9D9] text-[#181818] hover:border-purple-300"
                    }`}
                  >
                    {/* Service Icon */}
                    {service.image ? (
                      <img 
                        src={service.image} 
                        alt={service.label}
                        className="w-12 h-12 object-cover rounded-lg"
                      />
                    ) : (
                      <service.Icon size={32} weight="regular" />
                    )}
                    
                    {/* Service Name */}
                    <span className="text-center">{service.label}</span>
                    
                    {/* Service Price */}
                    {service.price && (
                      <span className="text-xs text-gray-600">
                        ₹{formatPrice(service.price)}
                      </span>
                    )}
                    
                    {/* Selected Checkmark */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-[#9C27B0] text-white rounded-full w-5 h-5 flex items-center justify-center">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Show selected services summary */}
            {selectedServices.length > 0 && (
              <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <p className="text-sm font-semibold text-gray-700 mb-2">
                  Selected Services ({selectedServices.length}):
                </p>
                <div className="space-y-1">
                  {selectedServices.map(service => (
                    <div key={service.id} className="flex justify-between text-sm">
                      <span className="text-gray-700">{service.name}</span>
                      <span className="text-purple-600 font-medium">₹{formatPrice(service.price)}</span>
                    </div>
                  ))}
                  <div className="border-t border-purple-200 pt-2 mt-2 flex justify-between font-semibold">
                    <span>Services Total:</span>
                    <span className="text-purple-700">
                      ₹{formatPrice(selectedServices.reduce((sum, s) => sum + (s.price || 0), 0))}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        <div className="flex flex-col sm:flex-row justify-center gap-3 mt-6">
          <button
            onClick={() => {
              const skipPrices = calculatePrices();
              setShowSlider(false);
              navigate("/venues/continue&pay", { 
                state: { 
                  venue, 
                  selectedServices: [],
                  eventDetails: {
                    eventTitle,
                    eventType: selectedEventType,
                    eventDates: selectedDateRange,
                    eventTime: selectedTime,
                  },
                  prices: skipPrices,
                  bookingType: "venue"
                } 
              });
            }}
            className="text-[#6610F2] border border-[#6610F2] px-6 py-2 rounded hover:bg-purple-50 transition"
          >
            Skip
          </button>
          <button
            onClick={() => {
              const continuePrices = calculatePrices();
              setShowSlider(false);
              navigate("/venues/continue&pay", { 
                state: { 
                  venue, 
                  selectedServices,
                  eventDetails: {
                    eventTitle,
                    eventType: selectedEventType,
                    eventDates: selectedDateRange,
                    eventTime: selectedTime,
                  },
                  prices: continuePrices,
                  bookingType: selectedServices.length > 0 ? "venue+service" : "venue"
                } 
              });
            }}
            disabled={selectedServices.length === 0}
            className={`px-6 py-2 rounded text-white transition ${
              selectedServices.length === 0 
                ? "bg-[#D9D9D9] cursor-not-allowed" 
                : "bg-[#9C27B0] hover:brightness-110 shadow-md"
            }`}
          >
            Continue {selectedServices.length > 0 && `(${selectedServices.length})`}
          </button>
        </div>
      </SlideOver>

      {showTimeModal && (
        <EventTimeModal onClose={() => setShowTimeModal(false)} onSelect={(option) => setSelectedTime(option)} />
      )}

      {showDateModal && (
        <EventDateModal onClose={() => setShowDateModal(false)} onSelect={(range) => setSelectedDateRange(range)} />
      )}

      {showEventModal && (
        <EventModal
          onClose={() => setShowEventModal(false)}
          onSelect={(type) => {
            setSelectedEventType(type);
            setShowEventModal(false);
          }}
        />
      )}
    </>
  );
};

export default VenueHighlight;
