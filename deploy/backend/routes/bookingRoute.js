// routes/bookingRoute.js
import express from "express";
import authUser from "../middlewares/authUser.js";
import { authSeller } from "../middlewares/authSeller.js";

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
bookingRouter.get("/list", authSeller, getAllBookings); // Admin endpoint - fetch all bookings (secured)
bookingRouter.get("/:id", authUser, getBookingById);
bookingRouter.patch("/:id/status", authSeller, updateBookingStatus); // Admin only - update booking status (secured)

export default bookingRouter;
