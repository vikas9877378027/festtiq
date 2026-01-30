
// // src/pages/Venues.jsx
// import React, { useEffect, useMemo, useState } from "react";
// import { useNavigate } from "react-router-dom";

// import eventFallback from "../assets/venue/image (11).png";
// import { HiAdjustmentsVertical } from "react-icons/hi2";

// /* ===================== API ENDPOINT ===================== */
// const API_BASE = "http://localhost:4000/api";
// const PRODUCT_LIST_URL = `${API_BASE}/product/list`;

// /* ===================== Event Types (for filter) ===================== */
// const EVENT_GROUPS = [
//   {
//     title: "Wedding Ceremonies",
//     options: ["Engagement", "Wedding", "Reception"],
//   },
//   {
//     title: "Family Celebrations",
//     options: ["Birthday Party", "Baby Shower", "Anniversary"],
//   },
//   {
//     title: "Corporate Events",
//     options: [
//       "Conference / Seminar",
//       "Product Launch",
//       "Networking Event",
//       "Company Anniversary",
//       "Trade Show / Exhibition",
//     ],
//   },
//   {
//     title: "Entertainment Shows",
//     options: ["Live Concert", "Stand-up Comedy Show", "DJ Night"],
//   },
//   {
//     title: "Cultural Events",
//     options: ["Festival", "Spiritual Retreats", "Community Gatherings"],
//   },
// ];

// /* ===================== Budget ranges ===================== */
// const BUDGET_OPTIONS = [
//   { id: "lt1", label: "Less than 1 lakh", min: 0, max: 1_00_000 },
//   { id: "1-5", label: "1 lakh - 5 lakh", min: 1_00_000, max: 5_00_000 },
//   { id: "5-10", label: "5 lakh - 10 lakh", min: 5_00_000, max: 10_00_000 },
//   { id: "10-20", label: "10 lakh - 20 lakh", min: 10_00_000, max: 20_00_000 },
//   { id: "20-30", label: "20 lakh - 30 lakh", min: 20_00_000, max: 30_00_000 },
//   { id: "30-40", label: "30 lakh - 40 lakh", min: 30_00_000, max: 40_00_000 },
//   { id: "40-50", label: "40 lakh - 50 lakh", min: 40_00_000, max: 50_00_000 },
// ];

// /* ===================== Hall size ranges ===================== */
// const HALL_SIZE_OPTIONS = [
//   { id: "small", label: "Small (< 50 guests)", min: 0, max: 50 },
//   { id: "med", label: "Medium (50 - 200 guests)", min: 50, max: 200 },
//   { id: "large", label: "Large (200 - 500 guests)", min: 200, max: 500 },
//   { id: "xl", label: "Extra large (500+ guests)", min: 500, max: Infinity },
// ];

// /* ===================== Small modal components ===================== */

// function ModalShell({ open, title, children, onClose }) {
//   if (!open) return null;
//   return (
//     <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
//       <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
//         <button
//           onClick={onClose}
//           className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600"
//         >
//           ✕
//         </button>
//         <div className="px-8 pt-10 pb-6">
//           <h2 className="text-2xl font-semibold text-center mb-6">
//             {title}
//           </h2>
//           {children}
//         </div>
//       </div>
//     </div>
//   );
// }

// function EventTypeModal({
//   open,
//   selected,
//   onSelect,
//   onClear,
//   onApply,
//   onClose,
// }) {
//   return (
//     <ModalShell open={open} title="Select Your Event Type" onClose={onClose}>
//       <div className="space-y-6 text-sm">
//         {EVENT_GROUPS.map((group) => (
//           <div key={group.title}>
//             <h3 className="font-semibold text-[#181375] mb-2">
//               {group.title}
//             </h3>
//             <div className="space-y-2">
//               {group.options.map((opt) => (
//                 <label
//                   key={opt}
//                   className="flex items-center gap-2 cursor-pointer"
//                 >
//                   <input
//                     type="radio"
//                     name="eventType"
//                     className="text-purple-600"
//                     checked={selected === opt}
//                     onChange={() => onSelect(opt)}
//                   />
//                   <span>{opt}</span>
//                 </label>
//               ))}
//             </div>
//           </div>
//         ))}
//       </div>

//       <div className="flex justify-center gap-4 mt-8">
//         <button
//           type="button"
//           onClick={onClear}
//           className="px-5 py-2 rounded-lg border border-purple-400 text-purple-600 text-sm"
//         >
//           Clear Selection
//         </button>
//         <button
//           type="button"
//           onClick={onApply}
//           className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm"
//         >
//           Show Results
//         </button>
//       </div>
//     </ModalShell>
//   );
// }

// function BudgetModal({ open, selectedId, onSelect, onClear, onApply, onClose }) {
//   return (
//     <ModalShell open={open} title="Select Your Budget" onClose={onClose}>
//       <div className="space-y-2 text-sm">
//         {BUDGET_OPTIONS.map((opt) => (
//           <label
//             key={opt.id}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <input
//               type="radio"
//               name="budget"
//               className="text-purple-600"
//               checked={selectedId === opt.id}
//               onChange={() => onSelect(opt.id)}
//             />
//             <span>{opt.label}</span>
//           </label>
//         ))}
//       </div>

