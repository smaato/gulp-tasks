
const gulp = require('gulp');
const runSequence = require('run-sequence');
const rimraf = require('rimraf');
const lstat = require('fs').lstat;
const copy = require('../index').copy;

describe('copy method', () => {
  it('returns a config and a task', () => {
    const result = copy();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = copy();
      expect(result.config).toEqual({
        src: './src/assets/**/*',
        dst: './dist/assets',
      });
    });

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
  });

  describe('gulp task', () => {
    beforeEach(done => {
      // rm -rf the dist folder.
      rimraf('./demo/dist', done);
    });

    it('recurisvely copies the paths matching the src glob to the dst directory', (done) => {
      gulp.task('testCopy', copy({
        taskName: 'assetsCopyGulpTask',
        src: './demo/src/assets/**/*',
        dst: './demo/dist/assets',
      }).task);

      /**
       * Because the Gulp task is async, we need to use runSequence to execute
       * the task and then call the `done` async callback.
       */
      runSequence('testCopy', () => {
        expect(gulp.tasks.testCopy.done).toBe(true);
        lstat('./demo/dist/assets/images/playful_kitten.jpg', (err, stats) => {
          if (err) throw err;
          expect(stats.isFile()).toBe(true);
          done();
        });
      });
    });
  });
});
