const { getUserId } = require("../../../utils");

module.exports = async function(
  parent,
  { updateMessage, messageId },
  ctx,
  info
) {
  const userId = getUserId(ctx);
  const message = await ctx.db.exists.Message({
    id: messageId,
    author: { id: userId }
  });

  if (!message) {
    throw new Error("NOT AUTHORIZED!!!!!!");
  }
  return ctx.db.mutation.updateMessage(
    {
      where: { id: messageId },
      data: {
        ...updateMessage
      }
    },
    info
  );
};
