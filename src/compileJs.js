'use strict'; // eslint-disable-line strict

const babelify = require('babelify');
const browserify = require('browserify');
const browserifyHmr = require('browserify-hmr');
const fs  = require('fs');
const gulp = require('gulp');
const gulpUtil = require('gulp-util');
const mkdirp = require('mkdirp');
const path  = require('path');
const vinylSourceStream = require('vinyl-source-stream');
const watchify = require('watchify');

module.exports = customConfig => {
  const config = Object.assign({
    src: './src/index.js',
    dst: './dist/js',
    watch: false,
    hmrPort: 3123,
  }, customConfig);

  if (!config.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
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
  browserifyConfig.debug = (process.env.NODE_ENV !== 'production');

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

  // CSS WebSocket Client Side /// START

  // Basically that's the way to pass config arguments to client side

  // This file is like a template for future JS file
  const lines = fs.readFileSync(__dirname + '/cssWebSocketClientSide.txt')
    .toString()
    .split('\n');

  function writeLines(fd) {
    const line = lines.shift();

    // Here the variables from config are supplied to final JS
    // TODO: path styles wsPort and css dist to compileJs
    const lineReplaced = line.toString()
      .replace('#cssHref', '/css/dist.css')
      .replace('#port', 4000)
      .concat('\n');

    fs.writeSync(fd, lineReplaced);

    if (lines.length > 0) {
      writeLines(fd);
    }
  }

  const packageRoot = path.join(
    // Relative to the folder this file/module is in
    __dirname,
    '..'
  );

  const cssWebSocketFolder = path.join(
    packageRoot,
    'dist/js'
  );

  mkdirp.sync(cssWebSocketFolder);

  const cssWebSocketFile = path.join(
    cssWebSocketFolder,
    'cssWebSocketClientSide.js'
  );

  // This creates JS file from template
  fs.open(cssWebSocketFile, 'w', (err, fd) => {
    writeLines(fd);
  });

  // Here the configured JS is added to bundle
  bundler.add(cssWebSocketFile);

  // CSS WebSocket Client Side /// END

  // Compile the JS, using the bundle.
  function compileJs() {
    const bundle = bundler.bundle();
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
