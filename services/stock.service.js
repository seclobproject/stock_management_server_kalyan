import productModel from "../models/productModel.js";
import { HttpException } from "../exceptions/exceptions.js";
import stockModel from "../models/stockModel.js";

// add stock

export async function addStock(data) {
  // Find the product by ID
  const product = await productModel.findById(data.product);
  if (!product) throw new HttpException(404, "product not found");

  const franchise = data.franchise;
  const quantity = data.quantity;

  if (!product.stock) {
    product.stock = [];
  }

  const stockIndex = product.stock.findIndex(
    (stock) => stock.storeId && stock.storeId.toString() === data.franchise
  );

  if (stockIndex > -1) {
    product.stock[stockIndex].quantity += data.quantity;
  } else {
    product.stock.push({ storeId: franchise, quantity });
  }

  const updatedProduct = await product.save();

  const stock = new stockModel({
    productId: data.product,
    storeId: franchise,
    quantity,
    type: "add",
  });
  await stock.save();

  return { product: updatedProduct };
}

// out stock

// export async function updateStock(data) {
//  const product = await productModel.findById(req.params.id);
//   if (!product) throw new HttpException(404, "product not found");

//  const stockIndex = product.stock.findIndex(
//    (stock) => stock.storeId.toString() === storeId
//  );
 
//  if (stockIndex > -1) {
//    if (product.stock[stockIndex].quantity < quantity) {
//      return res.status(400).json({ message: "Insufficient stock" });
//    }
//    product.stock[stockIndex].quantity -= quantity;
//  } else {
//    return res
//      .status(404)
//      .json({ message: "Stock not found in specified store" });
//  }

//  const updatedProduct = await product.save();

//  const stock = new stockModel({
//    productId: req.params.id,
//    storeId,
//    quantity,
//    type: "remove",
//  });
//  await stock.save();

//   return { stock };
// }

// get all stock transactions

export async function getAllStock(page, limit, query) {
 const stock = await stockModel.find().populate("productId storeId");
  const total = await stockModel.find().countDocuments();
  return { stock, total };
}
