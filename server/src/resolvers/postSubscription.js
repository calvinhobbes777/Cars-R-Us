module.exports = async function(
  parent,
  { PostSubscriptionWhereInput },
  ctx,
  info
) {
  return ctx.db.subscription.post(PostSubscriptionWhereInput, info);
};
