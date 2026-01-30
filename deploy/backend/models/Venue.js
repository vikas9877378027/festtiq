// import mongoose from "mongoose";

// const venueSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     description: { type: String, default: "" },
//     addressLine: { type: String, default: "" },
//     area: { type: String, index: true },
//     city: { type: String, index: true },
//     capacity: { type: Number, default: 0 },
//     rooms: { type: Number, default: 0 },
//     type: { type: String, enum: ["Indoor", "Outdoor", "Mixed"], default: "Indoor" },
//     pricePerDay: { type: Number, required: true },
//     photos: [{ type: String }],
//     thumbnail: { type: String },
//     isFeatured: { type: Boolean, default: false },
//     rating: { type: Number, default: 5 },
//     createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// const Venue = mongoose.models.Venue || mongoose.model("Venue", venueSchema);
// export default Venue;
