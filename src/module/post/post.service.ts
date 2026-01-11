import { Post } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

const getAllPosts = async (payload: { search?: string | undefined }) => {
  // Logic to fetch all posts from the database
  const result = await prisma.post.findMany({
    where: {
      OR: [
        { title: { contains: payload.search || "", mode: "insensitive" } },
        { content: { contains: payload.search || "", mode: "insensitive" } },
        { tags: { has: payload.search || "" } },
      ],
    },
  });
  return result;
};

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

export const postService = {
  createPost,
  getAllPosts,
};
