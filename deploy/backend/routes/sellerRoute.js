import express from "express";
import { authSeller } from "../middlewares/authSeller.js";
import { sellerLogout, sellerLogin, checkAuth, registerVendor, getVendor, updateVendor } from "../controllers/sellerController.js";
// import { createVenue, updateVenue, removeVenue } from "../controllers/venueController.js";

import { uploadImage, localUploadHandler } from "../middlewares/uploadImage.js";

const router = express.Router();

router.post("/login", sellerLogin);
router.get("/is-auth", authSeller, checkAuth);
router.get("/logout", authSeller, sellerLogout);

// Vendor management (admin only)
router.post("/register-vendor", authSeller, registerVendor);
router.get("/vendor/:id", authSeller, getVendor);
router.put("/vendor/:id", authSeller, updateVendor);

// local upload -> returns { success, url }
router.post("/upload", authSeller, uploadImage, localUploadHandler);

// CRUD venues - COMMENTED OUT FOR NOW
// router.post("/venues", authSeller, createVenue);
// router.patch("/venues/:id", authSeller, updateVenue);
// router.delete("/venues/:id", authSeller, removeVenue);

export default router;
