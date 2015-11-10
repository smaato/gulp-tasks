
module.exports = {
  'Demo test': browser => {
    browser
      .url('http://localhost:9000')
      .maximizeWindow()
      .waitForElementVisible('body', 200)
      .end();
  },
};
