const createMessage = require("./createMessage");
const deleteMessage = require("./deleteMessage");
const updateMessage = require("./updateMessage");

const message = {
  createMessage,
  deleteMessage,
  updateMessage
};

module.exports = { message };
