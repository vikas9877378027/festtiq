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
const allowedOrigins = ["http://localhost:5173", "http://127.0.0.1:5173"];
app.use(express.json());

app.use(cookiesParser());
app.use(cors({
  origin: function (origin, callback) {
    console.log("Request Origin:", origin);
    // Allow requests with no origin (like mobile apps/curl)
    if (!origin) return callback(null, true);
    // Check if origin is in allowed list OR just allow it for dev
    if (allowedOrigins.indexOf(origin) !== -1 || true) { // allowing all for dev debugging
      return callback(null, true);
    } else {
      console.log("Blocked by CORS:", origin);
      return callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.get("/", (req, res) => res.send("api is working"));
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
