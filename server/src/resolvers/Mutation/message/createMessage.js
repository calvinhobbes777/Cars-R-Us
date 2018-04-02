const { getUserId } = require("../../../utils");

module.exports = async function(parent, { newMessage, postId }, ctx, info) {
  const userId = getUserId(ctx);
  await ctx.db.mutation.updatePost({
    where: { id: postId },
    data: { dummy: "dummy" }
  });

  return ctx.db.mutation.createMessage(
    {
      data: {
        ...newMessage,
        author: { connect: { id: userId } },
        post: { connect: { id: postId } }
      }
    },
    info
  );
};
