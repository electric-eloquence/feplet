var i = 0;
var main = document.getElementById('main');

var templates = {
  'templates/00-base.fpt': '{{ title }}\n' +
'{{ message }}\n',
  'templates/00-nested.fpt': '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n' +
'{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n',
  'templates/00-array.fpt': '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n' +
'{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n',
  'templates/01-dotted.fpt': '{{ dot.title }}\n' +
'{{ dot.message }}\n',
  'templates/01-dotted_array.fpt': '{{ dot.0.title }}\n' +
'{{ dot.0.message }}\n',
  'templates/00_base.fpt': '{{> templates/00-base }}\n',
  'templates/00_nested.fpt': '{{> templates/00-nested }}\n',
  'templates/00_array.fpt': '{{> templates/00-nested }}\n',
  'templates/01_dotted.fpt': '{{> templates/01-dotted(dot: { title: "foo", message: "bar" }) }}\n',
  'templates/01_dotted_array.fpt': '{{> templates/01-dotted_array(dot: [{ title: "foo", message: "bar" }]) }}'
};

Object.keys(templates).forEach(function (template) {
  var context;
  var partials;

  switch (template) {
    case 'templates/00-base.fpt':
      context = {
        title: 'foo',
        message: 'bar'
      };
      break;

    case 'templates/00-nested.fpt':
      context = {
        check: {
          i18n: true
        }
      };
      break;

    case 'templates/00-array.fpt':
      context = {
        check: [
          {
            i18n: true
          }
        ]
      };
      break;

    case 'templates/01-dotted.fpt':
      context = {
        dot: {
          title: 'foo',
          message: 'bar'
        }
      };
      break;

    case 'templates/01-dotted_array.fpt':
      context = {
        dot: [
          {
            title: 'foo',
            message: 'bar'
          }
        ]
      };
      break;

    case 'templates/00_base.fpt':
      context = {
        title: 'foo',
        message: 'bar'
      };
      partials = {
        'templates/00-base': templates['templates/00-base.fpt']
      };
      break;

    case 'templates/00_nested.fpt':
      context = {
        check: {
          i18n: true
        }
      };
      partials = {
        'templates/00-nested': templates['templates/00-nested.fpt']
      };
      break;

    case 'templates/00_array.fpt':
      context = {
        check: [
          {
            i18n: true
          }
        ]
      };
      partials = {
        'templates/00-nested': templates['templates/00-nested.fpt']
      };
      break;

    case 'templates/01_dotted.fpt':
      partials = {
        'templates/01-dotted': templates['templates/01-dotted.fpt']
      };
      break;

    case 'templates/01_dotted_array.fpt':
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
  }

  switch (template) {
    case 'templates/00-base.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate templates with variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "foo\\nbar\\n"<br>';
      break;

    case 'templates/00-nested.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate templates with nested variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "\\nYes\\n"<br>';
      break;

    case 'templates/00-array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate templates with an array of variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "\\nYes\\n"<br>';
      break;

    case 'templates/01-dotted.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate variables written in dot.notation:<br>';
      contentParagraph.innerHTML += 'expect to equal "foo\\nbar\\n"<br>';
      break;

    case 'templates/01-dotted_array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate variables within an array written in dot.notation:<br>';
      contentParagraph.innerHTML += 'expect to equal "foo\\nbar\\n"<br>';
      break;

    case 'templates/00_base.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate templates with variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "foo\\nbar\\n"<br>';
      break;

    case 'templates/00_nested.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate templates with nested variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "\\nYes\\n"<br>';
      break;

    case 'templates/00_array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate templates with an array of variables:<br>';
      contentParagraph.innerHTML += 'expect to equal "\\nYes\\n"<br>';
      break;

    case 'templates/01_dotted.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate variables written in dot.notation:<br>';
      contentParagraph.innerHTML += 'expect to equal "foo\\nbar\\n"<br>';
      break;

    case 'templates/01_dotted_array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate variables within an array written in dot.notation:<br>';
      contentParagraph.innerHTML += 'expect to equal "foo\\nbar\\n"<br>';
      break;
  }

  if (render) {
    contentParagraph.innerHTML += 'actually equals "' + render.replace(/\n/g, '\\n') + '"';
    main.appendChild(contentParagraph);
  }
});

