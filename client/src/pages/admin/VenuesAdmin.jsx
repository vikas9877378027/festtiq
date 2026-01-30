// // src/pages/admin/VenuesAdmin.jsx
// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const API_BASE = "http://localhost:4000/api";
// const PRODUCT_ADD_URL = `${API_BASE}/product/add`;
// const PRODUCT_LIST_URL = `${API_BASE}/product/list`;
// const PRODUCT_STOCK_URL = `${API_BASE}/product/stock`;

// // These should match your backend enums
// const BEST_FOR_OPTIONS = [
//   "Wedding",
//   "Birthday Party",
//   "Corporate Events",
//   "Family Celebrations",
//   "Baby Shower",
// ];

// const VENUE_TYPES = ["Indoor", "Outdoor", "Mixed"];

// const VenuesAdmin = () => {
//   // ============= FORM STATE =============
//   const [name, setName] = useState("");
//   const [city, setCity] = useState("");
//   const [area, setArea] = useState("");
//   const [addressLine1, setAddressLine1] = useState("");
//   const [stateName, setStateName] = useState("");
//   const [pincode, setPincode] = useState("");

//   const [hallCapacity, setHallCapacity] = useState("");
//   const [parkingSlots, setParkingSlots] = useState("");
//   const [guestRooms, setGuestRooms] = useState("");

//   const [price, setPrice] = useState("");
//   const [offerPrice, setOfferPrice] = useState("");
//   const [description, setDescription] = useState("");

//   const [bestForEvents, setBestForEvents] = useState([]); // array of strings
//   const [venueType, setVenueType] = useState("Indoor");
//   const [amenitiesInput, setAmenitiesInput] = useState(""); // comma-separated

//   const [images, setImages] = useState([]);
//   const [previewUrls, setPreviewUrls] = useState([]);

//   const [loading, setLoading] = useState(false);
//   const [successMessage, setSuccessMessage] = useState("");
//   const [errorMessage, setErrorMessage] = useState("");

//   // ============= LIST STATE =============
//   const [venues, setVenues] = useState([]);
//   const [listLoading, setListLoading] = useState(false);

//   // ============= FETCH VENUES =============
//   const fetchVenues = async () => {
//     try {
//       setListLoading(true);
//       const { data } = await axios.get(PRODUCT_LIST_URL);
//       if (data?.success && Array.isArray(data.products)) {
//         // we treat all products as venues for now
//         setVenues(data.products);
//       } else {
//         setVenues([]);
//       }
//     } catch (err) {
//       console.error("Error fetching venues:", err?.message);
//     } finally {
//       setListLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchVenues();
//   }, []);

//   // ============= HANDLE FILES =============
//   const handleFileChange = (e) => {
//     const files = Array.from(e.target.files || []);
//     setImages(files);
//     setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
//   };

//   // ============= BEST FOR (checkboxes) =============
//   const toggleBestFor = (value) => {
//     setBestForEvents((prev) =>
//       prev.includes(value)
//         ? prev.filter((v) => v !== value)
//         : [...prev, value]
//     );
//   };

//   // ============= SUBMIT VENUE =============
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setSuccessMessage("");
//     setErrorMessage("");

//     if (!name.trim()) {
//       setErrorMessage("Venue name is required.");
//       return;
//     }
//     if (!city.trim()) {
//       setErrorMessage("City is required.");
//       return;
//     }
//     if (!description.trim()) {
//       setErrorMessage("Short description is required.");
//       return;
//     }
//     if (!images.length) {
//       setErrorMessage("Please upload at least one image.");
//       return;
//     }

//     try {
//       setLoading(true);

//       const amenitiesArray = amenitiesInput
//         .split(",")
//         .map((s) => s.trim())
//         .filter(Boolean);

//       const productData = {
//         name: name.trim(),
//         description: [description.trim()], // backend expects Array
//         price: Number(price) || 0,
//         offerPrice: Number(offerPrice) || 0,
//         category: "Venue",
//         inStock: true,
//         address: {
//           line1: addressLine1.trim(),
//           area: area.trim(),
//           city: city.trim(),
//           state: stateName.trim(),
//           pincode: pincode.trim(),
//         },
//         bestForEvents,
//         capacities: {
//           hall: Number(hallCapacity) || 0,
//           parkingSlots: Number(parkingSlots) || 0,
//           guestRooms: Number(guestRooms) || 0,
//         },
//         venueType,
//         amenities: amenitiesArray,
//       };

//       const formData = new FormData();
//       formData.append("productData", JSON.stringify(productData));
//       images.forEach((file) => formData.append("images", file));

//       await axios.post(PRODUCT_ADD_URL, formData, {
//         withCredentials: true,
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       });

//       setSuccessMessage("Venue added successfully.");
//       setName("");
//       setCity("");
//       setArea("");
//       setAddressLine1("");
//       setStateName("");
//       setPincode("");
//       setHallCapacity("");
//       setParkingSlots("");
//       setGuestRooms("");
//       setPrice("");
//       setOfferPrice("");
//       setDescription("");
//       setBestForEvents([]);
//       setVenueType("Indoor");
//       setAmenitiesInput("");
//       setImages([]);
//       setPreviewUrls([]);

//       fetchVenues();
//     } catch (err) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Something went wrong while adding venue.";
//       setErrorMessage(msg);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ============= TOGGLE ACTIVE / INACTIVE =============
//   const toggleVenueStatus = async (venue) => {
//     const newInStock = !venue.inStock;
//     try {
//       await axios.post(
//         PRODUCT_STOCK_URL,
//         { id: venue._id, inStock: newInStock },
//         { withCredentials: true }
//       );
//       // update locally without refetch
//       setVenues((prev) =>
//         prev.map((v) =>
//           v._id === venue._id ? { ...v, inStock: newInStock } : v
//         )
//       );
//     } catch (err) {
//       console.error("Error updating stock:", err?.message);
//     }
//   };

//   return (
//     <div className="max-w-5xl mx-auto space-y-10">
//       {/* Page heading */}
//       <header className="space-y-1">
//         <h1 className="text-2xl font-semibold text-purple-700">
//           Venues Management
//         </h1>
//         <p className="text-sm text-gray-600">
//           Add and manage venues that appear on the Festtiq website.
//         </p>
//       </header>

//       {/* Messages */}
//       {(successMessage || errorMessage) && (
//         <div className="space-y-2">
//           {successMessage && (
//             <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-2 text-xs text-green-700">
//               {successMessage}
//             </div>
//           )}
//           {errorMessage && (
//             <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
//               {errorMessage}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Form Card */}
//       <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
//         <form onSubmit={handleSubmit} className="space-y-6">
//           {/* Basic Info */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Venue Name
//               </label>
//               <input
//                 type="text"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//                 placeholder="e.g. Grand Palace Banquet"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 City
//               </label>
//               <input
//                 type="text"
//                 value={city}
//                 onChange={(e) => setCity(e.target.value)}
//                 placeholder="Chennai"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Area / Locality
//               </label>
//               <input
//                 type="text"
//                 value={area}
//                 onChange={(e) => setArea(e.target.value)}
//                 placeholder="Anna Nagar"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Address Line 1
//               </label>
//               <input
//                 type="text"
//                 value={addressLine1}
//                 onChange={(e) => setAddressLine1(e.target.value)}
//                 placeholder="#1, Pallavaram - Thoraipakkam Rd"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 State
//               </label>
//               <input
//                 type="text"
//                 value={stateName}
//                 onChange={(e) => setStateName(e.target.value)}
//                 placeholder="Tamil Nadu"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>

