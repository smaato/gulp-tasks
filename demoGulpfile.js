/**
 * Demo Gulpfile
 *
 * You can refer to this Gulpfile to learn how to use this repo in your projects.
 * Feel free to copy and paste this file and customize it.
 */

/**
 * You'll need to require these dependencies in your project's Gulpfile.
 */

const fs = require('fs');

/**
 * Here's how you can require individual tasks into your Gulpfile. Instead of
 * './src/task-name' you would write 'gulp-tasks/task-name'.
 */

const assets = require('./src/assets');
// const deploy = require('./src/deploy');
const lint = require('./src/lint');
const localWebServer = require('./src/localWebServer');
const scripts = require('./src/scripts');
const styles = require('./src/styles');
const templates = require('./src/templates');
const tests = require('./src/tests');

/**
 * Source constants.
 */

const SOURCE_DIR = './demoSrc';
const ASSETS_SRC = [
  `${SOURCE_DIR}/assets/**/*`, // UI Framework assets
];
const STYLES_SRC = `${SOURCE_DIR}/**/*.scss`;
const TEMPLATES_SRC = `${SOURCE_DIR}/index.jade`;

/**
 * Distribution constants.
 */

const DISTRIBUTION_DIR = './demoDist';
const SCRIPTS_DST = `${DISTRIBUTION_DIR}/js`;
const STYLES_DST = `${DISTRIBUTION_DIR}/css`;

/**
 * Copy files.
 */

assets.copy({
  taskName: 'copyAssets',
  dst: './demoDist/assets',
  src: ASSETS_SRC,
});

/**
 * Deploy to AWS.
 */

// TODO: Create a bucket for testing deployment with this repo.
// deploy.awsS3({
//   taskName: 'deploy',
//   bucketEnv: 'AWS_BUCKET_BUYER_TOOLS',
//   src: './demoDist/**/*.*'
// });

/**
 * Serve files to localhost.
 */

localWebServer.connect({
  taskName: 'serveLocally',
  fallback: `${DISTRIBUTION_DIR}/index.html`,
  livereload: true,
  port: 8002,
  root: DISTRIBUTION_DIR,
});

/**
 * Lint with ES6 rules.
 */

lint.eslint({
  taskName: 'lintJs',
  src: [
    './demoSrc/**/*.js',
  ],
});

/**
 * Compile JS.
 */

scripts.browserifyAndWatchify({
  taskName: 'compileJs',
  dst: SCRIPTS_DST,
  src: './demoSrc/index.js',
});

/**
 * Minify JS.
 */

scripts.uglify({
  taskName: 'minifyJs',
  src: SCRIPTS_DST,
});

/**
 * Compile CSS.
 */

styles.compassAndPostcss({
  taskName: 'compileCss',
  dst: STYLES_DST,
  src: STYLES_SRC,
});

/**
 * Minify CSS.
 */

styles.minifyCss({
  taskName: 'minifyCss',
  src: STYLES_DST,
});

/**
 * Compile HTML from Jade templates.
 */

templates.jade({
  taskName: 'compileHtml',
  dst: DISTRIBUTION_DIR,
  src: TEMPLATES_SRC,
});

/**
 *  Run unit tests.
 */

tests.karma({
  taskName: 'testUnits',
  configFile: `${__dirname}/karma.conf.js`,
  singleRun: true,
});

/**
 *  Run e2e tests.
 */

const karmaPhantomJsShimScript =
  fs.readFileSync('./node_modules/karma-phantomjs-shim/shim.js');
tests.nightwatch({
  taskName: 'testE2e',
  connect: {
    fallback: `${DISTRIBUTION_DIR}/index.html`,
    port: 9000,
    root: DISTRIBUTION_DIR,
  },
  dir: './tests-e2e/',
  shim: (`<script>${karmaPhantomJsShimScript}</script>`),
});

/**
 *  Compile everything and start watching for changes.
 */

const gulp = require('gulp');

gulp.task('watch', [
  'serveLocally',
  'compileHtml',
  'copyAssets',
  'compileCss',
  'compileJsThenWatch',
], () => {
  gulp.watch([TEMPLATES_SRC], ['compileHtml']);
  gulp.watch([ASSETS_SRC], ['copyAssets']);
  gulp.watch([STYLES_SRC], ['compileCss']);
});

gulp.task('default', () => {
  process.env.NODE_ENV = 'developmentWithHmr';
  gulp.start('watch');
});
