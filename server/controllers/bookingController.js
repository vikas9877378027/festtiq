// controllers/bookingController.js
import Order from "../models/order.js";

// POST /api/booking/place  (Secure Your Booking)
export const placeBooking = async (req, res) => {
  try {
    const userId = req.user;                 // 👈 same as your COD example

    const {
      venueId,              // optional
      eventTitle,
      eventType,
      eventDates,
      eventTime,
      basePrice,
      totalDays,
      serviceFee = 0,
      taxes = 0,
      discount = 0,
      totalAmount,
      bookingType,          // "venue" | "service" | "venue+service"
      selectedServices = [],// optional [{serviceId,name,price}]
      paymentType,
      paymentStatus = "pending", // "pending" | "partiallyPaid" | "paid"
    } = req.body;

    // basic validation
    if (!eventTitle || !eventType || !eventDates || !eventTime) {
      return res
        .status(400)
        .json({ success: false, message: "Missing event details" });
    }

    if (!bookingType) {
      return res
        .status(400)
        .json({ success: false, message: "bookingType is required" });
    }

    if (!paymentType) {
      return res
        .status(400)
        .json({ success: false, message: "paymentType is required" });
    }

    const isPaid = paymentStatus === "paid";

    const order = await Order.create({
      userId,
      venueId: venueId || null,
      eventTitle,
      eventType,
      eventDates,
      eventTime,
      basePrice,
      totalDays,
      serviceFee,
      taxes,
      discount,
      totalAmount,
      selectedServices,
      bookingType,
      paymentType,
      paymentStatus,
      isPaid,
    });

    res
      .status(201)
      .json({ success: true, message: "Booking placed successfully", order });
  } catch (error) {
    console.error("placeBooking error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET /api/booking/user  -> "My Bookings" list
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user;  // 👈 same pattern

    console.log("Fetching bookings for user:", userId);

    const orders = await Order.find({ userId })
      .populate({
        path: "venueId",
        select: "name address images",
        strictPopulate: false, // Don't throw error if ref doesn't exist
      })
      .populate({
        path: "selectedServices.serviceId",
        select: "name price image",
        strictPopulate: false,
      })
      .sort({ createdAt: -1 });

    console.log(`Found ${orders.length} bookings for user ${userId}`);

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getUserBookings error:", error);
    console.error("Error stack:", error.stack);
    res.status(500).json({ 
      success: false, 
      message: "Internal Server Error",
      error: error.message 
    });
  }
};

// GET /api/booking/:id (optional: detail / invoice view)
export const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findById(id)
      .populate("venueId", "name address images")
      .populate("selectedServices.serviceId", "name price image")
      .populate("userId", "name email phone");

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error("getBookingById error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// PATCH /api/booking/:id/status (for updating timeline/paid-state)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, paymentStatus } = req.body;

    const update = {};
    if (status) update.status = status;
    if (paymentStatus) {
      update.paymentStatus = paymentStatus;
      update.isPaid = paymentStatus === "paid";
    }

    const order = await Order.findByIdAndUpdate(id, update, { new: true });

    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Booking updated", order });
  } catch (error) {
    console.error("updateBookingStatus error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// GET /api/booking/list (Admin - Get All Bookings)
export const getAllBookings = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("userId", "name email phone")
      .populate("venueId", "name address images")
      .populate("selectedServices.serviceId", "name price image")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("getAllBookings error:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};