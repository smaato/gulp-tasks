
describe('Templates Gulp Task Module', () => {
  var gulp = require('gulp');
  var runSequence = require('run-sequence');
  var templates = require('./templates.js');

  it('is an object', () => {
    expect(typeof templates).toBe('object');
  });

  describe('Jade Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof templates.jade).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return templates.jade({
          dst: false
        });
      }).toThrow();

      expect(() => {
        return templates.jade({
          src: false
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        templates.jade({
          dst: './shouldNotExist/dist',
          src: './shouldNotExist/src/**/*.jade',
          taskName: 'templatesTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.templatesTest).toBeDefined();
    });

    describe('Jade Gulp Task', () => {
      beforeEach((done) => {
        /*
        The provided done function has to be called to proceed and therefore
        allows to do async operations here
        runSequence runs gulp tasks in order and accepts a callback as the last
        argument which is used to ensure that the gulp task finished before
        assertions are evaluated
        */
        runSequence(
          'templatesTest',
          done
        );
      });

      it('completes successfully', () => {
        expect(gulp.tasks.templatesTest.done).toBe(true);
      });
    });
  });
});
