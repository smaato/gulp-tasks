
const karmaServer = require('karma').Server;

module.exports = (customConfig) => {
  const config = Object.assign({
    singleRun: true,
  }, customConfig);

  // Run unit tests with Karma.
  function testUnit(callback) {
    return karmaServer.start(config, (exitStatus) => {
      if (exitStatus) {
        throw new Error('Unit testing failed');
      } else {
        callback(exitStatus);
      }
    });
  }

  return {
    task: testUnit,
    config,
  };
};
