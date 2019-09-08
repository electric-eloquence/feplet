'use strict';

const fs = require('fs');
const path = require('path');

const {expect} = require('chai');

const enc = 'utf8';

function pathToFixtures(file) {
  return path.join(__dirname, '..', 'fixtures', file);
}

module.exports = function (Feplet) {
  return function () {
    describe('Static render', function () {
      it('hydrates templates with variables', function () {
        const templateText = fs.readFileSync(pathToFixtures('00-base.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            title: 'foo',
            message: 'bar'
          }
        );

        expect(render).to.equal('foo\nbar\n');
      });

      it('hydrates templates with nested variables', function () {
        const templateText = fs.readFileSync(pathToFixtures('00-nested.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            check: {
              i18n: true
            }
          }
        );

        expect(render).to.equal('\nYes\n');
      });

      it('hydrates templates with an array of variables', function () {
        const templateText = fs.readFileSync(pathToFixtures('00-nested.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            check: [
              {
                i18n: true
              }
            ]
          }
        );

        expect(render).to.equal('\nYes\n');
      });

      it('hydrates variables written in dot.notation', function () {
        const templateText = fs.readFileSync(pathToFixtures('01-dotted.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            dot: {
              title: 'foo',
              message: 'bar'
            }
          }
        );

        expect(render).to.equal('foo\nbar\n');
      });

      it('hydrates variables within an array written in dot.notation', function () {
        const templateText = fs.readFileSync(pathToFixtures('01-dotted_array.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            dot: [
              {
                title: 'foo',
                message: 'bar'
              }
            ]
          }
        );

        expect(render).to.equal('foo\nbar\n');
      });

      it('recursively hydrates templates with variables', function () {
        const files = [
          '00-base.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('00_base-includer.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            title: 'foo',
            message: 'bar'
          },
          partials
        );

        expect(render).to.equal('foo\nbar\n');
      });

      it('recursively hydrates templates with nested variables', function () {
        const files = [
          '00-nested.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('00_nested-includer.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            check: {
              i18n: true
            }
          },
          partials
        );

        expect(render).to.equal('\nYes\n');
      });

      it('recursively hydrates templates with an array of variables', function () {
        const files = [
          '00-nested.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('00_nested-includer.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            check: [
              {
                i18n: true
              }
            ]
          },
          partials
        );

        expect(render).to.equal('\nYes\n');
      });

      it('recursively hydrates variables written in dot.notation', function () {
        const files = [
          '01-dotted.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('01_dotted-includer.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {},
          partials
        );

        expect(render).to.equal('foo\nbar\n');
      });

      it('recursively hydrates variables within an array written in dot.notation', function () {
        const files = [
          '01-dotted_array.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('01_dotted-includer_array.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {},
          partials
        );

        expect(render).to.equal('foo\nbar\n');
      });

      it('renders a top-level dot.notation parameter that nests more tags', function () {
        const files = [
          '05-dotted-param.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('05_dotted-param-includer.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {},
          partials
        );

        expect(render).to.equal('  hack\n');
      });

      it('renders an array of top-level dot.notation parameters that nest more tags', function () {
        const files = [
          '05-dotted-param.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_array.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {},
          partials
        );

        expect(render).to.equal('  hack\n  heck\n');
      });

      it('renders a deeply nested dot.notation parameter containing an array', function () {
        const files = [
          '06-dotted-array-param-inner.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('06_dotted-array-param-inner-includer.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {},
          partials
        );

        expect(render).to.equal('    heck\n');
      });

      it('renders a moderately nested dot.notation parameter containing an array', function () {
        const files = [
          '06-dotted-array-param-middle.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('06_dotted-array-param-middle-includer.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {},
          partials
        );

        expect(render).to.equal('    heck\n');
      });

      it('renders a top-level dot.notation parameter containing an array', function () {
        const files = [
          '06-dotted-array-param-outer.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('06_dotted-array-param-outer-includer.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {},
          partials
        );

        expect(render).to.equal('  heck\n');
      });

      it('hydrates templates with variables passed per the Pattern Lab styleModifier convention', function () {
        const files = [
          '02-stylemod-atom.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('02-stylemod-molecule.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          },
          partials
        );

        expect(render).to.equal('<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
      });

      it('recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
', function () {
        const files = [
          '02-stylemod-atom.fpt',
          '02-stylemod-molecule.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('02-stylemod-organism.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          },
          partials
        );

        expect(render).to.equal('<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
      });

      it('hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
        const files = [
          '02-stylemod-atom.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('02_stylemod-multiple-classes.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          },
          partials
        );

        expect(render).to.equal('<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
      });

      it('hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
        const files = [
          '02-stylemod-atom.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('02_stylemod-param.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          },
          partials
        );

        expect(render).to.equal('<span class="test_base test_2">\n    1\n    DESCRIPTION\n</span>\n');
      });

      it('hydrates templates with both data parameters and a styleModifier with multiple classes', function () {
        const files = [
          '02-stylemod-atom.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('02_stylemod-param_multiple-classes.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          },
          partials
        );

        expect(render).to.equal('<span class="test_base foo1 foo2">\n    2\n    DESCRIPTION\n</span>\n');
      });

      it('recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier\
', function () {
        const files = [
          '02-stylemod-atom.fpt',
          '02_stylemod-multiple-classes.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('02~stylemod-multiple-classes-includer.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          },
          partials
        );

        expect(render).to.equal('<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
      });

      it('recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
        const files = [
          '02-stylemod-atom.fpt',
          '02_stylemod-param.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('02~stylemod-param-includer.fpt'), enc);
        const render = Feplet.render(
          templateText,
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          },
          partials
        );

        expect(render).to.equal('<span class="test_base test_2">\n    1\n    DESCRIPTION\n</span>\n');
      });

      it('recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
', function () {
        const files = [
          '02-stylemod-atom.fpt',
          '02_stylemod-param_multiple-classes.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('02~stylemod-param_multiple-classes-includer.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          },
          partials
        );

        expect(render).to.equal('<span class="test_base foo1 foo2">\n    2\n    DESCRIPTION\n</span>\n');
      });

      it('shuts off otherwise infinite recursion paths with default false conditions', function () {
        const files = [
          '00-base.fpt',
          '00-nested.fpt',
          '00_nested-includer.fpt',
          '03-include-self-w-condition.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(pathToFixtures('03-include-self-w-condition.fpt'), enc);
        const render = Feplet.render(
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

      it('shuts off otherwise infinite recursion paths when flagged to do so by parameters', function () {
        const files = [
          '00-base.fpt',
          '00-nested.fpt',
          '00_nested-includer.fpt',
          '03-include-self-w-condition.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('03_include-self-w-condition-includer.fpt'),
          enc
        );
        const render = Feplet.render(
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

      it('renders a nested parameter variable differently than a non-parameter variable of the same name\
', function () {
        const files = [
          '04-nested-param-same-name-as-non-param.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            bez: 'hack',
            biz: 'heck'
          },
          partials
        );

        expect(render).to.equal('hack heck\n  hick hock\n');
      });

      it('renders an array of nested parameter variables differently from non-parameter variables of the same \
name', function () {
        const files = [
          '04-nested-param-same-name-as-non-param.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_array.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            bez: 'hack',
            biz: 'heck'
          },
          partials
        );

        expect(render).to.equal('hack heck\n  hick hock\n  huck hyck\n');
      });

      it('renders a more deeply nested parameter variable differently then a non-parameter variable of the same \
name', function () {
        const files = [
          '04-nested-param-same-name-as-non-param_deep.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_deep.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            biz: 'hack',
            boz: 'heck'
          },
          partials
        );

        expect(render).to.equal('hack heck\n  hick hock\n');
      });

      it('renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same \
name', function () {
        const files = [
          '04-nested-param-same-name-as-non-param_dotted-inner.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            biz: {
              boz: 'hack'
            }
          },
          partials
        );

        expect(render).to.equal('hack\n    heck\n');
      });

      it('renders a deeply nested array of dot.notation parameters differently than non-parameter variables of \
the same name', function () {
        const files = [
          '04-nested-param-same-name-as-non-param_dotted-inner.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            biz: {
              boz: 'hack'
            }
          },
          partials
        );

        expect(render).to.equal('hack\n    heck\n    hick\n');
      });

      it('renders a moderately nested dot.notation parameter differently than a non-parameter variable of the \
same name', function () {
        const files = [
          '04-nested-param-same-name-as-non-param_dotted-middle.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            bez: {
              biz: {
                boz: 'hack'
              }
            }
          },
          partials
        );

        expect(render).to.equal('  hack\n    heck\n');
      });

      it('renders a moderately nested array of dot.notation parameters differently than non-parameter variables \
of the same name', function () {
        const files = [
          '04-nested-param-same-name-as-non-param_dotted-middle.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            bez: {
              biz: [
                {
                  boz: 'hack'
                },
                {
                  boz: 'heck'
                }
              ]
            }
          },
          partials
        );

        expect(render).to.equal('  hack\n  heck\n    hick\n    hock\n');
      });

      it('renders a dot.notation parameter nested within a non-parameter', function () {
        const files = [
          '05-dotted-param_nested-in-non-param.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_nested-in-non-param.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            baz: {
              bez: 'hack'
            }
          },
          partials
        );

        expect(render).to.equal('  hack\n    heck\n');
      });

      it('renders an array of dot.notation parameters nested within a non-parameter', function () {
        const files = [
          '05-dotted-param_nested-in-non-param.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_nested-in-non-param_array.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            baz: {
              bez: 'hack'
            }
          },
          partials
        );

        expect(render).to.equal('  hack\n    heck\n    hick\n');
      });
    });

    describe('Instance render', function () {
      it('hydrates templates with variables passed per the Pattern Lab styleModifier convention', function () {
        const feplet = new Feplet(
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          }
        );
        const files = [
          '02-stylemod-atom.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('02-stylemod-molecule.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
      });

      it('recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
', function () {
        const feplet = new Feplet(
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          }
        );
        const files = [
          '02-stylemod-atom.fpt',
          '02-stylemod-molecule.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('02-stylemod-organism.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
      });

      it('hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
        const feplet = new Feplet(
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          }
        );
        const files = [
          '02-stylemod-atom.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('02_stylemod-multiple-classes.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
      });

      it('hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
        const feplet = new Feplet(
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          }
        );
        const files = [
          '02-stylemod-atom.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('02_stylemod-param.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('<span class="test_base test_2">\n    1\n    DESCRIPTION\n</span>\n');
      });

      it('hydrates templates with both data parameters and a styleModifier with multiple classes', function () {
        const feplet = new Feplet(
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          }
        );
        const files = [
          '02-stylemod-atom.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('02_stylemod-param_multiple-classes.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('<span class="test_base foo1 foo2">\n    2\n    DESCRIPTION\n</span>\n');
      });

      it('recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier\
', function () {
        const feplet = new Feplet(
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          }
        );
        const files = [
          '02-stylemod-atom.fpt',
          '02_stylemod-multiple-classes.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('02~stylemod-multiple-classes-includer.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
      });

      it('recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
        const feplet = new Feplet(
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          }
        );
        const files = [
          '02-stylemod-atom.fpt',
          '02_stylemod-param.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('02~stylemod-param-includer.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('<span class="test_base test_2">\n    1\n    DESCRIPTION\n</span>\n');
      });

      it('recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
', function () {
        const feplet = new Feplet(
          {
            message: 'MESSAGE',
            description: 'DESCRIPTION'
          }
        );
        const files = [
          '02-stylemod-atom.fpt',
          '02_stylemod-param_multiple-classes.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('02~stylemod-param_multiple-classes-includer.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('<span class="test_base foo1 foo2">\n    2\n    DESCRIPTION\n</span>\n');
      });

      it('shuts off otherwise infinite recursion paths with default false conditions', function () {
        const feplet = new Feplet(
          {
            check: [],
            i18n: true,
            heck: 'hack',
            bar: true,
            title: 'TITLE',
            message: 'MESSAGE'
          }
        );
        const files = [
          '00-base.fpt',
          '00-nested.fpt',
          '00_nested-includer.fpt',
          '03-include-self-w-condition.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('03-include-self-w-condition.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n');
      });

      it('shuts off otherwise infinite recursion paths when flagged to do so by parameters', function () {
        const feplet = new Feplet(
          {
            check: [],
            i18n: true,
            heck: 'hack',
            bar: true,
            title: 'TITLE',
            message: 'MESSAGE'
          }
        );
        const files = [
          '00-base.fpt',
          '00-nested.fpt',
          '00_nested-includer.fpt',
          '03-include-self-w-condition.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('03_include-self-w-condition-includer.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('No\n\nfoo\nMESSAGE\n  No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n  bar\n  MESSAGE\n');
      });

      it('renders a nested parameter variable differently than a non-parameter variable of the same name\
', function () {
        const feplet = new Feplet(
          {
            bez: 'hack',
            biz: 'heck'
          }
        );
        const files = [
          '04-nested-param-same-name-as-non-param.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('hack heck\n  hick hock\n');
      });

      it('renders an array of nested parameter variables differently from non-parameter variables of the same \
name', function () {
        const feplet = new Feplet(
          {
            bez: 'hack',
            biz: 'heck'
          }
        );
        const files = [
          '04-nested-param-same-name-as-non-param.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_array.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('hack heck\n  hick hock\n  huck hyck\n');
      });

      it('renders a more deeply nested parameter variable differently then a non-parameter variable of the same \
name', function () {
        const feplet = new Feplet(
          {
            biz: 'hack',
            boz: 'heck'
          }
        );
        const files = [
          '04-nested-param-same-name-as-non-param_deep.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_deep.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('hack heck\n  hick hock\n');
      });

      it('renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same \
name', function () {
        const feplet = new Feplet(
          {
            biz: {
              boz: 'hack'
            }
          }
        );
        const files = [
          '04-nested-param-same-name-as-non-param_dotted-inner.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('hack\n    heck\n');
      });

      it('renders a deeply nested array of dot.notation parameters differently than non-parameter variables of \
the same name', function () {
        const feplet = new Feplet(
          {
            biz: {
              boz: 'hack'
            }
          }
        );
        const files = [
          '04-nested-param-same-name-as-non-param_dotted-inner.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('hack\n    heck\n    hick\n');
      });

      it('renders a moderately nested dot.notation parameter differently than a non-parameter variable of the \
same name', function () {
        const feplet = new Feplet(
          {
            bez: {
              biz: {
                boz: 'hack'
              }
            }
          }
        );
        const files = [
          '04-nested-param-same-name-as-non-param_dotted-middle.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('  hack\n    heck\n');
      });

      it('renders a moderately nested array of dot.notation parameters differently than non-parameter variables \
of the same name', function () {
        const feplet = new Feplet(
          {
            bez: {
              biz: [
                {
                  boz: 'hack'
                },
                {
                  boz: 'heck'
                }
              ]
            }
          }
        );
        const files = [
          '04-nested-param-same-name-as-non-param_dotted-middle.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('  hack\n  heck\n    hick\n    hock\n');
      });

      it('renders a dot.notation parameter nested within a non-parameter', function () {
        const feplet = new Feplet(
          {
            baz: {
              bez: 'hack'
            }
          }
        );
        const files = [
          '05-dotted-param_nested-in-non-param.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_nested-in-non-param.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('  hack\n    heck\n');
      });

      it('renders an array of dot.notation parameters nested within a non-parameter', function () {
        const feplet = new Feplet(
          {
            baz: {
              bez: 'hack'
            }
          }
        );
        const files = [
          '05-dotted-param_nested-in-non-param.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_nested-in-non-param_array.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('  hack\n    heck\n    hick\n');
      });
    });

    describe('Additional methods', function () {
      it('unregisterPartial() unregisters partial', function () {
        const feplet = new Feplet(
          {
            baz: {
              bez: 'hack'
            }
          }
        );
        const partialName = '05-dotted-param_nested-in-non-param';
        const file = `${partialName}.fpt`;

        feplet.registerPartial(partialName, fs.readFileSync(pathToFixtures(file), enc));

        const partialsBefore = Object.keys(feplet.partials);

        feplet.unregisterPartial('05-dotted-param_nested-in-non-param', feplet.partials, feplet.partialsComp);

        const partialsAfter = Object.keys(feplet.partials);

        expect(partialsBefore.indexOf(partialName)).to.be.above(-1);
        expect(partialsAfter.indexOf(partialName)).to.equal(-1);
      });
    });
  };
};
