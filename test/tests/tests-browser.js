/* eslint-disable max-len, quotes, strict */

var Feplet = window.Feplet;
var i = 0;
var main = document.getElementById('main');
var templates = {
  'templates/00-base.fpt': // 1
    '{{ title }}\n{{ message }}\n',
  'templates/00-nested.fpt': // 2
    '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n',
  'templates/00_base-includer.fpt': // 3
    '{{> templates/00-base }}\n',
  'templates/00_nested-includer.fpt': // 4
    '{{> templates/00-nested }}\n',
  'templates/01-dotted.fpt': // 5
    '{{ dot.title }}\n{{ dot.message }}\n',
  'templates/01-dotted_array.fpt': // 6
    '{{ dot.0.title }}\n{{ dot.0.message }}\n',
  'templates/01_dotted-includer.fpt': // 7
    '{{> templates/01-dotted(dot: { title: "foo", message: "bar" }) }}\n',
  'templates/01_dotted-includer_array.fpt': // 8
    '{{> templates/01-dotted_array(dot: [{ title: "foo", message: "bar" }]) }}\n'
};

Object.keys(templates).forEach(function (template) {
  var context;
  var partials;

  switch (template) {
    case 'templates/00-base.fpt': // 1
      context = {
        title: 'foo',
        message: 'bar'
      };
      break;

    case 'templates/00-nested.fpt': // 2
      context = {
        check: {
          i18n: true
        }
      };
      break;

    case 'templates/00_base-includer.fpt': // 3
      context = {
        title: 'foo',
        message: 'bar'
      };
      partials = {
        'templates/00-base': templates['templates/00-base.fpt']
      };
      break;

    case 'templates/00_nested-includer.fpt': // 4
      context = {
        check: {
          i18n: true
        }
      };
      partials = {
        'templates/00-nested': templates['templates/00-nested.fpt']
      };
      break;

    case 'templates/01-dotted.fpt': // 5
      context = {
        dot: {
          title: 'foo',
          message: 'bar'
        }
      };
      break;

    case 'templates/01-dotted_array.fpt': // 6
      context = {
        dot: [
          {
            title: 'foo',
            message: 'bar'
          }
        ]
      };
      break;

    case 'templates/01_dotted-includer.fpt': // 7
      partials = {
        'templates/01-dotted': templates['templates/01-dotted.fpt']
      };
      break;

    case 'templates/01_dotted-includer_array.fpt': // 8
      partials = {
        'templates/01-dotted_array': templates['templates/01-dotted_array.fpt']
      };
      break;
  }

  var render;
  var contentParagraph;

  if (context || partials) {
    render = Feplet.render(
      templates[template],
      context,
      partials
    );
    contentParagraph = document.createElement('p');
    contentParagraph.className = 'assert';
  }

  switch (template) {
    case 'templates/00-base.fpt': // 1
      contentParagraph.innerHTML = ++i + '. Hydrates templates with variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "<span class="expect">foo\\nbar\\n</span>"<br>';
      break;

    case 'templates/00-nested.fpt': // 2
      contentParagraph.innerHTML = ++i + '. Hydrates templates with nested variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "<span class="expect">\\nYes\\n</span>"<br>';
      break;

    case 'templates/00_base-includer.fpt': // 3
      contentParagraph.innerHTML = ++i + '. Recursively hydrates templates with variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "<span class="expect">foo\\nbar\\n</span>"<br>';
      break;

    case 'templates/00_nested-includer.fpt': // 4
      contentParagraph.innerHTML = ++i + '. Recursively hydrates templates with nested variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "<span class="expect">\\nYes\\n</span>"<br>';
      break;

    case 'templates/01-dotted.fpt': // 5
      contentParagraph.innerHTML = ++i + '. Hydrates variables written in dot.notation:<br>';
      contentParagraph.innerHTML += 'expect to equal "<span class="expect">foo\\nbar\\n</span>"<br>';
      break;

    case 'templates/01-dotted_array.fpt': // 6
      contentParagraph.innerHTML = ++i + '. Hydrates variables within an array written in dot.notation:<br>';
      contentParagraph.innerHTML += 'expect to equal "<span class="expect">foo\\nbar\\n</span>"<br>';
      break;

    case 'templates/01_dotted-includer.fpt': // 7
      contentParagraph.innerHTML = ++i + '. Recursively hydrates variables written in dot.notation:<br>';
      contentParagraph.innerHTML += 'expect to equal "<span class="expect">foo\\nbar\\n</span>"<br>';
      break;

    case 'templates/01_dotted-includer_array.fpt': // 8
      contentParagraph.innerHTML = ++i + '. Recursively hydrates variables within an array written in dot.notation:<br>';
      contentParagraph.innerHTML += 'expect to equal "<span class="expect">foo\\nbar\\n</span>"<br>';
      break;
  }

  if (render) {
    contentParagraph.innerHTML += 'actually equals "<span class="actual">' + render.replace(/\n/g, '\\n') + '</span>"';
    main.appendChild(contentParagraph);
  }
});

