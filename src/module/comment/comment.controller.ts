import { Request, Response } from "express";
import { CommentService } from "./comment.service";


// !createCommentController
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

// !getCommentbyIdController
const getCommentByIdController = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const resultComment = await CommentService.getCommentById(
      commentId as string
    );
    return res.status(200).json({
      message: "Comment get successfully",
      data: resultComment,
    });
  } catch (error) {
    res.status(400).json({
      error: "commentid get/ fetched failed",
      details: error,
    });
  }
};

//! getCommentsByAuthorID
const getCommentsByAuthorIDController = async(req:Request, res:Response)=>{
  try{
    const {authorId}=req.params
    const resultComment = await CommentService.getCommentsByAuthorId(authorId as string)
    return res.status(200).json({
      message: "Comment get successfully",
      data: resultComment,
    });

  }catch(error){
    res.status(400).json({
      error: "commentid authorid get/ fetched failed",
      details: error,
  })
}}

// !delete comment controller
const deleteCommentController = async(req:Request, res:Response)=>{
  try {
    const {deleteId}=req.params;
    const authorId=req.user?.id;

    const deleteResult = await CommentService.deleteCommentService(deleteId as string, authorId as string)
     return res.status(200).json({
      message: "Comment deleted successfully",
      data: deleteResult,
    });
  } catch (error) {
    res.status(400).json({
      error:"comment deletion failed",
      details:error,
    })
  }
}

export const CommentController = {
  createCommentController,
  getCommentByIdController,
  getCommentsByAuthorIDController,
  deleteCommentController
};
