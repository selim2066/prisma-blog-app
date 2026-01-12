import { Post, PostStatus } from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const getAllPosts = async (payload: {
  search?: string | undefined;
  tags?: string[]; isFeatured?: boolean | undefined;
  status?: PostStatus | undefined;
}) => {
  // Logic to fetch all posts from the database
  const { search, tags, isFeatured, status } = payload;
  const andFilters:PostWhereInput[] = [];


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
if(typeof isFeatured === 'boolean'){
  andFilters.push({isFeatured})
}

// status filter
if(status){
  andFilters.push({status})
}

  const result = await prisma.post.findMany({
    where: {
      AND: andFilters,
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
