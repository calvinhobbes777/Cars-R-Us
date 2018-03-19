const { getUserId } = require("../../../utils");

module.exports = async function(parent, { id }, ctx, info) {
  const userId = getUserId(ctx);
  const postExists = await ctx.db.exists.Post({
    id,
    author: { id: userId }
  });
  if (!postExists) {
    throw new Error(`Post not found or you're not the author`);
  }

  await ctx.db.mutation.deleteManyMessages({ where: { post: { id } }, info });

  return ctx.db.mutation.deletePost({ where: { id } }, info);
};
