
const WebSocketServer = require('ws').Server;

const cssWebSocketServer = {

  instance: null,

  start: (port) => {
    if (cssWebSocketServer.instance) return;

    cssWebSocketServer.instance = new WebSocketServer({
      port,
    });
  },

  stop: () => {
    if (cssWebSocketServer.instance) {
      cssWebSocketServer.instance.close();
    }
  },

};

module.exports = cssWebSocketServer;
