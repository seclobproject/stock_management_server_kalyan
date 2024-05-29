import productModel from "../models/productModel.js";
import { HttpException } from "../exceptions/exceptions.js";
import stockModel from "../models/stockModel.js";
import { findSingleProduct } from "./product.service.js";
import { findFranchise } from "./franchise.service.js";
import franchiseModel from "../models/franchiseModel.js";

import lodash from "lodash";
const { toNumber } = lodash;

// add stock

export async function addStock(data) {
  try {
    // Find the product by ID
    const product = await productModel
      .findById(data.product)
      .populate("stock.storeId");
    if (!product) throw new HttpException(404, "Product not found");

    // Ensure product.stock is an array
    if (!Array.isArray(product.stock)) {
      product.stock = [];
    }

    const totalQuantity = (product.quantity || 0) + data.quantity;
    product.totalPrice = product.price * totalQuantity;
    product.quantity = totalQuantity;

    // Find franchise
    const franchiseData = await franchiseModel.findById(data.franchise);
    if (!franchiseData) throw new HttpException(404, "Franchise not found");

    // Ensure franchiseData.stock is an array
    if (!Array.isArray(franchiseData.stock)) {
      franchiseData.stock = [];
    }
    const stockIndex = product.stock.findIndex(
      (stock) => stock.storeId._id && stock.storeId._id.toString() === data.franchise
    );
    if (stockIndex > -1) {
      product.stock[stockIndex].quantity += data.quantity;
    } else {
      product.stock.push({
        storeId: franchiseData._id,
        quantity: data.quantity,
      });
    }
    const updatedProduct = await product.save();
    const productDetails = {
      productId: product._id,
      productName: product.name,
      productCode: product.productCode,
      quantity: data.quantity,
    };

    const franchiseIndex = franchiseData.stock.findIndex(
      (stock) =>
        stock.product.productId &&
        stock.product.productId.toString() === data.product
    );

    if (franchiseIndex > -1) {
      franchiseData.stock[franchiseIndex].product.quantity += data.quantity;
    } else {
      franchiseData.stock.push({
        product: productDetails,
      });
    }
    const updatedFranchise = await franchiseData.save();

    const stock = new stockModel({
      product: productDetails,
      franchise: {
        franchiseId: franchiseData._id,
        franchiseName: franchiseData.franchiseName,
      },
      quantity: data.quantity,
      type: "add",
    });
    await stock.save();

    return { stock };
  } catch (error) {
    console.error("Error in addStock function:", error);
    throw error;
  }
}

//-----------------------------

//------- out stock -------------

export async function updateStock(data) {
  const product = await productModel
    .findById(data.product)
    .populate("stock.storeId");
  if (!product) throw new HttpException(404, "product not found");

  const stockIndex = product.stock.findIndex(
    (stock) =>
      stock.storeId._id && stock.storeId._id.toString() === data.franchise
  );

  // Find franchise
  const franchiseData = await franchiseModel.findById(data.franchise);
  if (!franchiseData) throw new HttpException(404, "Franchise not found");

  if (stockIndex > -1) {
    if (product.stock[stockIndex].quantity < data.quantity) {
      throw new HttpException(400, "Insufficient stock");
    }
    // const quantity = data.quantity;
    const totalQuantity = product.quantity - data.quantity;
    product.totalPrice = product.price * totalQuantity;

    product.stock[stockIndex].quantity -= data.quantity;
    product.quantity -= data.quantity;
    // franchiseData.stock[franchiseIndex].product.quantity -= data.quantity;
  } else {
    throw new HttpException(404, "Stock not found in specified store");
  }

  const updatedProduct = await product.save();

  const franchiseDetails = {
    franchiseId: franchiseData._id,
    franchiseName: franchiseData.franchiseName,
  };
  const franchiseIndex = franchiseData.stock.findIndex(
    (stock) =>
      stock.product.productId &&
      stock.product.productId.toString() === data.product
  );
  
  if (franchiseIndex > -1) {
    franchiseData.stock[franchiseIndex].product.quantity -= data.quantity;
  }
  const updatedFranchise = await franchiseData.save();
    const productDetails = {
      productId: product._id,
      productName: product.name,
      productCode: product.productCode,
      price: product.price,
    };

  const stock = new stockModel({
    product: productDetails,
    franchise: franchiseDetails,
    quantity:data.quantity,
    type: "remove",
  });
  await stock.save();
  return { stock };
}

// get all stock transactions

export async function getAllStock(page, limit, query) {
  let queryData = {};
  if (query?.search) {
    queryData["$or"] = [
      { name: { $regex: query?.search ? query?.search : "", $options: "i" } },
      {
        productCode: {
          $regex: query?.search ? query?.search : "",
          $options: "i",
        },
      },
      {
        "franchise.franchiseName": {
          $regex: query?.search ? query?.search : "",
          $options: "i",
        },
      },
    ];
  }
  const totalDocs = await stockModel.find().countDocuments();
   const totalPages =await Math.ceil(totalDocs / limit);
  const stock = await stockModel
    .find(queryData)
    .skip((toNumber(page) - 1) * toNumber(limit))
    .limit(toNumber(limit))
    .sort({ createdAt: -1 });
  return { stock, totalPages, totalDocs };
}
