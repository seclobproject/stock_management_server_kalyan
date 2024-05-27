import productModel from "../models/productModel.js";
import { HttpException } from "../exceptions/exceptions.js";
import stockModel from "../models/stockModel.js";
import { findSingleProduct } from "./product.service.js";
import { findFranchise } from "./franchise.service.js";
import lodash from "lodash";
const { toNumber } = lodash;

// add stock

export async function addStock(data) {
  // Find the product by ID
  const product = await productModel
    .findById(data.product)
    .populate("stock.storeId");
  if (!product) throw new HttpException(404, "product not found");

  // const quantity = data.quantity;
  const totalQuantity = product.quantity + data.quantity;
  product.totalPrice = product.price * totalQuantity;

  // Find franchise
  const franchiseData = await findFranchise(data.franchise);
  const franchiseDetails = {
    franchiseId: franchiseData._id,
    franchiseName: franchiseData.franchiseName,
  };

  const stockIndex = product.stock.findIndex(
    (stock) => stock.storeId && stock.storeId.toString() === data.franchise
  );
  if (stockIndex > -1) {
    // get stock details in this franchise
    product.stock[stockIndex].quantity += data.quantity;
  } else {
    product.stock.push({ storeId: franchiseDetails, quantity:data.quantity });
  }
  const updatedProduct = await product.save();
console.log('====================================');
console.log(product.stock);
console.log('====================================');
  const productDetails = {
    productId: product._id,
    productName: product.name,
    productCode: product.productCode,
    quantity: product.stock[stockIndex].quantity += data.quantity,
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
      quantity: data.quantity,
    });
  }
  const updatedFranchise = await franchiseData.save();

  const stock = new stockModel({
    product: productDetails,
    franchise: franchiseDetails,
    quantity:data.quantity,
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
  const stock = await stockModel
    .find(queryData)
    .skip((toNumber(page) - 1) * toNumber(limit))
    .limit(toNumber(limit))
    .sort({ createdAt: -1 });
  const total = await stockModel.find().countDocuments();
  return { stock, total };
}
