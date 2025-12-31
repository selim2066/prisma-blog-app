import { Request, Response } from "express";

const createPost = async (req:Request, res:Response) =>{
  
  // Logic to create a new post
  res.status(201).send("Post created by Selim");
  console.log(req.body)

}

export const PostController = {
  createPost
}