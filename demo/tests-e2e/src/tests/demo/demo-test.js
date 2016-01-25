
export default {
  'View endpoints test': client => {
    client
      .url('http://localhost:8002')
      .maximizeWindow()
      .waitForElementVisible('h1', 1000)
      .assert.containsText('h1', 'Hello, world!')
      .end();
  },
};
