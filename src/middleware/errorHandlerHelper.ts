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
  }else if(err instanceof Prisma.PrismaClientUnknownRequestError){
    statusCode = 400;
    errorMessage = "Bad Request - Unknown Request Error";
  }else if (err instanceof Prisma.PrismaClientRustPanicError) {
    statusCode = 500;
    errorMessage = "Rust Panic Error : Prisma query engine chrashed";
  }else if (err instanceof Prisma.PrismaClientInitializationError) {
    if(err.errorCode === "P1000"){
      statusCode = 500;
      errorMessage = "Initialization Error : Database connection error, Authentication failed";
    }else if(err.errorCode === "P1001"){
      statusCode = 500;
      errorMessage = "Initialization Error : Database connection error, Database server is not running";
    }else if(err.errorCode === "P1003"){
      statusCode = 500;
      errorMessage = "Initialization Error :  Database does not exist at the provided url";
    }else if(err.errorCode === "P1008"){
      statusCode = 500;
      errorMessage = "Initialization Error :operation timed out after {err.timeout} ms";
    }
  }

  res.status(statusCode);
  res.json({ message: errorMessage, error: err });
}

export default errorHandlerHelper;
