
export default {
  'View endpoints test': client => {
    client
      .url('http://localhost:9000')
      .maximizeWindow()
      .waitForElementVisible('h1', 1000)
      .assert.containsText('h1', 'Hello, world!')
      .end();
  },
};
