'use strict';

process.chdir(__dirname);

const browserify = require('browserify');
const fs = require('fs');
const uglifyES = require('uglify-es');

const src5 = '../dist/feplet.node.es5.js';
const src6 = '../src/index.js';
const bld5 = '../dist/feplet.browser.min.js';
const bld6 = '../dist/feplet.browser.es6.min.js';

const keysToMinifyStr = fs.readFileSync('./keys-to-minify.json', 'utf8');
const keysToMinify = JSON.parse(keysToMinifyStr);

browserify(src5)
  .bundle((err, buf) => {
    if (err) {
      throw err;
    }

    let browserified = buf.toString('utf8');

    for (let i = 0, l = keysToMinify.length; i < l; i++) {
      const regex = new RegExp(keysToMinify[i], 'g');

      browserified = browserified.replace(regex, `a${i}`);
    }

    const uglified = uglifyES.minify(browserified);

    if (uglified.error) {
      throw uglified.error;
    }

    fs.writeFileSync(bld5, uglified.code);
  });

browserify(src6)
  .bundle((err, buf) => {
    if (err) {
      throw err;
    }

    let browserified = buf.toString('utf8');

    for (let i = 0, l = keysToMinify.length; i < l; i++) {
      const regex = new RegExp(keysToMinify[i], 'g');

      browserified = browserified.replace(regex, `a${i}`);
    }

    const uglified = uglifyES.minify(browserified);

    if (uglified.error) {
      throw uglified.error;
    }

    fs.writeFileSync(
      bld6,
      `${uglified.code}var F=window.Feplet;delete window.Feplet;export default F;`
    );
  });
