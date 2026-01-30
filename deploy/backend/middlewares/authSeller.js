import jwt from "jsonwebtoken";

export const authSeller = async (req, res, next) => {
  const { sellerToken } = req.cookies;
  
  console.log("🔐 [authSeller] Checking authentication...");
  console.log("📝 [authSeller] Cookies received:", Object.keys(req.cookies));
  console.log("🎫 [authSeller] sellerToken present:", !!sellerToken);
  
  if (!sellerToken) {
    console.log("❌ [authSeller] No token provided");
    return res.status(401).json({ message: "Unauthorized - No admin token provided", success: false });
  }
  
  try {
    const decoded = jwt.verify(sellerToken, process.env.JWT_SECRET);
    req.seller = decoded.email;
    console.log("✅ [authSeller] Authentication successful for:", decoded.email);
    next();
  } catch (error) {
    console.error("❌ [authSeller] Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token", success: false }); 
  }
};
