'use strict';

const {exec} = require('child_process');
const path = require('path');

const binPath = path.resolve('node_modules', '.bin');
const src = 'dist/feplet.node.es5.js';
const bld = 'dist/feplet.browser.min.js';

let cmd = `${binPath}/browserify ${src} | `;
cmd += `${binPath}/uglifyjs -o ${bld}`;

exec(cmd, (err, stdout, stderr) => {
  if (err) {
    throw err;
  }

  /* eslint-disable no-console */
  if (stderr) {
    console.error(stderr);
  }
});
