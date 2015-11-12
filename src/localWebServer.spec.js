
const gulp = require('gulp');
const localWebServer = require('./localWebServer.js');

describe('localWebServer module', () => {
  describe('connect method', () => {
    it('is a function', () => {
      expect(typeof localWebServer.connect).toBe('function');
    });

    it('registers a gulp task', () => {
      localWebServer.connect({
        taskName: 'localWebServerConnectRegistration',
      });
      expect(gulp.tasks.localWebServerConnectRegistration).toBeDefined();
    });
  });
});
