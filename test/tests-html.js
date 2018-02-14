var templates;
var i;
var partials;
var templateText;
var render;

var main = document.getElementById('main');

templates = {
  'templates/00-base.fpt': '{{ title }}\n' +
'{{ message }}\n',
  'templates/00-nested.fpt': '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n' +
'{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n',
  'templates/00-array.fpt': '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n' +
'{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n',
  'templates/01-dotted.fpt': '{{ dot.title }}\n' +
'{{ dot.message }}\n'
};

for (i in templates) {
  if (!templates.hasOwnProperty(i)) {
    continue;
  }

  let data;

  switch (i) {
    case 'templates/00-base.fpt':
      data = {
        title: 'foo',
        message: 'bar'
      };
      break;

    case 'templates/00-nested.fpt':
      data = {
        check: {
          i18n: true
        }
      }
      break;

    case 'templates/00-array.fpt':
      data = {
        check: [
          {
            i18n: true
          }
        ]
      }
      break;

    case 'templates/01-dotted.fpt':
      data = {
        dot: {
          title: 'foo',
          message: 'bar'
        }
      };
      break;
  }

  render = Feplet.render(
    templates[i],
    data
  );

  const contentParagraph = document.createElement('p');

  contentParagraph.innerHTML = '<b>' + i + ':</b><br>';

  switch (i) {
    case 'templates/00-base.fpt':
      contentParagraph.innerHTML += 'Expected to equal "foo\\nbar\\n"<br>';
      break;

    case 'templates/00-nested.fpt':
      contentParagraph.innerHTML += 'Expected to equal "\\nYes\\n"<br>';
      break;

    case 'templates/00-array.fpt':
      contentParagraph.innerHTML += 'Expected to equal "\\nYes\\n"<br>';
      break;

    case 'templates/01-dotted.fpt':
      contentParagraph.innerHTML += 'Expected to equal "foo\\nbar\\n"<br>';
      break;
  }

  contentParagraph.innerHTML += 'Actually equals "' + render.replace(/\n/g, '\\n') + '"</p>';

  main.appendChild(contentParagraph);
}

templates = {
  'templates/00-base.fpt': '{{ title }}\n' +
'{{ message }}\n',
  'templates/00-nested.fpt': '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n' +
'{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n',
  'templates/00-array.fpt': '{{^check}}{{#i18n}}No{{/i18n}}{{/check}}\n' +
'{{#check}}{{#i18n}}Yes{{/i18n}}{{/check}}\n'
};

for (i in templates) {
  if (!templates.hasOwnProperty(i)) {
    continue;
  }

  let data;

  switch (i) {
    case 'templates/00-base.fpt':
      data = {
        title: 'foo',
        message: 'bar'
      };
      break;

    case 'templates/00-nested.fpt':
      data = {
        check: {
          i18n: true
        }
      }
      break;

    case 'templates/00-array.fpt':
      data = {
        check: [
          {
            i18n: true
          }
        ]
      }
      break;
  }

  render = Feplet.render(
    templates[i],
    data
  );

  const contentParagraph = document.createElement('p');

  contentParagraph.innerHTML = '<b>' + i + ':</b><br>';

  switch (i) {
    case 'templates/00-base.fpt':
      contentParagraph.innerHTML += 'Expected to equal "foo\\nbar\\n"<br>';
      break;

    case 'templates/00-nested.fpt':
      contentParagraph.innerHTML += 'Expected to equal "\\nYes\\n"<br>';
      break;

    case 'templates/00-array.fpt':
      contentParagraph.innerHTML += 'Expected to equal "\\nYes\\n"<br>';
      break;
  }

  contentParagraph.innerHTML += 'Actually equals "' + render.replace(/\n/g, '\\n') + '"</p>';

  main.appendChild(contentParagraph);
}


