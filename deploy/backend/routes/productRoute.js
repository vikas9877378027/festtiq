import express from "express";
import { upload } from "../configs/multer.js";

import { authSeller } from "../middlewares/authSeller.js";
import {
  addProduct,
  changeStock,
  productById,
  productList,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const productRouter = express.Router();
productRouter.post("/add", authSeller, upload.array("images", 8), addProduct);
productRouter.post("/update", authSeller, upload.array("images", 8), updateProduct);
productRouter.post("/delete", authSeller, deleteProduct);

productRouter.get("/list", productList);    
productRouter.get("/:id", productById);

productRouter.post("/stock", authSeller, changeStock);    

export default productRouter;
