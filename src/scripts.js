'use strict'; // eslint-disable-line strict

/**
 * @description Script related tasks
 */

// Browserify, Browserify-HMR, Babelify, Watchify
module.exports.browserifyAndWatchify = (config) => {
  const babelify = require('babelify');
  const browserify = require('browserify');
  const browserifyHmr = require('browserify-hmr');
  const gulp = require('gulp');
  const gulpUtil = require('gulp-util');
  const vinylSourceStream = require('vinyl-source-stream');
  const watchify = require('watchify');

  let BROWSERIFY_CONFIG = {};
  const SCRIPTS_CONFIG = Object.assign({
    dst: './dist/js',
    src: './src/index.js',
    taskName: 'scripts',
  }, config);

  if (!SCRIPTS_CONFIG.dst || !SCRIPTS_CONFIG.src) {
    throw new Error('Invalid configuration: value of dst needs to be a path and value of src needs to be a glob or an array of globs.');
  }

  const bundleUsingBrowserify = (withWatchify) => {
    /*
    Watchify, a watch mode for browserify builds, will be enabled if
    withWatchify is true. The task will not exit and if a source file is changed
    the browserify bundler will emit an update event and the scripts will be
    rewritten. Since the browserify bundler is changed incrementally it is much
    faster than creating a new browserify bundler.
    If withWatchify is false the scripts will only be written once and the task
    will exit.
    */
    const writeScriptsFromBundle = (bundle) => {
      return bundle
        .pipe(vinylSourceStream('dist.js'))
        .pipe(gulp.dest(SCRIPTS_CONFIG.dst));
    };

    if (withWatchify) {
      BROWSERIFY_CONFIG = watchify.args;
    }

    BROWSERIFY_CONFIG.debug = (process.env.NODE_ENV !== 'production');

    let bundler = browserify(SCRIPTS_CONFIG.src, BROWSERIFY_CONFIG);

    if (withWatchify) {
      bundler.plugin(browserifyHmr);
      bundler = watchify(bundler);
    }

    bundler.transform(babelify);

    if (withWatchify) {
      bundler.on('update', () => {
        gulpUtil.log('Starting to update scripts');
        const startTime = (new Date().getTime());

        writeScriptsFromBundle(bundler.bundle())
          .on('end', () => {
            gulpUtil.log('Finished updating scripts after', ((new Date().getTime()) - startTime), 'ms');
          });
      });
    }

    return writeScriptsFromBundle(bundler.bundle());
  };

  gulp.task(SCRIPTS_CONFIG.taskName, () => {
    return bundleUsingBrowserify(false);
  });

  gulp.task((SCRIPTS_CONFIG.taskName + 'ThenWatch'), () => {
    return bundleUsingBrowserify(true);
  });
};

// UglifyJS
module.exports.uglify = (config) => {
  const gulp = require('gulp');
  const gulpRename = require('gulp-rename');
  const gulpUglify = require('gulp-uglify');

  const SCRIPTS_CONFIG = Object.assign({
    src: './dist/js',
    taskName: 'minifyScripts',
  }, config);

  if (!SCRIPTS_CONFIG.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  gulp.task(SCRIPTS_CONFIG.taskName, () => {
    return gulp.src((SCRIPTS_CONFIG.src + '/dist.js'))
      .pipe(gulpUglify({
        mangle: true,
      }))
      .pipe(gulpRename('dist.min.js'))
      .pipe(gulp.dest(SCRIPTS_CONFIG.src));
  });
};
