
/**
 * @description Local web server tasks
 */

// Connect
module.exports.connect = (config) => {
  const gulp = require('gulp');
  const gulpConnect = require('gulp-connect');

  const CONNECT_CONFIG = Object.assign({
    taskName: 'serveLocally',
  }, config);

  gulp.task(CONNECT_CONFIG.taskName, () => {
    gulpConnect.server(CONNECT_CONFIG);
  });
};
