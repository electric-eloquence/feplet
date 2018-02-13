'use strict';

const browserify = require('browserify');
const fs = require('fs');
const uglifyES = require('uglify-es');

const src5 = 'dist/feplet.node.es5.js';
const src6 = 'src/index.js';
const bld5 = 'dist/feplet.browser.min.js';
const bld6 = 'dist/feplet.browser.es6.min.js';

const uglifyOpts = {
  mangle: {
    properties: {
      reserved: [
        'Feplet',
        'compile',
        'preprocessContextKeys',
        'preprocessPartialParams',
        'registerPartial',
        'unregisterPartial',
        'render'
      ]
    }
  }
};

browserify(src5)
  .bundle((err, buf) => {
    if (err) {
      throw err;
    }

    const uglified = uglifyES.minify(buf.toString('utf8'), uglifyOpts);

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

    const uglified = uglifyES.minify(buf.toString('utf8'), uglifyOpts);

    if (uglified.error) {
      throw uglified.error;
    }

    fs.writeFileSync(bld6, uglified.code + 'export default window.Feplet;');
  });
