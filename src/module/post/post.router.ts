
import { PostController } from "./post.controller";
import express from "express";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";


const router = express.Router();
router.get("/", PostController.getAllPosts);

router.post("/", authMiddleware(UserRole.USER), PostController.createPost);

router.get("/:id", PostController.getPostById);
router.get("/me/posts", authMiddleware(UserRole.USER), PostController.getMyPostsController);

export const PostRouter = router;
