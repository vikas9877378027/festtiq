import GallerySection from "../models/gallery.js";
import cloudinary from "../configs/cloudinary.js";

// ADD
export const addGallerySection = async (req, res) => {
  try {
    const galleryData = JSON.parse(req.body.galleryData);
    const files = req.files;

    if (!files || files.length === 0) {
      return res.json({
        success: false,
        message: "Please upload at least 1 image",
      });
    }

    const uploadedImages = await Promise.all(
      files.map(async (file) => {
        const result = await cloudinary.uploader.upload(file.path, {  
          resource_type: "image",
        });
        return result.secure_url;
      })
    );

    await GallerySection.create({
      ...galleryData,
      images: uploadedImages,
    });

    res.json({ success: true, message: "Gallery section added successfully" });
  } catch (error) {  
    res.json({ success: false, message: error.message });
  }
};

// LIST
export const gallerySectionList = async (req, res) => {
  try {
    const sections = await GallerySection.find({});
    res.json({ success: true, sections });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// BY ID
export const gallerySectionById = async (req, res) => {
  try {
    const section = await GallerySection.findById(req.params.id);
    res.json({ success: true, section });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// STATUS
export const changeGallerySectionStatus = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    await GallerySection.findByIdAndUpdate(id, { isActive });
    res.json({ success: true, message: "Status updated successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// UPDATE
export const updateGallerySection = async (req, res) => {
  try {
    const { id } = req.body;
    const galleryData = JSON.parse(req.body.galleryData);
    const files = req.files;

    if (!id) {
      return res.status(400).json({ success: false, message: "Gallery section ID is required" });
    }

    const existingSection = await GallerySection.findById(id);
    if (!existingSection) {
      return res.status(404).json({ success: false, message: "Gallery section not found" });
    }

    // If new images uploaded, replace old ones
    if (files && files.length > 0) {
      const uploadedImages = await Promise.all(
        files.map(async (file) => {
          const result = await cloudinary.uploader.upload(file.path, {
            resource_type: "image",
          });
          return result.secure_url;
        })
      );
      galleryData.images = uploadedImages;
    } else {
      // Keep existing images
      galleryData.images = existingSection.images;
    }

    const updated = await GallerySection.findByIdAndUpdate(id, galleryData, { new: true });
    res.json({ success: true, message: "Gallery section updated successfully", section: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE
export const deleteGallerySection = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Gallery section ID is required" });
    }

    const section = await GallerySection.findByIdAndDelete(id);

    if (!section) {
      return res.status(404).json({ success: false, message: "Gallery section not found" });
    }

    res.json({ success: true, message: "Gallery section deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};