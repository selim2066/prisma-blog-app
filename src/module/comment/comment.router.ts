import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";
const router = express.Router();

router.post('/', authMiddleware(UserRole.ADMIN, UserRole.USER), CommentController.createCommentController)

export const CommentRouter: Router = router;