
const Server = require('karma').Server;

module.exports = (customConfig) => {
  const config = Object.assign({
    singleRun: true,
  }, customConfig);

  // Run unit tests with Karma.
  function testUnit(callback) {
    const server = new Server(config, (exitStatus) => {
      if (exitStatus) {
        throw new Error('Unit testing failed');
      } else {
        callback(exitStatus);
      }
    });

    server.start();

    return server;
  }

  return {
    task: testUnit,
    config,
  };
};
