import express from "express";
import { addCategory, deleteCategory, getAllCategory, updateCategory } from "../controllers/category.controller.js";
import { categoryValidator } from "../middlewares/category.middleware.js";
const router = express.Router();

//........user login and log out...........//
router.post("/category/add", categoryValidator, addCategory);
router.get("/category/all", getAllCategory);
router.put("/category/update/:id",categoryValidator, updateCategory);
router.delete("/category/delete/:id", deleteCategory);

export default router;
