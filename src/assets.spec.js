
describe('Assets Gulp Task Module', () => {
  const assets = require('./assets.js');
  const gulp = require('gulp');
  const runSequence = require('run-sequence');

  it('is an object', () => {
    expect(typeof assets).toBe('object');
  });

  describe('Copy Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof assets.copy).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return assets.copy({
          dst: false,
        });
      }).toThrow();

      expect(() => {
        return assets.copy({
          src: false,
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        assets.copy({
          dst: './shouldNotExist/dist/assets',
          src: './shouldNotExist/src/assets/**/*',
          taskName: 'assetsTest',
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.assetsTest).toBeDefined();
    });

    describe('Copy Gulp Task', () => {
      beforeEach((done) => {
        /*
        The provided done function has to be called to proceed and therefore
        allows to do async operations here
        runSequence runs gulp tasks in order and accepts a callback as the last
        argument which is used to ensure that the gulp task finished before
        assertions are evaluated
        */
        runSequence(
          'assetsTest',
          done
        );
      });

      it('completes successfully', () => {
        expect(gulp.tasks.assetsTest.done).toBe(true);
      });
    });
  });
});
