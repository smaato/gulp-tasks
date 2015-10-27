
/**
 * @description Asset related tasks
 */

// Copy and trigger live reload
module.exports.copy = (config) => {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');

  var ASSETS_CONFIG = config || {
    dst: './dist/assets',
    src: [
      './src/assets/**/*'
    ]
  };

  if (!ASSETS_CONFIG.dst || !ASSETS_CONFIG.src) {
    throw new Error('Invalid configuration');
  }

  gulp.task((ASSETS_CONFIG.taskName || 'assets'), () => {
    return gulp
      .src(ASSETS_CONFIG.src)
      .pipe(gulp.dest(ASSETS_CONFIG.dst))
      .pipe(gulpConnect.reload());
  });
};
