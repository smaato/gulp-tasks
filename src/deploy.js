
const gulp = require('gulp');
const gulpAwspublish = require('gulp-awspublish');
const gulpIf = require('gulp-if');
const gulpRename = require('gulp-rename');
const TextUtils = require('./services/TextUtils');

module.exports = customConfig => {
  const config = Object.assign({
    accessKeyId: undefined,
    bucketName: undefined,
    folder: undefined,
    secretAccessKey: undefined,
    src: './dist/**/*.*',
    sync: true,
  }, customConfig);

  if (!config.accessKeyId) {
    throw new Error(
      'Invalid configuration: value of accessKeyId needs to be a string.'
    );
  }

  if (!config.bucketName) {
    throw new Error(TextUtils.cleanString(
      `Invalid configuration: value of bucketName needs to be an AWS S3
      bucket name.`
    ));
  }

  if (!config.secretAccessKey) {
    throw new Error(
      'Invalid configuration: value of secretAccessKey needs to be a string.'
    );
  }

  if (!config.src) {
    throw new Error(TextUtils.cleanString(
      `Invalid configuration: value of src needs to be a glob or an array
      of globs.`
    ));
  }

  // Deploy to an AWS S3 bucket.
  function deploy() {
    const publisher = gulpAwspublish.create({
      params: {
        Bucket: config.bucketName,
      },
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    });

    return gulp.src(config.src)
      .pipe(gulpIf(Boolean(config.folder), gulpRename(path => {
        // Prepend the folder to all source files
        /* eslint-disable no-param-reassign */
        path.dirname = `${config.folder}/${path.dirname}`;
        /* eslint-enable no-param-reassign */
      })))
      .pipe(publisher.publish())
      // publisher.sync() deletes all other files than the uploaded
      .pipe(gulpIf(config.sync, publisher.sync()))
      .pipe(gulpAwspublish.reporter());
  }

  return {
    task: deploy,
    config,
  };
};
