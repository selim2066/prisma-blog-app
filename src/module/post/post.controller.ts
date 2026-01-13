import { Request, Response } from "express";
import { PostStatus } from "../../../generated/prisma/enums";
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

    const status = req.query.status as PostStatus | undefined;

    //!pagination

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    // console.log(page,limit,skip)

    const sortBy = req.query.sortBy as string | undefined;
    const sortOrder = req.query.sortOrder as "asc" | "desc" | undefined;


    //! enum validation (status)
    // const allowedStatus = ["DRAFT", "PUBLISHED"] as const;

    // const status =
    //   typeof req.query.status === "string" &&
    //   allowedStatus.includes(req.query.status as any) ? (req.query.status as (typeof allowedStatus)[number])
    //     : undefined;

    const result = await postService.getAllPosts({
      search: searchString,
      tags,
      isFeatured,
      status,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
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
