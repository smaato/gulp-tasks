
describe('Deploy Gulp Task Collection', () => {
  var deployGulpTaskCollection = require('./deploy.js');
  var gulp = require('gulp');

  it('can be imported', () => {
    expect(deployGulpTaskCollection).toBeDefined();
  });

  describe('AWS S3 Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(deployGulpTaskCollection.awsS3).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return deployGulpTaskCollection.awsS3({});
      }).toThrow();

      expect(() => {
        return deployGulpTaskCollection.awsS3({
          bucketEnv: 'AWS_S3_BUCKET'
        });
      }).toThrow();
    });

    it('can be called without a configuration', () => {
      expect(deployGulpTaskCollection.awsS3).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.deploy).toBeDefined();
    });
  });
});
