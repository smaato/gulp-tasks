
const serve = require('../index').serve;

describe('serve method', () => {
  it('returns a config and a task', () => {
    const result = serve();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = serve();
      expect(result.config).toEqual({
        root: './dist',
        fallback: './dist/index.html',
        port: 8000,
        livereload: true,
      });
    });
  });
});
