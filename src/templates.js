
/**
 * @description Template related tasks
 */

// Jade
module.exports.jade = (config) => {
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');
  var gulpJade = require('gulp-jade');

  var TEMPLATES_CONFIG = config || {
    dst: './dist',
    src: [
      './src/**/*.jade'
    ]
  };

  if (!TEMPLATES_CONFIG.dst || !TEMPLATES_CONFIG.src) {
    throw new Error('Invalid configuration');
  }

  gulp.task((TEMPLATES_CONFIG.taskName || 'templates'), () => {
    return gulp.src(TEMPLATES_CONFIG.src)
      .pipe(gulpJade({
        locals: {
          DATE_TIME: (new Date().getTime())
        }
      }))
      .pipe(gulp.dest(TEMPLATES_CONFIG.dst))
      .pipe(gulpConnect.reload());
  });
};
