
const WebSocketServer = require('ws').Server;

const server = {

  instance: null,

  start: (port) => {
    if (server.instance) return;

    server.instance = new WebSocketServer({
      port,
    });
  },

  stop: () => {
    if (!server.instance) return;

    server.instance.close();
  },

  sendUpdate: () => {
    if (!server.instance || !server.instance.clients) return;

    // In case site is opened in a number of browsers/tabs/windows
    // there will be many clients connected.
    // Send an update to all of them.
    server.instance.clients.forEach(
      (client) => {
        client.send();
      }
    );
  },

};

module.exports = server;
