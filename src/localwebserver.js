
/**
 * @description Local web server tasks
 */

// Connect
module.exports.connect = (config) => {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');

  var CONNECT_CONFIG = Object.assign({
    taskName: 'serveLocally'
  }, config);

  gulp.task(CONNECT_CONFIG.taskName, () => {
    gulpConnect.server(CONNECT_CONFIG);
  });
};
