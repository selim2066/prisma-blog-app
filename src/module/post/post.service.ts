import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

// !create post
const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  // Logic to create a new post in the database
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

// !get all posts
const getAllPosts = async (payload: {
  search?: string | undefined;
  tags?: string[];
  isFeatured?: boolean | undefined;
  status?: PostStatus | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string | undefined;
}) => {
  // Logic to fetch all posts from the database
  const {
    search,
    tags,
    isFeatured,
    status,
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  } = payload;
  const andFilters: PostWhereInput[] = [];

  // tags filter
  if (tags && tags.length > 0) {
    andFilters.push({
      tags: { hasEvery: tags || [] },
    });
  }

  // SEARCH FILTER (OR)
  if (search) {
    andFilters.push({
      OR: [
        { title: { contains: search, mode: "insensitive" } },
        { content: { contains: search, mode: "insensitive" } },
        // { tags: { has: search } },
      ],
    });
  }
  // isFeatured filter
  if (typeof isFeatured === "boolean") {
    andFilters.push({ isFeatured });
  }

  // status filter
  if (status) {
    andFilters.push({ status });
  }

  const allpost = await prisma.post.findMany({
    take: limit,
    skip: skip,
    where: {
      AND: andFilters,
    },
    orderBy: {
      [sortBy]: sortOrder,
    },
  });

  const totalPosts = await prisma.post.count({
    where: {
      AND: andFilters,
    },
  });
  return {
    data: allpost,
    pagination: {
      totalPosts,
      page,
      limit,
      totalPages: Math.ceil(totalPosts / limit),
    },
  };
};

// ! get post by id
const getPostById = async (postId: string | undefined) => {
  console.log(`get post by id ${postId}`);
  if (!postId) {
    throw new Error("Post ID is required");
  }
  //  transaction and rollback

  return await prisma.$transaction(async (tx) => {
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: { increment: 1 },
      },
    });

    const post = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: true,
      }
    });
    return post;
  });
};

export const postService = {
  createPost,
  getAllPosts,
  getPostById,
};
