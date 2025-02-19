import { StatusCodes } from "http-status-codes";
import { ZodError } from "zod";

export const validateRequest = (schema) => async (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    if(error instanceof ZodError) {
      const errorMessages = error.issues.map((err => err.message));

      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error : "Invalid request",
        details : errorMessages,
      });
    }

    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
      error: "Internal server error",
    });
  }
}