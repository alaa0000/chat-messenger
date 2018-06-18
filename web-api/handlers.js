function makeHandleEvent(client, clientManager, chatroomManager) {
  const ensureExists = (getter, rejectionMessage) =>
    new Promise(((resolve, reject) => {
      const res = getter();
      return res
        ? resolve(res)
        : reject(rejectionMessage);
    }));

  const ensureUserSelected = clientId =>
    ensureExists(
      () => clientManager.getUserByClientId(clientId),
      'select user first',
    );

  const ensureValidChatroom = chatroomName =>
    ensureExists(
      () => chatroomManager.getChatroomByName(chatroomName),
      `invalid chatroom name: ${chatroomName}`,
    );

  const ensureValidChatroomAndUserSelected = chatroomName =>
    Promise.all([
      ensureValidChatroom(chatroomName),
      ensureUserSelected(client.id),
    ])
      .then(([chatroom, user]) => Promise.resolve({ chatroom, user }));

  const handleEvent = (chatroomName, createEntry) =>
    ensureValidChatroomAndUserSelected(chatroomName)
      .then(({ chatroom, user }) => {
        // append event to chat history
        const entry = { user, ...createEntry() };
        chatroom.addEntry(entry);

        // notify other clients in chatroom
        chatroom.broadcastMessage({ chat: chatroomName, ...entry });
        return chatroom;
      });

  return handleEvent;
}

const handler = (client, clientManager, chatroomManager) => {
  const handleEvent = makeHandleEvent(client, clientManager, chatroomManager);

  const handleRegister = (userName, callback) => {
    if (!clientManager.isUserAvailable(userName)) { return callback('user is not available'); }

    const user = clientManager.getUserByName(userName);
    clientManager.registerClient(client, user);

    return callback(null, user);
  };

  const handleJoin = (chatroomName, callback) => {
    const createEntry = () => ({ event: `joined ${chatroomName}` });

    handleEvent(chatroomName, createEntry)
      .then((chatroom) => {
        // add member to chatroom
        chatroom.addUser(client);

        // send chat history to client
        callback(null, chatroom.getChatHistory());
      })
      .catch(callback);
  };

  const handleLeave = (chatroomName, callback) => {
    const createEntry = () => ({ event: `left ${chatroomName}` });

    handleEvent(chatroomName, createEntry)
      .then((chatroom) => {
        // remove member from chatroom
        chatroom.removeUser(client.id);

        callback(null);
      })
      .catch(callback);
  };

  const handleMessage = ({ chatroomName, message } = {}, callback) => {
    const createEntry = () => ({ message });

    handleEvent(chatroomName, createEntry)
      .then(() => callback(null))
      .catch(callback);
  };

  const handleGetChatrooms = (_, callback) =>
    callback(null, chatroomManager.serializeChatrooms());

  const handleGetAvailableUsers = (_, callback) =>
    callback(null, clientManager.getAvailableUsers());

  const handleDisconnect = () => {
    // remove user profile
    clientManager.removeClient(client);
    // remove member from all chatrooms
    chatroomManager.removeClient(client);
  };

  return {
    handleRegister,
    handleJoin,
    handleLeave,
    handleMessage,
    handleGetChatrooms,
    handleGetAvailableUsers,
    handleDisconnect,
  };
};

module.exports = handler;
