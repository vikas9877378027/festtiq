import Service from "../models/service.js";
import cloudinary from "../configs/cloudinary.js";

// add service  : /api/service/add
export const addService = async (req, res) => {
  try {
    // serviceData will come as JSON string (like productData)
    const serviceData = JSON.parse(req.body.serviceData);
    const image = req.file;

    if (!image) {
      return res.json({ success: false, message: "Image is required" });
    }

    const result = await cloudinary.uploader.upload(image.path, {
      resource_type: "image",
    });

    await Service.create({
      ...serviceData,
      image: result.secure_url,
    });

    res.json({ success: true, message: "Service added" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get all services  : /api/service/list
export const serviceList = async (req, res) => {
  try {
    const services = await Service.find({});
    res.json({ success: true, services });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// get single service  : /api/service/:id
export const serviceById = async (req, res) => {
  try {
    const { id } = req.params;
    const service = await Service.findById(id);

    if (!service) {
      return res
        .status(404)
        .json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, service });
  } catch (error) {
    console.log(error.message);
    res
      .status(500)
      .json({ success: false, message: error.message });
  }
};

// change active status  : /api/service/status 
export const changeServiceStatus = async (req, res) => {
  try {
    const { id, isActive } = req.body;
    await Service.findByIdAndUpdate(id, { isActive });
    res.json({ success: true, message: "Service status updated successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });    
  }
};

// update service  : /api/service/update
export const updateService = async (req, res) => {
  try {
    const { id } = req.body;
    const serviceData = JSON.parse(req.body.serviceData);
    const image = req.file;

    if (!id) {
      return res.status(400).json({ success: false, message: "Service ID is required" });
    }

    const existingService = await Service.findById(id);
    if (!existingService) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    // If new image uploaded, replace old one
    if (image) {
      const result = await cloudinary.uploader.upload(image.path, {
        resource_type: "image",
      });
      serviceData.image = result.secure_url;
    } else {
      // Keep existing image
      serviceData.image = existingService.image;
    }

    const updated = await Service.findByIdAndUpdate(id, serviceData, { new: true });
    res.json({ success: true, message: "Service updated successfully", service: updated });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// delete service  : /api/service/delete
export const deleteService = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Service ID is required" });
    }

    const service = await Service.findByIdAndDelete(id);

    if (!service) {
      return res.status(404).json({ success: false, message: "Service not found" });
    }

    res.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};