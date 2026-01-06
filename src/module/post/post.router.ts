
import { PostController } from "./post.controller";
import express from "express";
import { authMiddleware, UserRole } from "../../middleware/authMiddleware";


const router = express.Router();
router.get("/", );

router.post("/", authMiddleware(UserRole.USER), PostController.createPost);

export const PostRouter = router;
