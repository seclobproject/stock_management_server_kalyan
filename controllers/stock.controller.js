
import { addStock, getAllStock } from "../services/stock.service.js";

// add stock

export async function stockIn(req, res, next) {
  try {
    const stockData = req.body;
    const stock = await addStock(stockData);
    res.status(200).send(stock);
  } catch (err) {
    next(err);
  }
}

// get all stock reports

export async function getAllStockReport(req, res, next) {
  try {
    const query = req.query;
    const page = req.query.page;
    const limit = req.query.limit || "10";
    const result = await getAllStock(page, limit, query);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

// out stock

export async function stockOut(req, res, next) {
  try {
    const stockData = req.body;
    const stock = await updateStock(stockData);
    res.status(200).send(stock);
  } catch (err) {
    next(err);
  }
}
