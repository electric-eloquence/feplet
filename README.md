# A Mustache-compatible templating engine.

## Powerful under the hood. Simple behind the wheel.

### How is this different from Mustache (and Hogan.js)?

Feplet implements Hogan.js and is therefore, 100% compatible with it. The 
difference is that it allows the passing of data parameters per template, a la 
Handlebars. The syntax for passing parameters follows the Pattern Lab 
convention:

```handlebars
{{> partial_template(place: 'World') }}
```

Feplet accepts data parameters far more complex than what Pattern Lab documents. 
Any valid <a href="http://json5.org" target="_blank">JSON5</a> string (minus the 
wrapping curly braces) can be passed. Be sure that consecutive JSON5 curly 
braces are spaced to avoid being parsed as a stash `}}`.

```handlebars
{{> partial_template(nest: { egg: { yolk: 'Yellow' } }) }}
```

One thing to note is that the data passed in this example will apply only to the 
partial named "partial\_template", and not to any partials nested further 
within.

### Use

```javascript
const feplet = require('feplet');

const data = {
  place: 'World'
};

// These are references to Hogan.js methods:
const template = feplet.compile('Hello {{place}}');
const output = template.render(data); // Hello World

// These are also references to Hogan.js methods:
const text = 'Hello <%place%>';
const delimiters = '<% %>';
const options = {delimiters};
const scanned = feplet.scan(text, delimiters);
const parsed = feplet.parse(scanned, text, options);
const generated = feplet.generate(parsed, text, options);
const output1 = generated.render(data); // Hello World

// This is a Feplet implementation:
const partials = {
  partial_template: '{{#nest}}{{#egg}}{{yolk}} {{place}}{{/egg}}{{/nest}}'
};
const includer = '{{> partial_template(nest: { egg: { yolk: "Yellow" } }) }}';
const output2 = feplet.render(
  includer,
  {place: 'World'},
  partials
); // Yellow World
```

For recent versions of Node.js:

```javascript
const feplet = require('feplet')
```

For older versions of Node.js, not so supportive of ES6:

```javascript
var feplet = require('feplet/dist/feplet.node.es5.js')
```

For browsers:

```html
<script src="dist/feplet.browser.min.js"></script>
<script>
  var feplet = window.Feplet;
</script>
```

This browser implementation uses a minified ES5 bundle, which is slightly 
(_very_ slightly) slower than its ES6 counterpart. If you do not support 
older browsers, consider bundling the ES6 script directly for browser 
consumption.

<h3><a href="https://github.com/electric-eloquence/feplet/blob/master/ABOUT.md">More &raquo;</a></h3>
