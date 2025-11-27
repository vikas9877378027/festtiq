// routes/bookingRoute.js
import express from "express";
import authUser from "../middlewares/authUser.js";

import {
  placeBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  getAllBookings,
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

bookingRouter.post("/place", authUser, placeBooking);
bookingRouter.get("/user", authUser, getUserBookings);
bookingRouter.get("/list", getAllBookings); // Admin endpoint - fetch all bookings
bookingRouter.get("/:id", authUser, getBookingById);
bookingRouter.patch("/:id/status", updateBookingStatus);

export default bookingRouter;
