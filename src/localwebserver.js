
/**
 * @description Local web server tasks
 */

module.exports = function localWebServerGulpTasks(config) {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');

  var CONNECT_CFG = config || {};

  gulp.task('connect', function connect() {
    gulpConnect.server(CONNECT_CFG);
  });
};
