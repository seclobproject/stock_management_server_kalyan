import mongoose from "mongoose";

const Schema = mongoose.Schema;

const franchiseSchema = new Schema(
  {
    franchiseName: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Franchise = mongoose.model("Franchise", franchiseSchema);
export default Franchise;
