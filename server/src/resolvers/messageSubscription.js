module.exports = async function(parent, { where }, ctx, info) {
  return ctx.db.subscription.message(where, info);
};
