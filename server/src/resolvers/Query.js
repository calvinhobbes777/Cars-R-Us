const { getUserId } = require("../utils");

const Query = {
  post(parent, { id }, ctx, info) {
    return ctx.db.query.post({ where: { id } }, info);
  },

  posts(parent, args, ctx, info) {
    return ctx.db.query.posts({}, info);
  },

  messages(parent, { where }, ctx, info) {
    return ctx.db.query.messages(where, info);
  },

  messageNotifications(parent, { userId }, ctx, info) {
    return ctx.db.query.posts(
      {
        where: {
          OR: [
            { author: { id: userId } },
            { thread_some: { author: { id: userId } } }
          ]
        }
      },
      info
    );
  },

  me(parent, args, ctx, info) {
    const id = getUserId(ctx);
    return ctx.db.query.user({ where: { id } }, info);
  }
};

module.exports = { Query };
