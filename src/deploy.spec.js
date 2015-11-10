
describe('Deploy Gulp Task Module', () => {
  const deploy = require('./deploy.js');
  const gulp = require('gulp');

  it('is an object', () => {
    expect(typeof deploy).toBe('object');
  });

  describe('AWS S3 Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof deploy.awsS3).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return deploy.awsS3({
          src: false,
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        deploy.awsS3({
          bucketEnv: 'SHOULD_NOT_EXIST',
          src: './shouldNotExist/dist/**/*.*',
          taskName: 'deployTest',
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.deployTest).toBeDefined();
    });
  });
});
