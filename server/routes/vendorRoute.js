import express from "express";
import { authVendor } from "../middlewares/authVendor.js";
import { 
  vendorLogin, 
  checkVendorAuth, 
  vendorLogout,
  getVendorVenues,
  getVendorBookings
} from "../controllers/vendorController.js";

const router = express.Router();

// Vendor authentication routes
router.post("/login", vendorLogin);
router.get("/is-auth", authVendor, checkVendorAuth);
router.get("/logout", authVendor, vendorLogout);

// Vendor venues (read-only)
router.get("/venues", authVendor, getVendorVenues);

// Vendor bookings (read-only)
router.get("/bookings", authVendor, getVendorBookings);

export default router;
