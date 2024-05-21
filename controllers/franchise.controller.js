import { dltFranchise, getAllFranchise, saveFranchise, updFranchise } from "../services/franchise.service.js";

// add new category
export async function addFranchise(req, res, next) {
  try {
    const categoryData = req.body;
    const result = await saveFranchise(categoryData);
    res.status(200).send({ message: "successfully added Franchise" });
  } catch (err) {
    next(err);
  
}
}
// get all category
export async function getAll(req, res, next) {
  try {
    const result = await getAllFranchise();
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

// update a category
export async function updateFranchise(req, res, next) {
  try {
    const franchiseData = req.body;
    const franchiseId = req.params.id;
    const result = await updFranchise(franchiseData, franchiseId);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

// delete a category
export async function deleteCategory(req, res, next) {
  try {
    const franchiseId = req.params.id;
    const result = await dltFranchise(franchiseId);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}