//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Pincode
//               </label>
//               <input
//                 type="text"
//                 value={pincode}
//                 onChange={(e) => setPincode(e.target.value)}
//                 placeholder="600042"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>
//           </div>

//           {/* Capacities */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Hall Capacity
//               </label>
//               <input
//                 type="number"
//                 value={hallCapacity}
//                 onChange={(e) => setHallCapacity(e.target.value)}
//                 placeholder="300"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Parking Slots
//               </label>
//               <input
//                 type="number"
//                 value={parkingSlots}
//                 onChange={(e) => setParkingSlots(e.target.value)}
//                 placeholder="100"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Guest Rooms
//               </label>
//               <input
//                 type="number"
//                 value={guestRooms}
//                 onChange={(e) => setGuestRooms(e.target.value)}
//                 placeholder="10"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>
//           </div>

//           {/* Pricing */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Base Price (₹)
//               </label>
//               <input
//                 type="number"
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//                 placeholder="100000"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>
//             <div className="flex flex-col gap-1">
//               <label className="text-xs font-medium text-gray-700">
//                 Offer Price (₹)
//               </label>
//               <input
//                 type="number"
//                 value={offerPrice}
//                 onChange={(e) => setOfferPrice(e.target.value)}
//                 placeholder="90000"
//                 className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//               />
//             </div>
//           </div>

//           {/* Description */}
//           <div className="flex flex-col gap-1">
//             <label className="text-xs font-medium text-gray-700">
//               Short Description
//             </label>
//             <textarea
//               rows={4}
//               value={description}
//               onChange={(e) => setDescription(e.target.value)}
//               placeholder="Describe the venue (parking, ambience, decor, etc.)"
//               className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//             />
//           </div>

//           {/* Best for / Type / Amenities */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             {/* Best for events */}
//             <div className="flex flex-col gap-2">
//               <label className="text-xs font-medium text-gray-700">
//                 Best for Events
//               </label>
//               <div className="flex flex-wrap gap-2">
//                 {BEST_FOR_OPTIONS.map((opt) => (
//                   <button
//                     key={opt}
//                     type="button"
//                     onClick={() => toggleBestFor(opt)}
//                     className={`rounded-full border px-3 py-1 text-[11px] ${
//                       bestForEvents.includes(opt)
//                         ? "bg-purple-600 text-white border-purple-600"
//                         : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50"
//                     }`}
//                   >
//                     {opt}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Venue type */}
//             <div className="flex flex-col gap-2">
//               <label className="text-xs font-medium text-gray-700">
//                 Venue Type
//               </label>
//               <div className="flex flex-wrap gap-3 text-xs">
//                 {VENUE_TYPES.map((type) => (
//                   <label key={type} className="inline-flex items-center gap-1.5">
//                     <input
//                       type="radio"
//                       name="venueType"
//                       value={type}
//                       checked={venueType === type}
//                       onChange={(e) => setVenueType(e.target.value)}
//                       className="h-3 w-3 text-purple-600 border-gray-300"
//                     />
//                     <span className="text-gray-700">{type}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Amenities */}
//           <div className="flex flex-col gap-1">
//             <label className="text-xs font-medium text-gray-700">
//               Amenities (comma separated)
//             </label>
//             <input
//               type="text"
//               value={amenitiesInput}
//               onChange={(e) => setAmenitiesInput(e.target.value)}
//               placeholder="Wi-Fi Access, Car Parking, Air Conditioning, Stage, Projector"
//               className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
//             />
//           </div>

//           {/* Images */}
//           <div className="flex flex-col gap-1">
//             <label className="text-xs font-medium text-gray-700">
//               Venue Images (you can select multiple)
//             </label>
//             <input
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleFileChange}
//               className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-purple-600 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-purple-700"
//             />
//             <p className="mt-1 text-[11px] text-gray-500">
//               Max 8 images · JPG/PNG recommended.
//             </p>
//           </div>

//           {previewUrls.length > 0 && (
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
//               {previewUrls.map((url, idx) => (
//                 <div
//                   key={idx}
//                   className="relative h-24 overflow-hidden rounded-2xl border border-purple-100 bg-purple-50"
//                 >
//                   <img
//                     src={url}
//                     alt={`preview-${idx}`}
//                     className="h-full w-full object-cover"
//                   />
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="flex justify-end pt-2">
//             <button
//               type="submit"
//               disabled={loading}
//               className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
//             >
//               {loading ? "Saving..." : "Save Venue"}
//             </button>
//           </div>
//         </form>
//       </section>

//       {/* ============================
//           TABLE: ALL VENUES
//       ============================ */}
//       <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
//         <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
//           <h2 className="text-sm font-semibold text-gray-700">All Venues</h2>
//           <span className="text-[11px] text-gray-500">
//             {listLoading
//               ? "Loading..."
//               : `Showing ${venues.length} venue${
//                   venues.length === 1 ? "" : "s"
//                 }`}
//           </span>
//         </div>
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-purple-50">
//               <tr className="text-xs text-gray-600">
//                 <th className="px-4 py-2 text-left font-semibold">#</th>
//                 <th className="px-4 py-2 text-left font-semibold">
//                   Venue Name
//                 </th>
//                 <th className="px-4 py-2 text-left font-semibold">City</th>
//                 <th className="px-4 py-2 text-left font-semibold">
//                   Hall Capacity
//                 </th>
//                 <th className="px-4 py-2 text-left font-semibold">
//                   Type
//                 </th>
//                 <th className="px-4 py-2 text-left font-semibold">Status</th>
//                 <th className="px-4 py-2 text-left font-semibold">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="divide-y divide-gray-100">
//               {venues.map((v, idx) => (
//                 <tr key={v._id || idx}>
//                   <td className="px-4 py-2 text-xs text-gray-600">
//                     {idx + 1}
//                   </td>
//                   <td className="px-4 py-2 text-xs text-gray-800">
//                     {v.name}
//                   </td>
//                   <td className="px-4 py-2 text-xs text-gray-700">
//                     {v.address?.city || "-"}
//                   </td>
//                   <td className="px-4 py-2 text-xs text-gray-700">
//                     {v.capacities?.hall || 0}
//                   </td>
//                   <td className="px-4 py-2 text-xs text-gray-700">
//                     {v.venueType || "-"}
//                   </td>
//                   <td className="px-4 py-2">
//                     <span
//                       className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
//                         v.inStock
//                           ? "bg-green-50 text-green-700"
//                           : "bg-yellow-50 text-yellow-700"
//                       }`}
//                     >
//                       {v.inStock ? "Active" : "Inactive"}
//                     </span>
//                   </td>
//                   <td className="px-4 py-2 space-x-2">
//                     <button
//                       type="button"
//                       onClick={() => toggleVenueStatus(v)}
//                       className="rounded-full border border-gray-200 px-3 py-1 text-[11px] text-gray-700 hover:bg-purple-50"
//                     >
//                       {v.inStock ? "Deactivate" : "Activate"}
//                     </button>
//                     {/* Placeholders for future Edit/Delete */}
//                     {/* <button className="rounded-full border border-gray-200 px-3 py-1 text-[11px] text-gray-700 hover:bg-purple-50">
//                       Edit
//                     </button> */}
//                   </td>
//                 </tr>
//               ))}

