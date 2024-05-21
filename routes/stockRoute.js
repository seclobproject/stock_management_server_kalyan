import express from "express";
import { stockValidator } from "../middlewares/stock.middleware.js";
import { getAllStockReport, stockIn, stockOut } from "../controllers/stock.controller.js";

const router = express.Router();
const path = "/stock";

router.post(`${path}/add`, stockValidator, stockIn);
router.post(`${path}/out`, stockValidator, stockOut);
router.get(`${path}/all`, getAllStockReport);

export default router;
