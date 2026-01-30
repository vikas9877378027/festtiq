import mongoose from "mongoose";

// --- sub-schemas ------------------------------------------------------------
const addressSchema = new mongoose.Schema(
  {
    line1: { type: String, trim: true }, // e.g., "#1, Pallavaram - Thoraipakkam Rd"
    area: { type: String, index: true }, // e.g., Anna Nagar
    city: { type: String, index: true }, // e.g., Chennai
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { _id: false }
);

const capacitiesSchema = new mongoose.Schema(   
  {
    hall: { type: Number, default: 0 }, // Hall Capacity
    parkingSlots: { type: Number, default: 0 }, // Parking Slots
    guestRooms: { type: Number, default: 0 }, // Guest Rooms
  },
  { _id: false }
);

const BEST_FOR = [
  // Wedding Ceremonies
  "Engagement",
  "Wedding",
  "Reception",
  
  // Family Celebrations
  "Birthday Party",
  "Baby Shower",
  "Anniversary",
  
  // Corporate Events
  "Conference / Seminar",
  "Product Launch",
  "Networking Event",
  "Company Anniversary",
  "Trade Show / Exhibition",
  
  // Entertainment Shows
  "Live Concert",
  "Stand-up Comedy Show",
  "DJ Night",
  
  // Cultural Events
  "Festival",
  "Spiritual Retreats",
  "Community Gatherings",
];

const VENUE_TYPES = ["Indoor", "Outdoor", "Mixed"];

// --- main schema ------------------------------------------------------------
const productSchema = new mongoose.Schema(
  {
    // existing fields
    name: { type: String, required: true },
    description: { type: Array, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: [String], required: true }, // array of image URLs/paths
    category: { type: String, required: true },
    inStock: { type: Boolean, required: true, default: true },

    // newly added venue bits
    address: addressSchema,

    // “Venue Best for” chips
    bestForEvents: [{ type: String, enum: BEST_FOR }],

    // “Venue Highlights”
    capacities: capacitiesSchema, // { hall, parkingSlots, guestRooms }
    venueType: { type: String, enum: VENUE_TYPES, default: "Indoor" },

    // “Amenities & Facilities”
    amenities: [{ type: String }], // e.g., ["Wi-Fi Access","Car Parking",...]
    
    // Link to vendor who owns this venue (optional)
    vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

// helpful indexes for filtering

productSchema.index({ bestForEvents: 1 });  
productSchema.index({ "capacities.hall": -1 });    
productSchema.index({ price: 1 });

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
