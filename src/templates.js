
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
    src: []
  };

  gulp.task('templates', () => {
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
