import { StatusCodes } from "http-status-codes";
import transactionModel from "../models/transactionModel.js";

export const handlePayment = async (req, res) => {
  try {
    const body = req.body;

    const orderId = body.order_id;

    switch (body.transaction_status) {
      case "capture":
      case "settlement":
        await transactionModel.findByIdAndUpdate(orderId, {
          status: "success",
        });
        break;

      case "deny":
      case "cancel":
      case "expire":
      case "failure":
        await transactionModel.findByIdAndUpdate(orderId, {
          status: "failed",
        });
        break;
      default:
        break;
    }

    return res.status(StatusCodes.OK).json({
      message: "Success",
      data: {}
    })
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error"
    });
  }
}