const { getUserId } = require("../../../utils");

module.exports = async function(parent, { updatePost, postId }, ctx, info) {
  const userId = getUserId(ctx);
  const post = await ctx.db.exists.Post({
    id: postId,
    author: { id: userId }
  });

  if (!post) {
    throw new Error("NOT AUTHORIZED!!!!!!");
  }
  return ctx.db.mutation.updatePost(
    {
      where: { id: postId },
      data: {
        ...updatePost,
        images: { set: updatePost.images }
      }
    },
    info
  );
};
