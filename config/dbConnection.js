import mongoose from "mongoose";
import "dotenv/config";

const connection_string = "mongodb://127.0.0.1/product_manage_seclob";

export async function initialize() {
  try {
    await mongoose.connect(connection_string);

    console.log("mongodb connected");
  } catch (err) {
    console.log("mongoDB connection error:", err);
    throw err;
  }
}
