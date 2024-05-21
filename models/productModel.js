Schema.Types.ObjectId;
import mongoose, { Schema, model } from "mongoose";

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    productCode: {
      type: String,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
      dafault: 0,
    },
    category: {
      categoryId: {
        type: String,
        ref: "Category",
      },
      categoryName: {
        type: String,
      },
    },
    franchise: {
      franchiseId: {
        type: String,
        ref: "Category",
      },
      franchiseName: {
        type: String,
      },
    },
    stock: [
      {
        storeId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Store",
        },
        quantity: Number,
      },
    ],
    totalPrice: {
      type: Number,
      dafault: 0,
    },
  },
  { timestamps: true }
);

const Product = model("Product", productSchema);

export default Product;
