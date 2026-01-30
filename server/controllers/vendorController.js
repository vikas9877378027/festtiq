import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import Product from "../models/product.js";
import Order from "../models/order.js";

// Vendor login: /api/vendor/login
export const vendorLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Check if user is a vendor
    if (user.role !== "vendor") {
      return res.status(403).json({
        success: false,
        message: "Access denied. This login is for vendors only.",
      });
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Set cookie
    const cookieOptions = {
      httpOnly: true,
      secure: false, // Set to true in production with HTTPS
      sameSite: "Lax",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };
    
    res.cookie("vendorToken", token, cookieOptions);
    
    console.log("✅ [Vendor Login] Cookie set successfully for:", user.email);
    console.log("🍪 [Vendor Login] Cookie options:", cookieOptions);
    console.log("⏰ [Vendor Login] Token expires in: 7 days");

    res.status(200).json({
      success: true,
      message: "Login successful",
      vendor: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error in vendorLogin:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Check vendor auth: /api/vendor/is-auth
export const checkVendorAuth = async (req, res) => {
  try {
    // req.vendor is set by authVendor middleware
    const vendor = req.vendor;

    res.status(200).json({
      success: true,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        role: vendor.role,
      },
    });
  } catch (error) {
    console.error("Error in checkVendorAuth:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Vendor logout: /api/vendor/logout
export const vendorLogout = async (req, res) => {
  try {
    res.clearCookie("vendorToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Error in vendorLogout:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

// Get vendor's venues (read-only): /api/vendor/venues
export const getVendorVenues = async (req, res) => {
  try {
    // req.vendorId is set by authVendor middleware
    const vendorId = req.vendorId;

    // Find all venues belonging to this vendor
    const venues = await Product.find({ vendorId });

    res.status(200).json({
      success: true,
      venues,
      count: venues.length,
    });
  } catch (error) {
    console.error("Error in getVendorVenues:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch venues",
    });
  }
};

// Get bookings for vendor's venues: /api/vendor/bookings
export const getVendorBookings = async (req, res) => {
  try {
    const vendorId = req.vendorId;

    // First, get all venues belonging to this vendor
    const vendorVenues = await Product.find({ vendorId }).select("_id");
    const venueIds = vendorVenues.map((v) => v._id);

    if (venueIds.length === 0) {
      return res.status(200).json({
        success: true,
        bookings: [],
        count: 0,
        message: "No venues found for this vendor",
      });
    }

    // Find all bookings for these venues
    const bookings = await Order.find({ venueId: { $in: venueIds } })
      .populate("userId", "name email phone")
      .populate("venueId", "name address images location")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      bookings,
      count: bookings.length,
    });
  } catch (error) {
    console.error("Error in getVendorBookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
};
