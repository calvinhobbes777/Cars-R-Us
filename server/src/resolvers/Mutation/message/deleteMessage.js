const { getUserId } = require("../../../utils");

module.exports = async function(parent, { id }, ctx, info) {
  const userId = getUserId(ctx);
  const messageExists = await ctx.db.exists.Message({
    id,
    author: { id: userId }
  });
  if (!messageExists) {
    throw new Error(`Post not found or you're not the author`);
  }

  return ctx.db.mutation.deleteMessage({ where: { id } });
};
