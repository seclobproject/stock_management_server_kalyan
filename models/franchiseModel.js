import mongoose from "mongoose";

const Schema = mongoose.Schema;

const franchiseSchema = new Schema(
  {
    franchiseName: {
      type: String,
      required: true,
      unique: true,
    },
    stock: [
      {
        product: {
          productId: {
            type: String,
            ref: "Product",
          },
          productName: {
            type: String,
          },
          productCode: {
            type: String,
          },
          quantity: {
            type: Number,
          },
        },
        
      },
    ],
  },

  {
    timestamps: true,
  }
);

const Franchise = mongoose.model("Franchise", franchiseSchema);
export default Franchise;