//               {venues.length === 0 && !listLoading && (
//                 <tr>
//                   <td
//                     colSpan={7}
//                     className="px-4 py-6 text-center text-xs text-gray-500"
//                   >
//                     No venues added yet. Use the form above to add your first
//                     venue.
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default VenuesAdmin;



// src/pages/admin/VenuesAdmin.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from 'react-toastify';
import {
  PRODUCT_ADD_URL,
  PRODUCT_LIST_URL,
  PRODUCT_STOCK_URL,
  PRODUCT_UPDATE_URL,
  PRODUCT_DELETE_URL,
  ADMIN_IS_AUTH,
  ADMIN_REGISTER_VENDOR,
  ADMIN_GET_VENDOR,
  ADMIN_UPDATE_VENDOR,
  getImageUrl,
} from "../../config/apiConfig";

// 🚨 MUST MATCH USER FILTERS (Venues.jsx)
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

const VENUE_TYPES = ["Indoor", "Outdoor", "Mixed"];

const VenuesAdmin = () => {
  // ============= FORM STATE =============
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [area, setArea] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [stateName, setStateName] = useState("");
  const [pincode, setPincode] = useState("");

  const [hallCapacity, setHallCapacity] = useState("");
  const [parkingSlots, setParkingSlots] = useState("");
  const [guestRooms, setGuestRooms] = useState("");

  const [price, setPrice] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [description, setDescription] = useState("");

  const [bestForEvents, setBestForEvents] = useState([]); // array of strings
  const [venueType, setVenueType] = useState("Indoor");
  const [amenitiesInput, setAmenitiesInput] = useState(""); // comma-separated

  const [images, setImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // ============= LIST STATE =============
  const [venues, setVenues] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(null); // track which venue is being updated
  
  // ============= EDIT STATE =============
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingVenueId, setEditingVenueId] = useState(null);
  
  // ============= VIEW STATE =============
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // ============= VENDOR REGISTRATION STATE =============
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [vendorName, setVendorName] = useState("");
  const [vendorEmail, setVendorEmail] = useState("");
  const [vendorPhone, setVendorPhone] = useState("");
  const [vendorPassword, setVendorPassword] = useState("");
  const [vendorLoading, setVendorLoading] = useState(false);
  
  // ============= VENDOR DETAILS & EDIT STATE =============
  const [vendorDetails, setVendorDetails] = useState(null);
  const [showVendorDetailsModal, setShowVendorDetailsModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(false);
  const [editVendorName, setEditVendorName] = useState("");
  const [editVendorEmail, setEditVendorEmail] = useState("");
  const [editVendorPhone, setEditVendorPhone] = useState("");
  const [editVendorPassword, setEditVendorPassword] = useState("");
  const [vendorDetailsLoading, setVendorDetailsLoading] = useState(false);

  // ============= FETCH VENUES =============
  const fetchVenues = async () => {
    try {
      setListLoading(true);
      const { data } = await axios.get(PRODUCT_LIST_URL);
      if (data?.success && Array.isArray(data.products)) {
        setVenues(data.products);
      } else {
        setVenues([]);
      }
    } catch (err) {
      console.error("Error fetching venues:", err?.message);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  // ============= HANDLE FILES =============
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    console.log(`Selected ${files.length} images:`, files.map(f => f.name));
    setImages(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  // ============= BEST FOR (chips) =============
  const toggleBestFor = (value) => {
    setBestForEvents((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  // ============= SUBMIT VENUE (ADD OR UPDATE) =============
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");

    if (!name.trim()) {
      setErrorMessage("Venue name is required.");
      return;
    }
    if (!city.trim()) {
      setErrorMessage("City is required.");
      return;
    }
    // For edit mode, images are optional (keep existing if not uploaded)
    if (!isEditMode && !images.length) {
      setErrorMessage("Please upload at least one image.");
      return;
    }

    try {
      setLoading(true);

      const amenitiesArray = amenitiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const productData = {
        name: name.trim(),
        description: [], // Empty array - description not needed
        price: Number(price) || 0,
        offerPrice: Number(offerPrice) || 0,
        category: "Venue",
        inStock: true,
        address: {
          line1: addressLine1.trim(),
          area: area.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
        },
        bestForEvents, // 👈 used by user filters
        capacities: {
          hall: Number(hallCapacity) || 0,
          parkingSlots: Number(parkingSlots) || 0,
          guestRooms: Number(guestRooms) || 0,
        },
        venueType,
        amenities: amenitiesArray,
      };

      console.log("=== FRONTEND SUBMIT DEBUG ===");
      console.log("Submitting venue with data:", productData);
      console.log("Images array length:", images.length);
      console.log("Image files:", images.map(f => ({ name: f.name, size: f.size, type: f.type })));

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      
      // Add venue ID if editing
      if (isEditMode && editingVenueId) {
        formData.append("id", editingVenueId);
      }
      
      console.log("Appending images to FormData...");
      images.forEach((file, index) => {
        console.log(`Appending image ${index + 1}:`, file.name);
        formData.append("images", file);
      });
      
      // Log FormData contents
      console.log("FormData entries:");
      for (let pair of formData.entries()) {
        if (pair[0] === "images") {
          console.log(pair[0], "=>", pair[1].name);
        } else if (pair[0] === "id") {
          console.log(pair[0], "=>", pair[1]);
        } else {
          console.log(pair[0], "=> [productData]");
        }
      }

      // Use update or add endpoint based on mode
      const url = isEditMode ? PRODUCT_UPDATE_URL : PRODUCT_ADD_URL;
      console.log(`Sending to: ${url}`);
      
      const response = await axios.post(url, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("=== SERVER RESPONSE ===");
      console.log("Response:", response.data);
      console.log("Images uploaded:", response.data?.imageCount || "unknown");

      if (response.data?.success) {
        const action = isEditMode ? "updated" : "added";
        
        // Show success toast
        toast.success(`Venue ${action} successfully`, {
          position: "top-right",
          autoClose: 2500,
        });
        
        // Reset edit mode and view state
        setIsEditMode(false);
        setEditingVenueId(null);
        setSelectedVenue(null);
        setShowEditForm(false);
        setShowAddForm(false);
        setName("");
        setCity("");
        setArea("");
        setAddressLine1("");
        setStateName("");
        setPincode("");
        setHallCapacity("");
        setParkingSlots("");
        setGuestRooms("");
        setPrice("");
        setOfferPrice("");
        setDescription("");
        setBestForEvents([]);
        setVenueType("Indoor");
        setAmenitiesInput("");
        setImages([]);
        setPreviewUrls([]);

        fetchVenues();
      } else {
        throw new Error(response.data?.message || `Failed to ${isEditMode ? 'update' : 'add'} venue`);
      }
    } catch (err) {
      const action = isEditMode ? "updating" : "adding";
      console.error(`Error ${action} venue:`, err);
      console.error("Error response:", err?.response?.data);
      
      let msg = `Something went wrong while ${action} venue.`;
      
      if (err?.response?.status === 401) {
        msg = "Unauthorized. Please make sure you're logged in as admin.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      
      // Show error toast
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  // ============= TOGGLE ACTIVE / INACTIVE =============
  const toggleVenueStatus = async (venue) => {
    const newInStock = !venue.inStock;
    const statusText = newInStock ? "activated" : "deactivated";
    
    try {
      setUpdatingStatus(venue._id);
      setSuccessMessage("");
      setErrorMessage("");
      
      console.log(`Updating venue ${venue._id} status to:`, newInStock);
      
      const response = await axios.post(
        PRODUCT_STOCK_URL,
        { id: venue._id, inStock: newInStock },
        { withCredentials: true }
      );
      
      console.log("Status update response:", response.data);
      
      if (response.data?.success) {
        // Update local state
        setVenues((prev) =>
          prev.map((v) =>
            v._id === venue._id ? { ...v, inStock: newInStock } : v
          )
        );
        
        // Show success toast
        toast.success(`Venue ${statusText}`, {
          position: "top-right",
          autoClose: 2500,
        });
      } else {
        throw new Error(response.data?.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating venue status:", err);
      console.error("Error response:", err?.response?.data);
      
      let msg = `Failed to update venue status.`;
      
      if (err?.response?.status === 401) {
        msg = "Unauthorized. Please make sure you're logged in as admin.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      
      // Show error toast
      toast.error(msg, {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setUpdatingStatus(null);
    }
  };

  // ============= VIEW VENUE (NEW FLOW) =============
  const handleViewVenue = (venue) => {
    setSelectedVenue(venue);
    setShowEditForm(false);
    
    // Clear messages
    setSuccessMessage("");
    setErrorMessage("");
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= SHOW EDIT FORM =============
  const handleShowEditForm = () => {
    if (!selectedVenue) return;
    
    // Populate form with venue data
    setName(selectedVenue.name || "");
    setCity(selectedVenue.address?.city || "");
    setArea(selectedVenue.address?.area || "");
    setAddressLine1(selectedVenue.address?.line1 || "");
    setStateName(selectedVenue.address?.state || "");
    setPincode(selectedVenue.address?.pincode || "");
    setHallCapacity(selectedVenue.capacities?.hall || "");
    setParkingSlots(selectedVenue.capacities?.parkingSlots || "");
    setGuestRooms(selectedVenue.capacities?.guestRooms || "");
    setPrice(selectedVenue.price || "");
    setOfferPrice(selectedVenue.offerPrice || "");
    setBestForEvents(selectedVenue.bestForEvents || []);
    setVenueType(selectedVenue.venueType || "Indoor");
    setAmenitiesInput((selectedVenue.amenities || []).join(", "));
    
    // Set edit mode
    setIsEditMode(true);
    setEditingVenueId(selectedVenue._id);
    setShowEditForm(true);
    
    // Clear images (user can optionally upload new ones)
    setImages([]);
    setPreviewUrls([]);
  };
  
  // ============= EDIT VENUE (QUICK EDIT - DIRECT) =============
  const handleEditVenue = (venue) => {
    // Populate form with venue data
    setName(venue.name || "");
    setCity(venue.address?.city || "");
    setArea(venue.address?.area || "");
    setAddressLine1(venue.address?.line1 || "");
    setStateName(venue.address?.state || "");
    setPincode(venue.address?.pincode || "");
    setHallCapacity(venue.capacities?.hall || "");
    setParkingSlots(venue.capacities?.parkingSlots || "");
    setGuestRooms(venue.capacities?.guestRooms || "");
    setPrice(venue.price || "");
    setOfferPrice(venue.offerPrice || "");
    setBestForEvents(venue.bestForEvents || []);
    setVenueType(venue.venueType || "Indoor");
    setAmenitiesInput((venue.amenities || []).join(", "));
    
    // Set edit mode - THIS IS THE KEY FIX
    setIsEditMode(true);
    setEditingVenueId(venue._id);
    setSelectedVenue(null);
    setShowEditForm(true); // Changed from false to true
    setShowAddForm(false);
    
    // Clear images (user can optionally upload new ones)
    setImages([]);
    setPreviewUrls([]);
    
    // Clear messages
    setSuccessMessage("");
    setErrorMessage("");
    
    // Scroll to form
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= CANCEL EDIT =============
  const handleCancelEdit = () => {
    setIsEditMode(false);
    setEditingVenueId(null);
    setShowEditForm(false);
    setShowAddForm(false);
    
    // Clear form
    setName("");
    setCity("");
    setArea("");
    setAddressLine1("");
    setStateName("");
    setPincode("");
    setHallCapacity("");
    setParkingSlots("");
    setGuestRooms("");
    setPrice("");
    setOfferPrice("");
    setBestForEvents([]);
    setVenueType("Indoor");
    setAmenitiesInput("");
    setImages([]);
    setPreviewUrls([]);
    
    setSuccessMessage("");
    setErrorMessage("");
  };
  
  // ============= CLOSE VENUE VIEW =============
  const handleCloseVenueView = () => {
    setSelectedVenue(null);
    setShowEditForm(false);
    setShowAddForm(false);
    setIsEditMode(false);
    setEditingVenueId(null);
    
    // Clear form
    setName("");
    setCity("");
    setArea("");
    setAddressLine1("");
    setStateName("");
    setPincode("");
    setHallCapacity("");
    setParkingSlots("");
    setGuestRooms("");
    setPrice("");
    setOfferPrice("");
    setBestForEvents([]);
    setVenueType("Indoor");
    setAmenitiesInput("");
    setImages([]);
    setPreviewUrls([]);
  };

  // ============= SHOW ADD FORM =============
  const handleShowAddForm = () => {
    setShowAddForm(true);
    setSelectedVenue(null);
    setShowEditForm(false);
    setIsEditMode(false);
    setEditingVenueId(null);
    
    // Clear form
    setName("");
    setCity("");
    setArea("");
    setAddressLine1("");
    setStateName("");
    setPincode("");
    setHallCapacity("");
    setParkingSlots("");
    setGuestRooms("");
    setPrice("");
    setOfferPrice("");
    setBestForEvents([]);
    setVenueType("Indoor");
    setAmenitiesInput("");
    setImages([]);
    setPreviewUrls([]);
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // ============= DELETE VENUE =============
  const handleDeleteVenue = async (venueId, venueName) => {
    if (!confirm(`Are you sure you want to delete "${venueName}"? This action cannot be undone.`)) {
      return;
    }
    
    try {
      setSuccessMessage("");
      setErrorMessage("");
      
      console.log("Deleting venue:", venueId);
      
      const response = await axios.post(
        PRODUCT_DELETE_URL,
        { id: venueId },
        { withCredentials: true }
      );
      
      console.log("Delete response:", response.data);
      
      if (response.data?.success) {
        setSuccessMessage(`Venue "${venueName}" deleted successfully.`);
        fetchVenues(); // Refresh the list
        
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.data?.message || "Failed to delete venue");
      }
    } catch (err) {
      console.error("Error deleting venue:", err);
      console.error("Error response:", err?.response?.data);
      
      let msg = "Failed to delete venue.";
      
      if (err?.response?.status === 401) {
        msg = "Unauthorized. Please make sure you're logged in as admin.";
      } else if (err?.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err?.message) {
        msg = err.message;
      }
      
      setErrorMessage(msg);
      
      // Clear error message after 5 seconds
      setTimeout(() => setErrorMessage(""), 5000);
    }
  };

  // Check if admin is logged in
  const checkAuth = async () => {
    try {
      const response = await axios.get(ADMIN_IS_AUTH, {
        withCredentials: true,
      });
      console.log("Auth check:", response.data);
    } catch (err) {
      console.error("Auth check failed:", err?.response?.data || err?.message);
    }
  };

  // ============= VIEW VENDOR DETAILS =============
  const handleViewVendorDetails = async (vendorId) => {
    if (!vendorId) {
      toast.error("No vendor linked to this venue", { position: "top-right", autoClose: 3000 });
      return;
    }

    try {
      setVendorDetailsLoading(true);
      const response = await axios.get(ADMIN_GET_VENDOR(vendorId), {
        withCredentials: true,
      });

      if (response.data?.success) {
        const pwd = response.data.vendor.plainPassword;
        const cleanPassword = (pwd && pwd !== "Not available") ? pwd : "";
        
        setVendorDetails(response.data.vendor);
        setEditVendorName(response.data.vendor.name);
        setEditVendorEmail(response.data.vendor.email);
        setEditVendorPhone(response.data.vendor.phone || "");
        setEditVendorPassword(cleanPassword);
        setShowVendorDetailsModal(true);
      } else {
        throw new Error(response.data?.message || "Failed to load vendor details");
      }
    } catch (err) {
      console.error("Error loading vendor details:", err);
      toast.error(err?.response?.data?.message || "Failed to load vendor details", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setVendorDetailsLoading(false);
    }
  };

  // ============= UPDATE VENDOR DETAILS =============
  const handleUpdateVendor = async (e) => {
    e.preventDefault();
    
    if (!vendorDetails?.id) return;

    try {
      setVendorDetailsLoading(true);
      
      const response = await axios.put(
        ADMIN_UPDATE_VENDOR(vendorDetails.id),
        {
          name: editVendorName.trim(),
          email: editVendorEmail.trim(),
          phone: editVendorPhone.trim() || undefined,
          password: editVendorPassword.trim() || undefined,
        },
        { withCredentials: true }
      );

      if (response.data?.success) {
        toast.success("Vendor details updated successfully!", {
          position: "top-right",
          autoClose: 2500,
        });
        
        setVendorDetails(response.data.vendor);
        setEditingVendor(false);
      } else {
        throw new Error(response.data?.message || "Failed to update vendor");
      }
    } catch (err) {
      console.error("Error updating vendor:", err);
      toast.error(err?.response?.data?.message || "Failed to update vendor", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setVendorDetailsLoading(false);
    }
  };

  // Run auth check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // ============= REGISTER VENDOR WITH VENUE =============
  const handleRegisterVendor = async (e) => {
    e.preventDefault();
    setVendorLoading(true);
    setSuccessMessage("");
    setErrorMessage("");

    // Validate venue fields first
    if (!name.trim()) {
      toast.error("Venue name is required", { position: "top-right", autoClose: 3000 });
      setVendorLoading(false);
      return;
    }
    if (!city.trim()) {
      toast.error("City is required", { position: "top-right", autoClose: 3000 });
      setVendorLoading(false);
      return;
    }
    if (!images.length) {
      toast.error("Please upload at least one image", { position: "top-right", autoClose: 3000 });
      setVendorLoading(false);
      return;
    }
    if (!vendorName.trim() || !vendorEmail.trim() || !vendorPassword.trim()) {
      toast.error("Vendor name, email and password are required", { position: "top-right", autoClose: 3000 });
      setVendorLoading(false);
      return;
    }

    try {
      // Step 1: Register the vendor account
      console.log("Step 1: Registering vendor account...");
      const vendorResponse = await axios.post(
        ADMIN_REGISTER_VENDOR,
        {
          vendorName: vendorName.trim(),
          vendorEmail: vendorEmail.trim(),
          vendorPassword: vendorPassword,
          vendorPhone: vendorPhone.trim() || undefined,
        },
        { withCredentials: true }
      );

      if (!vendorResponse.data?.success) {
        throw new Error(vendorResponse.data?.message || "Failed to register vendor");
      }

      console.log("Vendor registered successfully:", vendorResponse.data.vendor);

      // Step 2: Create the venue
      console.log("Step 2: Creating venue...");
      const amenitiesArray = amenitiesInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const productData = {
        name: name.trim(),
        description: [],
        price: Number(price) || 0,
        offerPrice: Number(offerPrice) || 0,
        category: "Venue",
        inStock: true,
        address: {
          line1: addressLine1.trim(),
          area: area.trim(),
          city: city.trim(),
          state: stateName.trim(),
          pincode: pincode.trim(),
        },
        bestForEvents,
        capacities: {
          hall: Number(hallCapacity) || 0,
          parkingSlots: Number(parkingSlots) || 0,
          guestRooms: Number(guestRooms) || 0,
        },
        venueType,
        amenities: amenitiesArray,
        vendorId: vendorResponse.data.vendor.id, // Link venue to vendor
      };

      const formData = new FormData();
      formData.append("productData", JSON.stringify(productData));
      images.forEach((file) => formData.append("images", file));

      const venueResponse = await axios.post(PRODUCT_ADD_URL, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (venueResponse.data?.success) {
        toast.success("Vendor and venue created successfully!", {
          position: "top-right",
          autoClose: 2500,
        });

        // Reset all form fields
        setName("");
        setCity("");
        setArea("");
        setAddressLine1("");
        setStateName("");
        setPincode("");
        setHallCapacity("");
        setParkingSlots("");
        setGuestRooms("");
        setPrice("");
        setOfferPrice("");
        setBestForEvents([]);
        setVenueType("Indoor");
        setAmenitiesInput("");
        setImages([]);
        setPreviewUrls([]);
        setVendorName("");
        setVendorEmail("");
        setVendorPhone("");
        setVendorPassword("");
        setShowVendorModal(false);

        // Refresh venue list
        fetchVenues();
      } else {
        throw new Error(venueResponse.data?.message || "Failed to create venue");
      }
    } catch (err) {
      console.error("Error in vendor/venue registration:", err);
      const msg =
        err?.response?.data?.message || err?.message || "Failed to register vendor and venue";
      
      toast.error(msg, {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setVendorLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-10">
      {/* Page heading */}
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-purple-700">
            Venues Management
          </h1>
          <p className="text-sm text-gray-600">
            Add and manage venues that appear on the Festtiq website.
          </p>
        </div>
        {!showAddForm && !selectedVenue && (
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowVendorModal(true)}
              className="inline-flex items-center rounded-full border-2 border-purple-600 bg-white px-6 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50 transition-colors"
            >
              + Add Venue Vendor
            </button>
            <button
              type="button"
              onClick={handleShowAddForm}
              className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition-colors"
            >
              + Add New Venue
            </button>
          </div>
        )}
      </header>

      {/* Messages */}
      {(successMessage || errorMessage) && (
        <div className="space-y-2">
          {successMessage && (
            <div className="rounded-xl border border-green-100 bg-green-50 px-4 py-2 text-xs text-green-700">
              {successMessage}
            </div>
          )}
          {errorMessage && (
            <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs text-red-700">
              {errorMessage}
            </div>
          )}
        </div>
      )}

      {/* Venue Details View */}
      {selectedVenue && !showEditForm && (
        <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Venue Details</h2>
            <button
              type="button"
              onClick={handleCloseVenueView}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Close
            </button>
          </div>

          {/* Venue Images */}
          {selectedVenue.images && selectedVenue.images.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {selectedVenue.images.map((img, idx) => (
                  <div
                    key={idx}
                    className="relative h-32 overflow-hidden rounded-xl border border-gray-200"
                  >
                    <img
                      src={getImageUrl(img)}
                      alt={`${selectedVenue.name} - ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Venue Name</label>
              <p className="text-sm text-gray-800">{selectedVenue.name}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">City</label>
              <p className="text-sm text-gray-800">{selectedVenue.address?.city || "-"}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Area / Locality</label>
              <p className="text-sm text-gray-800">{selectedVenue.address?.area || "-"}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Address</label>
              <p className="text-sm text-gray-800">{selectedVenue.address?.line1 || "-"}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">State</label>
              <p className="text-sm text-gray-800">{selectedVenue.address?.state || "-"}</p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-500">Pincode</label>
              <p className="text-sm text-gray-800">{selectedVenue.address?.pincode || "-"}</p>
            </div>
          </div>

          {/* Capacities */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Capacities</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-purple-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Hall Capacity</p>
                <p className="text-lg font-semibold text-purple-700">{selectedVenue.capacities?.hall || 0}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Parking Slots</p>
                <p className="text-lg font-semibold text-blue-700">{selectedVenue.capacities?.parkingSlots || 0}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Guest Rooms</p>
                <p className="text-lg font-semibold text-green-700">{selectedVenue.capacities?.guestRooms || 0}</p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Base Price</p>
                <p className="text-lg font-semibold text-gray-800">₹{selectedVenue.price?.toLocaleString() || 0}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-3">
                <p className="text-xs text-gray-600">Offer Price</p>
                <p className="text-lg font-semibold text-green-700">₹{selectedVenue.offerPrice?.toLocaleString() || 0}</p>
              </div>
            </div>
          </div>

          {/* Venue Type */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Venue Type</h3>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              {selectedVenue.venueType || "Indoor"}
            </span>
          </div>

          {/* Best For Events */}
          {selectedVenue.bestForEvents && selectedVenue.bestForEvents.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Best For Events</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVenue.bestForEvents.map((event, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700"
                  >
                    {event}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Amenities */}
          {selectedVenue.amenities && selectedVenue.amenities.length > 0 && (
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-gray-700">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedVenue.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                  >
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-700">Status</h3>
            <span
              className={`inline-flex rounded-full px-3 py-1 text-xs font-medium ${
                selectedVenue.inStock
                  ? "bg-green-50 text-green-700"
                  : "bg-yellow-50 text-yellow-700"
              }`}
            >
              {selectedVenue.inStock ? "Active" : "Inactive"}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-4 border-t border-gray-200">
            {selectedVenue.vendorId && (
              <button
                type="button"
                onClick={() => handleViewVendorDetails(selectedVenue.vendorId)}
                className="inline-flex items-center rounded-full border-2 border-purple-600 bg-white px-6 py-2.5 text-sm font-medium text-purple-600 hover:bg-purple-50"
              >
                👤 View Vendor Details
              </button>
            )}
            <button
              type="button"
              onClick={handleShowEditForm}
              className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700"
            >
              Edit This Venue
            </button>
          </div>
        </section>
      )}

      {/* Form Card - Only show when adding new venue OR editing */}
      {(showAddForm || showEditForm) && (
      <section className="rounded-2xl border border-purple-100 bg-white shadow-sm p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800">
            {isEditMode ? "Edit Venue" : "Add New Venue"}
          </h2>
          {isEditMode && (
            <button
              type="button"
              onClick={handleCancelEdit}
              className="px-4 py-2 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel Edit
            </button>
          )}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Venue Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Grand Palace Banquet"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Chennai"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Area / Locality
              </label>
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="Anna Nagar"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Address Line 1
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder="#1, Pallavaram - Thoraipakkam Rd"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">State</label>
              <input
                type="text"
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="Tamil Nadu"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Pincode
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="600042"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Capacities */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Hall Capacity
              </label>
              <input
                type="number"
                value={hallCapacity}
                onChange={(e) => setHallCapacity(e.target.value)}
                placeholder="300"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Parking Slots
              </label>
              <input
                type="number"
                value={parkingSlots}
                onChange={(e) => setParkingSlots(e.target.value)}
                placeholder="100"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Guest Rooms
              </label>
              <input
                type="number"
                value={guestRooms}
                onChange={(e) => setGuestRooms(e.target.value)}
                placeholder="10"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Base Price (₹)
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="100000"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-700">
                Offer Price (₹)
              </label>
              <input
                type="number"
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                placeholder="90000"
                className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
              />
            </div>
          </div>

          {/* Best for / Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Best for events – grouped same as user filter */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Best for Events
              </label>
              <div className="space-y-2">
                {EVENT_GROUPS.map((group) => (
                  <div key={group.title}>
                    <p className="text-[11px] font-semibold text-gray-700 mb-1">
                      {group.title}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-1">
                      {group.options.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => toggleBestFor(opt)}
                          className={`rounded-full border px-3 py-1 text-[11px] ${
                            bestForEvents.includes(opt)
                              ? "bg-purple-600 text-white border-purple-600"
                              : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Venue type */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-medium text-gray-700">
                Venue Type
              </label>
              <div className="flex flex-wrap gap-3 text-xs">
                {VENUE_TYPES.map((type) => (
                  <label
                    key={type}
                    className="inline-flex items-center gap-1.5"
                  >
                    <input
                      type="radio"
                      name="venueType"
                      value={type}
                      checked={venueType === type}
                      onChange={(e) => setVenueType(e.target.value)}
                      className="h-3 w-3 text-purple-600 border-gray-300"
                    />
                    <span className="text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Amenities */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Amenities (comma separated)
            </label>
            <input
              type="text"
              value={amenitiesInput}
              onChange={(e) => setAmenitiesInput(e.target.value)}
              placeholder="Wi-Fi Access, Car Parking, Air Conditioning, Stage, Projector"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
            />
          </div>

          {/* Images */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-700">
              Venue Images (you can select multiple)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-purple-600 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-purple-700"
            />
            <p className="mt-1 text-[11px] text-gray-500">
              Max 8 images · JPG/PNG recommended. 
              {images.length > 0 && (
                <span className="font-semibold text-purple-600 ml-2">
                  {images.length} {images.length === 1 ? 'image' : 'images'} selected
                </span>
              )}
            </p>
          </div>

          {previewUrls.length > 0 && (
            <div>
              <p className="text-xs font-medium text-gray-700 mb-2">
                Selected Images ({images.length}):
              </p>
              <div className="mb-3 flex flex-wrap gap-2">
                {images.map((file, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-700"
                  >
                    {idx + 1}. {file.name}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {previewUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="relative h-24 overflow-hidden rounded-2xl border border-purple-100 bg-purple-50"
                  >
                    <img
                      src={url}
                      alt={`preview-${idx}`}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                      {idx + 1}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-3 pt-2">
            {isEditMode && (
              <button
                type="button"
                onClick={handleCancelEdit}
                disabled={loading}
                className="inline-flex items-center rounded-full border border-gray-300 bg-white px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center rounded-full bg-purple-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {loading ? (isEditMode ? "Updating..." : "Saving...") : (isEditMode ? "Update Venue" : "Save Venue")}
            </button>
          </div>
        </form>
      </section>
      )}

      {/* TABLE: ALL VENUES */}
      <section className="rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-3 bg-gray-50">
          <div>
            <h2 className="text-sm font-semibold text-gray-700">All Venues</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">Click on any venue to view details</p>
          </div>
          <span className="text-[11px] text-gray-500">
            {listLoading
              ? "Loading..."
              : `Showing ${venues.length} venue${
                  venues.length === 1 ? "" : "s"
                }`}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-purple-50">
              <tr className="text-xs text-gray-600">
                <th className="px-4 py-2 text-left font-semibold">#</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Venue Name
                </th>
                <th className="px-4 py-2 text-left font-semibold">City</th>
                <th className="px-4 py-2 text-left font-semibold">
                  Hall Capacity
                </th>
                <th className="px-4 py-2 text-left font-semibold">Type</th>
                <th className="px-4 py-2 text-left font-semibold">Status</th>
                <th className="px-4 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {venues.map((v, idx) => (
                <tr 
                  key={v._id || idx}
                  className="hover:bg-purple-50 cursor-pointer transition-colors"
                  onClick={() => handleViewVenue(v)}
                >
                  <td className="px-4 py-2 text-xs text-gray-600">
                    {idx + 1}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-800 font-medium">
                    {v.name}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-700">
                    {v.address?.city || "-"}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-700">
                    {v.capacities?.hall || 0}
                  </td>
                  <td className="px-4 py-2 text-xs text-gray-700">
                    {v.venueType || "-"}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-medium ${
                        v.inStock
                          ? "bg-green-50 text-green-700"
                          : "bg-yellow-50 text-yellow-700"
                      }`}
                    >
                      {v.inStock ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 space-x-2" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      onClick={() => handleEditVenue(v)}
                      className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-[11px] text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-all"
                    >
                      Quick Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleVenueStatus(v)}
                      disabled={updatingStatus === v._id}
                      className={`rounded-full border px-3 py-1 text-[11px] transition-all ${
                        updatingStatus === v._id
                          ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "border-gray-200 text-gray-700 hover:bg-purple-50 hover:border-purple-200"
                      }`}
                    >
                      {updatingStatus === v._id
                        ? "Updating..."
                        : v.inStock
                        ? "Deactivate"
                        : "Activate"}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteVenue(v._id, v.name)}
                      className="rounded-full border border-red-200 bg-red-50 px-3 py-1 text-[11px] text-red-700 hover:bg-red-100 hover:border-red-300 transition-all"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

              {venues.length === 0 && !listLoading && (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-6 text-center text-xs text-gray-500"
                  >
                    No venues added yet. Use the form above to add your first
                    venue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========================================
          VENDOR WITH VENUE REGISTRATION MODAL
      ======================================== */}
      {showVendorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 overflow-y-auto py-8">
          <div className="relative w-full max-w-4xl rounded-2xl bg-white shadow-xl my-8">
            <button
              onClick={() => {
                setShowVendorModal(false);
                // Reset venue form
                setName("");
                setCity("");
                setArea("");
                setAddressLine1("");
                setStateName("");
                setPincode("");
                setHallCapacity("");
                setParkingSlots("");
                setGuestRooms("");
                setPrice("");
                setOfferPrice("");
                setBestForEvents([]);
                setVenueType("Indoor");
                setAmenitiesInput("");
                setImages([]);
                setPreviewUrls([]);
                // Reset vendor form
                setVendorName("");
                setVendorEmail("");
                setVendorPhone("");
                setVendorPassword("");
              }}
              className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600 z-10"
            >
              ✕
            </button>

            <div className="px-8 pt-10 pb-6 max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-center mb-2 text-purple-700">
                Add Venue Vendor
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                Register a new vendor with their first venue
              </p>

              <form onSubmit={handleRegisterVendor} className="space-y-6">
                {/* Vendor Credentials Section */}
                <div className="rounded-xl border-2 border-purple-200 bg-purple-50 p-4 space-y-4">
                  <h3 className="text-md font-semibold text-purple-700 flex items-center gap-2">
                    🔐 Vendor Credentials
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">
                        Vendor Name *
                      </label>
                      <input
                        type="text"
                        value={vendorName}
                        onChange={(e) => setVendorName(e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">
                        Vendor Email *
                      </label>
                      <input
                        type="email"
                        value={vendorEmail}
                        onChange={(e) => setVendorEmail(e.target.value)}
                        placeholder="vendor@example.com"
                        required
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">
                        Vendor Phone
                      </label>
                      <input
                        type="tel"
                        value={vendorPhone}
                        onChange={(e) => setVendorPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-2">
                      <label className="text-xs font-medium text-gray-700">
                        Password *
                      </label>
                      <input
                        type="password"
                        value={vendorPassword}
                        onChange={(e) => setVendorPassword(e.target.value)}
                        placeholder="Minimum 6 characters"
                        required
                        minLength={6}
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Venue Information Section */}
                <div className="space-y-4">
                  <h3 className="text-md font-semibold text-gray-700 flex items-center gap-2">
                    🏢 Venue Information
                  </h3>
                  
                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Venue Name *</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Grand Palace Banquet"
                        required
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">City *</label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Chennai"
                        required
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Area / Locality</label>
                      <input
                        type="text"
                        value={area}
                        onChange={(e) => setArea(e.target.value)}
                        placeholder="Anna Nagar"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Address Line 1</label>
                      <input
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="#1, Pallavaram - Thoraipakkam Rd"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">State</label>
                      <input
                        type="text"
                        value={stateName}
                        onChange={(e) => setStateName(e.target.value)}
                        placeholder="Tamil Nadu"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Pincode</label>
                      <input
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="600042"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Capacities */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Hall Capacity</label>
                      <input
                        type="number"
                        value={hallCapacity}
                        onChange={(e) => setHallCapacity(e.target.value)}
                        placeholder="300"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Parking Slots</label>
                      <input
                        type="number"
                        value={parkingSlots}
                        onChange={(e) => setParkingSlots(e.target.value)}
                        placeholder="100"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Guest Rooms</label>
                      <input
                        type="number"
                        value={guestRooms}
                        onChange={(e) => setGuestRooms(e.target.value)}
                        placeholder="10"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Base Price (₹)</label>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="100000"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Offer Price (₹)</label>
                      <input
                        type="number"
                        value={offerPrice}
                        onChange={(e) => setOfferPrice(e.target.value)}
                        placeholder="90000"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  {/* Best for / Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Best for events */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-gray-700">Best for Events</label>
                      <div className="space-y-2 max-h-48 overflow-y-auto border border-gray-200 rounded-xl p-3">
                        {EVENT_GROUPS.map((group) => (
                          <div key={group.title}>
                            <p className="text-[11px] font-semibold text-gray-700 mb-1">
                              {group.title}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {group.options.map((opt) => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => toggleBestFor(opt)}
                                  className={`rounded-full border px-3 py-1 text-[11px] ${
                                    bestForEvents.includes(opt)
                                      ? "bg-purple-600 text-white border-purple-600"
                                      : "bg-white text-gray-700 border-gray-200 hover:bg-purple-50"
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Venue type */}
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-medium text-gray-700">Venue Type</label>
                      <div className="flex flex-wrap gap-3 text-xs">
                        {VENUE_TYPES.map((type) => (
                          <label key={type} className="inline-flex items-center gap-1.5">
                            <input
                              type="radio"
                              name="vendorVenueType"
                              value={type}
                              checked={venueType === type}
                              onChange={(e) => setVenueType(e.target.value)}
                              className="h-3 w-3 text-purple-600 border-gray-300"
                            />
                            <span className="text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Amenities (comma separated)
                    </label>
                    <input
                      type="text"
                      value={amenitiesInput}
                      onChange={(e) => setAmenitiesInput(e.target.value)}
                      placeholder="Wi-Fi Access, Car Parking, Air Conditioning, Stage, Projector"
                      className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                    />
                  </div>

                  {/* Images */}
                  <div className="flex flex-col gap-1">
                    <label className="text-xs font-medium text-gray-700">
                      Venue Images * (select multiple)
                    </label>
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      required
                      className="w-full rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-sm file:mr-3 file:rounded-full file:border-0 file:bg-purple-600 file:px-4 file:py-1.5 file:text-xs file:font-medium file:text-white hover:file:bg-purple-700"
                    />
                    <p className="mt-1 text-[11px] text-gray-500">
                      Max 8 images · JPG/PNG recommended
                      {images.length > 0 && (
                        <span className="font-semibold text-purple-600 ml-2">
                          {images.length} {images.length === 1 ? 'image' : 'images'} selected
                        </span>
                      )}
                    </p>
                  </div>

                  {previewUrls.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {previewUrls.map((url, idx) => (
                        <div
                          key={idx}
                          className="relative h-24 overflow-hidden rounded-xl border border-purple-100 bg-purple-50"
                        >
                          <img
                            src={url}
                            alt={`preview-${idx}`}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute top-1 left-1 bg-purple-600 text-white text-xs px-2 py-0.5 rounded-full">
                            {idx + 1}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Submit Buttons */}
                <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setShowVendorModal(false);
                      setName("");
                      setCity("");
                      setArea("");
                      setAddressLine1("");
                      setStateName("");
                      setPincode("");
                      setHallCapacity("");
                      setParkingSlots("");
                      setGuestRooms("");
                      setPrice("");
                      setOfferPrice("");
                      setBestForEvents([]);
                      setVenueType("Indoor");
                      setAmenitiesInput("");
                      setImages([]);
                      setPreviewUrls([]);
                      setVendorName("");
                      setVendorEmail("");
                      setVendorPhone("");
                      setVendorPassword("");
                    }}
                    disabled={vendorLoading}
                    className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={vendorLoading}
                    className="px-6 py-2.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {vendorLoading ? "Creating Vendor & Venue..." : "Create Vendor & Venue"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
          VENDOR DETAILS MODAL
      ======================================== */}
      {showVendorDetailsModal && vendorDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl">
            <button
              onClick={() => {
                setShowVendorDetailsModal(false);
                setEditingVendor(false);
                setVendorDetails(null);
              }}
              className="absolute right-4 top-4 text-xl text-gray-400 hover:text-gray-600 z-10"
            >
              ✕
            </button>

            <div className="px-8 pt-10 pb-6 max-h-[85vh] overflow-y-auto">
              <h2 className="text-2xl font-semibold text-center mb-2 text-purple-700">
                👤 Vendor Details
              </h2>
              <p className="text-sm text-gray-600 text-center mb-6">
                View and edit vendor information
              </p>

              {!editingVendor ? (
                /* VIEW MODE */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <label className="text-xs font-semibold text-gray-500">Vendor Name</label>
                      <p className="text-base text-gray-800 mt-1">{vendorDetails.name}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <label className="text-xs font-semibold text-gray-500">Email</label>
                      <p className="text-base text-gray-800 mt-1">{vendorDetails.email}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
                      <label className="text-xs font-semibold text-gray-500">Phone</label>
                      <p className="text-base text-gray-800 mt-1">{vendorDetails.phone || "Not provided"}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-purple-50 border border-purple-200">
                      <label className="text-xs font-semibold text-purple-600">Password</label>
                      {vendorDetails.plainPassword && vendorDetails.plainPassword !== "Not available" ? (
                        <p className="text-base text-gray-800 mt-1 font-mono">{vendorDetails.plainPassword}</p>
                      ) : (
                        <div>
                          <p className="text-sm text-gray-500 mt-1 italic">Password not stored</p>
                          <p className="text-xs text-gray-400 mt-1">
                            This vendor was created before password storage was enabled. Click "Edit Vendor Details" to set a new password.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => setShowVendorDetailsModal(false)}
                      className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingVendor(true)}
                      className="px-6 py-2.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700"
                    >
                      Edit Vendor Details
                    </button>
                  </div>
                </div>
              ) : (
                /* EDIT MODE */
                <form onSubmit={handleUpdateVendor} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Vendor Name *</label>
                      <input
                        type="text"
                        value={editVendorName}
                        onChange={(e) => setEditVendorName(e.target.value)}
                        placeholder="e.g. John Doe"
                        required
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Email *</label>
                      <input
                        type="email"
                        value={editVendorEmail}
                        onChange={(e) => setEditVendorEmail(e.target.value)}
                        placeholder="vendor@example.com"
                        required
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Phone</label>
                      <input
                        type="tel"
                        value={editVendorPhone}
                        onChange={(e) => setEditVendorPhone(e.target.value)}
                        placeholder="9876543210"
                        className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                      />
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-medium text-gray-700">Password *</label>
                      <div className="relative">
                        <input
                          type="text"
                          value={editVendorPassword}
                          onChange={(e) => setEditVendorPassword(e.target.value)}
                          placeholder={vendorDetails.plainPassword && vendorDetails.plainPassword !== "Not available" ? "Enter new password" : "Set a new password"}
                          required
                          minLength={6}
                          className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 font-mono"
                        />
                      </div>
                      {vendorDetails.plainPassword && vendorDetails.plainPassword !== "Not available" ? (
                        <p className="text-[10px] text-gray-500 mt-1">
                          Current: <span className="font-mono text-purple-600">{vendorDetails.plainPassword}</span>
                        </p>
                      ) : (
                        <p className="text-[10px] text-orange-600 mt-1">
                          ⚠️ No password stored. Please set a new password for this vendor.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-4 border-t border-gray-200">
                    <button
                      type="button"
                      onClick={() => {
                        setEditingVendor(false);
                        setEditVendorName(vendorDetails.name);
                        setEditVendorEmail(vendorDetails.email);
                        setEditVendorPhone(vendorDetails.phone || "");
                        const pwd = vendorDetails.plainPassword;
                        setEditVendorPassword((pwd && pwd !== "Not available") ? pwd : "");
                      }}
                      disabled={vendorDetailsLoading}
                      className="px-6 py-2.5 rounded-lg border border-gray-300 text-gray-700 text-sm hover:bg-gray-50 disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={vendorDetailsLoading}
                      className="px-6 py-2.5 rounded-lg bg-purple-600 text-white text-sm hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {vendorDetailsLoading ? "Updating..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenuesAdmin;
