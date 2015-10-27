
describe('Tests Gulp Task Collection', () => {
  var gulp = require('gulp');
  var testsGulpTaskCollection = require('./tests.js');

  it('can be imported', () => {
    expect(testsGulpTaskCollection).toBeDefined();
  });

  describe('Karma Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(testsGulpTaskCollection.karma).toBeDefined();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        testsGulpTaskCollection.karma({
          taskName: 'unitTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.unitTest).toBeDefined();
    });
  });

  describe('Nightwatch Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(testsGulpTaskCollection.nightwatch).toBeDefined();
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return testsGulpTaskCollection.nightwatch({});
      }).toThrow();

      expect(() => {
        return testsGulpTaskCollection.nightwatch({
          connect: {
            root: './shouldNotExist/dist'
          }
        });
      }).toThrow();

      expect(() => {
        return testsGulpTaskCollection.nightwatch({
          dir: './shouldNotExist/e2e/'
        });
      }).toThrow();

      expect(() => {
        return testsGulpTaskCollection.nightwatch({
          shim: '<script></script>'
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        testsGulpTaskCollection.nightwatch({
          connect: {
            root: './shouldNotExist/dist'
          },
          dir: './shouldNotExist/e2e/',
          shim: '<script></script>',
          taskName: 'e2eTest'
        });
      }).not.toThrow();
    });

    it('registers eight gulp tasks', () => {
      expect(gulp.tasks.e2eTest).toBeDefined();
      expect(gulp.tasks['e2eTest:startConnect']).toBeDefined();
      expect(gulp.tasks['e2eTest:clean']).toBeDefined();
      expect(gulp.tasks['e2eTest:compileTests']).toBeDefined();
      expect(gulp.tasks['e2eTest:addShim']).toBeDefined();
      expect(gulp.tasks['e2eTest:nightwatch']).toBeDefined();
      expect(gulp.tasks['e2eTest:removeShim']).toBeDefined();
      expect(gulp.tasks['e2eTest:stopConnect']).toBeDefined();
    });
  });
});
