import { NextFunction, Request, Response } from "express";
import { Prisma } from "../../generated/prisma/client";

function errorHandlerHelper(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = err;
  // prisma clientValidation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage =
      "Bad Request - Validation Error : You provided Incorrect field type provided or Missing required field";
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      statusCode = 409;
      errorMessage = "Conflict Error - Unique constraint failed";
    } else if (err.code === "P2025") {
      statusCode = 404;
      errorMessage = "Not Found Error - Required Record not found";
    }
  }

  res.status(statusCode);
  res.json({ message: errorMessage, error: err });
}

export default errorHandlerHelper;
