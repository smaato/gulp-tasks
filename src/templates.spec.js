
const gulp = require('gulp');
const runSequence = require('run-sequence');
const templates = require('./templates.js');

describe('templates module', () => {
  describe('jade method', () => {
    it('is a function', () => {
      expect(typeof templates.jade).toBe('function');
    });

    it('registers a gulp task', () => {
      templates.jade({
        taskName: 'templatesJadeRegistration',
      });
      expect(gulp.tasks.templatesJadeRegistration).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          return templates.jade({
            dst: false,
          });
        }).toThrow();

        expect(() => {
          return templates.jade({
            src: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          templates.jade({
            dst: '/',
            src: '/',
          });
        }).not.toThrow();
      });
    });

    describe('gulp task', () => {
      it('completes successfully', (done) => {
        templates.jade({
          taskName: 'templatesJadeGulpTask',
        });
        /**
         * Because the Gulp task is async, we need to use runSequence to execute
         * the task and then call the `done` async callback.
         */
        runSequence('templatesJadeGulpTask', () => {
          expect(gulp.tasks.templatesJadeGulpTask.done).toBe(true);
          done();
        });
      });
    });
  });
});
