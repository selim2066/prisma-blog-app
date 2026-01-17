import { CommentStatus } from "../../../generated/prisma/enums";
import { prisma } from "../../lib/prisma";

// !create comment
const createCommentService = async (payload: {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
}) => {
  console.log("create comment service", payload);

  //? condition before creating comment

  // Check if the post exists
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: payload.postId },
  });

  // Check if this comment is a reply
  if (payload.parentId) {
    const parentComment = await prisma.comment.findUniqueOrThrow({
      where: { id: payload.parentId },
    });
  }

  // create comment in database
  return await prisma.comment.create({
    data: payload,
  });
};

// ! get comments by id

const getCommentById = async (id: string) => {
  console.log("comment id: ", id);
  return await prisma.comment.findUnique({
    where: {
      id,
    },
    include: {
      post: { select: { title: true, id: true } },
    },
  });
};

// ! get comments by authorID
const getCommentsByAuthorId = (authorId: string) => {
  return prisma.comment.findMany({
    where: {
      authorId,
    },
    include: {
      post: {
        select: {
          title: true,
          id: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

//! delete comment
const deleteCommentService = async (commentId: string, authorId: string) => {
  console.log("delete id ", commentId, authorId);
  // find the comment
  const commentData = await prisma.comment.findUniqueOrThrow({
    where: {
      id: commentId,
      authorId,
    },
  });

  // delete the comment
  return await prisma.comment.delete({
    where:{
      id: commentData.id,
    }
  })
};

// ! update comment service

const updateCommentService = async (
  commentId: string,
  authorId: string, data: { content: string }
) => {
  // find the comment}
  const commentData = await prisma.comment.findUniqueOrThrow({
    where:{
      id: commentId,
      authorId,
    }
  });
  // update the comment
  return await prisma.comment.update({
    where:{
      id: commentData.id,
    },
    data,
  })
  //console.log(data, commentId, authorId)
}

// ! moderate comment service by admin
const moderateCommentService = async (commentId:string, data:{status: CommentStatus})=>{
  //console.log(commentId, data)
  await prisma.comment.findUniqueOrThrow({
    where:{
      id: commentId,
    }
  })
  return await prisma.comment.update({
    where:{
      id: commentId,
    },
    data
  })
}

export const CommentService = {
  createCommentService,
  getCommentById,
  getCommentsByAuthorId,
  deleteCommentService,
  updateCommentService,
  moderateCommentService
};
