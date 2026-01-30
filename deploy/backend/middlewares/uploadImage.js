import multer from "multer";
import path from "path";
import fs from "fs";

const fileFilter = (_req, file, cb) => {
  const ok = /image\/(png|jpe?g|webp)/i.test(file.mimetype);
  cb(ok ? null : new Error("Only PNG/JPG/WEBP images allowed"), ok);
};

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    const dir = path.join(process.cwd(), "public", "uploads");
    fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

export const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("image");

// Middleware for avatar upload
export const uploadAvatar = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
}).single("avatar");

// controller to respond with absolute URL
export const localUploadHandler = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: "No image" });
    const base = process.env.STATIC_BASE_URL || `http://localhost:${process.env.PORT || 4000}`;
    const url = `${base}/uploads/${req.file.filename}`;
    res.json({ success: true, url });
  } catch (e) {
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};
