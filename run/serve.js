'use strict';

const fs = require('fs');
const http = require('http');
const path = require('path');

let port = 8080;

if (typeof process.argv[2] === 'string' && /^\d+$/.test(process.argv[2])) {
  port = process.argv[2];
}

http.createServer((req, res) => {
  let filePath = `.${req.url}`;

  if (filePath === './') {
    filePath += 'index.html';
  }

  const extname = path.extname(filePath);
  let contentType = 'application/octet-stream';

  switch (extname) {
    case '.html':
      contentType = 'text/html';
      break;
    case '.ico':
      contentType = 'image/x-icon';
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
}).listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Listening on port ${port}`);
});
