import {
  getAllProduct,
  getSingleProduct,
  createProduct,
  updateProduct,
  getAllProductBycategory,
  removeProduct,
} from "../controllers/product.controller.js";
import express from "express";
// import { upload } from "../utils/multer.util.js";
import { productValidator } from "../middlewares/product.middleware.js";

const router = express.Router();
const path = "/product";

router.get(`${path}/all`, getAllProduct);
router.get(`${path}/category/all`, getAllProductBycategory);
router.post(
  `${path}/create`,
  productValidator,
  createProduct
);
router.put(`${path}/update/:id`, updateProduct);
router.get(`${path}/single/:id`, getSingleProduct);
router.delete(`${path}/delete/:id`, removeProduct);

export default router;
