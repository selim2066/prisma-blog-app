const createCommentService = async (payload: {
  postId: string;
  authorId: string;
  content: string;
  parentId?: string;
}) => {
  console.log("create comment service", payload);
};

export const CommentService = {
  createCommentService,
};
