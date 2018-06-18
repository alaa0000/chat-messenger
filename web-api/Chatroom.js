const Chatroom = ({ name, image }) => {
  const members = new Map();
  let chatHistory = [];

  const broadcastMessage = (message) => {
    members.forEach(m => m.emit('message', message));
  };

  const addEntry = (entry) => {
    chatHistory = chatHistory.concat(entry);
  };

  const getChatHistory = () => chatHistory.slice();

  const addUser = (client) => {
    members.set(client.id, client);
  };

  const removeUser = (client) => {
    members.delete(client.id);
  };

  const serialize = () => ({
    name,
    image,
    numMembers: members.size,
  });

  return {
    broadcastMessage,
    addEntry,
    getChatHistory,
    addUser,
    removeUser,
    serialize,
  };
};

module.exports = Chatroom;
