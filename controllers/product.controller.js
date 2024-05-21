import {
  deleteProduct,
  findAllProductByCategory,
  findSingleProduct,
  getAll,
  productUpdate,
  saveProduct,
} from "../services/product.service.js";

// add new product

export async function createProduct(req, res, next) {
  try {
    const productData = req.body;
    const product = await saveProduct(productData);
    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
}

// update a product

export async function updateProduct(req, res, next) {
  try {
    const productData = req.body;
    const productId = req.params.id;
    // const files = req.files;
    const product = await productUpdate(productId, productData);

    res.status(200).send(product);
  } catch (err) {
    next(err);
  }
}

// get all products

export async function getAllProduct(req, res, next) {
  try {
    const query = req.query;
    const page = req.query.page;
    const limit = req.query.limit || "10";
    const result = await getAll(page, limit, query);

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

// get filtered product by category

export async function getAllProductBycategory(req, res, next) {
  try {
    const categories = req.query.category;
    const page = req.query.page;
    const limit = req.query.limit || 10;
    const result = await findAllProductByCategory(page, limit, categories);

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

// get single product

export async function getSingleProduct(req, res, next) {
  try {
    const productId = req.params.id;
    const result = await findSingleProduct(productId);

    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}

// delete a product

export async function removeProduct(req, res, next) {
  try {
    const productId = req.params.id;
    const result = await deleteProduct(productId);
    res.status(200).send(result);
  } catch (err) {
    next(err);
  }
}
