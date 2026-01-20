import { Request, Response } from "express";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/paginationSortingHelpers";
import { postService } from "./post.service";

// ! createPost controller
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

// ! ## getAllPosts controller
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

    // 🔥 NEW: authorId from query
    const authorId =
      typeof req.query.authorId === "string" ? req.query.authorId : undefined;

    //!pagination

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    //! enum validation (status)
    // const allowedStatus = ["DRAFT", "PUBLISHED"] as const;

    // const status =
    //   typeof req.query.status === "string" &&
    //   allowedStatus.includes(req.query.status as any) ? (req.query.status as (typeof allowedStatus)[number])
    //     : undefined;

    const result = await postService.getAllPosts({
      authorId,
      search: searchString,
      tags,
      isFeatured,
      status,
      page,
      limit,
      skip,
      sortBy,
      sortOrder
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch posts",
      details: error,
    });
  }
};

// ! get post by id controller

const getPostById = async (req: Request, res: Response) => {
  try {
    const postId = req.params.id;
    const result = await postService.getPostById(postId);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch post",
      details: error,
    });
  }
};

// ! get my posts controller

const getMyPostsController = async (req: Request, res: Response) => {
  try {
    const authorId = req.user?.id;
    if (!authorId) {
      throw new Error("User ID not found in request");
    }
    //console.log(authorId)
    const result = await postService.getMyPosts(authorId as string);
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      error: "Failed to fetch post",
      details: error,
    });
  }
};

export const PostController = {
  createPost,
  getAllPosts,
  getPostById,
  getMyPostsController,
};
