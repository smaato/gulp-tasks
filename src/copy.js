
const gulp = require('gulp');
const gulpConnect = require('gulp-connect');

module.exports = customConfig => {
  const config = Object.assign({
    src: './src/assets/**/*',
    dst: './dist/assets',
  }, customConfig);

  if (!config.src) {
    throw new Error('Invalid configuration: value of src needs to be a glob or an array of globs.');
  }

  if (!config.dst) {
    throw new Error('Invalid configuration: value of dst needs to be a path.');
  }

  // Copy and trigger live reload.
  function copy() {
    return gulp
      .src(config.src)
      .pipe(gulp.dest(config.dst))
      .pipe(gulpConnect.reload());
  }

  return {
    task: copy,
    config,
  };
};
