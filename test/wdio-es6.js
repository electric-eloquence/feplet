'use strict';

const {spawn} = require('child_process');

require('../run/serve').then((server) => {
  const args = [`${__dirname}/wdio-es6.conf.js`];
  const wdio = spawn(`${__dirname}/../node_modules/.bin/wdio`, args, {stdio: 'inherit'});

  wdio.on('exit', function (code) {
    server.close();
    process.exit(code); // eslint-disable-line no-process-exit
  });

  wdio.on('error', function (err) {
    server.close();
    throw err;
  });
});
