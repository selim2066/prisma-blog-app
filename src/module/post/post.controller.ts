import { Request, Response } from "express";
import { postService } from "./post.service";

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const search = req.query.search;
    const tags = (req.query.tags as string)?.split(",") || [];
    const searchString = typeof search === "string" ? search : undefined;
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;

    //console.log(typeof search, search)
    const result = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch posts",
      details: error,
    });
  }
};

const createPost = async (req: Request, res: Response) => {
  try {
    //console.log(req.user)
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const result = await postService.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      error: "post creation failed",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
};
