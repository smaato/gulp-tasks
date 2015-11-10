
const gulp = require('gulp');
const assets = require('./assets.js');
const runSequence = require('run-sequence');

describe('assets module', () => {
  describe('copy method', () => {
    it('is a function', () => {
      expect(typeof assets.copy).toBe('function');
    });

    it('registers a gulp task', () => {
      assets.copy({
        taskName: 'assetsCopyGulpTaskRegistration',
      });
      expect(gulp.tasks.assetsCopyGulpTaskRegistration).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          assets.copy({
            dst: false,
          });
        }).toThrow();

        expect(() => {
          assets.copy({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          assets.copy({
            dst: '/',
          });
        }).not.toThrow();

        expect(() => {
          assets.copy({
            src: '/',
          });
        }).not.toThrow();
      });
    });

    describe('gulp task', () => {
      it('completes successfully', (done) => {
        assets.copy({
          taskName: 'assetsCopyGulpTask',
        });
        /**
         * Because the Gulp task is async, we need to use runSequence to execute
         * the task and then call the `done` async callback.
         */
        runSequence('assetsCopyGulpTask', () => {
          expect(gulp.tasks.assetsCopyGulpTask.done).toBe(true);
          done();
        });
      });
    });
  });
});
