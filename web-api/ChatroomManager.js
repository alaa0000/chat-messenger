const Chatroom = require('./Chatroom');
const chatroomTemplates = require('./config/chatrooms');

const ChatroomManager = () => {
  // mapping of all available chatrooms
  const chatrooms = new Map(chatroomTemplates.map(c => [
    c.name,
    Chatroom(c),
  ]));

  const removeClient = (client) => {
    chatrooms.forEach(c => c.removeUser(client));
  };

  const getChatroomByName = chatroomName => chatrooms.get(chatroomName);

  const serializeChatrooms = () => Array.from(chatrooms.values()).map(c => c.serialize());

  return {
    removeClient,
    getChatroomByName,
    serializeChatrooms,
  };
};

module.exports = ChatroomManager;
