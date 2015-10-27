
describe('Templates Gulp Task Collection', () => {
  var gulp = require('gulp');
  var runSequence = require('run-sequence');
  var templatesGulpTaskCollection = require('./templates.js');

  it('can be imported', () => {
    expect(templatesGulpTaskCollection).toBeDefined();
  });

  describe('Jade Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(templatesGulpTaskCollection.jade).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return templatesGulpTaskCollection.jade({});
      }).toThrow();

      expect(() => {
        return templatesGulpTaskCollection.jade({
          dst: './dist'
        });
      }).toThrow();

      expect(() => {
        return templatesGulpTaskCollection.jade({
          src: [
            './src/**/*.jade'
          ]
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        templatesGulpTaskCollection.jade({
          dst: './dist',
          src: [
            './src/**/*.jade'
          ],
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

      it('can be executed', () => {
        expect(gulp.tasks.templatesTest.done).toBe(true);
      });
    });
  });
});
