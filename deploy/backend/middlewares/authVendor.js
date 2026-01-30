import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Middleware to authenticate vendors (not admin)
export const authVendor = async (req, res, next) => {
  const { vendorToken } = req.cookies;
  
  console.log("🔐 [authVendor] Checking authentication...");
  console.log("📝 [authVendor] Cookies received:", Object.keys(req.cookies));
  console.log("🎫 [authVendor] vendorToken present:", !!vendorToken);
  
  if (!vendorToken) {
    console.log("❌ [authVendor] No token provided");
    return res.status(401).json({ message: "Unauthorized - No vendor token provided", success: false });
  }
  
  try {
    const decoded = jwt.verify(vendorToken, process.env.JWT_SECRET);
    
    // Fetch the vendor user from database
    const vendor = await User.findById(decoded.id);
    
    if (!vendor) {
      console.log("❌ [authVendor] Vendor not found in database");
      return res.status(401).json({ message: "Vendor not found", success: false });
    }
    
    if (vendor.role !== "vendor") {
      console.log("❌ [authVendor] User is not a vendor, role:", vendor.role);
      return res.status(403).json({ message: "Access denied - Not a vendor account", success: false });
    }
    
    // Attach vendor ID to request
    req.vendorId = vendor._id;
    req.vendor = vendor;
    console.log("✅ [authVendor] Authentication successful for:", vendor.email);
    next();
  } catch (error) {
    console.error("❌ [authVendor] Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token", success: false });
  }
};
