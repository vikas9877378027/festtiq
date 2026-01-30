import express from "express";
import { defaultAllowedOrigins } from "vite";
import cookiesParser from "cookie-parser";
import cors from "cors";
import path from "path";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRoute from "./routes/sellerRoute.js";
import vendorRoute from "./routes/vendorRoute.js";

import productRouter from "./routes/productRoute.js";
import serviceRouter from "./routes/serviceRoute.js";
import gallerySectionRouter from "./routes/galleryRoute.js";
import bookingRouter from "./routes/bookingRoute.js";
const app = express();
const port = process.env.PORT || 4000;

await connectDB();
// await connectCloudinary()
//allow multiple origin   
const allowedOrigins = [
  "http://localhost:5173", 
  "http://127.0.0.1:5173",
  "https://sumriktest.in",
  "http://sumriktest.in"
];

app.use(express.json());
app.use(cookiesParser());

// CORS configuration
app.use(cors({
  origin: function (origin, callback) {
    console.log("Request Origin:", origin);
    // Allow requests with no origin (like mobile apps/curl/proxy)
    if (!origin) return callback(null, true);
    
    // In production, check allowed origins
    if (process.env.NODE_ENV === 'production') {
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      } else {
        console.log("Blocked by CORS:", origin);
        return callback(new Error('Not allowed by CORS'));
      }
    }
    
    // In development, allow all
    return callback(null, true);
  },
  credentials: true
}));

// Health check endpoint
app.get("/", (req, res) => res.json({ 
  status: "ok", 
  message: "Festiq API is running",
  timestamp: new Date().toISOString(),
  env: process.env.NODE_ENV || 'development'
}));

app.get("/api/health", (req, res) => res.json({ 
  status: "healthy",
  uptime: process.uptime(),
  timestamp: new Date().toISOString()
}));
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads"))
);
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRoute);
app.use("/api/vendor", vendorRoute);
app.use("/api/product", productRouter);
app.use("/api/service", serviceRouter);
app.use("/api/gallery-section", gallerySectionRouter);
app.use("/api/booking", bookingRouter);

// app.use("/api/venues", venueRoute);   // public list/get

app.listen(port, () => {
  console.log(`server is running http://localhost:${port}`);
});
