import mongoose from "mongoose";
import "dotenv/config";

const connection_string = process.env.MONGODB_URL;

export async function initialize() {
  try {
    await mongoose.connect(connection_string);

    console.log("mongodb connected");
  } catch (err) {
    console.log("mongoDB connection error:", err);
    throw err;
  }
}
