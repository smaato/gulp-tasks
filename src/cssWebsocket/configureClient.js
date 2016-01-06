
const fs = require('fs');

module.exports = (cssReloadPort, cssReloadPath) => {
  // Read the template for a client JS file
  const lines = fs.readFileSync(__dirname + '/client.txt')
    .toString()
    .split('\n');

  fs.open(__dirname + '/client.js', 'w', (err, fd) => {
    lines.forEach(line => {
      // Gulp task variables are supplied to a client JS file
      const lineReplaced = line.toString()
        .replace('#{cssHref}', cssReloadPath)
        .replace('#{port}', cssReloadPort)
        .concat('\n');

      fs.writeSync(fd, lineReplaced);
    });
  });
};
