import express from "express";
import { defaultAllowedOrigins } from "vite";
import cookiesParser from "cookie-parser";
import cors from "cors";
import path from "path";
import connectDB from "./configs/db.js";
import "dotenv/config";
import userRouter from "./routes/userRoute.js";
import sellerRoute from "./routes/sellerRoute.js";

import productRouter from "./routes/productRoute.js";
import serviceRouter from "./routes/serviceRoute.js";
import gallerySectionRouter from "./routes/galleryRoute.js";   
import bookingRouter from "./routes/bookingRoute.js"; 
const app = express();
const port = process.env.PORT || 4000;

await connectDB();
// await connectCloudinary()
//allow multiple origin
const allowedOrigins = ["http://localhost:5173"];
app.use(express.json());

app.use(cookiesParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.get("/", (req, res) => res.send("api is working"));
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads"))
);
app.use("/api/user", userRouter);
app.use("/api/seller", sellerRoute);
app.use("/api/product", productRouter);
app.use("/api/service", serviceRouter);
app.use("/api/gallery-section", gallerySectionRouter);
app.use("/api/booking", bookingRouter);

// app.use("/api/venues", venueRoute);   // public list/get

app.listen(port, () => {
  console.log(`server is running http://localhost:${port}`);
});
