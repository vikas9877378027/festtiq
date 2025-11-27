import express from "express";
import { upload } from "../configs/multer.js";
import { authSeller } from "../middlewares/authSeller.js";
import {
  addService,
  serviceList,
  serviceById,
  changeServiceStatus,
  updateService,
  deleteService,
} from "../controllers/serviceController.js";

const serviceRouter = express.Router();

serviceRouter.post(
  "/add",
  authSeller,
  upload.single("image"), // single file field name = "image"
  addService
);

serviceRouter.post(
  "/update",
  authSeller,
  upload.single("image"),
  updateService
);

serviceRouter.post("/delete", authSeller, deleteService);

serviceRouter.get("/list", serviceList);

serviceRouter.get("/:id", serviceById);

serviceRouter.post("/status", authSeller, changeServiceStatus);

export default serviceRouter;
