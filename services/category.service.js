import mongoose from "mongoose";
import categoryModel from "../models/categoryModel.js";
import { HttpException } from "../exceptions/exceptions.js";
// import lodash from "lodash";
// const { toNumber } = lodash;


// add new category
export async function saveCategory(data) {
  const findCategory = await categoryModel.findOne({
    categoryName: data.categoryName,
  });
  if(findCategory) throw new HttpException(400, "Category already exist");
  const category = await categoryModel.create({ ...data });
  return { category };
}
// get all categories
export async function getAll() {
  const category = await categoryModel.find().sort({ createdAt: -1 });;
  const total = await categoryModel.find().countDocuments();
  return { category, total };
}

// update category
export async function updCategory(categoryData, categoryId) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new HttpException(400, "Invalid category ID");
  }

  const catry = await categoryModel.findById(categoryId);
  if (!catry) {
    throw new HttpException(404, "Category not found");
  }

  const category = await categoryModel.findByIdAndUpdate(
    categoryId,
    categoryData,
    { new: true }
  );

  return { category };
}

// delete category

export async function dltCategory(categoryId) {
  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    throw new HttpException(400, "Invalid category ID");
  }

  const category = await categoryModel.findByIdAndDelete(categoryId);
  if (!category) throw new HttpException(404, "category not found");
  return { category };
}

// find single category

export async function findcategoryData(categoryId) {
  const category = await categoryModel.findOne({ _id: categoryId });
  if (!category) throw new HttpException(404, "category not found");

  return category;
}