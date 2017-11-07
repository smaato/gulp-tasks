
const gulp = require('gulp');
const gulpAwspublish = require('gulp-awspublish');
const gulpIf = require('gulp-if');
const gulpRename = require('gulp-rename');

module.exports = (customConfig) => {
  const config = Object.assign({
    bucketName: undefined,
    folder: undefined,
    headers: undefined,
    src: './dist/**/*.*',
    sync: true,
  }, customConfig);

  if (!config.bucketName) {
    throw new Error(
      'Invalid configuration: value of bucketName needs to be an AWS S3 ' +
      'bucket name.'
    );
  }

  if (!config.src) {
    throw new Error(
      'Invalid configuration: value of src needs to be a glob or an array ' +
      'of globs.'
    );
  }

  // Deploy to an AWS S3 bucket.
  function deploy() {
    const publisher = gulpAwspublish.create({
      params: {
        Bucket: config.bucketName,
      },
    });

    return gulp.src(config.src)
      .pipe(gulpIf(Boolean(config.folder), gulpRename((path) => {
        // Prepend the folder to all source files
        path.dirname = `${config.folder}/${path.dirname}`;// eslint-disable-line no-param-reassign
      })))
      .pipe(publisher.publish(config.headers))
      // publisher.sync() deletes all other files than the uploaded
      .pipe(gulpIf(config.sync, publisher.sync()))
      .pipe(gulpAwspublish.reporter());
  }

  return {
    task: deploy,
    config,
  };
};
