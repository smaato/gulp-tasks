
describe('Local Web Server Gulp Task Collection', () => {
  var gulp = require('gulp');
  var localWebServerGulpTaskCollection = require('./localwebserver.js');

  it('can be imported', () => {
    expect(localWebServerGulpTaskCollection).toBeDefined();
  });

  describe('Connect Gulp Task Declaration', () => {
    it('is defined', () => {
      expect(localWebServerGulpTaskCollection.connect).toBeDefined();
    });

    it('can be called with a valid configuration', () => {
      expect(() => {
        localWebServerGulpTaskCollection.connect({
          taskName: 'localWebServerTest'
        });
      }).not.toThrow();
    });

    it('registers a gulp task', () => {
      expect(gulp.tasks.localWebServerTest).toBeDefined();
    });
  });
});
