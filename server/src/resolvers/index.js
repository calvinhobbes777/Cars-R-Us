const { Query } = require("./Query");
const { auth } = require("./Mutation/auth");
const { post } = require("./Mutation/post");
const { message } = require("./Mutation/message");
const postSubscription = require("./postSubscription");
const messageSubscription = require("./messageSubscription");

const { AuthPayload } = require("./AuthPayload");

module.exports = {
  Query,
  Mutation: {
    ...auth,
    ...post,
    ...message
  },
  Subscription: {
    post: {
      subscribe: postSubscription
    },
    message: {
      subscribe: messageSubscription
    }
  },
  AuthPayload
};
