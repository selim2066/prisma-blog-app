import { prisma } from "../../lib/prisma";

const createCommentService = async (payload: {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
}) => {
  console.log("create comment service", payload);

  // condition before creating comment
  // Check if the post exists
  const post = await prisma.post.findUniqueOrThrow({
    where: { id: payload.postId },
  });
  

  // Check if this comment is a reply
  if(payload.parentId){
    const parentComment = await prisma.comment.findUniqueOrThrow({
      where: {id: payload.parentId}
    })
  }

  // create comment in database
  return await prisma.comment.create({
    data:payload
  })
};

export const CommentService = {
  createCommentService,
};
