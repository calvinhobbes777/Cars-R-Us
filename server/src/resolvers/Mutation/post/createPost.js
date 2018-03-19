const { getUserId } = require("../../../utils");

module.exports = async function(parent, { newPost }, ctx, info) {
  const userId = getUserId(ctx);
  return ctx.db.mutation.createPost(
    {
      data: {
        ...newPost,
        images: { set: newPost.images },
        author: { connect: { id: userId } }
      }
    },
    info
  );
};
