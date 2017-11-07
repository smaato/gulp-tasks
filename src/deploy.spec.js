
const deploy = require('../index').deploy;

describe('deploy method', () => {
  it('returns a config and a task', () => {
    const result = deploy({
      bucketName: '-',
    });
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = deploy({
        bucketName: '-',
      });
      expect(result.config).toEqual({
        bucketName: '-',
        folder: undefined,
        headers: undefined,
        src: './dist/**/*.*',
        sync: true,
      });
    });

    it('throws an error when it doesn\'t contain a bucket name', () => {
      expect(() => {
        deploy({
          accessKeyId: '-',
          secretAccessKey: '-',
          src: '/',
        });
      }).toThrowError(
        'Invalid configuration: value of bucketName needs to be an AWS S3 ' +
        'bucket name.'
      );
    });

    it('throws an error when it contains falsy paths', () => {
      expect(() => {
        deploy({
          accessKeyId: '-',
          bucketName: '-',
          secretAccessKey: '-',
          src: false,
        });
      }).toThrowError(
        'Invalid configuration: value of src needs to be a glob or an array ' +
        'of globs.'
      );
    });
  });
});
