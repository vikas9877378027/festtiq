// models/order.model.js  (your booking schema)
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },

    // optional – user can book only services
    venueId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },

    eventTitle: { type: String, required: true },
    eventType: { type: String, required: true },

    eventDates: { type: [String], required: true },
    eventTime: { type: String, required: true },

    basePrice: { type: Number, required: true },
    totalDays: { type: Number, required: true },

    serviceFee: { type: Number, default: 0 },
    taxes: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },

    totalAmount: { type: Number, required: true },

    // optional services
    selectedServices: [
      {
        serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
        name: String,
        price: Number,
      },
    ],

    bookingType: {
      type: String,
      enum: ["venue", "service", "service-only", "venue+service"],
      required: true,
    },

    paymentType: { type: String, required: true }, // card / upi / etc
    paymentStatus: {
      type: String,
      enum: ["pending", "partiallyPaid", "paid"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },

    status: {
      type: String,
      enum: ["booked", "confirmed", "requestedServices", "completed"],
      default: "booked",
    },
  },
  { timestamps: true }
);

const Order =
  mongoose.models.Order || mongoose.model("Order", orderSchema);

export default Order;
