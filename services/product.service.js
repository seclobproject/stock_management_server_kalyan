import productModel from "../models/productModel.js";
import { HttpException } from "../exceptions/exceptions.js";
import lodash from "lodash";
import { findcategoryData } from "./category.service.js";
import { findFranchise } from "./franchise.service.js";
import franchiseModel from "../models/franchiseModel.js";

import mongoose from "mongoose";
const { toNumber } = lodash;

//----------- add new product----------------

export async function saveProduct(productData) {
  const findProduct = await productModel.findOne({ name: productData.name });
  if (findProduct) throw new HttpException(400, "Product already exist ");

  // update the product total prise
  if (!productData.quantity) {
    productData.totalPrice = productData.price;
  } else {
    productData.totalPrice = productData.price * productData.quantity;
  }

  const product = await productModel.create({
    ...productData,
    quantity:0,
    stock: [],
  });
  return { product };
}

//---------------------------

//--------- update product --------

export async function productUpdate(productId, productData) {
  try {

    if (productData.name) {
      const findProduct = await productModel.findOne({
        name: productData.name,
      });
      if (findProduct && findProduct._id.toString() !== productId) {
        throw new HttpException(400, "Product with this name already exists");
      }
    }
    const product = await productModel.findByIdAndUpdate(
      productId,
      productData,
      { new: true }
    );
    if (!product) {
      throw new HttpException(404, "Product not found");
    }
    return { product };
  } catch (error) {
    throw error;
  }
}
// ----------------------------
      
//----------- get all products -------------

export async function getAll(page, limit, query) {
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
        "category.categoryName": {
          $regex: query?.search ? query?.search : "",
          $options: "i",
        },
      },
    ];
  }

  const products = await productModel
    .find(queryData)
    .populate([{ path: "stock.storeId" }, { path: "category" }])
    .skip((toNumber(page) - 1) * toNumber(limit))
    .limit(toNumber(limit))
    .sort({ createdAt: -1 });

  const total = await productModel.find(queryData).countDocuments();
  return { products, total };
}
// ------------------------------------

// ------- get filtered product by franchise

export async function findAllProductByFranchise(page, limit, franchiseId) {
  try {
    const products = await franchiseModel.findById(franchiseId);
    return { products:products.stock };
  } catch (error) {
    throw error;
  }
}

//-------- find single product -----------

export async function findSingleProduct(productId) {
  const product = await productModel.findById(productId);
  if (!product) throw new HttpException(404, "product not found");
  return { product };
}

//-------- delete a product -----------

export async function deleteProduct(productId) {
  if (!mongoose.Types.ObjectId.isValid(productId)) {
    throw new HttpException(400, "Invalid product ID");
  }

  const product = await productModel.findByIdAndDelete(productId);
  if (!product) throw new HttpException(404, "product not found");
  return { product };
}
