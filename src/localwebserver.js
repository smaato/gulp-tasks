
/**
 * @description Local web server tasks
 */

// Connect
module.exports.connect = (config) => {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');

  var CONNECT_CONFIG = config || {};

  gulp.task('serveLocally', () => {
    gulpConnect.server(CONNECT_CONFIG);
  });
};
