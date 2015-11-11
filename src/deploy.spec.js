
const gulp = require('gulp');
const deploy = require('./deploy.js');

describe('deploy module', () => {
  describe('awsS3 method', () => {
    it('is a function', () => {
      expect(typeof deploy.awsS3).toBe('function');
    });

    it('registers a gulp task', () => {
      deploy.awsS3({
        taskName: 'deployAws3GulpTaskRegistration',
      });
      expect(gulp.tasks.deployAws3GulpTaskRegistration).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          return deploy.awsS3({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          deploy.awsS3({
            src: '/',
          });
        }).not.toThrow();
      });
    });
  });
});
