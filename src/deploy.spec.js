
const deploy = require('../index').deploy;

describe('deploy method', () => {
  it('returns a config and a task', () => {
    const result = deploy({
      bucketEnv: 'BUCKET',
    });
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = deploy({
        bucketEnv: 'BUCKET',
      });
      expect(result.config).toEqual({
        src: './dist/**/*.*',
        bucketEnv: 'BUCKET',
      });
    });

    it('throws errors when it contains falsy paths', () => {
      expect(() => {
        return deploy({
          src: false,
          bucketEnv: 'BUCKET',
        });
      }).toThrow();
    });

    it('throws errors when it doesn\'t contain a bucket', () => {
      expect(() => {
        return deploy({
          src: '/',
        });
      }).toThrow();
    });
  });
});
