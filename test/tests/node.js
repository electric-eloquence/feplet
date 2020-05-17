'use strict';

const fs = require('fs');
const path = require('path');

const {expect} = require('chai');

const hogan = require('../../lib/hogan.js/lib/hogan.js');
const {templateName, context, partial} = require('./subjects');
const expectation = require('./expectation');

const enc = 'utf8';
const template = [];

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function pathToFixtures(file) {
  return path.join(__dirname, '..', 'fixtures', file);
}

templateName.forEach((t) => {
  template[t] = fs.readFileSync(pathToFixtures(t), enc);
});

templateName.forEach((t, i) => {
  Object.keys(partial[i]).forEach(function (partialKey) {
    partial[i][partialKey] = template[partialKey];
  });
});

module.exports = function (Feplet) {
  return function () {
    describe('Static render', function () {
      it('0. Hydrates templates with variables', function () {
        const i = 0;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('1. Hydrates templates with nested variables', function () {
        const i = 1;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('2. Recursively hydrates templates with variables', function () {
        const i = 2;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('3. Recursively hydrates templates with nested variables', function () {
        const i = 3;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('4. Hydrates variables written in dot.notation', function () {
        const i = 4;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('5. Hydrates variables within an array written in dot.notation', function () {
        const i = 5;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('6. Recursively hydrates variables written in dot.notation', function () {
        const i = 6;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('7. Recursively hydrates variables within an array written in dot.notation', function () {
        const i = 7;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('9. Hydrates templates with variables passed per the Pattern Lab styleModifier convention', function () {
        const i = 9;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('10. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
', function () {
        const i = 10;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('11. Hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
        const i = 11;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('12. Hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
        const i = 12;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('13. Hydrates templates with both data parameters and a styleModifier with multiple classes', function () {
        const i = 13;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('14. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
        const i = 14;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('15. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
        const i = 15;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('16. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
', function () {
        const i = 16;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('17. Shuts off otherwise infinite recursion paths with default false conditions', function () {
        const i = 17;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('18. Shuts off otherwise infinite recursion paths when flagged to do so by parameters', function () {
        const i = 18;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('23. Renders a nested parameter variable differently than a non-parameter variable of the same name\
', function () {
        const i = 23;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('24. Renders an array of nested parameter variables differently from non-parameter variables of the same name\
', function () {
        const i = 24;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('25. Renders a more deeply nested parameter variable differently than a non-parameter variable of the same \
name', function () {
        const i = 25;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('26. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name\
', function () {
        const i = 26;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('27. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the \
same name', function () {
        const i = 27;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('28. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same \
name', function () {
        const i = 28;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('29. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of \
the same name', function () {
        const i = 29;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('34. Renders a top-level dot.notation parameter that nests more tags', function () {
        const i = 34;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('35. Renders an array of top-level dot.notation parameters that nest more tags', function () {
        const i = 35;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('36. Renders a dot.notation parameter nested within a non-parameter', function () {
        const i = 36;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('37. Renders an array of dot.notation parameters nested within a non-parameter', function () {
        const i = 37;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('38. Renders dot.notation parameters nested aside each other within a non-parameter', function () {
        const i = 38;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('39. Renders dot.notation parameter nested within another within a non-parameter', function () {
        const i = 39;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('43. Renders a deeply nested dot.notation parameter containing an array', function () {
        const i = 43;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('44. Renders a moderately nested dot.notation parameter containing an array', function () {
        const i = 44;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });

      it('45. Renders a top-level dot.notation parameter containing an array', function () {
        const i = 45;
        const render = Feplet.render(template[templateName[i]], context[i], clone(partial[i]));
        expect(render).to.equal(expectation[i]);
      });
    });

    describe('Instance render', function () {
      it('2. Recursively hydrates templates with variables', function () {
        const i = 2;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('3. Recursively hydrates templates with nested variables', function () {
        const i = 3;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('9. Hydrates templates with variables passed per the Pattern Lab styleModifier convention', function () {
        const i = 9;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('10. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
', function () {
        const i = 10;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('11. Hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
        const i = 11;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('12. Hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
        const i = 12;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('13. Hydrates templates with both data parameters and a styleModifier with multiple classes', function () {
        const i = 13;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('14. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
        const i = 14;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('15. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
        const i = 15;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('16. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
', function () {
        const i = 16;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('17. Shuts off otherwise infinite recursion paths with default false conditions', function () {
        const i = 17;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('18. Shuts off otherwise infinite recursion paths when flagged to do so by parameters', function () {
        const i = 18;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('23. Renders a nested parameter variable differently than a non-parameter variable of the same name\
', function () {
        const i = 23;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('24. Renders an array of nested parameter variables differently from non-parameter variables of the same name\
', function () {
        const i = 24;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('25. Renders a more deeply nested parameter variable differently than a non-parameter variable of the same \
name', function () {
        const i = 25;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('26. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name\
', function () {
        const i = 26;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('27. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the \
same name', function () {
        const i = 27;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('28. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same \
name', function () {
        const i = 28;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('29. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of \
the same name', function () {
        const i = 29;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('34. Renders a top-level dot.notation parameter that nests more tags', function () {
        const i = 34;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('35. Renders an array of top-level dot.notation parameters that nest more tags', function () {
        const i = 35;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('36. Renders a dot.notation parameter nested within a non-parameter', function () {
        const i = 36;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('37. Renders an array of dot.notation parameters nested within a non-parameter', function () {
        const i = 37;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('38. Renders dot.notation parameters nested aside each other within a non-parameter', function () {
        const i = 38;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('39. Renders dot.notation parameter nested within another within a non-parameter', function () {
        const i = 39;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('43. Renders a deeply nested dot.notation parameter containing an array', function () {
        const i = 43;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('44. Renders a moderately nested dot.notation parameter containing an array', function () {
        const i = 44;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });

      it('45. Renders a top-level dot.notation parameter containing an array', function () {
        const i = 45;
        const feplet = new Feplet(context[i]);
        Object.keys(partial[i]).forEach((partialKey) => {
          feplet.registerPartial(partialKey, template[partialKey]);
        });
        const render = feplet.render(template[templateName[i]]);
        expect(render).to.equal(expectation[i]);
      });
    });

    describe('Additional methods', function () {
      // DEPRECATED.
      // TODO: To be removed.
      it('preProcessPartialParams() accepts partialsComp arg where its keyed values are hogan.compile() objects\
', function () {
        const partialName = '01-dotted.fpt';
        const partials = {};
        const partialsComp = {};
        partials[partialName] = template[partialName];
        partialsComp[partialName] = hogan.compile(partials[partialName]);

        const templateText = template['01_dotted-includer.fpt'];
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
        expect(preProcess.partialsComp[partialName]).to.have.property('parseArr');
        expect(preProcess.partialsComp[partialName]).to.have.property('compilation');
        expect(render).to.equal('foo\nbar\n');
      });

      // Tests the fix to a bug where a partial called wtih a parameter, but with no tag corresponding to the parameter
      // would return an empty value.
      it('preProcessPartialParams() populates partials and partialsComp where the partial does not have a tag that \
correlates to the param', function () {
        const partialName = 'footbarf';
        const partialText = '{{ foot }}{{ barf }}'; // Be sure not to use tags used by any fixtures.
        const partialWithParamName = `${partialName}(foo: 'bar')`;
        const partials = {};
        const partialsComp = {};
        partials[partialName] = partialText;
        partials[partialWithParamName] = '';
        partialsComp[partialName] = hogan.compile(partials[partialName]);
        partialsComp[partialWithParamName] = {};

        const templateText = `{{> ${partialWithParamName} }}`;
        const preProcess = Feplet.preProcessPartialParams(templateText, null, partials, partialsComp);
        const render = Feplet.render(
          templateText,
          {
            foot: 'foot',
            barf: 'barf'
          },
          partials,
          partialsComp
        );

        expect(preProcess).to.have.property('compilation');
        expect(preProcess).to.have.property('_contextKeys');
        expect(preProcess).to.have.property('partials');
        expect(preProcess).to.have.property('partialsComp');
        expect(preProcess.partials[partialName]).to.equal(partialText);
        expect(preProcess.partials[partialWithParamName]).to.equal(partialText);
        expect(preProcess.partialsComp[partialName]).to.have.property('parseArr');
        expect(preProcess.partialsComp[partialName]).to.have.property('compilation');
        expect(preProcess.partialsComp[partialWithParamName]).to.have.property('parseArr');
        expect(preProcess.partialsComp[partialWithParamName]).to.have.property('compilation');
        expect(render).to.equal('footbarf');
      });

      // DEPRECATED.
      // TODO: To be removed.
      it('compile() accepts partialsComp arg where its keyed values are hogan.compile() objects', function () {
        const partialName = '00-base.fpt';
        const partials = {};
        const partialsComp = {};
        partials[partialName] = template[partialName];
        partialsComp[partialName] = hogan.compile(partials[partialName]);

        const templateText = template['00_base-includer.fpt'];
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
        const partialName = '00-base.fpt';
        const partialText = template[partialName];
        const parseArr = Feplet.parse(Feplet.scan(partialText));
        const partialComp = {
          parseArr,
          compilation: Feplet.generate(parseArr, partialText, {})
        };

        feplet.registerPartial(partialName, partialText, partialComp);

        const templateText = template['00_base-includer.fpt'];
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
        const partialName = '05-dotted-param_nested-in-non-param.fpt';

        feplet.registerPartial(partialName, template[partialName]);

        const partialsBefore = Object.keys(feplet.partials);

        feplet.unregisterPartial(partialName, feplet.partials, feplet.partialsComp);

        const partialsAfter = Object.keys(feplet.partials);

        expect(partialsBefore.indexOf(partialName)).to.be.above(-1);
        expect(partialsAfter.indexOf(partialName)).to.equal(-1);
      });
    });
  };
};
