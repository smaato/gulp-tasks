
/**
 * @description Local web server tasks
 */

// Connect
module.exports.connect = function connect(config) {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');

  var CONNECT_CFG = config || {};

  gulp.task('serveLocally', function serveLocally() {
    gulpConnect.server(CONNECT_CFG);
  });
};
