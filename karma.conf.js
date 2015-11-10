
const istanbul = require('browserify-istanbul');  // eslint-disable-line no-unused-vars

module.exports = (config) => {
  config.set({
    frameworks: [
      'phantomjs-shim',
      'browserify',
      'jasmine',
    ],
    basePath: '',
    // Specify the JS to compile to create a functioning test environment.
    files: [
      // For a React project, you will need these dependencies.
      // 'node_modules/react/dist/react-with-addons.js',
      // 'node_modules/babel-core/browser-polyfill.js',
      // 'demoSrc/**/*.jsx',
      'demoSrc/**/*.js',
    ],
    exclude: [
      // For a React project, you will have a root file which you'll want to
      // exclude since it will include the browser-polyfill mentioned above,
      // and only one instance of it is allowed.
      // 'demo/index.jsx'
    ],
    browsers: ['PhantomJS'],
    // The reporters with which to surface test results.
    reporters: [
      'dots',
      'coverage',
      'junit',
    ],
    coverageReporter: {
      dir: 'reports/coverage',
    },
    junitReporter: {
      outputDir: 'reports/karma',
    },
    // Specify preprocessors through which files should be run, excluding test
    // files.
    preprocessors: {
      // For a React project you will need to preprocess JSX files, too.
      // 'demoSrc/**/*.jsx': ['browserify'],
      'demoSrc/**/*.js': ['browserify'],
    },
    // Configuration for the above `browserify` preprocessor.
    browserify: {
      debug: true,
      transform: ['babelify', 'browserify-istanbul'],
    },
  });
};
