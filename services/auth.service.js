import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { HttpException } from "../exceptions/exceptions.js";

export async function userLogin(loginData) {
  const findUser = await userModel.findOne({ email: loginData.email });
  if (!findUser)
    throw new HttpException(404, "username or password is invalid");

  const validpassword = await bcrypt.compare(
    loginData.password,
    findUser.password
  );

  if (!validpassword)
    throw new HttpException(404, "username or password is invalid");

  const token = jwt.sign({ _id: findUser._id }, process.env.TOKEN_KEY);
  return { token };
}