var templates1 = {
  'templates/00-base.fpt': '{{ title }}\n{{ message }}\n',
  'templates/00-nested.fpt': '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n',
  'templates/00_nested-includer.fpt': '{{> templates/00-nested }}\n',
  'templates/02-stylemod-atom.fpt': '<span class="test_base {{ styleModifier }}">\n    {{ message }}\n' +
    '    {{ description }}\n</span>\n',
  'templates/02-stylemod-molecule.fpt': // 9
    '{{> templates/02-stylemod-atom:test_1 }}\n',
  'templates/02-stylemod-organism.fpt': // 10
    '{{> templates/02-stylemod-molecule }}\n',
  'templates/02_stylemod-multiple-classes.fpt': // 11
    '{{> templates/02-stylemod-atom:foo1|foo2 }}\n',
  'templates/02_stylemod-param.fpt': // 12
    '{{> templates/02-stylemod-atom:test_2(message: \'1\') }}\n',
  'templates/02_stylemod-param_multiple-classes.fpt': // 13
    '{{> templates/02-stylemod-atom:foo1|foo2(message: "2") }}\n',
  'templates/02~stylemod-multiple-classes-includer.fpt': // 14
    '{{> templates/02_stylemod-multiple-classes }}\n',
  'templates/02~stylemod-param-includer.fpt': // 15
    '{{> templates/02_stylemod-param }}\n',
  'templates/02~stylemod-param_multiple-classes-includer.fpt': // 16
    '{{> templates/02_stylemod-param_multiple-classes }}\n',
  'templates/03-include-self-w-condition.fpt': // 17
    '{{> templates/00_nested-includer }}\n' +
    '{{> templates/00-base(title: "foo") }}\n' +
    '{{# foo }}\n' +
    '  {{> templates/03-include-self-w-condition(bar: true) }}\n' +
    '{{/ foo }}\n' +
    '{{# bar }}\n' +
    '  {{> templates/00-base(title: "bar") }}\n' +
    '{{/ bar }}\n',
  'templates/03_include-self-w-condition-includer.fpt': // 18
    '{{> templates/03-include-self-w-condition(foo: true) }}\n',
  'templates/04-nested-param-same-name-as-non-param.fpt': '{{bez}} {{biz}}\n' +
    '{{#baz}}\n' +
    '  {{bez}} {{biz}}\n' +
    '{{/baz}}\n',
  'templates/04-nested-param-same-name-as-non-param_deep.fpt': '{{biz}} {{boz}}\n' +
    '{{#baz}}{{#bez}}\n' +
    '  {{biz}} {{boz}}\n' +
    '{{/bez}}{{/baz}}\n',
  'templates/04-nested-param-same-name-as-non-param_dotted-inner.fpt': '{{biz.boz}}\n' +
    '{{#baz}}\n' +
    '  {{#bez}}\n' +
    '    {{biz.boz}}\n' +
    '  {{/bez}}\n' +
    '{{/baz}}\n',
  'templates/04-nested-param-same-name-as-non-param_dotted-middle.fpt': '{{#bez.biz}}\n' +
    '  {{boz}}\n' +
    '{{/bez.biz}}\n' +
    '{{#baz}}\n' +
    '  {{#bez.biz}}\n' +
    '    {{boz}}\n' +
    '  {{/bez.biz}}\n' +
    '{{/baz}}\n',
  'templates/04_nested-param-same-name-as-non-param-includer.fpt': // 19
    '{{> templates/04-nested-param-same-name-as-non-param(baz: { bez: "hick", biz: "hock" }) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_array.fpt': // 20
    '{{> templates/04-nested-param-same-name-as-non-param(\n  baz: [\n    { bez: "hick", biz: "hock" },\n' +
    '    { bez: "huck", biz: "hyck" }\n  ]\n) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_deep.fpt': // 21
    '{{> templates/04-nested-param-same-name-as-non-param_deep(baz: { bez: { biz: "hick", boz: "hock" } }) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt': // 22
    '{{> templates/04-nested-param-same-name-as-non-param_dotted-inner(baz: { bez: { biz: { boz: "heck" } } }) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt': // 23
    '{{> templates/04-nested-param-same-name-as-non-param_dotted-inner(\n' +
    '  baz: {\n' +
    '    bez: [\n' +
    '      {\n' +
    '        biz: {\n' +
    '          boz: "heck"\n' +
    '        }\n' +
    '      },\n' +
    '      {\n' +
    '        biz: {\n' +
    '          boz: "hick"\n' +
    '        }\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    ') }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt': // 24
    '{{> templates/04-nested-param-same-name-as-non-param_dotted-middle(baz: { bez: { biz: { boz: "heck" } } }) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt': // 25
    '{{> templates/04-nested-param-same-name-as-non-param_dotted-middle(\n' +
    '  baz: {\n' +
    '    bez: {\n' +
    '      biz: [\n' +
    '        {\n' +
    '          boz: "hick"\n' +
    '        },\n' +
    '        {\n' +
    '          boz: "hock"\n' +
    '        }\n' +
    '      ]\n' +
    '    }\n' +
    '  }\n' +
    ') }}\n',
  'templates/05-dotted-param.fpt': '{{#baz.bez}}\n' +
    '  {{biz}}\n' +
    '{{/baz.bez}}\n',
  'templates/05-dotted-param_nested-in-non-param.fpt': '{{#baz}}\n' +
    '  {{bez}}\n' +
    '  {{#biz.boz}}\n' +
    '    {{{buz}}}\n' +
    '  {{/biz.boz}}\n' +
    '{{/baz}}\n',
  'templates/05-dotted-param_nested-in-non-param_aside.fpt': '{{#baz}}\n' +
    '  {{#bez.biz}}\n' +
    '    {{{byz}}}\n' +
    '  {{/bez.biz}}\n' +
    '  {{#boz.buz}}\n' +
    '    {{{byz}}}\n' +
    '  {{/boz.buz}}\n' +
    '{{/baz}}\n',
  'templates/05-dotted-param_nested-in-non-param_nested.fpt': '{{#baz}}\n' +
    '  {{#bez.biz.boz}}\n' +
    '    {{{buz.byz}}}\n' +
    '  {{/bez.biz.boz}}\n' +
    '{{/baz}}\n',
  'templates/05_dotted-param-includer.fpt': // 26
    '{{> templates/05-dotted-param(baz: { bez: { biz: "hack" } }) }}\n',
  'templates/05_dotted-param-includer_array.fpt': // 27
    '{{> templates/05-dotted-param(\n' +
    '  baz: {\n' +
    '    bez: [\n' +
    '      {\n' +
    '        biz: "hack"\n' +
    '      },\n' +
    '      {\n' +
    '        biz: "heck"\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    ') }}\n',
  'templates/05_dotted-param-includer_nested-in-non-param.fpt': // 28
    '{{> templates/05-dotted-param_nested-in-non-param(biz: { boz: { buz: "heck" } }) }}\n',
  'templates/05_dotted-param-includer_nested-in-non-param_array.fpt': // 29
    '{{> templates/05-dotted-param_nested-in-non-param(\n' +
    '  biz: {\n' +
    '    boz: [\n' +
    '      {\n' +
    '        buz: "heck"\n' +
    '      },\n' +
    '      {\n' +
    '        buz: "hick"\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    ') }}\n',
  'templates/05_dotted-param-includer_nested-in-non-param_aside.fpt': // 30
    '{{> 05-dotted-param_nested-in-non-param_aside(\n' +
    '  bez: {\n' +
    '    biz: {\n' +
    '      byz: \'heck\'\n' +
    '    }\n' +
    '  },\n' +
    '  boz: {\n' +
    '    buz: {\n' +
    '      byz: \'hick\'\n' +
    '    }\n' +
    '  }\n' +
    ') }}\n',
  'templates/05_dotted-param-includer_nested-in-non-param_nested.fpt': // 31
    '{{> 05-dotted-param_nested-in-non-param_nested(bez: { biz: { boz: { buz: { byz: \'heck\' } } } } ) }}\n',
  'templates/06-dotted-array-param-inner.fpt': '{{#baz}}\n' +
    '  {{#bez}}\n' +
    '    {{biz.1.boz}}\n' +
    '  {{/bez}}\n' +
    '{{/baz}}\n',
  'templates/06-dotted-array-param-middle.fpt': '{{#baz}}\n' +
    '  {{#bez.1.biz}}\n' +
    '    {{boz}}\n' +
    '  {{/bez.1.biz}}\n' +
    '{{/baz}}\n',
  'templates/06-dotted-array-param-outer.fpt': '{{#baz.1.bez}}\n' +
    '  {{biz}}\n' +
    '{{/baz.1.bez}}\n',
  'templates/06_dotted-array-param-inner-includer.fpt': // 32
    '{{> templates/06-dotted-array-param-inner(\n' +
    '  baz: {\n' +
    '    bez: {\n' +
    '      biz: [\n' +
    '        {\n' +
    '          boz: "hack"\n' +
    '        },\n' +
    '        {\n' +
    '          boz: "heck"\n' +
    '        },\n' +
    '        {\n' +
    '          boz: "hick"\n' +
    '        }\n' +
    '      ]\n' +
    '    }\n' +
    '  }\n' +
    ') }}\n',
  'templates/06_dotted-array-param-middle-includer.fpt': // 33
    '{{> templates/06-dotted-array-param-middle(\n' +
    '  baz: {\n' +
    '    bez: [\n' +
    '      {\n' +
    '        biz: {\n' +
    '          boz: "hack"\n' +
    '        }\n' +
    '      },\n' +
    '      {\n' +
    '        biz: {\n' +
    '          boz: "heck"\n' +
    '        }\n' +
    '      },\n' +
    '      {\n' +
    '        biz: {\n' +
    '          boz: "hick"\n' +
    '        }\n' +
    '      }\n' +
    '    ]\n' +
    '  }\n' +
    ') }}\n',
  'templates/06_dotted-array-param-outer-includer.fpt': // 34
    '{{> templates/06-dotted-array-param-outer(\n' +
    '  baz: [\n' +
    '    {\n' +
    '      bez: {\n' +
    '        biz: "hack"\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      bez: {\n' +
    '        biz: "heck"\n' +
    '      }\n' +
    '    },\n' +
    '    {\n' +
    '      bez: {\n' +
    '        biz: "hick"\n' +
    '      }\n' +
    '    }\n' +
    '  ]\n' +
    ') }}\n'
};

