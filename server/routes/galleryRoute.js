// server/routes/galleryRoute.js  
import express from "express";
import { upload } from "../configs/multer.js";
import { authSeller } from "../middlewares/authSeller.js";    

import {
  addGallerySection,
  gallerySectionList,
  gallerySectionById,
  changeGallerySectionStatus,
  updateGallerySection,
  deleteGallerySection,
} from "../controllers/galleryController.js";
  
const gallerySectionRouter = express.Router();

// ADD gallery section (heading + description + multiple images)   
gallerySectionRouter.post(
  "/add",
  authSeller,
  upload.array("images", 20),
  addGallerySection
);

// UPDATE gallery section
gallerySectionRouter.post(
  "/update",
  authSeller,
  upload.array("images", 20),
  updateGallerySection
);

// DELETE gallery section
gallerySectionRouter.post("/delete", authSeller, deleteGallerySection);

// GET all sections
gallerySectionRouter.get("/list", gallerySectionList);

// GET one section by id
gallerySectionRouter.get("/:id", gallerySectionById);

// CHANGE status (active / inactive)
gallerySectionRouter.post("/status", authSeller, changeGallerySectionStatus);

export default gallerySectionRouter;
