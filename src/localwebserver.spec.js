
describe('Local Web Server Gulp Task Module', () => {
  var gulp = require('gulp');
  var localWebServer = require('./localwebserver.js');

  it('is an object', () => {
    expect(typeof localWebServer).toBe('object');
  });

  describe('Connect Gulp Task Declaration', () => {
    it('is a function', () => {
      expect(typeof localWebServer.connect).toBe('function');
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        localWebServer.connect({
          taskName: 'localWebServerTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.localWebServerTest).toBeDefined();
    });
  });
});
