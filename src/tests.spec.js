
describe('Tests Gulp Task Module', () => {
  var gulp = require('gulp');
  var tests = require('./tests.js');

  it('is an object', () => {
    expect(typeof tests).toBe('object');
  });

  describe('Karma Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof tests.karma).toBe('function');
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        tests.karma({
          taskName: 'unitTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.unitTest).toBeDefined();
    });
  });

  describe('Nightwatch Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof tests.nightwatch).toBe('function');
    });

    it('can not be called with an invalid configuration', () => {
      expect(() => {
        return tests.nightwatch({
          connect: false
        });
      }).toThrow();

      expect(() => {
        return tests.nightwatch({
          dir: false
        });
      }).toThrow();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        tests.nightwatch({
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
