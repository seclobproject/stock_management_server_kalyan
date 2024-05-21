import express from "express";
import { addFranchise, deleteCategory, getAll, updateFranchise } from "../controllers/franchise.controller.js";
import { franchiseValidator } from "../middlewares/franchise.middleware.js";
const router = express.Router();

//........user login and log out...........//
router.post("/franchise/add", franchiseValidator, addFranchise);
router.get("/franchise/all", getAll);
router.put("/franchise/update/:id", franchiseValidator, updateFranchise);
router.delete("/franchise/delete/:id", deleteCategory);

export default router;
