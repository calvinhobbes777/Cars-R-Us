const { getUserId } = require("../../../utils");

module.exports = async function(parent, { newMessage, postId }, ctx, info) {
  const userId = getUserId(ctx);
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
