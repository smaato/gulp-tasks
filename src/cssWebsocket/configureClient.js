
const fs = require('fs');

function doesDirectoryExist(path) {
  try {
    const stats = fs.lstatSync(path);

    return stats.isDirectory();
  } catch (e) {
    // Error is thrown if path does not exist
    return false;
  }
}

module.exports = (cssReloadPort, cssReloadPath) => {
  // Read the template for a client JS file
  const lines = fs.readFileSync(`${__dirname}/client.txt`)
    .toString()
    .split('\n');

  const distPath = `${__dirname}/../../dist`;

  if (!doesDirectoryExist(distPath)) {
    fs.mkdirSync(distPath);
  }

  fs.open(`${distPath}/cssWebsocketClient.js`, 'w', (err, fd) => {
    lines.forEach(line => {
      // Gulp task variables are supplied to a client JS file
      const lineReplaced = `\n${line}`
        .replace('#{cssHref}', cssReloadPath)
        .replace('#{port}', cssReloadPort);

      fs.writeSync(fd, lineReplaced);
    });
  });
};