/*
  it('should populate variables within an array written in dot.notation', function () {
    const files = [
      'templates/01-dotted_array.fpt'
    ];
    const partials = {};

    files.forEach((file) => {
      partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/01_dotted_array.fpt'), enc);
    const render = Feplet.render(
      templateText,
      {},
      partials
    );

    expect(render).to.equal('foo\nbar\n');
  });

  it('should hydrate templates with variables passed per the Pattern Lab styleModifier convention', function () {
    const feplet = new Feplet(
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      }
    );
    const files = [
      'templates/02-stylemod-atom.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/02-stylemod-molecule.fpt'), enc);
    const render = feplet.render(templateText);

    expect(render).to.equal('<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
  });

  it(
    'should recursively hydrate templates with variables passed per the Pattern Lab styleModifier convention',
    function () {
      const feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      const files = [
        'templates/02-stylemod-atom.fpt',
        'templates/02-stylemod-molecule.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/02-stylemod-organism.fpt'), enc);
      const render = feplet.render(templateText);

      expect(render).to.equal('<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
    }
  );

  it('should hydrate templates with multiple classes passed per Pattern Lab styleModifier', function () {
    const feplet = new Feplet(
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      }
    );
    const files = [
      'templates/02-stylemod-atom.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/02_stylemod-multiple-classes.fpt'), enc);
    const render = feplet.render(templateText);

    expect(render).to.equal('<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
  });

  it('should hydrate templates with both data parameters and a Pattern Lab styleModifier', function () {
    const feplet = new Feplet(
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      }
    );
    const files = [
      'templates/02-stylemod-atom.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/02_stylemod-param.fpt'), enc);
    const render = feplet.render(templateText);

    expect(render).to.equal('<span class="test_base test_2">\n    1\n    DESCRIPTION\n</span>\n');
  });

  it('should hydrate templates with both data parameters and a styleModifier with multiple classes', function () {
    const feplet = new Feplet(
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      }
    );
    const files = [
      'templates/02-stylemod-atom.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText =
      fs.readFileSync(path.resolve(__dirname, 'templates/02_stylemod-param_multiple-classes.fpt'), enc);
    const render = feplet.render(templateText);

    expect(render).to.equal('<span class="test_base foo1 foo2">\n    2\n    DESCRIPTION\n</span>\n\n');
  });

  it('should recursively hydrate templates with multiple classes passed per Pattern Lab styleModifier', function () {
    const feplet = new Feplet(
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      }
    );
    const files = [
      'templates/02-stylemod-atom.fpt',
      'templates/02_stylemod-multiple-classes.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText =
      fs.readFileSync(path.resolve(__dirname, 'templates/02~stylemod-multiple-classes-includer.fpt'), enc);
    const render = feplet.render(templateText);

    expect(render).to.equal('<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n');
  });

  it('should recursively hydrate templates with both data parameters and a Pattern Lab styleModifier', function () {
    const feplet = new Feplet(
      {
        message: 'MESSAGE',
        description: 'DESCRIPTION'
      }
    );
    const files = [
      'templates/02-stylemod-atom.fpt',
      'templates/02_stylemod-param.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/02~stylemod-param-includer.fpt'), enc);
    const render = feplet.render(templateText);

    expect(render).to.equal('<span class="test_base test_2">\n    1\n    DESCRIPTION\n</span>\n');
  });

  it(
    'should recursively hydrate templates with both data parameters and a styleModifier with multiple classes',
    function () {
      const feplet = new Feplet(
        {
          message: 'MESSAGE',
          description: 'DESCRIPTION'
        }
      );
      const files = [
        'templates/02-stylemod-atom.fpt',
        'templates/02_stylemod-param_multiple-classes.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText =
        fs.readFileSync(path.resolve(__dirname, 'templates/02~stylemod-param_multiple-classes-includer.fpt'), enc);
      const render = feplet.render(templateText);

      expect(render).to.equal('<span class="test_base foo1 foo2">\n    2\n    DESCRIPTION\n</span>\n\n');
    }
  );

  it('should shut off otherwise infinite recursion paths with default false conditions', function () {
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
      'templates/00-base.fpt',
      'templates/00-nested.fpt',
      'templates/00_base.fpt',
      'templates/03-include-self-w-condition.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/03-include-self-w-condition.fpt'), enc);
    const render = feplet.render(templateText);

    expect(render).to.equal('No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n');
  });

  it('should shut off otherwise infinite recursion paths when flagged to do so by parameters', function () {
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
      'templates/00-base.fpt',
      'templates/00-nested.fpt',
      'templates/00_base.fpt',
      'templates/03-include-self-w-condition.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText =
      fs.readFileSync(path.resolve(__dirname, 'templates/03_include-self-w-condition-includer.fpt'), enc);
    const render = feplet.render(templateText);

    expect(render).to.equal('No\n\nfoo\nMESSAGE\n  No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n  bar\n  MESSAGE\n');
  });

  it(
    'should render a nested parameter variable differently than a non-parameter variable of the same name',
    function () {
      const feplet = new Feplet(
        {
          bez: 'hack',
          biz: 'heck'
        }
      );
      const files = [
        'templates/04-nested-param-same-name-as-non-param.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText =
        fs.readFileSync(path.resolve(__dirname, 'templates/04_nested-param-same-name-as-non-param-includer.fpt'), enc);
      const render = feplet.render(templateText);

      expect(render).to.equal('hack heck\n  hick hock\n');
    }
  );

  it(
    'should render an array of nested parameter variables differently from non-parameter variables of the same name',
    function () {
      const feplet = new Feplet(
        {
          bez: 'hack',
          biz: 'heck'
        }
      );
      const files = [
        'templates/04-nested-param-same-name-as-non-param.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText = fs.readFileSync(
        path.resolve(__dirname, 'templates/04_nested-param-same-name-as-non-param-includer_array.fpt'), enc);
      const render = feplet.render(templateText);

      expect(render).to.equal('hack heck\n  hick hock\n  huck hyck\n');
    }
  );

  it(
    'should render a more deeply nested parameter variable differently then a non-parameter variable of the same name',
    function () {
      const feplet = new Feplet(
        {
          biz: 'hack',
          boz: 'heck'
        }
      );
      const files = [
        'templates/04-nested-param-same-name-as-non-param_deep.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText = fs.readFileSync(
        path.resolve(__dirname, 'templates/04_nested-param-same-name-as-non-param-includer_deep.fpt'),
        enc
      );
      const render = feplet.render(templateText);

      expect(render).to.equal('hack heck\n  hick hock\n');
    }
  );

  it(
    'should render a deeply nested dot.notation parameter differently than a non-parameter variable of the same name',
    function () {
      const feplet = new Feplet(
        {
          biz: {
            boz: 'hack'
          }
        }
      );
      const files = [
        'templates/04-nested-param-same-name-as-non-param_dotted-inner.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText = fs.readFileSync(
        path.resolve(__dirname, 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner.fpt'),
        enc
      );
      const render = feplet.render(templateText);

      expect(render).to.equal('hack\n    heck\n');
    }
  );

  it(
    // eslint-disable-next-line max-len
    'should render a deeply nested array of dot.notation parameters differently than non-parameter variables of the same name',
    function () {
      const feplet = new Feplet(
        {
          biz: {
            boz: 'hack'
          }
        }
      );
      const files = [
        'templates/04-nested-param-same-name-as-non-param_dotted-inner.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText = fs.readFileSync(
        path.resolve(__dirname, 'templates/04_nested-param-same-name-as-non-param-includer_dotted-inner_array.fpt'),
        enc
      );
      const render = feplet.render(templateText);

      expect(render).to.equal('hack\n    heck\n    hick\n');
    }
  );

  it(
    // eslint-disable-next-line max-len
    'should render a moderately nested dot.notation parameter differently than a non-parameter variable of the same name',
    function () {
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
        'templates/04-nested-param-same-name-as-non-param_dotted-middle.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText = fs.readFileSync(
        path.resolve(__dirname, 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle.fpt'),
        enc
      );
      const render = feplet.render(templateText);

      expect(render).to.equal('  hack\n    heck\n');
    }
  );

  it(
    // eslint-disable-next-line max-len
    'should render a moderately nested array of dot.notation parameters differently than non-parameter variables of the same name',
    function () {
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
        'templates/04-nested-param-same-name-as-non-param_dotted-middle.fpt'
      ];

      files.forEach((file) => {
        feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
      });

      const templateText = fs.readFileSync(
        path.resolve(__dirname, 'templates/04_nested-param-same-name-as-non-param-includer_dotted-middle_array.fpt'),
        enc
      );
      const render = feplet.render(templateText);

      expect(render).to.equal('  hack\n  heck\n    hick\n    hock\n');
    }
  );

  it('should render a top-level dot.notation parameter that nests more tags', function () {
    const files = [
      'templates/05-dotted-param.fpt'
    ];
    const partials = {};

    files.forEach((file) => {
      partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/05_dotted-param-includer.fpt'), enc);
    const render = Feplet.render(
      templateText,
      {},
      partials
    );

    expect(render).to.equal('  hack\n');
  });

  it('should render an array of top-level dot.notation parameters that nest more tags', function () {
    const files = [
      'templates/05-dotted-param.fpt'
    ];
    const partials = {};

    files.forEach((file) => {
      partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(path.resolve(__dirname, 'templates/05_dotted-param-includer_array.fpt'), enc);

    const render = Feplet.render(
      templateText,
      {},
      partials
    );

    expect(render).to.equal('  hack\n  heck\n');
  });

  it('should render a dot.notation parameter nested within a non-parameter', function () {
    const feplet = new Feplet(
      {
        baz: {
          bez: 'hack'
        }
      }
    );
    const files = [
      'templates/05-dotted-param_nested-in-non-param.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText = fs.readFileSync(
      path.resolve(__dirname, 'templates/05_dotted-param-includer_nested-in-non-param.fpt'),
      enc
    );
    const render = feplet.render(templateText);

    expect(render).to.equal('  hack\n    heck\n');
  });

  it('should render an array of dot.notation parameters nested within a non-parameter', function () {
    const feplet = new Feplet(
      {
        baz: {
          bez: 'hack'
        }
      }
    );
    const files = [
      'templates/05-dotted-param_nested-in-non-param.fpt'
    ];

    files.forEach((file) => {
      feplet.registerPartial(file.replace(/\.fpt$/, ''), fs.readFileSync(path.resolve(__dirname, file), enc));
    });

    const templateText = fs.readFileSync(
      path.resolve(__dirname, 'templates/05_dotted-param-includer_nested-in-non-param_array.fpt'),
      enc
    );
    const render = feplet.render(templateText);

    expect(render).to.equal('  hack\n    heck\n    hick\n');
  });

  it('should render a deeply nested dot.notation parameter containing an array', function () {
    const files = [
      'templates/06-dotted-array-param-inner.fpt'
    ];
    const partials = {};

    files.forEach((file) => {
      partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(
      path.resolve(__dirname, 'templates/06_dotted-array-param-inner-includer.fpt'),
      enc
    );

    const render = Feplet.render(
      templateText,
      {},
      partials
    );

    expect(render).to.equal('    heck\n');
  });

  it('should render a moderately nested dot.notation parameter containing an array', function () {
    const files = [
      'templates/06-dotted-array-param-middle.fpt'
    ];
    const partials = {};

    files.forEach((file) => {
      partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(
      path.resolve(__dirname, 'templates/06_dotted-array-param-middle-includer.fpt'),
      enc
    );

    const render = Feplet.render(
      templateText,
      {},
      partials
    );

    expect(render).to.equal('    heck\n');
  });

  it('should render a top-level dot.notation parameter containing an array', function () {
    const files = [
      'templates/06-dotted-array-param-outer.fpt'
    ];
    const partials = {};

    files.forEach((file) => {
      partials[file.replace(/\.fpt$/, '')] = fs.readFileSync(path.resolve(__dirname, file), enc);
    });

    const templateText = fs.readFileSync(
      path.resolve(__dirname, 'templates/06_dotted-array-param-outer-includer.fpt'),
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
*/