import productModel from "../models/productModel.js";
import { HttpException } from "../exceptions/exceptions.js";
import lodash from "lodash";
import { findcategoryData } from "./category.service.js";
import { findFranchise } from "./franchise.service.js";
import mongoose from "mongoose";
const { toNumber } = lodash;

//----------- add new product----------------

export async function saveProduct(productData) {
  const findProduct = await productModel.findOne({ name: productData.name });
  if (findProduct) throw new HttpException(400, "Product already exist ");

  if (!productData.quantity) {
    productData.totalPrice = productData.price;
  } else {
    productData.totalPrice = productData.price * productData.quantity;
  }

  const categoryData = await findcategoryData(productData.category);
  const category = {
    categoryId: categoryData._id,
    categoryName: categoryData.categoryName,
  };

  const franchiseData = await findFranchise(productData.franchise);
  const franchise = {
    franchiseId: franchiseData._id,
    franchiseName: franchiseData.franchiseName,
  };
  const product = await productModel.create({
    ...productData,
    category,
    franchise,
    stock: [],
  });
  return { product };
}

//---------------------------

//--------- update product --------

export async function productUpdate(productId, productData) {
  if (productData.subcategory) {
    const categoryData = await findcategoryData(
      productData.subcategory.subcategoryId
    );
    const category = {
      categoryId: categoryData._id,
      categoryName: categoryData.categoryName,
    };
    productData.category = category;
  }

  const product = await productModel.findByIdAndUpdate(
    productId,
    productData,

    { new: true }
  );
  if (!product) throw new HttpException(404, "product not found");
  return { product };
}
// ----------------------------

// get all products

export async function getAll(page, limit, query) {
  let queryData = {};
  if (query?.search) {
    queryData["$or"] = [
      { title: { $regex: query?.search ? query?.search : "", $options: "i" } },
      {
        "subcategory.subcategoryName": {
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
    .skip((toNumber(page) - 1) * toNumber(limit))
    .limit(toNumber(limit))
    .sort({ createdAt: -1 });

  const total = await productModel.find(queryData).countDocuments();
  return { products, total };
}


// ------- get filtered product by category

export async function findAllProductByCategory(page, limit, categories) {
  const queryData = {
    "subcategory.subcategoryId": { $in: categories }, // Using $in operator to match multiple subcategory IDs
  };
  const products = await productModel
    .find(queryData)
    .skip((toNumber(page) - 1) * toNumber(limit))
    .limit(toNumber(limit))
    .sort({ createdAt: -1 });

  const total = await productModel.find(queryData).countDocuments();
  return { products, total };
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
