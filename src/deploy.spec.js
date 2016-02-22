
const deploy = require('../index').deploy;
const TextUtils = require('./services/TextUtils');

describe('deploy method', () => {
  it('returns a config and a task', () => {
    const result = deploy({
      accessKeyId: '-',
      bucketName: '-',
      secretAccessKey: '-',
    });
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = deploy({
        accessKeyId: '-',
        bucketName: '-',
        secretAccessKey: '-',
      });
      expect(result.config).toEqual({
        accessKeyId: '-',
        bucketName: '-',
        folder: undefined,
        secretAccessKey: '-',
        src: './dist/**/*.*',
        sync: true,
      });
    });

    it('throws an error when it doesn\'t contain an access key ID', () => {
      expect(() => {
        deploy({
          bucketName: '-',
          secretAccessKey: '-',
          src: '/',
        });
      }).toThrowError(
        'Invalid configuration: value of accessKeyId needs to be a string.'
      );
    });

    it('throws an error when it doesn\'t contain a bucket name', () => {
      expect(() => {
        deploy({
          accessKeyId: '-',
          secretAccessKey: '-',
          src: '/',
        });
      }).toThrowError(TextUtils.cleanString(
        `Invalid configuration: value of bucketName needs to be an AWS S3
        bucket name.`
      ));
    });

    it('throws an error when it doesn\'t contain a secret access key', () => {
      expect(() => {
        deploy({
          accessKeyId: '-',
          bucketName: '-',
          src: '/',
        });
      }).toThrowError(
        'Invalid configuration: value of secretAccessKey needs to be a string.'
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
      }).toThrowError(TextUtils.cleanString(
        `Invalid configuration: value of src needs to be a glob or an array
        of globs.`
      ));
    });
  });
});
