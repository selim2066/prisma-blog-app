import express, { Router } from "express";
import { CommentController } from "./comment.controller";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";
const router = express.Router();

router.post('/', authMiddleware(UserRole.ADMIN, UserRole.USER), CommentController.createCommentController)
router.get('/:commentId', CommentController.getCommentByIdController)
router.get('/author/:authorId', CommentController.getCommentsByAuthorIDController)
router.delete('/:deleteId', authMiddleware(UserRole.ADMIN, UserRole.USER), CommentController.deleteCommentController)
router.patch('/:commentId', authMiddleware(UserRole.ADMIN, UserRole.USER), CommentController.updateCommentController)
router.patch('/moderate/:commentId', authMiddleware(UserRole.ADMIN),CommentController.moderateCommentController)

export const CommentRouter: Router = router;