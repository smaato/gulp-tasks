
const gulp = require('gulp');
const tests = require('./tests.js');

describe('tests module', () => {
  describe('karma method', () => {
    it('is a function', () => {
      expect(typeof tests.karma).toBe('function');
    });

    it('registers a gulp task', () => {
      tests.karma({
        taskName: 'testsKarmaRegistration',
      });
      expect(gulp.tasks.testsKarmaRegistration).toBeDefined();
    });
  });

  describe('nightwatch method', () => {
    it('is a function', () => {
      expect(typeof tests.nightwatch).toBe('function');
    });

    it('registers 8 gulp tasks', () => {
      tests.nightwatch({
        taskName: 'testsNightwatchRegistration',
      });
      expect(gulp.tasks.testsNightwatchRegistration).toBeDefined();
      expect(gulp.tasks['testsNightwatchRegistration:startConnect']).toBeDefined();
      expect(gulp.tasks['testsNightwatchRegistration:clean']).toBeDefined();
      expect(gulp.tasks['testsNightwatchRegistration:compileTests']).toBeDefined();
      expect(gulp.tasks['testsNightwatchRegistration:addShim']).toBeDefined();
      expect(gulp.tasks['testsNightwatchRegistration:nightwatch']).toBeDefined();
      expect(gulp.tasks['testsNightwatchRegistration:removeShim']).toBeDefined();
      expect(gulp.tasks['testsNightwatchRegistration:stopConnect']).toBeDefined();
    });

    describe('configuration', () => {
      it('throws errors when it contains falsy paths', () => {
        expect(() => {
          return tests.nightwatch({
            connect: false,
          });
        }).toThrow();

        expect(() => {
          return tests.nightwatch({
            dir: false,
          });
        }).toThrow();
      });

      it('doesn\'t throw errors when it contains truthy paths', () => {
        expect(() => {
          tests.nightwatch({
            connect: {
              root: '/',
            },
            dir: '/',
          });
        }).not.toThrow();
      });
    });
  });
});
