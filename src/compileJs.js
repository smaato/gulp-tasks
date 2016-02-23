'use strict'; // eslint-disable-line strict

const babelify = require('babelify');
const browserify = require('browserify');
const browserifyHmr = require('browserify-hmr');
const cssWsConfigureClient = require('./cssWebsocket/configureClient');
const cssWsServer = require('./cssWebsocket/server');
const envify = require('envify');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const vinylSourceStream = require('vinyl-source-stream');
const watchify = require('watchify');
const TextUtils = require('./services/TextUtils');

module.exports = customConfig => {
  const config = Object.assign({
    src: './src/index.js',
    dst: './dist/js',
    watch: false,
    makeSourceMaps: true,
    hmrPort: 3123,
    cssReloadPort: 4000,
    cssReloadPath: '/css/dist.css',
  }, customConfig);

  if (!config.src) {
    throw new Error(TextUtils.cleanString(
      `Invalid configuration: value of src needs to be a glob or an array
      of globs.`
    ));
  }

  if (!config.dst) {
    throw new Error('Invalid configuration: value of dst needs to be a path.');
  }

  /**
   * Browserify, Browserify-HMR, Babelify, optionally Watchify.
   *
   * Watchify, a watch mode for browserify builds, will be enabled if
   * config.watch is true. The task will not exit and if a source file is changed
   * the browserify bundler will emit an update event and the scripts will be
   * rewritten. Since the browserify bundler is changed incrementally it is much
   * faster than creating a new browserify bundler.
   *
   * If config.watch is false the scripts will only be written once and the task
   * will exit.
   */

  // Configure browserify.
  let browserifyConfig = {};
  if (config.watch) {
    browserifyConfig = watchify.args;
  }
  browserifyConfig.debug = config.makeSourceMaps;

  // Build bundle with browserify configuration.
  let bundler = browserify(config.src, browserifyConfig);
  if (config.watch) {
    bundler.plugin(browserifyHmr, {
      // Start HMR on this port
      port: config.hmrPort,
      // Tell client side the url of HMR server
      url: `http://localhost:${config.hmrPort}`,
    });
    bundler = watchify(bundler);
  }
  bundler.transform(babelify);
  bundler.transform(envify);

  if (config.watch) {
    cssWsConfigureClient(config.cssReloadPort, config.cssReloadPath);
    bundler.add(`${__dirname}/cssWebsocket/client.js`);
  }

  // Compile the JS, using the bundle.
  function compileJs() {
    const bundle = bundler.bundle();
    if (config.watch) {
      cssWsServer.start(config.cssReloadPort);
    }
    return bundle
      .on('error', function onCompileJsError(error) {
        gulpUtil.log(gulpUtil.colors.red(error.message));
        this.emit('end');
      })
      .pipe(vinylSourceStream('dist.js'))
      .pipe(gulp.dest(config.dst));
  }

  // Start watching.
  if (config.watch) {
    bundler.on('update', () => {
      gulpUtil.log('Starting to update scripts');
      const startTime = new Date().getTime();

      compileJs()
        .on('end', () => {
          const timeElapsedMs = new Date().getTime() - startTime;
          gulpUtil.log('Finished updating scripts after', timeElapsedMs, 'ms');
        });
    });
  }

  return {
    task: compileJs,
    config,
  };
};
