
/**
 * @description Script related tasks
 */

// Browserify, Browserify-HMR, Babelify, Watchify
module.exports.browserifyAndWatchify = (config) => {
  var babelify = require('babelify');
  var browserify = require('browserify');
  var browserifyHmr = require('browserify-hmr');
  var gulp = require('gulp');
  var gulpUtil = require('gulp-util');
  var vinylSourceStream = require('vinyl-source-stream');
  var watchify = require('watchify');

  var BROWSERIFY_CONFIG = {};
  var SCRIPTS_CONFIG = config || {
    dst: './dist/js',
    src: './src/index.js'
  };

  if (!SCRIPTS_CONFIG.dst || !SCRIPTS_CONFIG.src) {
    throw new Error('Invalid configuration');
  }

  var bundleUsingBrowserify = (withWatchify) => {
    /*
    Watchify, a watch mode for browserify builds, will be enabled if
    withWatchify is true. The task will not exit and if a source file is changed
    the browserify bundler will emit an update event and the scripts will be
    rewritten. Since the browserify bundler is changed incrementally it is much
    faster than creating a new browserify bundler.
    If withWatchify is false the scripts will only be written once and the task
    will exit.
    */
    var writeScriptsFromBundle = (bundle) => {
      return bundle
        .pipe(vinylSourceStream('dist.js'))
        .pipe(gulp.dest(SCRIPTS_CONFIG.dst));
    };
    var bundler;
    var startTime;

    if (withWatchify) {
      BROWSERIFY_CONFIG = watchify.args;
    }

    BROWSERIFY_CONFIG.debug = (process.env.NODE_ENV !== 'production');

    bundler = browserify(SCRIPTS_CONFIG.src, BROWSERIFY_CONFIG);

    if (withWatchify) {
      bundler.plugin(browserifyHmr);
      bundler = watchify(bundler);
    }

    bundler.transform(babelify);

    if (withWatchify) {
      bundler.on('update', () => {
        gulpUtil.log('Starting to update scripts');
        startTime = (new Date().getTime());

        writeScriptsFromBundle(bundler.bundle())
          .on('end', () => {
            gulpUtil.log('Finished updating scripts after', ((new Date().getTime()) - startTime), 'ms');
          });
      });
    }

    return writeScriptsFromBundle(bundler.bundle());
  };

  gulp.task((SCRIPTS_CONFIG.taskName || 'scripts'), () => {
    return bundleUsingBrowserify(false);
  });

  gulp.task(((SCRIPTS_CONFIG.taskName + 'ThenWatch') || 'scriptsThenWatch'), () => {
    return bundleUsingBrowserify(true);
  });
};

// UglifyJS
module.exports.uglify = (config) => {
  var gulp = require('gulp');
  var gulpRename = require('gulp-rename');
  var gulpUglify = require('gulp-uglify');

  var SCRIPTS_CONFIG = config || {
    src: './dist/js'
  };

  if (!SCRIPTS_CONFIG.src) {
    throw new Error('Invalid configuration');
  }

  gulp.task((SCRIPTS_CONFIG.taskName || 'minifyScripts'), () => {
    return gulp.src((SCRIPTS_CONFIG.src + '/dist.js'))
      .pipe(gulpUglify({
        mangle: true
      }))
      .pipe(gulpRename('dist.min.js'))
      .pipe(gulp.dest(SCRIPTS_CONFIG.src));
  });
};
