import bcrypt from "bcryptjs";
import userModel from "../models/userModel.js";
import { StatusCodes } from "http-status-codes";

export const signUp = async (req, res) => {
  try {
    const body = req.body;

    const hashPassword = bcrypt.hashSync(body.password, 12);

    const user = userModel({
      name: body.name,
      email: body.email,
      photo: "default.jpg",
      password: hashPassword,
      role: "manager",    
    }) 

    // payment midtrans

    await user.save();

    return res.status(StatusCodes.CREATED).json({
      message: "Sign up success",
      data: {
        midtrans_url: "https://app.sandbox.midtrans.com/snap/v1/transactions",
      }
    })
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error"
  });
  }
}