//       <div className="flex justify-center gap-4 mt-8">
//         <button
//           type="button"
//           onClick={onClear}
//           className="px-5 py-2 rounded-lg border border-purple-400 text-purple-600 text-sm"
//         >
//           Clear Selection
//         </button>
//         <button
//           type="button"
//           onClick={onApply}
//           className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm"
//         >
//           Show Results
//         </button>
//       </div>
//     </ModalShell>
//   );
// }

// function HallSizeModal({
//   open,
//   selectedId,
//   onSelect,
//   onClear,
//   onApply,
//   onClose,
// }) {
//   return (
//     <ModalShell open={open} title="Select Hall Size" onClose={onClose}>
//       <div className="space-y-2 text-sm">
//         {HALL_SIZE_OPTIONS.map((opt) => (
//           <label
//             key={opt.id}
//             className="flex items-center gap-2 cursor-pointer"
//           >
//             <input
//               type="radio"
//               name="hallSize"
//               className="text-purple-600"
//               checked={selectedId === opt.id}
//               onChange={() => onSelect(opt.id)}
//             />
//             <span>{opt.label}</span>
//           </label>
//         ))}
//       </div>

//       <div className="flex justify-center gap-4 mt-8">
//         <button
//           type="button"
//           onClick={onClear}
//           className="px-5 py-2 rounded-lg border border-purple-400 text-purple-600 text-sm"
//         >
//           Clear Selection
//         </button>
//         <button
//           type="button"
//           onClick={onApply}
//           className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm"
//         >
//           Show Results
//         </button>
//       </div>
//     </ModalShell>
//   );
// }

// /* ===================== Main Page ===================== */

// export default function Venues() {
//   const navigate = useNavigate();

//   const [venues, setVenues] = useState([]);
//   const [favorites, setFavorites] = useState([]);

//   const [loading, setLoading] = useState(false);

//   // filters
//   const [selectedEventType, setSelectedEventType] = useState("");
//   const [selectedBudgetId, setSelectedBudgetId] = useState("");
//   const [selectedHallSizeId, setSelectedHallSizeId] = useState("");
//   const [selectedLocality, setSelectedLocality] = useState("");

//   // modal open flags
//   const [showEventModal, setShowEventModal] = useState(false);
//   const [showBudgetModal, setShowBudgetModal] = useState(false);
//   const [showHallModal, setShowHallModal] = useState(false);

//   // locality dropdown
//   const [showLocalityMenu, setShowLocalityMenu] = useState(false);

//   const currency = (n) =>
//     (Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

//   // map product from API -> UI shape
//   const mapProductToVenue = (p) => {
//     const price = p.offerPrice || p.price || 0;
//     const capacity = p.capacities?.hall || 0;
//     const rooms = p.capacities?.guestRooms || 0;
//     const city = p.address?.city || "";
//     const area = p.address?.area || "";
//     const localityLabel = [area, city].filter(Boolean).join(", ");

//     return {
//       _id: p._id,
//       name: p.name,
//       thumbnail: p.image?.[0] || eventFallback,
//       area: localityLabel,
//       city,
//       capacity,
//       rooms,
//       type: p.venueType || "Indoor",
//       pricePerDay: price,
//       rating: 5,
//       badge: p.isFeatured ? "Most Viewed" : undefined,
//       bestForEvents: p.bestForEvents || [], // used for filters
//     };
//   };

//   // fetch from /api/product/list
//   useEffect(() => {
//     (async () => {
//       try {
//         setLoading(true);
//         const res = await fetch(PRODUCT_LIST_URL);
//         const data = await res.json().catch(() => ({}));
//         if (res.ok && data?.success && Array.isArray(data.products)) {
//           setVenues(data.products.map(mapProductToVenue));
//         } else {
//           setVenues([]);
//         }
//       } catch (err) {
//         console.error("Error loading venues:", err?.message);
//       } finally {
//         setLoading(false);
//       }
//     })();
//   }, []);

//   // unique localities from venues
//   const localityOptions = useMemo(() => {
//     const set = new Set();
//     venues.forEach((v) => {
//       const loc = v.area || v.city;
//       if (loc) set.add(loc);
//     });
//     return Array.from(set).sort();
//   }, [venues]);

//   // derived filtered list
//   const filteredVenues = useMemo(() => {
//     return venues.filter((v) => {
//       // locality
//       if (selectedLocality && !(v.area || "").includes(selectedLocality)) {
//         return false;
//       }

//       // event type
//       if (
//         selectedEventType &&
//         !(v.bestForEvents || []).includes(selectedEventType)
//       ) {
//         return false;
//       }

//       // budget
//       if (selectedBudgetId) {
//         const opt = BUDGET_OPTIONS.find((o) => o.id === selectedBudgetId);
//         const price = v.pricePerDay || 0;
//         if (!opt || price < opt.min || price > opt.max) {
//           return false;
//         }
//       }

//       // hall size
//       if (selectedHallSizeId) {
//         const opt = HALL_SIZE_OPTIONS.find((o) => o.id === selectedHallSizeId);
//         const cap = v.capacity || 0;
//         if (!opt || cap < opt.min || cap > opt.max) {
//           return false;
//         }
//       }

//       return true;
//     });
//   }, [venues, selectedLocality, selectedEventType, selectedBudgetId, selectedHallSizeId]);

//   const toggleFavorite = (id) =>
//     setFavorites((prev) =>
//       prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
//     );

//   /* ------------ handlers ------------ */