Object.keys(templates1).forEach(function (template) {
  var feplet;

  switch (template) {
    case 'templates/02-stylemod-molecule.fpt': // 9
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      break;

    case 'templates/02-stylemod-organism.fpt': // 10
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02-stylemod-molecule', templates1['templates/02-stylemod-molecule.fpt']);
      break;

    case 'templates/02_stylemod-multiple-classes.fpt': // 11
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      break;

    case 'templates/02_stylemod-param.fpt': // 12
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      break;

    case 'templates/02_stylemod-param_multiple-classes.fpt': // 13
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      break;

    case 'templates/02~stylemod-multiple-classes-includer.fpt': // 14
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02_stylemod-multiple-classes', templates1['templates/02_stylemod-multiple-classes.fpt']);
      break;

    case 'templates/02~stylemod-param-includer.fpt': // 15
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02_stylemod-param', templates1['templates/02_stylemod-param.fpt']);
      break;

    case 'templates/02~stylemod-param_multiple-classes-includer.fpt': // 16
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02_stylemod-param_multiple-classes', templates1['templates/02_stylemod-param_multiple-classes.fpt']);
      break;

    case 'templates/03-include-self-w-condition.fpt': // 17
      feplet = new Feplet(
        {
          check: [],
          i18n: true,
          heck: 'hack',
          bar: true,
          title: 'TITLE',
          message: 'MESSAGE'
        }
      );
      feplet.registerPartial('templates/00-base', templates1['templates/00-base.fpt']);
      feplet.registerPartial('templates/00-nested', templates1['templates/00-nested.fpt']);
      feplet.registerPartial('templates/00_nested-includer', templates1['templates/00_nested-includer.fpt']);
      feplet.registerPartial('templates/03-include-self-w-condition', templates1['templates/03-include-self-w-condition.fpt']);
      break;

    case 'templates/03_include-self-w-condition-includer.fpt': // 18
      feplet = new Feplet(
        {
          check: [],
          i18n: true,
          heck: 'hack',
          bar: true,
          title: 'TITLE',
          message: 'MESSAGE'
        }
      );
      feplet.registerPartial('templates/00-base', templates1['templates/00-base.fpt']);
      feplet.registerPartial('templates/00-nested', templates1['templates/00-nested.fpt']);
      feplet.registerPartial('templates/00_nested-includer', templates1['templates/00_nested-includer.fpt']);
      feplet.registerPartial('templates/03-include-self-w-condition', templates1['templates/03-include-self-w-condition.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer.fpt': // 19
      feplet = new Feplet(
        {
          bez: 'hack',
          biz: 'heck'
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param', templates1['templates/04-nested-param-same-name-as-non-param.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_array.fpt': // 20
      feplet = new Feplet(
        {
          bez: 'hack',
          biz: 'heck'
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param', templates1['templates/04-nested-param-same-name-as-non-param.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_deep.fpt': // 21
      feplet = new Feplet(
        {
          biz: 'hack',
          boz: 'heck'
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param_deep', templates1['templates/04-nested-param-same-name-as-non-param_deep.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt': // 22
      feplet = new Feplet(
        {
          biz: {
            boz: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param_dotted-inner', templates1['templates/04-nested-param-same-name-as-non-param_dotted-inner.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt': // 23
      feplet = new Feplet(
        {
          biz: {
            boz: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param_dotted-inner', templates1['templates/04-nested-param-same-name-as-non-param_dotted-inner.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt': // 24
      feplet = new Feplet(
        {
          bez: {
            biz: {
              boz: 'hack'
            }
          }
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param_dotted-middle', templates1['templates/04-nested-param-same-name-as-non-param_dotted-middle.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt': // 25
      feplet = new Feplet(
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
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param_dotted-middle', templates1['templates/04-nested-param-same-name-as-non-param_dotted-middle.fpt']);
      break;

    case 'templates/05_dotted-param-includer.fpt': // 26
      feplet = new Feplet({});
      feplet.registerPartial('templates/05-dotted-param', templates1['templates/05-dotted-param.fpt']);
      break;

    case 'templates/05_dotted-param-includer_array.fpt': // 27
      feplet = new Feplet({});
      feplet.registerPartial('templates/05-dotted-param', templates1['templates/05-dotted-param.fpt']);
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param.fpt': // 28
      feplet = new Feplet(
        {
          baz: {
            bez: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/05-dotted-param_nested-in-non-param', templates1['templates/05-dotted-param_nested-in-non-param.fpt']);
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param_array.fpt': // 29
      feplet = new Feplet(
        {
          baz: {
            bez: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/05-dotted-param_nested-in-non-param', templates1['templates/05-dotted-param_nested-in-non-param.fpt']);
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param_aside.fpt': // 30
      feplet = new Feplet(
        {
          baz: {
            byz: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/05-dotted-param_nested-in-non-param_aside', templates1['templates/05-dotted-param_nested-in-non-param_aside.fpt']);
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param_nested.fpt': // 31
      feplet = new Feplet(
        {
          baz: {
            byz: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/05-dotted-param_nested-in-non-param_nested', templates1['templates/05-dotted-param_nested-in-non-param_nested.fpt']);
      break;

    case 'templates/06_dotted-array-param-inner-includer.fpt': // 32
      feplet = new Feplet({});
      feplet.registerPartial('templates/06-dotted-array-param-inner', templates1['templates/06-dotted-array-param-inner.fpt']);
      break;

    case 'templates/06_dotted-array-param-middle-includer.fpt': // 33
      feplet = new Feplet({});
      feplet.registerPartial('templates/06-dotted-array-param-middle', templates1['templates/06-dotted-array-param-middle.fpt']);
      break;

    case 'templates/06_dotted-array-param-outer-includer.fpt': // 34
      feplet = new Feplet({});
      feplet.registerPartial('templates/06-dotted-array-param-outer', templates1['templates/06-dotted-array-param-outer.fpt']);
      break;
  }

  var contentParagraph;
  var render;

  if (feplet) {
    render = feplet.render(templates1[template]);
    render = render.replace(/\n/g, '\\n').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    contentParagraph = document.createElement('p');
    contentParagraph.className = 'assert';
  }

  switch (template) {
    case 'templates/02-stylemod-molecule.fpt': // 9
      contentParagraph.innerHTML = ++i + '. Hydrates templates with variables passed per the Pattern Lab styleModifier convention:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">&lt;span class="test_base test_1"&gt;\\n    MESSAGE\\n    DESCRIPTION\\n&lt;/span&gt;\\n</span>\'<br>';
      break;

    case 'templates/02-stylemod-organism.fpt': // 10
      contentParagraph.innerHTML = ++i + '. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">&lt;span class="test_base test_1"&gt;\\n    MESSAGE\\n    DESCRIPTION\\n&lt;/span&gt;\\n</span>\'<br>';
      break;

    case 'templates/02_stylemod-multiple-classes.fpt': // 11
      contentParagraph.innerHTML = ++i + '. Hydrates templates with multiple classes passed per Pattern Lab styleModifier:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">&lt;span class="test_base foo1 foo2"&gt;\\n    MESSAGE\\n    DESCRIPTION\\n&lt;/span&gt;\\n</span>\'<br>';
      break;

    case 'templates/02_stylemod-param.fpt': // 12
      contentParagraph.innerHTML = ++i + '. Hydrates templates with both data parameters and a Pattern Lab styleModifier:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">&lt;span class="test_base test_2"&gt;\\n    1\\n    DESCRIPTION\\n&lt;/span&gt;\\n</span>\'<br>';
      break;

    case 'templates/02_stylemod-param_multiple-classes.fpt': // 13
      contentParagraph.innerHTML = ++i + '. Hydrates templates with both data parameters and a styleModifier with multiple classes:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">&lt;span class="test_base foo1 foo2"&gt;\\n    2\\n    DESCRIPTION\\n&lt;/span&gt;\\n</span>\'<br>';
      break;

    case 'templates/02~stylemod-multiple-classes-includer.fpt': // 14
      contentParagraph.innerHTML = ++i + '. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">&lt;span class="test_base foo1 foo2"&gt;\\n    MESSAGE\\n    DESCRIPTION\\n&lt;/span&gt;\\n</span>\'<br>';
      break;

    case 'templates/02~stylemod-param-includer.fpt': // 15
      contentParagraph.innerHTML = ++i + '. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">&lt;span class="test_base test_2"&gt;\\n    1\\n    DESCRIPTION\\n&lt;/span&gt;\\n</span>\'<br>';
      break;

    case 'templates/02~stylemod-param_multiple-classes-includer.fpt': // 16
      contentParagraph.innerHTML = ++i + '. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">&lt;span class="test_base foo1 foo2"&gt;\\n    2\\n    DESCRIPTION\\n&lt;/span&gt;\\n</span>\'<br>';
      break;

    case 'templates/03-include-self-w-condition.fpt': // 17
      contentParagraph.innerHTML = ++i + '. Shuts off otherwise infinite recursion paths with default false conditions:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">No\\n\\nfoo\\nMESSAGE\\n  bar\\n  MESSAGE\\n</span>\'<br>';
      break;

    case 'templates/03_include-self-w-condition-includer.fpt': // 18
      contentParagraph.innerHTML = ++i + '. Shuts off otherwise infinite recursion paths when flagged to do so by parameters:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">No\\n\\nfoo\\nMESSAGE\\n  No\\n\\nfoo\\nMESSAGE\\n  bar\\n  MESSAGE\\n  bar\\n  MESSAGE\\n</span>\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer.fpt': // 19
      contentParagraph.innerHTML = ++i + '. Renders a nested parameter variable differently than a non-parameter variable of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">hack heck\\n  hick hock\\n</span>\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_array.fpt': // 20
      contentParagraph.innerHTML = ++i + '. Renders an array of nested parameter variables differently from non-parameter variables of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">hack heck\\n  hick hock\\n  huck hyck\\n</span>\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_deep.fpt': // 21
      contentParagraph.innerHTML = ++i + '. Renders a more deeply nested parameter variable differently then a non-parameter variable of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">hack heck\\n  hick hock\\n</span>\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt': // 22
      contentParagraph.innerHTML = ++i + '. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">hack\\n    heck\\n</span>\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt': // 23
      contentParagraph.innerHTML = ++i + '. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">hack\\n    heck\\n    hick\\n</span>\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt': // 24
      contentParagraph.innerHTML = ++i + '. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">  hack\\n    heck\\n</span>\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt': // 25
      contentParagraph.innerHTML = ++i + '. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">  hack\\n  heck\\n    hick\\n    hock\\n</span>\'<br>';
      break;

    case 'templates/05_dotted-param-includer.fpt': // 26
      contentParagraph.innerHTML = ++i + '. Renders a top-level dot.notation parameter that nests more tags:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">  hack\\n</span>\'<br>';
      break;

    case 'templates/05_dotted-param-includer_array.fpt': // 27
      contentParagraph.innerHTML = ++i + '. Renders an array of top-level dot.notation parameters that nest more tags:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">  hack\\n  heck\\n</span>\'<br>';
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param.fpt': // 28
      contentParagraph.innerHTML = ++i + '. Renders a dot.notation parameter nested within a non-parameter:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">  hack\\n    heck\\n</span>\'<br>';
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param_array.fpt': // 29
      contentParagraph.innerHTML = ++i + '. Renders an array of dot.notation parameters nested within a non-parameter:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">  hack\\n    heck\\n    hick\\n</span>\'<br>';
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param_aside.fpt': // 30
      contentParagraph.innerHTML = ++i + '. Renders dot.notation parameters nested aside each other within a non-parameter:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">    heck\\n    hick\\n</span>\'<br>';
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param_nested.fpt': // 31
      contentParagraph.innerHTML = ++i + '. Renders dot.notation parameter nested within another within a non-parameter:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">    heck\\n</span>\'<br>';
      break;

    case 'templates/06_dotted-array-param-inner-includer.fpt': // 32
      contentParagraph.innerHTML = ++i + '. Renders a deeply nested dot.notation parameter containing an array:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">    heck\\n</span>\'<br>';
      break;

    case 'templates/06_dotted-array-param-middle-includer.fpt': // 33
      contentParagraph.innerHTML = ++i + '. Renders a moderately nested dot.notation parameter containing an array:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">    heck\\n</span>\'<br>';
      break;

    case 'templates/06_dotted-array-param-outer-includer.fpt': // 34
      contentParagraph.innerHTML = ++i + '. Renders a top-level dot.notation parameter containing an array:<br>';
      contentParagraph.innerHTML += 'expect to equal \'<span class="expect">  heck\\n</span>\'<br>';
      break;
  }

  if (render) {
    contentParagraph.innerHTML += 'actually equals \'<span class="actual">' + render + '</span>\'';
    main.appendChild(contentParagraph);
  }
});

var assertions = document.querySelectorAll('.assert');
Array.prototype.filter.call(assertions, function (assertion) {
  var expect = assertion.querySelector('.expect');
  var actual = assertion.querySelector('.actual');

  if (expect.innerHTML === actual.innerHTML) {
    expect.setAttribute('style', 'color: #0a0;');
    actual.setAttribute('style', 'color: #0a0;');
  }
  else {
    expect.setAttribute('style', 'color: #f00;');
    actual.setAttribute('style', 'color: #f00;');
  }
});
