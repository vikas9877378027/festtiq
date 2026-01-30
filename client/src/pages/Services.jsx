import React, { useState, useEffect } from "react";
import { HandPointing, Pinwheel, CheckCircle } from "phosphor-react";
import { Check } from "react-feather";
import axios from "axios";
import { toast } from "react-toastify";
// Service fallback image removed - using API data
import Question from "../components/Home/Question";
import { useNavigate } from "react-router-dom";
import { SERVICE_LIST_URL } from "../config/apiConfig";

// Default placeholder if service has no image
const fallbackImage = "https://via.placeholder.com/400x300?text=Service+Image";

function Services() {
  const [services, setServices] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const toggle = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchServices();
  }, []);

  // Fetch services from API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(SERVICE_LIST_URL);
      
      console.log("Services response:", response.data);
      
      if (response.data?.success && Array.isArray(response.data.services)) {
        // Filter only active services
        const activeServices = response.data.services.filter(service => service.isActive);
        
        // Map to the format needed for display
        const mappedServices = activeServices.map(service => ({
          id: service._id,
          title: service.name,
          price: service.price || 0,
          img: service.image || fallbackImage,
        }));
        
        setServices(mappedServices);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error("Error fetching services:", err);
      setError("Failed to load services");
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col pt-[100px]  items-center bg-white w-full max-w-[1440px] mx-auto gap-y-[40px] py-6 px-4 sm:px-6 overflow-x-hidden">
      <div className="flex flex-col items-center justify-center w-full max-w-[850px] space-y-[24px] p-4 mx-auto">
        <h2 className="font-abhaya text-[36px] sm:text-[48px] md:text-[64px] leading-[117%] tracking-[-1.5px] text-[#181375] text-center">
          Comprehensive Services For
          <br />
          Every Occasion
        </h2>
        <p className="w-full text-[16px] sm:text-[18px] md:text-[20px] text-center text-[#212121] leading-[160%] tracking-[0.15px]">
          Pick from our curated list of services, tailored to make your event truly special.
          Each service comes with a clear price range to suit your needs.
        </p>
      </div>

      <div className="mt-[60px] flex flex-col md:flex-row items-center justify-center gap-8 flex-wrap w-full max-w-[960px] px-4">
        {[{
          icon: <HandPointing size={26} weight="fill" color="#9C27B0" />,
          title: "Pick Your Services",
          desc: "Select the services you need and pick your event date."
        }, {
          icon: <CheckCircle size={24} color="#9C27B0" weight="bold" />,
          title: "Confirm Bookings",
          desc: "Receive an instant confirmation after selecting your services."
        }, {
          icon: <Pinwheel size={26} weight="fill" color="#9C27B0" />,
          title: "Book and Relax",
          desc: "Sit back as our team ensures everything is taken care of."
        }].map((step, idx) => (
          <div key={idx} className="flex flex-col items-center text-center space-y-4 w-full sm:w-[280px]">
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center">{step.icon}</div>
            <h3 className="font-plusjakarta font-semibold text-[24px] text-[#212121]">{step.title}</h3>
            <p className="font-plusjakarta text-[16px] leading-[150%] text-gray-600">{step.desc}</p>
          </div>
        ))}
      </div>

      <div className="mt-[60px] flex flex-col items-center justify-center w-full max-w-[850px] space-y-2 mx-auto px-4">
        <h2 className="font-abhaya text-[32px] sm:text-[40px] md:text-[48px] leading-[117%] tracking-[-1.5px] text-[#181375] text-center">
          Your Event, Your Choice
        </h2>
        <p className="text-[16px] sm:text-[18px] md:text-[20px] leading-[160%] tracking-[0.15px] text-[#212121] text-center">
          Choose from our range. Add as many services as you need, all in one booking.
        </p>
      </div>

      <div className="py-6 w-full">
        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-600 text-lg">Loading services...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <button
              onClick={fetchServices}
              className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && services.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-600 text-lg mb-2">No services available yet.</p>
            <p className="text-gray-500 text-sm">Check back soon for amazing services!</p>
          </div>
        )}

        {/* Services Grid */}
        {!loading && !error && services.length > 0 && (
          <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 px-4 sm:px-[60px] gap-[20px]">
            {services.map((svc) => {
            const isSelected = selectedIds.includes(svc.id);
            return (
              <div
                key={svc.id}
                onClick={() => toggle(svc.id)}
                className="w-full max-w-[403px] h-[309px] rounded-[20px] bg-white overflow-hidden cursor-pointer border transition-shadow hover:shadow-md flex flex-col justify-start"
                style={{
                  border: isSelected ? "1px solid #9C27B0" : "1px solid rgba(0, 0, 0, 0.12)",
                }}
              >
                <img
                  src={svc.img}
                  alt={svc.title}
                  className="w-full h-[200px] object-cover rounded-[20px]"
                />

                <div className="flex justify-between items-center px-4 pt-4">
                  <div>
                    <h3 className="font-plusjakarta font-semibold text-[24px] leading-[160%] tracking-[0.15px] text-[#424242] m-0">
                      {svc.title}
                    </h3>
                    <p className="font-plusjakarta font-medium text-[18px] leading-[160%] tracking-[0.15px] text-[#424242] mt-1">
                      Starts from ₹{svc.price.toLocaleString()}
                    </p>
                  </div>

                  <div
                    className={`w-6 h-6 min-w-[24px] min-h-[24px] rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? "bg-[#9C27B0] border-[#9C27B0]" : "border-gray-400"
                    }`}
                  >
                    <Check size={14} color={isSelected ? "white" : "gray"} />
                  </div>
                </div>
              </div>
            );
          })}
          </div>
        )}

        {/* Action Buttons - Only show when services are loaded */}
        {!loading && !error && services.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-center mt-6 space-y-4 sm:space-y-0 sm:space-x-4 px-4">
          <button
            onClick={() => setSelectedIds([])}
            className="w-[165px] h-[44px] px-2 py-2 rounded-[7px] border border-[#9C27B080] text-[#9C27B0] font-semibold text-[16px] leading-[26px] tracking-[0.46px] hover:bg-[#F5F0FF] transition duration-200"
            style={{ fontFamily: "Plus Jakarta Sans" }}
          >
            Clear Selection
          </button>

          <button
            onClick={() => {
              if (selectedIds.length === 0) {
                toast.error("Please select at least one service", {
                  position: "top-right",
                  autoClose: 3000,
                });
                return;
              }
              // Get full service objects for selected IDs
              const selectedServiceObjects = services.filter(svc => selectedIds.includes(svc.id));
              // Navigate with selected services
              navigate("/services/booking", { state: { selectedServices: selectedServiceObjects } });
            }}
            className="w-[136px] h-[44px] px-5 py-2 rounded-[7px] text-white font-semibold text-[16px] leading-[26px] tracking-[0.46px] flex items-center justify-center gap-2 transition-all duration-300 ease-in-out"
            style={{
              fontFamily: "Plus Jakarta Sans",
              background: "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)",
              boxShadow: `
                0px 3px 1px -2px rgba(0, 0, 0, 0.2),
                0px 2px 2px 0px rgba(0, 0, 0, 0.14),
                0px 1px 5px 0px rgba(0, 0, 0, 0.12)
              `,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "linear-gradient(180deg, #6A1B9A 0%, #4A0072 100%)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "linear-gradient(180deg, #9C27B0 0%, #7B1FA2 100%)";
            }}
          >
            Proceed
            <span className="ml-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 17L17 7M7 7h10v10"
                />
              </svg>
            </span>
          </button>
          </div>
        )}
      </div>
<div className="w-full max-w-[1440px] h-auto gap-[40px] rotate-0 opacity-100 px-4 sm:px-6 md:px-[70px] overflow-hidden mx-auto">
  <Question />
</div>




    
    </div>
  );
}

export default Services;