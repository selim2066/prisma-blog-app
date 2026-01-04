import express, { NextFunction, Request, Response } from "express";
import { PostController } from "./post.controller";
import {auth} from "../../lib/auth"

const router = express.Router();
const authMiddleware = ()=>{
  return async (req:Request,res:Response,next:NextFunction)=>{
 //headers
 const session = await auth.api.getSession({
      headers:req.headers as any
    });
 next()
}}

router.post("/", authMiddleware(), PostController.createPost);
export const PostRouter = router;