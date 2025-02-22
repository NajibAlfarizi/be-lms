import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";
import TransactionModel from '../models/transactionModel.js';
import { StatusCodes } from "http-status-codes";
import transactionModel from "../models/transactionModel.js";

export const signUp = async (req, res) => {
  const midtransUrl = process.env.MIDTRANS_URL;
  const midtransAuthString = process.env.MIDTRANS_AUTH_STRING;
  const midtransCallBackSuccess = process.env.MIDTRANS_CALLBACK_SUCCESS;

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
    const transaction = new TransactionModel({
      user: user._id,
      price: 280000,
    })

    const midtrans = await fetch(midtransUrl, {
      method: "POST",
      body: JSON.stringify({
        transaction_details: {
          order_id: transaction._id.toString(),
          gross_amount: transaction.price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          email: user.email,
        },
        callbacks: {
          finish: "http://localhost:5173/success-checkout",
        },
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${midtransAuthString}`,
      },
    });

    const resMidtrans = await midtrans.json();

    await user.save();
    await transaction.save();

    return res.status(StatusCodes.CREATED).json({
      message: "Sign up success",
      data: {
        midtrans: resMidtrans.redirect_url,
      }
    })
  } catch (error) {
    console.error(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error"
  });
  }
}

export const signIn = async (req, res) => {
  try {
    const body = req.body;

    const existingUser = await userModel.findOne().where('email').equals(body.email)

    if(!existingUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "User not found",
      })
    }

    const isMatch = await bcrypt.compare(body.password, existingUser.password);

    if(!isMatch){
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "Invalid credentials",
      })
    }

    const isValidUser = await transactionModel.findOne({
      user: existingUser._id,
      status: "success",
    })

    if(existingUser.role === "manager" && !isValidUser) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: "user not verified",
      })
    }

    const token = jwt.sign(
      {
        data: {
          id: existingUser._id.toString(),
        }
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    )

    return res.status(StatusCodes.OK).json({
      message: "Sign in success",
      data: {
        name: existingUser.name,
        email: existingUser.email,
        token,
        role: existingUser.role
      }
    })
  } catch (error) {
    console.log(error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
    })
  }
}