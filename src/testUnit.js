
const karmaServer = require('karma').Server;

module.exports = (customConfig) => {
  const config = Object.assign({
    singleRun: true,
  }, customConfig);

  // Run unit tests with Karma.
  function testUnit() {
    return karmaServer.start(config, (exitStatus) => {
      if (exitStatus) {
        throw new Error('Unit testing failed');
      }
    });
  }

  return {
    task: testUnit,
    config,
  };
};
