
import { PostController } from "./post.controller";
import express from "express";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";


const router = express.Router();
router.get("/", PostController.getAllPosts);

router.post("/", authMiddleware(UserRole.USER, UserRole.ADMIN), PostController.createPost);

router.get("/my-posts", authMiddleware(UserRole.USER,UserRole.ADMIN), PostController.getMyPostsController);
router.get("/stats", authMiddleware(UserRole.ADMIN), PostController.getStatsController);
// always dynamic route at the end
router.get("/:id", PostController.getPostById);
router.patch("/:postId", authMiddleware(UserRole.USER,UserRole.ADMIN), PostController.updatePostController);
router.delete("/:postId", authMiddleware(UserRole.USER,UserRole.ADMIN), PostController.deletePostController);
export const PostRouter = router;
