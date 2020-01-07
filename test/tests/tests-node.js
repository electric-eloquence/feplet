'use strict';

const fs = require('fs');
const path = require('path');

const {expect} = require('chai');

const hogan = require('../../lib/hogan.js/lib/hogan.js');

const enc = 'utf8';

function pathToFixtures(file) {
  return path.join(__dirname, '..', 'fixtures', file);
}

module.exports = function (Feplet) {
  return function () {
    describe('Static render', function () {
      it('1. Hydrates templates with variables', function () {
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

      it('2. Hydrates templates with nested variables', function () {
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

      it('3. Recursively hydrates templates with variables', function () {
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

      it('4. Recursively hydrates templates with nested variables', function () {
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

      it('5. Hydrates variables written in dot.notation', function () {
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

      it('6. Hydrates variables within an array written in dot.notation', function () {
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

      it('7. Recursively hydrates variables written in dot.notation', function () {
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

      it('8. Recursively hydrates variables within an array written in dot.notation', function () {
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

      it('9. Hydrates templates with variables passed per the Pattern Lab styleModifier convention', function () {
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
            description: 'DESCRIPTION' // Need to test hydration of only one variable.
          },
          partials
        );

        expect(render).to.equal('<span class="test_base test_1">\n    \n    DESCRIPTION\n</span>\n');
      });

      it('10. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
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

      it('11. Hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
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

      it('12. Hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
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

      it('13. Hydrates templates with both data parameters and a styleModifier with multiple classes', function () {
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

      it('14. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
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

      it('15. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
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

      it('16. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
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

      it('17. Shuts off otherwise infinite recursion paths with default false conditions', function () {
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

      it('18. Shuts off otherwise infinite recursion paths when flagged to do so by parameters', function () {
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

      it('19. Renders a nested parameter variable differently than a non-parameter variable of the same name\
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

      it('20. Renders an array of nested parameter variables differently from non-parameter variables of the same name\
', function () {
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

      it('21. Renders a more deeply nested parameter variable differently then a non-parameter variable of the same name\
', function () {
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

      it('22. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name\
', function () {
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

      it('23. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the \
same name', function () {
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

      it('24. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same \
name', function () {
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

      it('25. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of \
the same name', function () {
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

      it('26. Renders a top-level dot.notation parameter that nests more tags', function () {
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

      it('27. Renders an array of top-level dot.notation parameters that nest more tags', function () {
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

      it('28. Renders a dot.notation parameter nested within a non-parameter', function () {
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

      it('29. Renders an array of dot.notation parameters nested within a non-parameter', function () {
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

      it('30. Renders dot.notation parameters nested aside each other within a non-parameter', function () {
        const files = [
          '05-dotted-param_nested-in-non-param_aside.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_nested-in-non-param_aside.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            baz: {
              byz: 'hack'
            }
          },
          partials
        );

        expect(render).to.equal('    heck\n    hick\n');
      });

      it('31. Renders dot.notation parameter nested within another within a non-parameter', function () {
        const files = [
          '05-dotted-param_nested-in-non-param_nested.fpt'
        ];
        const partials = {};

        files.forEach((file) => {
          partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(pathToFixtures(file), enc);
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_nested-in-non-param_nested.fpt'),
          enc
        );
        const render = Feplet.render(
          templateText,
          {
            baz: {
              byz: 'hack'
            }
          },
          partials
        );

        expect(render).to.equal('    heck\n');
      });

      it('32. Renders a deeply nested dot.notation parameter containing an array', function () {
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

      it('33. Renders a moderately nested dot.notation parameter containing an array', function () {
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

      it('34. Renders a top-level dot.notation parameter containing an array', function () {
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
    });

    describe('Instance render', function () {
      it('3. Recursively hydrates templates with variables', function () {
        const feplet = new Feplet(
          {
            title: 'foo',
            message: 'bar'
          }
        );
        const files = [
          '00-base.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('00_base-includer.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('foo\nbar\n');
      });

      it('4. Recursively hydrates templates with nested variables', function () {
        const feplet = new Feplet(
          {
            check: {
              i18n: true
            }
          }
        );
        const files = [
          '00-nested.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('00_nested-includer.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('\nYes\n');
      });

      it('9. Hydrates templates with variables passed per the Pattern Lab styleModifier convention', function () {
        const feplet = new Feplet(
          {
            description: 'DESCRIPTION' // Need to test hydration of only one variable.
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

        expect(render).to.equal('<span class="test_base test_1">\n    \n    DESCRIPTION\n</span>\n');
      });

      it('10. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
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

      it('11. Hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
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

      it('12. Hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
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

      it('13. Hydrates templates with both data parameters and a styleModifier with multiple classes', function () {
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

      it('14. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
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

      it('15. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
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

      it('16. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
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

      it('17. Shuts off otherwise infinite recursion paths with default false conditions', function () {
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

      it('18. Shuts off otherwise infinite recursion paths when flagged to do so by parameters', function () {
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

      it('19. Renders a nested parameter variable differently than a non-parameter variable of the same name\
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

      it('20. Renders an array of nested parameter variables differently from non-parameter variables of the same name\
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
          pathToFixtures('04_nested-param-same-name-as-non-param-includer_array.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('hack heck\n  hick hock\n  huck hyck\n');
      });

      it('21. Renders a more deeply nested parameter variable differently then a non-parameter variable of the same \
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

      it('22. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name\
', function () {
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

      it('23. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the \
same name', function () {
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

      it('24. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same \
name', function () {
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

      it('25. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of \
the same name', function () {
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

      it('26. Renders a top-level dot.notation parameter that nests more tags', function () {
        const feplet = new Feplet(
          {}
        );
        const files = [
          '05-dotted-param.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(pathToFixtures('05_dotted-param-includer.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('  hack\n');
      });

      it('27. Renders an array of top-level dot.notation parameters that nest more tags', function () {
        const feplet = new Feplet(
          {}
        );
        const files = [
          '05-dotted-param.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_array.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('  hack\n  heck\n');
      });

      it('28. Renders a dot.notation parameter nested within a non-parameter', function () {
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

      it('29. Renders an array of dot.notation parameters nested within a non-parameter', function () {
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

      it('30. Renders dot.notation parameters nested aside each other within a non-parameter', function () {
        const feplet = new Feplet(
          {
            baz: {
              byz: 'hack'
            }
          }
        );
        const files = [
          '05-dotted-param_nested-in-non-param_aside.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_nested-in-non-param_aside.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('    heck\n    hick\n');
      });

      it('31. Renders dot.notation parameter nested within another within a non-parameter', function () {
        const feplet = new Feplet(
          {
            baz: {
              byz: 'hack'
            }
          }
        );
        const files = [
          '05-dotted-param_nested-in-non-param_nested.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('05_dotted-param-includer_nested-in-non-param_nested.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('    heck\n');
      });

      it('32. Renders a deeply nested dot.notation parameter containing an array', function () {
        const feplet = new Feplet(
          {}
        );
        const files = [
          '06-dotted-array-param-inner.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('06_dotted-array-param-inner-includer.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('    heck\n');
      });

      it('33. Renders a moderately nested dot.notation parameter containing an array', function () {
        const feplet = new Feplet(
          {}
        );
        const files = [
          '06-dotted-array-param-middle.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('06_dotted-array-param-middle-includer.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('    heck\n');
      });

      it('34. Renders a top-level dot.notation parameter containing an array', function () {
        const feplet = new Feplet(
          {}
        );
        const files = [
          '06-dotted-array-param-outer.fpt'
        ];

        files.forEach((file) => {
          feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(pathToFixtures(file), enc));
        });

        const templateText = fs.readFileSync(
          pathToFixtures('06_dotted-array-param-outer-includer.fpt'),
          enc
        );
        const render = feplet.render(templateText);

        expect(render).to.equal('  heck\n');
      });
    });

    describe('Additional methods', function () {
      // DEPRECATED.
      // TODO: To be removed.
      it('preProcessPartialParams() accepts partialsComp arg where its keyed values are hogan.compile() objects\
', function () {
        const partial = '01-dotted';
        const partials = {};
        const partialsComp = {};
        partials[partial] = fs.readFileSync(pathToFixtures(`${partial}.fpt`), enc);
        partialsComp[partial] = hogan.compile(partials[partial]);

        const templateText = fs.readFileSync(pathToFixtures('01_dotted-includer.fpt'), enc);
        const preProcess = Feplet.preProcessPartialParams(templateText, null, partials, partialsComp);
        const render = Feplet.render(
          templateText,
          {
            dot: {
              title: 'foo',
              message: 'bar'
            }
          },
          partials,
          partialsComp
        );

        expect(preProcess).to.have.property('compilation');
        expect(preProcess).to.have.property('_contextKeys');
        expect(preProcess).to.have.property('partials');
        expect(preProcess).to.have.property('partialsComp');
        expect(preProcess.partialsComp['01-dotted']).to.have.property('parseArr');
        expect(preProcess.partialsComp['01-dotted']).to.have.property('compilation');
        expect(render).to.equal('foo\nbar\n');
      });

      // DEPRECATED.
      // TODO: To be removed.
      it('compile() accepts partialsComp arg where its keyed values are hogan.compile() objects', function () {
        const partial = '00-base';
        const partials = {};
        const partialsComp = {};
        partials[partial] = fs.readFileSync(pathToFixtures(`${partial}.fpt`), enc);
        partialsComp[partial] = hogan.compile(partials[partial]);

        const templateText = fs.readFileSync(pathToFixtures('00_base-includer.fpt'), enc);
        const compilation = Feplet.compile(templateText, null, partials, partialsComp);
        const render = compilation.render(
          {
            title: 'foo',
            message: 'bar'
          },
          partials,
          null,
          partialsComp
        );

        expect(compilation).to.have.property('r');
        expect(compilation).to.have.property('c');
        expect(compilation).to.have.property('options');
        expect(compilation).to.have.property('text');
        expect(compilation).to.have.property('partials');
        expect(compilation).to.have.property('subs');
        expect(compilation).to.have.property('buf');
        expect(render).to.equal('foo\nbar\n');
      });

      // This tests an edge-case and is primarily here for coverage.
      it('registerPartial() accepts a partialComp argument', function () {
        const feplet = new Feplet(
          {
            title: 'foo',
            message: 'bar'
          }
        );
        const partial = '00-base';
        const text = fs.readFileSync(pathToFixtures(`${partial}.fpt`), enc);
        const parseArr = Feplet.parse(Feplet.scan(text));
        const partialComp = {
          parseArr,
          compilation: Feplet.generate(parseArr, text, {})
        };

        feplet.registerPartial(partial, text, partialComp);

        const templateText = fs.readFileSync(pathToFixtures('00_base-includer.fpt'), enc);
        const render = feplet.render(templateText);

        expect(render).to.equal('foo\nbar\n');
      });

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
