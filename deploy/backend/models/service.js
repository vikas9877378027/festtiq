// models/service.js
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: { type: String, required: true }, // single image URL
    price: { type: Number, required: true },
    isActive: { type: Boolean, default: true }, // like inStock
  },
  { timestamps: true }      
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

export default Service;
