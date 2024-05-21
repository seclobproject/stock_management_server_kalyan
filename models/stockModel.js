import mongoose from "mongoose";

const Schema = mongoose.Schema;

const stockSchema = new Schema(
  {
    product: {
      productName: {
        type: String,
        ref: "Product",
      },
      productId: {
        type: String,
        ref: "Product",
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
    franchise: {
      franchiseId: {
        type: String,
        ref: "Franchise",
      },
      franchiseName: {
        type: String,
      },
    },
    partyName: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Stock = mongoose.model("Stock", stockSchema);
export default Stock;