var templates1 = {
  'templates/00-base.fpt': '{{ title }}\n' +
'{{ message }}\n',
  'templates/00-nested.fpt': '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n' +
'{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n',
  'templates/00_nested.fpt': '{{> templates/00-nested }}\n',
  'templates/02-stylemod-atom.fpt': '<span class="test_base {{ styleModifier }}">\n' +
'    {{ message }}\n' +
'    {{ description }}\n' +
'</span>\n',
  'templates/02-stylemod-molecule.fpt': '{{> templates/02-stylemod-atom:test_1 }}\n',
  'templates/02-stylemod-organism.fpt': '{{> templates/02-stylemod-molecule }}\n',
  'templates/02_stylemod-multiple-classes.fpt': '{{> templates/02-stylemod-atom:foo1|foo2 }}\n',
  'templates/02_stylemod-param.fpt': '{{> templates/02-stylemod-atom:test_2(message: "1") }}\n',
  'templates/02_stylemod-param_multiple-classes.fpt': '{{> templates/02-stylemod-atom:foo1|foo2(message: "2") }}\n',
  'templates/02~stylemod-multiple-classes-includer.fpt': '{{> templates/02_stylemod-multiple-classes }}\n',
  'templates/02~stylemod-param-includer.fpt': '{{> templates/02_stylemod-param }}\n',
  'templates/02~stylemod-param_multiple-classes-includer.fpt': '{{> templates/02_stylemod-param_multiple-classes }}\n',
  'templates/03-include-self-w-condition.fpt': '{{> templates/00_nested }}\n' +
'{{> templates/00-base(title: "foo") }}\n' +
'{{# foo }}\n' +
'  {{> templates/03-include-self-w-condition(bar: true) }}\n' +
'{{/ foo }}\n' +
'{{# bar }}\n' +
'  {{> templates/00-base(title: "bar") }}\n' +
'{{/ bar }}\n',
  'templates/03_include-self-w-condition-includer.fpt': '{{> templates/03-include-self-w-condition(foo: true) }}\n',
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
  'templates/04_nested-param-same-name-as-non-param-includer.fpt': '{{> templates/04-nested-param-same-name-as-non-param(baz: { bez: "hick", biz: "hock" }) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_array.fpt': '{{> templates/04-nested-param-same-name-as-non-param(\n' +
'  baz: [\n' +
'    { bez: "hick", biz: "hock" },\n' +
'    { bez: "huck", biz: "hyck" }\n' +
'  ]\n' +
') }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_deep.fpt': '{{> templates/04-nested-param-same-name-as-non-param_deep(baz: { bez: { biz: "hick", boz: "hock" } }) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt': '{{> templates/04-nested-param-same-name-as-non-param_dotted-inner(baz: { bez: { biz: { boz: "heck" } } }) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt': '{{> templates/04-nested-param-same-name-as-non-param_dotted-inner(\n' +
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
  'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt': '{{> templates/04-nested-param-same-name-as-non-param_dotted-middle(baz: { bez: { biz: { boz: "heck" } } }) }}\n',
  'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt': '{{> templates/04-nested-param-same-name-as-non-param_dotted-middle(\n' +
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
'    {{buz}}\n' +
'  {{/biz.boz}}\n' +
'{{/baz}}\n',
  'templates/05_dotted-param-includer.fpt': '{{> templates/05-dotted-param(baz: { bez: { biz: "hack" } }) }}\n',
  'templates/05_dotted-param-includer_array.fpt': '{{> templates/05-dotted-param(\n' +
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
  'templates/05_dotted-param-includer_nested-in-non-param.fpt': '{{> templates/05-dotted-param_nested-in-non-param(biz: { boz: { buz: "heck" } }) }}\n',
  'templates/05_dotted-param-includer_nested-in-non-param_array.fpt': '{{> templates/05-dotted-param_nested-in-non-param(\n' +
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
  'templates/06_dotted-array-param-inner-includer.fpt': '{{> templates/06-dotted-array-param-inner(\n' +
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
  'templates/06_dotted-array-param-middle-includer.fpt': '{{> templates/06-dotted-array-param-middle(\n' +
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
  'templates/06-dotted-array-param-outer.fpt': '{{#baz.1.bez}}\n' +
'  {{biz}}\n' +
'{{/baz.1.bez}}\n',
  'templates/06_dotted-array-param-outer-includer.fpt': '{{> templates/06-dotted-array-param-outer(\n' +
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
    case 'templates/02-stylemod-molecule.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      break;

    case 'templates/02-stylemod-organism.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02-stylemod-molecule', templates1['templates/02-stylemod-molecule.fpt']);
      break;

    case 'templates/02-stylemod-organism.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02-stylemod-molecule', templates1['templates/02-stylemod-molecule.fpt']);
      break;

    case 'templates/02_stylemod-multiple-classes.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      break;

    case 'templates/02_stylemod-param.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      break;

    case 'templates/02_stylemod-param_multiple-classes.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      break;

    case 'templates/02~stylemod-multiple-classes-includer.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02_stylemod-multiple-classes', templates1['templates/02_stylemod-multiple-classes.fpt']);
      break;

    case 'templates/02~stylemod-param-includer.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02_stylemod-param', templates1['templates/02_stylemod-param.fpt']);
      break;

    case 'templates/02~stylemod-param_multiple-classes-includer.fpt':
      feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      feplet.registerPartial('templates/02-stylemod-atom', templates1['templates/02-stylemod-atom.fpt']);
      feplet.registerPartial('templates/02_stylemod-param_multiple-classes', templates1['templates/02_stylemod-param_multiple-classes.fpt']);
      break;

    case 'templates/03-include-self-w-condition.fpt':
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
      feplet.registerPartial('templates/00_nested', templates1['templates/00_nested.fpt']);
      feplet.registerPartial('templates/03-include-self-w-condition', templates1['templates/03-include-self-w-condition.fpt']);
      break;

    case 'templates/03_include-self-w-condition-includer.fpt':
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
      feplet.registerPartial('templates/00_nested', templates1['templates/00_nested.fpt']);
      feplet.registerPartial('templates/03-include-self-w-condition', templates1['templates/03-include-self-w-condition.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer.fpt':
      feplet = new Feplet(
        {
          bez: 'hack',
          biz: 'heck'
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param', templates1['templates/04-nested-param-same-name-as-non-param.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_array.fpt':
      feplet = new Feplet(
        {
          bez: 'hack',
          biz: 'heck'
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param', templates1['templates/04-nested-param-same-name-as-non-param.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_deep.fpt':
      feplet = new Feplet(
        {
          biz: 'hack',
          boz: 'heck'
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param_deep', templates1['templates/04-nested-param-same-name-as-non-param_deep.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt':
      feplet = new Feplet(
        {
          biz: {
            boz: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param_dotted-inner', templates1['templates/04-nested-param-same-name-as-non-param_dotted-inner.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt':
      feplet = new Feplet(
        {
          biz: {
            boz: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/04-nested-param-same-name-as-non-param_dotted-inner', templates1['templates/04-nested-param-same-name-as-non-param_dotted-inner.fpt']);
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt':
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

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt':
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

    case 'templates/05_dotted-param-includer.fpt':
      feplet = new Feplet({});
      feplet.registerPartial('templates/05-dotted-param', templates1['templates/05-dotted-param.fpt']);
      break;

    case 'templates/05_dotted-param-includer_array.fpt':
      feplet = new Feplet({});
      feplet.registerPartial('templates/05-dotted-param', templates1['templates/05-dotted-param.fpt']);
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param.fpt':
      feplet = new Feplet(
        {
          baz: {
            bez: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/05-dotted-param_nested-in-non-param', templates1['templates/05-dotted-param_nested-in-non-param.fpt']);
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param_array.fpt':
      feplet = new Feplet(
        {
          baz: {
            bez: 'hack'
          }
        }
      );
      feplet.registerPartial('templates/05-dotted-param_nested-in-non-param', templates1['templates/05-dotted-param_nested-in-non-param.fpt']);
      break;

    case 'templates/06_dotted-array-param-inner-includer.fpt':
      feplet = new Feplet({});
      feplet.registerPartial('templates/06-dotted-array-param-inner', templates1['templates/06-dotted-array-param-inner.fpt']);
      break;

    case 'templates/06_dotted-array-param-middle-includer.fpt':
      feplet = new Feplet({});
      feplet.registerPartial('templates/06-dotted-array-param-middle', templates1['templates/06-dotted-array-param-middle.fpt']);
      break;

    case 'templates/06_dotted-array-param-outer-includer.fpt':
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
  }

  switch (template) {
    case 'templates/02-stylemod-molecule.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate templates with variables passed per the Pattern Lab styleModifier convention:<br>';
      contentParagraph.innerHTML += 'expect to equal \'&lt;span class="test_base test_1"&gt;\\n    MESSAGE\\n    DESCRIPTION\\n&lt;/span&gt;\\n\'<br>';
      break;

    case 'templates/02-stylemod-organism.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate templates with variables passed per the Pattern Lab styleModifier convention:<br>';
      contentParagraph.innerHTML += 'expect to equal \'&lt;span class="test_base test_1"&gt;\\n    MESSAGE\\n    DESCRIPTION\\n&lt;/span&gt;\\n\'<br>';
      break;

    case 'templates/02_stylemod-multiple-classes.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate templates with multiple classes passed per Pattern Lab styleModifier:<br>';
      contentParagraph.innerHTML += 'expect to equal \'&lt;span class="test_base foo1 foo2"&gt;\\n    MESSAGE\\n    DESCRIPTION\\n&lt;/span&gt;\\n\'<br>';
      break;

    case 'templates/02_stylemod-param.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate templates with both data parameters and a Pattern Lab styleModifier:<br>';
      contentParagraph.innerHTML += 'expect to equal \'&lt;span class="test_base test_2"&gt;\\n    1\\n    DESCRIPTION\\n&lt;/span&gt;\\n\'<br>';
      break;

    case 'templates/02_stylemod-param_multiple-classes.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should hydrate templates with both data parameters and a styleModifier with multiple classes:<br>';
      contentParagraph.innerHTML += 'expect to equal \'&lt;span class="test_base foo1 foo2"&gt;\\n    2\\n    DESCRIPTION\\n&lt;/span&gt;\\n\'<br>';
      break;

    case 'templates/02~stylemod-multiple-classes-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate templates with multiple classes passed per Pattern Lab styleModifier:<br>';
      contentParagraph.innerHTML += 'expect to equal \'&lt;span class="test_base foo1 foo2"&gt;\\n    MESSAGE\\n    DESCRIPTION\\n&lt;/span&gt;\\n\'<br>';
      break;

    case 'templates/02~stylemod-param-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate templates with both data parameters and a Pattern Lab styleModifier:<br>';
      contentParagraph.innerHTML += 'expect to equal \'&lt;span class="test_base test_2"&gt;\\n    1\\n    DESCRIPTION\\n&lt;/span&gt;\\n\'<br>';
      break;

    case 'templates/02~stylemod-param_multiple-classes-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should recursively hydrate templates with both data parameters and a styleModifier with multiple classes:<br>';
      contentParagraph.innerHTML += 'expect to equal \'&lt;span class="test_base foo1 foo2"&gt;\\n    2\\n    DESCRIPTION\\n&lt;/span&gt;\\n\'<br>';
      break;

    case 'templates/03-include-self-w-condition.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should shut off otherwise infinite recursion paths with default false conditions:<br>';
      contentParagraph.innerHTML += 'expect to equal \'No\\n\\nfoo\\nMESSAGE\\n  bar\\n  MESSAGE\\n\'<br>';
      break;

    case 'templates/03_include-self-w-condition-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should shut off otherwise infinite recursion paths when flagged to do so by parameters:<br>';
      contentParagraph.innerHTML += 'expect to equal \'No\\n\\nfoo\\nMESSAGE\\n  No\\n\\nfoo\\nMESSAGE\\n  bar\\n  MESSAGE\\n  bar\\n  MESSAGE\\n\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a nested parameter variable differently than a non-parameter variable of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'hack heck\\n  hick hock\\n\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render an array of nested parameter variables differently from non-parameter variables of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'hack heck\\n  hick hock\\n  huck hyck\\n\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_deep.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a more deeply nested parameter variable differently then a non-parameter variable of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'hack heck\\n  hick hock\\n\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a deeply nested dot.notation parameter differently than a non-parameter variable of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'hack\\n    heck\\n\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a deeply nested array of dot.notation parameters differently than non-parameter variables of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'hack\\n    heck\\n    hick\\n\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a moderately nested dot.notation parameter differently than a non-parameter variable of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'  hack\\n    heck\\n\'<br>';
      break;

    case 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a moderately nested array of dot.notation parameters differently than non-parameter variables of the same name:<br>';
      contentParagraph.innerHTML += 'expect to equal \'  hack\\n  heck\\n    hick\\n    hock\\n\'<br>';
      break;

    case 'templates/05_dotted-param-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a top-level dot.notation parameter that nests more tags:<br>';
      contentParagraph.innerHTML += 'expect to equal \'  hack\\n\'<br>';
      break;

    case 'templates/05_dotted-param-includer_array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render an array of top-level dot.notation parameters that nest more tags:<br>';
      contentParagraph.innerHTML += 'expect to equal \'  hack\\n  heck\\n\'<br>';
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a dot.notation parameter nested within a non-parameter:<br>';
      contentParagraph.innerHTML += 'expect to equal \'  hack\\n    heck\\n\'<br>';
      break;

    case 'templates/05_dotted-param-includer_nested-in-non-param_array.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render an array of dot.notation parameters nested within a non-parameter:<br>';
      contentParagraph.innerHTML += 'expect to equal \'  hack\\n    heck\\n    hick\\n\'<br>';
      break;

    case 'templates/06_dotted-array-param-inner-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a deeply nested dot.notation parameter containing an array:<br>';
      contentParagraph.innerHTML += 'expect to equal \'    heck\\n\'<br>';
      break;

    case 'templates/06_dotted-array-param-middle-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a moderately nested dot.notation parameter containing an array:<br>';
      contentParagraph.innerHTML += 'expect to equal \'    heck\\n\'<br>';
      break;

    case 'templates/06_dotted-array-param-outer-includer.fpt':
      contentParagraph.innerHTML = '' + ++i + '. Should render a top-level dot.notation parameter containing an array:<br>';
      contentParagraph.innerHTML += 'expect to equal \'  heck\\n\'<br>';
      break;
  }

  if (render) {
    contentParagraph.innerHTML += 'actually equals \'' + render + '\'';
    main.appendChild(contentParagraph);
  }
});
