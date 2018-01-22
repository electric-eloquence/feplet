'use strict';

const fs = require('fs');
const path = require('path');

const expect = require('chai').expect;

const feplet = require('../src/index');

const enc = 'utf8';

describe('Feplet', function () {
  it('should populate variables written in dot.notation', function () {
    const partials = {};
    const files = [
      'templates/00-dot.mustache'
    ];

    files.forEach((file) => {
      partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/01-parametered-dot.mustache'), enc);

    const render = feplet.render(
      templateText,
      {},
      partials
    );

    expect(render).to.equal('foo\nbar\n');
  });

  it('should populate variables within an array written in dot.notation', function () {
    const partials = {};
    const files = [
      'templates/01-dot-array.mustache'
    ];

    files.forEach((file) => {
      partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/02-parametered-dot-array.mustache'), enc);

    const render = feplet.render(
      templateText,
      {},
      partials
    );

    expect(render).to.equal('foo\nbar\n');
  });

  it('should hydrate templates with variables passed per the Pattern Lab styleModifier convention', function () {
    const partials = {};
    const files = [
      'templates/02-styled-atom.mustache'
    ];

    files.forEach((file) => {
      partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/03-styled-molecule.mustache'), enc);

    const render = feplet.render(
      templateText,
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      },
      partials
    );

    expect(render).to.equal('<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
  });

  it(
    'should recursively hydrate templates with variables passed per the Pattern Lab styleModifier convention',
    function () {
      const partials = {};
      const files = [
        'templates/02-styled-atom.mustache',
        'templates/03-styled-molecule.mustache'
      ];

      files.forEach((file) => {
        partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
      });

      const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/04-styled-organism.mustache'), enc);

      const render = feplet.render(
        templateText,
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        },
        partials
      );

      expect(render).to.equal('<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
    }
  );

  it('should hydrate templates with multiple classes passed per Pattern Lab styleModifier', function () {
    const partials = {};
    const files = [
      'templates/02-styled-atom.mustache'
    ];

    files.forEach((file) => {
      partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/05-multiple-classes.mustache'), enc);

    const render = feplet.render(
      templateText,
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      },
      partials
    );

    expect(render).to.equal('<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
  });

  it('should recursively hydrate templates with data passed as parameters specific to that template', function () {
    const partials = {};
    const files = [
      'templates/00-foo.mustache',
      'templates/00-simple.mustache',
      'templates/01-bar.mustache',
      'templates/05-parametered-partial.mustache'
    ];

    files.forEach((file) => {
      partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/05-parametered-partial.mustache'), enc);

    const render = feplet.render(
      templateText,
      {
        check: [],
        i18n: true,
        heck: 'hack',
        bar: true,
        title: 'TITLE',
        message: 'MESSAGE'
      },
      partials
    );

    expect(render).to.equal('No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n');
  });

  it('should hydrate templates with both data parameters and a Pattern Lab styleModifier', function () {
    const partials = {};
    const files = [
      'templates/02-styled-atom.mustache'
    ];

    files.forEach((file) => {
      partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/06-mixed-params.mustache'), enc);

    const render = feplet.render(
      templateText,
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      },
      partials
    );

    expect(render).to.equal('<span class="test_base test_2">\n    1\n    DESCRIPTION\n</span>\n');
  });

  it('should hydrate templates with both data parameters and a styleModifier with multiple classes', function () {
    const partials = {};
    const files = [
      'templates/02-styled-atom.mustache'
    ];

    files.forEach((file) => {
      partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/07-multiple-classes-params.mustache'), enc);

    const render = feplet.render(
      templateText,
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      },
      partials
    );

    expect(render).to.equal('<span class="test_base foo1 foo2">\n    2\n    DESCRIPTION\n</span>\n\n');
  });

  it('should shut off otherwise infinite recursion paths when flagged to do so by parameters', function () {
    const partials = {};
    const files = [
      'templates/00-foo.mustache',
      'templates/00-simple.mustache',
      'templates/01-bar.mustache',
      'templates/05-parametered-partial.mustache'
    ];

    files.forEach((file) => {
      partials[file.replace(/\.mustache$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/07-anti-infinity-tester.mustache'), enc);

    const render = feplet.render(
      templateText,
      {
        check: [],
        i18n: true,
        heck: 'hack',
        bar: true,
        title: 'TITLE',
        message: 'MESSAGE'
      },
      partials
    );

    expect(render).to.equal('No\n\nfoo\nMESSAGE\n  No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n  bar\n  MESSAGE\n');
  });
});
