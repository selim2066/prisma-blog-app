import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createCommentController = async(req:Request, res:Response) => {

  try {
    req.body.authorId = req.user?.id;
    const resultComment = await CommentService.createCommentService(req.body);
    
  } catch (error) {
    res.status(400).json({
      error: "comment creation failed",
      details: error,
    });
  }

}

export const CommentController = {
    createCommentController
}