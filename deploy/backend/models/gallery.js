import mongoose from "mongoose";

const gallerySectionSchema = new mongoose.Schema(                                         
  {
    heading: {
      type: String,
      required: true,        
      trim: true,
    },

    description: {   
      type: String,
      required: true,    
      trim: true,
    },

    images: {
      type: [String], // Cloudinary URLs               
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.GallerySection ||
  mongoose.model("GallerySection", gallerySectionSchema);    
