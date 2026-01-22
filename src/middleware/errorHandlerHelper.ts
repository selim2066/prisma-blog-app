import { NextFunction, Request, Response } from "express";

function errorHandlerHelper(err: any, req: Request, res: Response, next: NextFunction) {

  res.status(500)
  res.json({ message: "Internal Server Error from errorHandlerHelper",
    error: err })
}

export default errorHandlerHelper;