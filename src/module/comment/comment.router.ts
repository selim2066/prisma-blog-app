import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";
const router = express.Router();

router.post('/', authMiddleware(UserRole.ADMIN, UserRole.USER), CommentController.createCommentController)
router.get('/:commentId', CommentController.getCommentByIdController)
router.get('/author/:authorId', CommentController.getCommentsByAuthorIDController)

export const CommentRouter: Router = router;