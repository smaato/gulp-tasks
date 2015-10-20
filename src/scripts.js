
/**
 * @description Script related tasks
 */

module.exports = function scripts(src, dst) {
  var babelify = require('babelify');
  var browserify = require('browserify');
  var gulp = require('gulp');
  var gulpConnect = require('gulp-connect');
  var gulpRename = require('gulp-rename');
  var gulpUglify = require('gulp-uglify');
  var gulpUtil = require('gulp-util');
  var vinylSourceStream = require('vinyl-source-stream');
  var watchify = require('watchify');

  var BROWSERIFY_CFG = {};
  var SCRIPTS_DST = dst || './dist/js';
  var SCRIPTS_SRC = src || '';

  function bundleUsingBrowserify(withWatchify) {
    /*
    Watchify, a watch mode for browserify builds, will be enabled if
    withWatchify is true. The task will not exit and if a source file is changed
    the browserify bundler will emit an update event and the scripts will be
    rewritten. Since the browserify bundler is changed incrementally it is much
    faster than creating a new browserify bundler.
    If withWatchify is false the scripts will only be written once and the task
    will exit.
    */
    var writeScriptsFromBundle = function writeScriptsFromBundle(bundle) {
      return bundle
        .pipe(vinylSourceStream('dist.js'))
        .pipe(gulp.dest(SCRIPTS_DST))
        .pipe(gulpConnect.reload());
    };
    var bundler;
    var startTime;

    if (withWatchify) {
      BROWSERIFY_CFG = watchify.args;
    }

    BROWSERIFY_CFG.debug = !process.env.GULP_IS_PRODUCTION;

    bundler = browserify(SCRIPTS_SRC, BROWSERIFY_CFG);

    if (withWatchify) {
      bundler = watchify(bundler);
    }

    bundler.transform(babelify);

    if (withWatchify) {
      bundler.on('update', function update() {
        gulpUtil.log('Starting to update scripts');
        startTime = (new Date().getTime());

        writeScriptsFromBundle(bundler.bundle())
          .on('end', function end() {
            gulpUtil.log('Finished updating scripts after', ((new Date().getTime()) - startTime), 'ms');
          });
      });
    }

    return writeScriptsFromBundle(bundler.bundle());
  }

  gulp.task('browserifyScripts', function browserifyScripts() {
    return bundleUsingBrowserify(false);
  });

  gulp.task('browserifyScriptsAndWatch', function browserifyScriptsAndWatch() {
    return bundleUsingBrowserify(true);
  });

  gulp.task('minifyJs', function minifyJs() {
    return gulp.src((SCRIPTS_DST + '/dist.js'))
      .pipe(gulpUglify({
        mangle: true
      }))
      .pipe(gulpRename('dist.min.js'))
      .pipe(gulp.dest(SCRIPTS_DST));
  });
};
