const userTemplates = require('./config/users');

const ClientManager = () => {
  // mapping of all connected clients
  const clients = new Map();

  const addClient = (client) => {
    clients.set(client.id, { client });
  };

  const registerClient = (client, user) => {
    clients.set(client.id, { client, user });
  };

  const removeClient = (client) => {
    clients.delete(client.id);
  };

  const getAvailableUsers = () => {
    const usersTaken = new Set(Array.from(clients.values())
      .filter(c => c.user)
      .map(c => c.user.name));

    return userTemplates
      .filter(u => !usersTaken.has(u.name));
  };

  const isUserAvailable = userName => getAvailableUsers().some(u => u.name === userName);

  const getUserByName = userName => userTemplates.find(u => u.name === userName);

  const getUserByClientId = clientId => (clients.get(clientId) || {}).user;

  return {
    addClient,
    registerClient,
    removeClient,
    getAvailableUsers,
    isUserAvailable,
    getUserByName,
    getUserByClientId,
  };
};

module.exports = ClientManager;
