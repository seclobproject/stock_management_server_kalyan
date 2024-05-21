import bcrypt from "bcryptjs";
const admin = {
  name: "Admin",
  email: "admin@gmail.com",
  password: bcrypt.hashSync("admin123", 10),
};
export default admin;
