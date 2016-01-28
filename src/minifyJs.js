
const gulp = require('gulp');
const gulpRename = require('gulp-rename');
const gulpUglify = require('gulp-uglify');

module.exports = customConfig => {
  const config = Object.assign({
    src: './dist/js',
    dropConsole: true,
    mangle: true,
  }, customConfig);

  if (!config.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  // Use uglify to minify the JS.
  function minifyJs() {
    return gulp.src(`${config.src}/dist.js`)
      .pipe(gulpUglify({
        compress: {
          drop_console: config.dropConsole,
        },
        mangle: config.mangle,
      }))
      .pipe(gulpRename('dist.min.js'))
      .pipe(gulp.dest(config.src));
  }

  return {
    task: minifyJs,
    config,
  };
};
