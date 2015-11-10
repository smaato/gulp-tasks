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
 * '../src/task-name' you would write 'gulp-tasks/task-name'.
 */

const assets = require('../src/assets');
// const deploy = require('../src/deploy');
const lint = require('../src/lint');
const localWebServer = require('../src/localWebServer');
const scripts = require('../src/scripts');
const styles = require('../src/styles');
const templates = require('../src/templates');
const tests = require('../src/tests');

/**
 * Source constants.
 */

const SOURCE_DIR = './src';
const ASSETS_SRC = [
  `${SOURCE_DIR}/assets/**/*`, // UI Framework assets
];
const STYLES_SRC = `${SOURCE_DIR}/**/*.scss`;
const TEMPLATES_SRC = `${SOURCE_DIR}/index.jade`;

/**
 * Distribution constants.
 */

const DISTRIBUTION_DIR = './dist';
const SCRIPTS_DST = `${DISTRIBUTION_DIR}/js`;
const STYLES_DST = `${DISTRIBUTION_DIR}/css`;

/**
 * Copy files.
 */

assets.copy({
  taskName: 'demoCopyAssets',
  dst: './dist/assets',
  src: ASSETS_SRC,
});

/**
 * Deploy to AWS.
 */

// TODO: Create a bucket for testing deployment with this repo.
// deploy.awsS3({
//   taskName: 'deploy',
//   bucketEnv: 'AWS_BUCKET_BUYER_TOOLS',
//   src: './dist/**/*.*'
// });

/**
 * Serve files to localhost.
 */

localWebServer.connect({
  taskName: 'demoServeLocally',
  fallback: `${DISTRIBUTION_DIR}/index.html`,
  livereload: true,
  port: 8002,
  root: DISTRIBUTION_DIR,
});

/**
 * Lint with ES6 rules.
 */

lint.eslint({
  taskName: 'demoLintJs',
  src: [
    './src/**/*.js',
  ],
});

/**
 * Compile JS.
 */

scripts.browserifyAndWatchify({
  taskName: 'demoCompileJs',
  dst: SCRIPTS_DST,
  src: './src/index.js',
});

/**
 * Minify JS.
 */

scripts.uglify({
  taskName: 'demoMinifyJs',
  src: SCRIPTS_DST,
});

/**
 * Compile CSS.
 */

styles.compassAndPostcss({
  taskName: 'demoCompileCss',
  dst: STYLES_DST,
  src: STYLES_SRC,
  compassImportPath: '../node_modules',
});

/**
 * Minify CSS.
 */

styles.minifyCss({
  taskName: 'demoMinifyCss',
  src: STYLES_DST,
});

/**
 * Compile HTML from Jade templates.
 */

templates.jade({
  taskName: 'demoCompileHtml',
  dst: DISTRIBUTION_DIR,
  src: TEMPLATES_SRC,
});

/**
 *  Run unit tests.
 */

tests.karma({
  taskName: 'demoTestUnits',
  configFile: `${__dirname}/karma.conf.js`,
  singleRun: true,
});

/**
 *  Run e2e tests.
 */

const karmaPhantomJsShimScript =
  fs.readFileSync('../node_modules/karma-phantomjs-shim/shim.js');
tests.nightwatch({
  taskName: 'demoTestE2e',
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

gulp.task('demoWatch', [
  'demoServeLocally',
  'demoCompileHtml',
  'demoCopyAssets',
  'demoCompileCss',
  'demoCompileJsThenWatch',
], () => {
  gulp.watch([TEMPLATES_SRC], ['demoCompileHtml']);
  gulp.watch([ASSETS_SRC], ['demoCopyAssets']);
  gulp.watch([STYLES_SRC], ['demoCompileCss']);
});

gulp.task('default', () => {
  process.env.NODE_ENV = 'developmentWithHmr';
  gulp.start('demoWatch');
});
