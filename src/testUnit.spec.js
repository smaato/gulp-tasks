
const testUnit = require('../index').testUnit;

describe('testUnit method', () => {
  it('returns a config and a task', () => {
    const result = testUnit();
    expect(result).toEqual({
      config: jasmine.any(Object),
      task: jasmine.any(Function),
    });
  });

  describe('configuration', () => {
    it('has defaults', () => {
      const result = testUnit();
      expect(result.config).toEqual({
        singleRun: true,
      });
    });
  });
});