//   const handleFilterClick = (filter) => {
//     if (filter === "Event Type") setShowEventModal(true);
//     else if (filter === "Budget") setShowBudgetModal(true);
//     else if (filter === "Hall Size") setShowHallModal(true);
//   };

//   const handleAddVenueClick = () => {
//     // ✅ go to admin dashboard instead of opening popup
//     navigate("/admin/venues");
//   };

//   /* ===================== Render ===================== */

//   return (
//     <div className="w-full pt-[150px] px-4 sm:px-6 lg:px-24 py-8 bg-[#f9f9f9] font-[Plus_Jakarta_Sans]">
//       {/* Header + Filters */}
//       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6">
//         <h2 className="text-2xl sm:text-[28px] lg:text-[35px] font-abhaya font-normal leading-[117%] tracking-[-0.09375em] text-[#181375]">
//           Refined Results
//         </h2>

//         <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
//           <button
//             onClick={handleAddVenueClick}
//             className="rounded-lg bg-[#8F24AB] px-4 py-2 text-white shadow hover:bg-[#5E0C7D]"
//           >
//             + Add Venue
//           </button>

//           <div className="relative flex flex-wrap gap-2 sm:gap-3">
//             {/* Localities button with dropdown */}
//             <button
//               type="button"
//               onClick={() => setShowLocalityMenu((s) => !s)}
//               className="w-full sm:w-[140px] h-[42px] flex items-center justify-center gap-2 border border-gray-300 rounded-md bg-white 
//                 text-sm font-semibold text-gray-600"
//             >
//               {selectedLocality || "Localities"}
//               <HiAdjustmentsVertical className="text-gray-600 text-lg" />
//             </button>
//             {showLocalityMenu && localityOptions.length > 0 && (
//               <div className="absolute z-40 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-60 overflow-y-auto">
//                 <button
//                   className={`w-full text-left text-xs px-3 py-1 rounded-lg ${
//                     !selectedLocality
//                       ? "bg-purple-50 text-purple-700"
//                       : "hover:bg-gray-50"
//                   }`}
//                   onClick={() => {
//                     setSelectedLocality("");
//                     setShowLocalityMenu(false);
//                   }}
//                 >
//                   All localities
//                 </button>
//                 {localityOptions.map((loc) => (
//                   <button
//                     key={loc}
//                     className={`w-full text-left text-xs px-3 py-1 rounded-lg ${
//                       selectedLocality === loc
//                         ? "bg-purple-100 text-purple-700"
//                         : "hover:bg-gray-50"
//                     }`}
//                     onClick={() => {
//                       setSelectedLocality(loc);
//                       setShowLocalityMenu(false);
//                     }}
//                   >
//                     {loc}
//                   </button>
//                 ))}
//               </div>
//             )}

//             {/* Event type */}
//             <button
//               type="button"
//               onClick={() => handleFilterClick("Event Type")}
//               className="w-full sm:w-[140px] h-[42px] flex items-center justify-center gap-2 border border-gray-300 rounded-md bg-white 
//                 text-sm font-semibold text-gray-600"
//             >
//               {selectedEventType || "Event Type"}
//               <HiAdjustmentsVertical className="text-gray-600 text-lg" />
//             </button>

//             {/* Budget */}
//             <button
//               type="button"
//               onClick={() => handleFilterClick("Budget")}
//               className="w-full sm:w-[140px] h-[42px] flex items-center justify-center gap-2 border border-gray-300 rounded-md bg-white 
//                 text-sm font-semibold text-gray-600"
//             >
//               {selectedBudgetId
//                 ? BUDGET_OPTIONS.find((b) => b.id === selectedBudgetId)?.label ??
//                   "Budget"
//                 : "Budget"}
//               <HiAdjustmentsVertical className="text-gray-600 text-lg" />
//             </button>

//             {/* Hall size */}
//             <button
//               type="button"
//               onClick={() => handleFilterClick("Hall Size")}
//               className="w-full sm:w-[140px] h-[42px] flex items-center justify-center gap-2 border border-gray-300 rounded-md bg-white 
//                 text-sm font-semibold text-gray-600"
//             >
//               {selectedHallSizeId
//                 ? HALL_SIZE_OPTIONS.find((h) => h.id === selectedHallSizeId)
//                     ?.label ?? "Hall Size"
//                 : "Hall Size"}
//               <HiAdjustmentsVertical className="text-gray-600 text-lg" />
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Venue Grid */}
//       {loading ? (
//         <p className="text-sm text-gray-500">Loading venues…</p>
//       ) : filteredVenues.length === 0 ? (
//         <p className="text-sm text-gray-500">
//           No venues found for the selected filters.
//         </p>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           {filteredVenues.map((venue) => {
//             const isMostViewed = venue.badge === "Most Viewed";
//             const isFavorited = favorites.includes(venue._id);

//             return (
//               <div
//                 key={venue._id}
//                 onClick={() =>
//                   isMostViewed && navigate("/venues/mostviewed")
//                 }
//                 className={`rounded-xl bg-white border border-[#E0E0E0] shadow-md w-full max-w-full sm:max-w-[297px] h-[360px] overflow-hidden mx-auto cursor-${
//                   isMostViewed ? "pointer" : "default"
//                 }`}
//               >
//                 <div className="relative">
//                   <img
//                     src={venue.thumbnail || eventFallback}
//                     alt={venue.name}
//                     className="w-full h-[180px] object-cover rounded-t-xl"
//                   />
//                   {venue.badge && (
//                     <span className="absolute top-2 left-2 bg-white text-[10px] font-medium px-2 py-1 rounded-full shadow-sm">
//                       👑 {venue.badge}
//                     </span>
//                   )}
//                   <span
//                     className="absolute top-2 right-2 text-xl cursor-pointer"
//                     onClick={(e) => {
//                       e.stopPropagation();
//                       toggleFavorite(venue._id);
//                     }}
//                   >
//                     {isFavorited ? "❤️" : "🤍"}
//                   </span>
//                 </div>

