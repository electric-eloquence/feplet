'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

let port = 8080;

if (process.env.PORT) {
  port = process.env.PORT;
}
else if (typeof process.argv[2] === 'string' && /^\d+$/.test(process.argv[2])) {
  port = process.argv[2];
}

process.env.PORT = port;

module.exports = new Promise((resolve) => {
  const server = http.createServer((req, res) => {
    const filePath = `${__dirname}/..${req.url}`;
    const extname = path.extname(filePath);
    let contentType = 'application/octet-stream';

    switch (extname) {
      case '.fpt':
        contentType = 'text/plain';
        break;
      case '.html':
        contentType = 'text/html';
        break;
      case '.js':
        contentType = 'application/javascript';
        break;
    }

    fs.readFile(filePath, (err, data) => {
      if (err) {
        if (err.code === 'ENOENT') {
          res.writeHead(404);
          res.end('HTTP 404: Not Found');
        }
        else {
          res.writeHead(500);
          res.end('HTTP 500: Internal Server Error');
        }
      }
      else {
        res.writeHead(200, {'Content-Type': contentType});
        res.end(data);
      }
    });
  })
  .listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Listening on port ${port}`);

    resolve(server);
  });
});
