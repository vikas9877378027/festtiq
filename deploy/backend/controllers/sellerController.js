import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

// seller login :/api/seller/login
export const sellerLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (
      password === process.env.SELLER_PASSWORD &&
      email === process.env.SELLER_EMAIL
    ) {
      const token = jwt.sign({ email }, process.env.JWT_SECRET, {
        expiresIn: "7d",
      });
      
      const cookieOptions = {   
        httpOnly: true,
        secure: false,
        sameSite: "Lax",
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      };
      
      res.cookie("sellerToken", token, cookieOptions);
      
      console.log("✅ [Admin Login] Cookie set successfully");
      console.log("🍪 [Admin Login] Cookie options:", cookieOptions);
      console.log("⏰ [Admin Login] Token expires in: 7 days");
      
      return res
        .status(200)
        .json({ message: "Login successful", success: true });
    } else {
      return res
        .status(400)
        .json({ message: "Invalid credentials", success: false });
    }
  } catch (error) {
    console.error("Error in sellerLogin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// check seller auth  : /api/seller/is-auth
export const checkAuth = async (req, res) => {
  try {
    // Return seller/admin user info
    const user = {
      email: req.seller, // from authSeller middleware
      role: "admin",
    };
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// logout seller: /api/seller/logout
export const sellerLogout = async (req, res) => {
  try {
    res.clearCookie("sellerToken", {
      httpOnly: true,
      secure: false,
      sameSite: "Lax",
      path: "/",
    });
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error("Error in logout:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// register vendor with venue: /api/seller/register-vendor (admin only)
export const registerVendor = async (req, res) => {
  try {
    const { vendorEmail, vendorPassword, vendorPhone, vendorName } = req.body;

    // Validation
    if (!vendorEmail || !vendorPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email: vendorEmail });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "A user with this email already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(vendorPassword, 10);

    // Create vendor user
    const vendor = await User.create({
      name: vendorName || vendorEmail.split('@')[0], // Use provided name or email prefix
      email: vendorEmail,
      phone: vendorPhone || undefined,
      password: hashedPassword,
      role: "vendor",
      plainPassword: vendorPassword, // Store plain password for admin view (NOT RECOMMENDED IN PRODUCTION)
    });

    res.status(201).json({
      success: true,
      message: "Vendor registered successfully",
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        role: vendor.role,
        plainPassword: vendorPassword,
      },
    });
  } catch (error) {
    console.error("Error in registerVendor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to register vendor",
    });
  }
};

// get vendor details: /api/seller/vendor/:id (admin only)
export const getVendor = async (req, res) => {
  try {
    const { id } = req.params;
    
    const vendor = await User.findById(id).select('name email phone role plainPassword');
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.role !== "vendor") {
      return res.status(400).json({
        success: false,
        message: "User is not a vendor",
      });
    }

    res.json({
      success: true,
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        role: vendor.role,
        plainPassword: vendor.plainPassword || "Not available",
      },
    });
  } catch (error) {
    console.error("Error in getVendor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to get vendor",
    });
  }
};

// update vendor details: /api/seller/vendor/:id (admin only)
export const updateVendor = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, password } = req.body;

    const vendor = await User.findById(id);
    
    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.role !== "vendor") {
      return res.status(400).json({
        success: false,
        message: "User is not a vendor",
      });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== vendor.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Email is already taken",
        });
      }
    }

    // Update fields
    if (name) vendor.name = name;
    if (email) vendor.email = email;
    if (phone !== undefined) vendor.phone = phone;
    
    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      vendor.password = hashedPassword;
      vendor.plainPassword = password;
    }

    await vendor.save();

    res.json({
      success: true,
      message: "Vendor updated successfully",
      vendor: {
        id: vendor._id,
        name: vendor.name,
        email: vendor.email,
        phone: vendor.phone,
        role: vendor.role,
        plainPassword: vendor.plainPassword,
      },
    });
  } catch (error) {
    console.error("Error in updateVendor:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to update vendor",
    });
  }
};
