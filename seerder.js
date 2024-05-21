import { initialize } from "./config/dbConnection.js";
import admin from "./data/admin.data.js";
import User from "./models/userModel.js";
await initialize();
const importData = async () => {
  try {
    await User.deleteMany();
    const createdAdmin = await User.insertMany(admin);
    console.log("Data cleared and Imported");
    process.exit();
  } catch (error) {
    console.error(`${error}`);
    process.exit(1);
  }
};
if (process.argv[2] === "-id") {
  destroyData();
} else {
  importData();
}
