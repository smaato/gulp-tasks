
/**
 * @description Deployment related tasks
 */

module.exports = function deploy(bucketEnv) {
  var gulp = require('gulp');
  var gulpAwspublish = require('gulp-awspublish');
  var minimist = require('minimist');

  var BUCKET_ENV = bucketEnv || 'AWS_S3_BUCKET';

  /**
   * @description AWS S3 deployment task
   * To manually deploy the working copy the following command can be used:
   * gulp awsS3Deploy --accessKeyId=XXX --bucket=XXX --secretAccessKey=XXX
   *
   * The arguments can be provided via the command line as in this example where
   * - accessKeyId is the AWS access key id,
   * - bucket is the AWS S3 bucket and
   * - secretAccessKey is the AWS secret access key.
   *
   * If the arguments are not provided via the command line they will be read
   * from the environment variables
   * - AWS_ACCESS_KEY_ID
   * - AWS_SECRET_ACCESS_KEY
   * - the environment variable for the bucket is set via the bucketEnv argument
   */
  gulp.task('awsS3Deploy', function awsS3Deploy() {
    var commandLineArguments = minimist(process.argv.slice(2));
    var publisher = gulpAwspublish.create({
      accessKeyId: commandLineArguments.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
      params: {
        Bucket: commandLineArguments.bucket || process.env[BUCKET_ENV]
      },
      secretAccessKey: commandLineArguments.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY
    });
    return gulp.src('./dist/**/*.*')
      .pipe(publisher.publish())
      .pipe(publisher.sync())
      .pipe(gulpAwspublish.reporter());
  });
};
