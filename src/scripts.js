
/**
 * @description Script related tasks
 */

// Browserify, Browserify-HMR, Babelify, Watchify
module.exports.browserifyAndWatchify = function browserifyAndWatchify(src, dst) {
  var babelify = require('babelify');
  var browserify = require('browserify');
  var browserifyHmr = require('browserify-hmr');
  var gulp = require('gulp');
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
        .pipe(gulp.dest(SCRIPTS_DST));
    };
    var bundler;
    var startTime;

    if (withWatchify) {
      BROWSERIFY_CFG = watchify.args;
    }

    BROWSERIFY_CFG.debug = (process.env.NODE_ENV !== 'production');

    bundler = browserify(SCRIPTS_SRC, BROWSERIFY_CFG);

    if (withWatchify) {
      bundler.plugin(browserifyHmr);
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

  gulp.task('scripts', function scripts() {
    return bundleUsingBrowserify(false);
  });

  gulp.task('scriptsThenWatch', function scriptsThenWatch() {
    return bundleUsingBrowserify(true);
  });
};

// UglifyJS
module.exports.uglify = function uglify(src) {
  var gulp = require('gulp');
  var gulpRename = require('gulp-rename');
  var gulpUglify = require('gulp-uglify');

  var SCRIPTS_SRC = src || './dist/js';

  gulp.task('minifyScripts', function minifyScripts() {
    return gulp.src((SCRIPTS_SRC + '/dist.js'))
      .pipe(gulpUglify({
        mangle: true
      }))
      .pipe(gulpRename('dist.min.js'))
      .pipe(gulp.dest(SCRIPTS_SRC));
  });
};
