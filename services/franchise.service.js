import mongoose from "mongoose";
import { HttpException } from "../exceptions/exceptions.js";
import franchiseModel from '../models/franchiseModel.js'

// add new category
export async function saveFranchise(data) {
    const findFranchise = await franchiseModel.findOne({
      franchiseName: data.franchiseName,
    });
    if (findFranchise) throw new HttpException(400, "franchise already exist");
  const franchise = await franchiseModel.create({ ...data });
  return { franchise };
}
// get all categories
export async function getAllFranchise() {
  const franchise = await franchiseModel.find()
  const total = await franchiseModel.find().countDocuments();
  return { franchise, total };
}

// update category
export async function updFranchise(franchiseData, franchiseId) {
  if (!mongoose.Types.ObjectId.isValid(franchiseId)) {
    throw new HttpException(400, "Invalid franchise ID");
  }

  const franch = await franchiseModel.findById(franchiseId);
  if (!franch) {
    throw new HttpException(404, "Franchise not found");
  }

  const category = await franchiseModel.findByIdAndUpdate(
    franchiseId,
    franchiseData,
    { new: true }
  );

  return { category };
}
// delete category

export async function dltFranchise(franchiseId) {
  if (!mongoose.Types.ObjectId.isValid(franchiseId)) {
    throw new HttpException(400, "Invalid franchise ID");
  }

  const franchise = await franchiseModel.findByIdAndDelete(franchiseId
    
  );
  if (!franchise) throw new HttpException(404, "franchise not found");
  return { franchise };
}

// find single franchise

export async function findFranchise(franchiseId) {
  const franchise = await franchiseModel.findById(franchiseId);
  if (!franchise) throw new HttpException(404, "franchise not found");
  return franchise;
}