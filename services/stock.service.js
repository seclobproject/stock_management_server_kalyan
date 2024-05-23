import productModel from "../models/productModel.js";
import { HttpException } from "../exceptions/exceptions.js";
import stockModel from "../models/stockModel.js";
import { findSingleProduct } from "./product.service.js";
import { findFranchise } from "./franchise.service.js";

// add stock

export async function addStock(data) {
  // Find the product by ID
  const product = await productModel.findById(data.product);
  if (!product) throw new HttpException(404, "product not found");

  const franchise = data.franchise;
  const quantity = data.quantity;
  const totalQuantity = product.quantity += quantity;

  product.totalPrice = product.price * totalQuantity;
  if (!product.stock) {
    product.stock = [];
  }

  const productData = await findSingleProduct(data.product);
  const productDetails = {
    productId: productData.product._id,
    productName: productData.product.name,
  };
  const franchiseData = await findFranchise(data.franchise);
  const franchiseDetails = {
    franchiseId: franchiseData._id,
    franchiseName: franchiseData.name,
  };
  const stockIndex = product.stock.findIndex(
    (stock) => stock.storeId && stock.storeId.toString() === data.franchise
  );

  if (stockIndex > -1) {
    product.stock[stockIndex].quantity += quantity;
  } else {
    product.stock.push({ storeId: franchise, quantity });
  }
  const updatedProduct = await product.save();

  const stock = new stockModel({
    product: productDetails,
    franchise: franchiseDetails,
    quantity,
    type: "add",
  });
  await stock.save();

  return { stock };
}

// out stock

export async function updateStock(data) {
  const product = await productModel.findById(data.product);
  if (!product) throw new HttpException(404, "product not found");

  const franchise = data.franchise;
  const quantity = data.quantity;
  const totalQuantity = (product.quantity -= quantity);
  product.totalPrice = product.price * totalQuantity;
  const stockIndex = product.stock.findIndex(
    (stock) => stock.storeId.toString() === franchise
  );

  const productData = await findSingleProduct(data.product);
  const productDetails = {
    productId: productData.product._id,
    productName: productData.product.name,
  };
  const franchiseData = await findFranchise(data.franchise);
  const franchiseDetails = {
    franchiseId: franchiseData._id,
    franchiseName: franchiseData.name,
  };

  if (stockIndex > -1) {
    if (product.stock[stockIndex].quantity < quantity) {
      throw new HttpException(400, "Insufficient stock");
    }
    product.stock[stockIndex].quantity -= quantity;
  } else {
    throw new HttpException(404, "Stock not found in specified store");
  }

  const updatedProduct = await product.save();

  const stock = new stockModel({
    product: productDetails,
    franchise: franchiseDetails,
    quantity,
    type: "remove",
  });
  await stock.save();
  return { stock };
}

// get all stock transactions

export async function getAllStock(page, limit, query) {
  const stock = await stockModel
    .find()
    .skip((toNumber(page) - 1) * toNumber(limit))
    .limit(toNumber(limit))
    .sort({ createdAt: -1 });;
  const total = await stockModel.find().countDocuments();
  return { stock, total };
}