//                 <div className="px-4 pt-2 pb-3">
//                   <div className="flex justify-between items-center font-semibold text-lg">
//                     <span className="text-[15px] sm:text-[16px]">
//                       {venue.name}
//                     </span>
//                     <div className="flex items-center text-yellow-500 text-sm gap-1">
//                       <span>⭐</span>
//                       <span className="font-medium">
//                         {Number(venue.rating || 5).toFixed(1)}
//                       </span>
//                     </div>
//                   </div>
//                   <p className="text-xs sm:text-sm text-gray-500">
//                     {venue.area}
//                   </p>
//                   <div className="flex gap-2 mt-2 flex-wrap text-xs text-gray-700">
//                     <span className="px-2 py-[2px] bg-gray-100 border border-gray-300 rounded-full">
//                       {venue.capacity} Capacity
//                     </span>
//                     <span className="px-2 py-[2px] bg-gray-100 border border-gray-300 rounded-full">
//                       {venue.rooms} Rooms
//                     </span>
//                     <span className="px-2 py-[2px] bg-gray-100 border border-gray-300 rounded-full">
//                       {venue.type}
//                     </span>
//                   </div>
//                   <div className="pt-2 text-md font-bold text-black">
//                     ₹{currency(venue.pricePerDay)}{" "}
//                     <span className="text-sm font-normal text-gray-500">
//                       Per Day
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       )}

//       {/* Filter Modals */}
//       <EventTypeModal
//         open={showEventModal}
//         selected={selectedEventType}
//         onSelect={setSelectedEventType}
//         onClear={() => setSelectedEventType("")}
//         onApply={() => setShowEventModal(false)}
//         onClose={() => setShowEventModal(false)}
//       />
//       <BudgetModal
//         open={showBudgetModal}
//         selectedId={selectedBudgetId}
//         onSelect={setSelectedBudgetId}
//         onClear={() => setSelectedBudgetId("")}
//         onApply={() => setShowBudgetModal(false)}
//         onClose={() => setShowBudgetModal(false)}
//       />
//       <HallSizeModal
//         open={showHallModal}
//         selectedId={selectedHallSizeId}
//         onSelect={setSelectedHallSizeId}
//         onClear={() => setSelectedHallSizeId("")}
//         onApply={() => setShowHallModal(false)}
//         onClose={() => setShowHallModal(false)}
//       />
//     </div>
//   );
// }



// src/pages/Venues.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import eventFallback from "../assets/venue/image (11).png";
import { HiAdjustmentsVertical } from "react-icons/hi2";

/* ===================== API ENDPOINT ===================== */
import {
  PRODUCT_LIST_URL,
  FAVORITES_URL,
  TOGGLE_FAVORITE_URL,
  getImageUrl,
} from "../config/apiConfig";
console.log("PRODUCT_LIST_URL", PRODUCT_LIST_URL);   

/* ===================== Event Types (for filter) ===================== */
const EVENT_GROUPS = [
  {
    title: "Wedding Ceremonies",
    options: ["Engagement", "Wedding", "Reception"],
  },
  {
    title: "Family Celebrations",
    options: ["Birthday Party", "Baby Shower", "Anniversary"],
  },
  {
    title: "Corporate Events",
    options: [
      "Conference / Seminar",
      "Product Launch",
      "Networking Event",
      "Company Anniversary",
      "Trade Show / Exhibition",
    ],
  },
  {
    title: "Entertainment Shows",
    options: ["Live Concert", "Stand-up Comedy Show", "DJ Night"],
  },
  {
    title: "Cultural Events",
    options: ["Festival", "Spiritual Retreats", "Community Gatherings"],
  },
];

/* ===================== Budget ranges ===================== */
const BUDGET_OPTIONS = [
  { id: "lt1", label: "Less than 1 lakh", min: 0, max: 1_00_000 },
  { id: "1-5", label: "1 lakh - 5 lakh", min: 1_00_000, max: 5_00_000 },
  { id: "5-10", label: "5 lakh - 10 lakh", min: 5_00_000, max: 10_00_000 },
  { id: "10-20", label: "10 lakh - 20 lakh", min: 10_00_000, max: 20_00_000 },
  { id: "20-30", label: "20 lakh - 30 lakh", min: 20_00_000, max: 30_00_000 },
  { id: "30-40", label: "30 lakh - 40 lakh", min: 30_00_000, max: 40_00_000 },
  { id: "40-50", label: "40 lakh - 50 lakh", min: 40_00_000, max: 50_00_000 },
];

/* ===================== Hall size ranges ===================== */
const HALL_SIZE_OPTIONS = [
  { id: "small", label: "Small (< 50 guests)", min: 0, max: 50 },
  { id: "med", label: "Medium (50 - 200 guests)", min: 50, max: 200 },
  { id: "large", label: "Large (200 - 500 guests)", min: 200, max: 500 },
  { id: "xl", label: "Extra large (500+ guests)", min: 500, max: Infinity },
];

