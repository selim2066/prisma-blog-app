import { Request, Response } from "express";
import { CommentService } from "./comment.service";

const createCommentController = async (req: Request, res: Response) => {
  try {
    req.body.authorId = req.user?.id; //!how i get user id from auth middleware
    const resultComment = await CommentService.createCommentService(req.body);
    return res.status(201).json({
      message: "Comment created successfully",
      data: resultComment,
    });
  } catch (error) {
    res.status(400).json({
      error: "comment creation failed",
      details: error,
    });
  }
};

export const CommentController = {
  createCommentController,
};