/* ===================== Small modal components ===================== */                  

function ModalShell({ open, title, children, onClose }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
      <div className="relative w-full max-w-xl rounded-2xl bg-white shadow-xl max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
        <div className="px-8 pt-10 pb-6">
          <h2 className="text-2xl font-semibold text-center mb-6">
            {title}
          </h2>
          {children}
        </div>
      </div>
    </div>
  );
}

function EventTypeModal({
  open,
  selected,
  onSelect,
  onClear,
  onApply,
  onClose,
}) {
  return (
    <ModalShell open={open} title="Select Your Event Type" onClose={onClose}>
      <div className="space-y-6 text-sm">
        {EVENT_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="font-semibold text-[#181375] mb-2">
              {group.title}
            </h3>
            <div className="space-y-2">
              {group.options.map((opt) => (
                <label
                  key={opt}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="radio"
                    name="eventType"
                    className="text-purple-600"
                    checked={selected === opt}
                    onChange={() => onSelect(opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={onClear}
          className="px-5 py-2 rounded-lg border border-purple-400 text-purple-600 text-sm"
        >
          Clear Selection
        </button>
        <button
          type="button"
          onClick={onApply}
          className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm"
        >
          Show Results
        </button>
      </div>
    </ModalShell>
  );
}

function BudgetModal({
  open,
  selectedId,
  onSelect,
  onClear,
  onApply,
  onClose,
}) {
  return (
    <ModalShell open={open} title="Select Your Budget" onClose={onClose}>
      <div className="space-y-2 text-sm">
        {BUDGET_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="budget"
              className="text-purple-600"
              checked={selectedId === opt.id}
              onChange={() => onSelect(opt.id)}
            />
            <span>{opt.label}</span>       
          </label>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={onClear}
          className="px-5 py-2 rounded-lg border border-purple-400 text-purple-600 text-sm"
        >
          Clear Selection
        </button>
        <button
          type="button"
          onClick={onApply}
          className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm"
        >
          Show Results
        </button>
      </div>
    </ModalShell>
  );
}

function HallSizeModal({
  open,
  selectedId,
  onSelect,
  onClear,
  onApply,
  onClose,
}) {
  return (
    <ModalShell open={open} title="Select Hall Size" onClose={onClose}>
      <div className="space-y-2 text-sm">
        {HALL_SIZE_OPTIONS.map((opt) => (
          <label
            key={opt.id}
            className="flex items-center gap-2 cursor-pointer"
          >
            <input
              type="radio"
              name="hallSize"
              className="text-purple-600"
              checked={selectedId === opt.id}
              onChange={() => onSelect(opt.id)}
            />
            <span>{opt.label}</span>
          </label>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8">
        <button
          type="button"
          onClick={onClear}
          className="px-5 py-2 rounded-lg border border-purple-400 text-purple-600 text-sm"
        >
          Clear Selection
        </button>
        <button
          type="button"
          onClick={onApply}
          className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm"
        >
          Show Results
        </button>
      </div>
    </ModalShell>
  );
}

/* ===================== Main Page ===================== */

export default function Venues() {
  const navigate = useNavigate();

  const [venues, setVenues] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Check if user is admin
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const authUser = localStorage.getItem("auth_user");
    if (authUser) {
      try {
        const user = JSON.parse(authUser);
        setIsAdmin(user.role === "admin");
      } catch (e) {
        console.error("Error parsing auth_user:", e);
        setIsAdmin(false);
      }
    }
  }, []);

  // filters
  const [selectedEventType, setSelectedEventType] = useState("");
  const [selectedBudgetId, setSelectedBudgetId] = useState("");
  const [selectedHallSizeId, setSelectedHallSizeId] = useState("");
  const [selectedLocality, setSelectedLocality] = useState("");

  // modals
  const [showEventModal, setShowEventModal] = useState(false);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [showHallModal, setShowHallModal] = useState(false);

  // locality dropdown
  const [showLocalityMenu, setShowLocalityMenu] = useState(false);

  const currency = (n) =>
    (Number(n) || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

  // map backend product -> venue card
  const mapProductToVenue = (p) => {
    const price = p.offerPrice || p.price || 0;
    const capacity = p.capacities?.hall || 0;
    const rooms = p.capacities?.guestRooms || 0;
    const city = p.address?.city || "";
    const area = p.address?.area || "";
    const localityLabel = [area, city].filter(Boolean).join(", ");

    return {
      _id: p._id,
      name: p.name,
      thumbnail: p.image?.[0] || eventFallback,
      area: localityLabel,
      city,
      capacity,
      rooms,
      type: p.venueType || "Indoor",
      pricePerDay: price,
      rating: 5,
      badge: p.isFeatured ? "Most Viewed" : undefined,
      bestForEvents: p.bestForEvents || [],
    };
  };

  // fetch venues from API
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log("Fetching venues from:", PRODUCT_LIST_URL);
        const res = await fetch(PRODUCT_LIST_URL);
        
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        
        const data = await res.json();
        console.log("API Response:", data);
        
        if (data?.success && Array.isArray(data.products)) {
          console.log("Total products from API:", data.products.length);
          
          // Filter to show only active venues (inStock: true)
          const activeProducts = data.products.filter((p) => p.inStock === true);
          console.log("Active venues (inStock=true):", activeProducts.length);
          
          const mappedVenues = activeProducts.map(mapProductToVenue);
          setVenues(mappedVenues);
          
          if (mappedVenues.length === 0) {
            setError("No active venues found. Please add some venues from the admin panel.");
          }
        } else {
          setVenues([]);
          setError("Invalid API response format");
        }
      } catch (err) {
        console.error("Error loading venues:", err);
        setError(`Failed to load venues: ${err.message}`);
        setVenues([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Load user favorites from backend
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        // Check if user is logged in
        const storedUser = localStorage.getItem("auth_user");
        if (!storedUser) {
          console.log("No user logged in, skipping favorites load");
          return;
        }

        const response = await axios.get(FAVORITES_URL, {
          withCredentials: true,
        });

        if (response.data?.success) {
          setFavorites(response.data.favorites || []);
          console.log("Loaded favorites:", response.data.favorites);
        }
      } catch (error) {
        console.error("Error loading favorites:", error);
        // If unauthorized, clear favorites
        if (error.response?.status === 401) {
          setFavorites([]);
        }
      }
    };

    loadFavorites();
  }, []);

  // locality list derived from venues - using city only for cleaner display
  const localityOptions = useMemo(() => {
    const citySet = new Set();
    venues.forEach((v) => {
      const city = v.city;
      if (city && city.trim()) {
        citySet.add(city.trim());
      }
    });
    return Array.from(citySet).sort();
  }, [venues]);

  // apply filters
  const filteredVenues = useMemo(() => {
    console.log("=== FILTER DEBUG ===");
    console.log("Total venues:", venues.length);
    console.log("Active filters:", {
      locality: selectedLocality,
      eventType: selectedEventType,
      budgetId: selectedBudgetId,
      hallSizeId: selectedHallSizeId,
    });
    
    // Debug: Show all venue prices
    if (selectedBudgetId) {
      console.log("\n📊 All Venue Prices:");
      venues.forEach(v => {
        console.log(`  ${v.name}: ₹${(v.pricePerDay || 0).toLocaleString('en-IN')}`);
      });
      const opt = BUDGET_OPTIONS.find((o) => o.id === selectedBudgetId);
      console.log(`\n🎯 Selected Budget Range: ₹${opt?.min.toLocaleString('en-IN')} - ₹${opt?.max.toLocaleString('en-IN')}\n`);
    }

    const filtered = venues.filter((v) => {
      // Locality filter - match against city
      if (selectedLocality) {
        const cityStr = (v.city || "").trim().toLowerCase();
        const searchStr = selectedLocality.trim().toLowerCase();
        
        // Check if city matches
        if (cityStr !== searchStr) {
          console.log(`❌ Filtered out "${v.name}" - locality mismatch (searching: "${searchStr}", city: "${cityStr}")`);
          return false;
        }
      }

      // Event Type filter - exact match in array
      if (selectedEventType) {
        const eventTypes = v.bestForEvents || [];
        if (!eventTypes.includes(selectedEventType)) {
          console.log(`❌ Filtered out "${v.name}" - event type mismatch (searching: "${selectedEventType}", has: [${eventTypes.join(", ")}])`);
          return false;
        }
      }

      // Budget filter - inclusive range check
      if (selectedBudgetId) {
        const opt = BUDGET_OPTIONS.find((o) => o.id === selectedBudgetId);
        const price = v.pricePerDay || 0;
        if (!opt || price < opt.min || price > opt.max) {
          console.log(`❌ Filtered out "${v.name}" - budget mismatch (price: ₹${price}, range: ${opt?.min}-${opt?.max})`);
          return false;
        }
      }

      // Hall Size filter - inclusive range check
      if (selectedHallSizeId) {
        const opt = HALL_SIZE_OPTIONS.find((o) => o.id === selectedHallSizeId);
        const cap = v.capacity || 0;
        if (!opt || cap < opt.min || (opt.max !== Infinity && cap > opt.max)) {
          console.log(`❌ Filtered out "${v.name}" - capacity mismatch (capacity: ${cap}, range: ${opt?.min}-${opt?.max})`);
          return false;
        }
      }

      return true;
    });

    console.log(`✅ Filtered result: ${filtered.length} venues`);
    return filtered;
  }, [venues, selectedLocality, selectedEventType, selectedBudgetId, selectedHallSizeId]);

  const toggleFavorite = async (id) => {
    try {
      // Check if user is logged in
      const storedUser = localStorage.getItem("auth_user");
      if (!storedUser) {
        toast.error("Please log in to save favorites", {
          position: "top-right",
          autoClose: 3000,
        });
        return;
      }

      // Optimistically update UI
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );

      // Send to backend
      const response = await axios.post(
        TOGGLE_FAVORITE_URL,
        { venueId: id },
        { withCredentials: true }
      );

      if (response.data?.success) {
        console.log(response.data.message);
        // Update with server response to ensure sync
        setFavorites(response.data.favorites);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // Revert optimistic update on error
      setFavorites((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
      );
      
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
    }
  };

  const handleFilterClick = (filter) => {
    if (filter === "Event Type") setShowEventModal(true);
    else if (filter === "Budget") setShowBudgetModal(true);
    else if (filter === "Hall Size") setShowHallModal(true);
  };

  const handleAddVenueClick = () => {
    navigate("/admin/venues");
  };  

  // clear all filters at once   
  const clearAllFilters = () => {  
    setSelectedLocality("");
    setSelectedEventType("");
    setSelectedBudgetId("");
    setSelectedHallSizeId("");
  };

  // retry loading venues
  const retryLoadVenues = () => {
    window.location.reload();
  };

  return (
    <div className="w-full pt-[150px] px-4 sm:px-6 lg:px-24 py-8 bg-[#f9f9f9] font-[Plus_Jakarta_Sans]">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6">
        <h2 className="text-2xl sm:text-[28px] lg:text-[35px] font-abhaya font-normal leading-[117%] tracking-[-0.09375em] text-[#181375]">
          Refined Results
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 w-full md:w-auto">
          {/* Only show Add Venue button to admins */}
          {isAdmin && (
            <button
              onClick={handleAddVenueClick}
              className="rounded-lg bg-[#8F24AB] px-4 py-2 text-white shadow hover:bg-[#5E0C7D]"
            >
              + Add Venue
            </button>
          )}

          <div className="relative flex flex-wrap gap-2 sm:gap-3">
            {/* City dropdown */}
            <button
              type="button"
              onClick={() => setShowLocalityMenu((s) => !s)}
              className={`w-full sm:w-[140px] h-[42px] flex items-center justify-center gap-2 border rounded-md text-sm font-semibold transition-colors ${
                selectedLocality
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
              }`}
            >
              {selectedLocality || "City"}
              <HiAdjustmentsVertical className={selectedLocality ? "text-purple-700" : "text-gray-600"} />
            </button>
            {showLocalityMenu && localityOptions.length > 0 && (
              <div className="absolute z-40 mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-60 overflow-y-auto">
                <button
                  className={`w-full text-left text-xs px-3 py-1 rounded-lg ${
                    !selectedLocality
                      ? "bg-purple-50 text-purple-700"
                      : "hover:bg-gray-50"
                  }`}
                  onClick={() => {
                    setSelectedLocality("");
                    setShowLocalityMenu(false);
                  }}
                >
                  All cities
                </button>
                {localityOptions.map((loc) => (
                  <button
                    key={loc}
                    className={`w-full text-left text-xs px-3 py-1 rounded-lg ${
                      selectedLocality === loc
                        ? "bg-purple-100 text-purple-700"
                        : "hover:bg-gray-50"
                    }`}
                    onClick={() => {
                      setSelectedLocality(loc);
                      setShowLocalityMenu(false);
                    }}
                  >
                    {loc}
                  </button>
                ))}
              </div>
            )}

            {/* Event type */}
            <button
              type="button"
              onClick={() => handleFilterClick("Event Type")}
              className={`w-full sm:w-[140px] h-[42px] flex items-center justify-center gap-2 border rounded-md text-sm font-semibold transition-colors ${
                selectedEventType
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
              }`}
            >
              {selectedEventType || "Event Type"}
              <HiAdjustmentsVertical className={selectedEventType ? "text-purple-700" : "text-gray-600"} />
            </button>

            {/* Budget */}
            <button
              type="button"
              onClick={() => handleFilterClick("Budget")}
              className={`w-full sm:w-[140px] h-[42px] flex items-center justify-center gap-2 border rounded-md text-sm font-semibold transition-colors ${
                selectedBudgetId
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
              }`}
            >
              {selectedBudgetId
                ? BUDGET_OPTIONS.find((b) => b.id === selectedBudgetId)?.label ??
                  "Budget"
                : "Budget"}
              <HiAdjustmentsVertical className={selectedBudgetId ? "text-purple-700" : "text-gray-600"} />
            </button>

            {/* Hall size */}
            <button
              type="button"
              onClick={() => handleFilterClick("Hall Size")}
              className={`w-full sm:w-[140px] h-[42px] flex items-center justify-center gap-2 border rounded-md text-sm font-semibold transition-colors ${
                selectedHallSizeId
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 bg-white text-gray-600 hover:border-purple-300"
              }`}
            >
              {selectedHallSizeId
                ? HALL_SIZE_OPTIONS.find((h) => h.id === selectedHallSizeId)
                    ?.label ?? "Hall Size"
                : "Hall Size"}
              <HiAdjustmentsVertical className={selectedHallSizeId ? "text-purple-700" : "text-gray-600"} />
            </button>
          </div>
        </div>
      </div>

      {/* Active Filters Display */}
      {(selectedLocality || selectedEventType || selectedBudgetId || selectedHallSizeId) && (
        <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-gray-200 mb-6">
          <span className="text-sm text-gray-600 font-medium">Active Filters:</span>
          
          {selectedLocality && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              City: {selectedLocality}
              <button
                onClick={() => setSelectedLocality("")}
                className="hover:text-purple-900"
              >
                ✕
              </button>
            </span>
          )}
          
          {selectedEventType && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              Event: {selectedEventType}
              <button
                onClick={() => setSelectedEventType("")}
                className="hover:text-purple-900"
              >
                ✕
              </button>
            </span>
          )}
          
          {selectedBudgetId && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              Budget: {BUDGET_OPTIONS.find((b) => b.id === selectedBudgetId)?.label}
              <button
                onClick={() => setSelectedBudgetId("")}
                className="hover:text-purple-900"
              >
                ✕
              </button>
            </span>
          )}
          
          {selectedHallSizeId && (
            <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-100 text-purple-700 text-xs font-medium">
              Hall: {HALL_SIZE_OPTIONS.find((h) => h.id === selectedHallSizeId)?.label}
              <button
                onClick={() => setSelectedHallSizeId("")}
                className="hover:text-purple-900"
              >
                ✕
              </button>
            </span>
          )}
          
          <button
            onClick={clearAllFilters}
            className="ml-2 px-3 py-1.5 rounded-full border border-purple-500 text-purple-600 text-xs font-medium hover:bg-purple-50"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Venue Grid / Empty State */}
      {loading ? (
        <div className="mt-8 mb-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white/70 px-6 py-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mb-4"></div>
          <p className="text-sm text-gray-600">Loading venues…</p>
        </div>
      ) : error ? (
        <div className="mt-8 mb-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50/70 px-6 py-10 text-center">
          <div className="text-4xl mb-3">⚠️</div>
          <p className="text-base font-semibold text-red-800 mb-2">
            Error Loading Venues
          </p>
          <p className="text-sm text-red-600 mb-4 max-w-md">
            {error}
          </p>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={retryLoadVenues}
              className="px-5 py-2 rounded-lg bg-purple-600 text-white text-sm font-medium hover:bg-purple-700"
            >
              Retry
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/venues")}
              className="px-5 py-2 rounded-lg border border-purple-500 text-purple-600 text-sm font-medium hover:bg-purple-50"
            >
              Go to Admin Panel
            </button>
          </div>
        </div>
      ) : filteredVenues.length === 0 ? (
        <div className="mt-8 mb-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-purple-200 bg-white/70 px-6 py-10 text-center">
          <div className="text-4xl mb-3">🔍</div>
          <p className="text-base font-semibold text-gray-800 mb-1">
            {venues.length === 0 ? "No venues available" : "No venues found for the selected filters"}
          </p>
          <p className="text-xs text-gray-500 mb-4 max-w-md">
            {venues.length === 0 
              ? "There are no venues in the database. Please add some venues from the admin panel."
              : "Try changing locality, event type, budget or hall size to see more options."
            }
          </p>
          <div className="flex gap-3">
            {venues.length > 0 && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-5 py-2 rounded-full border border-purple-500 text-purple-600 text-xs font-medium hover:bg-purple-50"
              >
                Clear all filters
              </button>
            )}
            <button
              type="button"
              onClick={() => navigate("/admin/venues")}
              className="px-5 py-2 rounded-lg bg-purple-600 text-white text-xs font-medium hover:bg-purple-700"
            >
              Add Venues
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {filteredVenues.map((venue) => {
            const isMostViewed = venue.badge === "Most Viewed";
            const isFavorited = favorites.includes(venue._id);

            return (
              <div
                key={venue._id}
                onClick={() => navigate(`/venues/${venue._id}`)}
                className="rounded-xl bg-white border border-[#E0E0E0] shadow-md w-full max-w-full sm:max-w-[297px] h-[360px] overflow-hidden mx-auto cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={venue.thumbnail || eventFallback}
                    alt={venue.name}
                    className="w-full h-[180px] object-cover rounded-t-xl"
                  />
                  {venue.badge && (
                    <span className="absolute top-2 left-2 bg-white text-[10px] font-medium px-2 py-1 rounded-full shadow-sm">
                      👑 {venue.badge}
                    </span>
                  )}
                  <span
                    className="absolute top-2 right-2 text-xl cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(venue._id);
                    }}
                  >
                    {isFavorited ? "❤️" : "🤍"}
                  </span>
                </div>

                <div className="px-4 pt-2 pb-3">
                  <div className="flex justify-between items-center font-semibold text-lg">
                    <span className="text-[15px] sm:text-[16px]">
                      {venue.name}
                    </span>
                    <div className="flex items-center text-yellow-500 text-sm gap-1">
                      <span>⭐</span>
                      <span className="font-medium">
                        {Number(venue.rating || 5).toFixed(1)}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500">
                    {venue.area}
                  </p>
                  <div className="flex gap-2 mt-2 flex-wrap text-xs text-gray-700">
                    <span className="px-2 py-[2px] bg-gray-100 border border-gray-300 rounded-full">
                      {venue.capacity} Capacity
                    </span>
                    <span className="px-2 py-[2px] bg-gray-100 border border-gray-300 rounded-full">
                      {venue.rooms} Rooms
                    </span>
                    <span className="px-2 py-[2px] bg-gray-100 border border-gray-300 rounded-full">
                      {venue.type}
                    </span>
                  </div>
                  <div className="pt-2 text-md font-bold text-black">
                    ₹{currency(venue.pricePerDay)}{" "}
                    <span className="text-sm font-normal text-gray-500">
                      Per Day
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filter Modals */}
      <EventTypeModal
        open={showEventModal}
        selected={selectedEventType}
        onSelect={setSelectedEventType}
        onClear={() => setSelectedEventType("")}
        onApply={() => setShowEventModal(false)}
        onClose={() => setShowEventModal(false)}
      />
      <BudgetModal
        open={showBudgetModal}
        selectedId={selectedBudgetId}
        onSelect={setSelectedBudgetId}
        onClear={() => setSelectedBudgetId("")}
        onApply={() => setShowBudgetModal(false)}
        onClose={() => setShowBudgetModal(false)}
      />
      <HallSizeModal
        open={showHallModal}
        selectedId={selectedHallSizeId}
        onSelect={setSelectedHallSizeId}
        onClear={() => setSelectedHallSizeId("")}
        onApply={() => setShowHallModal(false)}
        onClose={() => setShowHallModal(false)}
      />
    </div>
  );
}
