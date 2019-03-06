# Feplet: a Mustache-compatible template engine.

[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Mac/Linux Build Status][travis-image]][travis-url]
[![Windows Build Status][appveyor-image]][appveyor-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

## Powerful under the hood. Simple behind the wheel.

### How is this different from <a href="https://mustache.github.io/mustache.5.html" target="_blank">Mustache</a> (and <a href="https://github.com/twitter/hogan.js#readme" target="_blank">Hogan.js</a>)?

Feplet implements Hogan.js and is mostly compatible with it, and is therefore 
mostly compatible with Mustache. These are the main differences:

* Feplet does not allow space between an opening delimiter and a command 
  character, such as `#`, `/`, or `>`. For example:
  * `{{> partial }}` is allowed.
  * `{{ > partial }}` is not allowed.
* Feplet allows the passing of data parameters per template.

The syntax for passing data parameters follows the Pattern Lab convention:

```handlebars
{{> partial_tpl(place: 'World') }}
```

Feplet accepts data parameters far more complex than what Pattern Lab documents. 
Any valid <a href="http://json5.org" target="_blank">JSON5</a> string (minus the 
outermost curly braces) can be passed. Be sure that consecutive JSON5 curly 
braces are separated with space to avoid being parsed as a stash `}}`. Similarly, 
space curly braces if they need to be submitted literally as parameter values 
(to be printed as JavaScript or CSS code), or else, encode them as HTML entities 
(`&lcub;` or `&rcub;`).

```handlebars
{{> partial_tpl(nest: { egg: { yolk: 'Yellow' } }) }}
```

One thing to note is that the data passed in this example will apply only to the 
partial named "partial\_tpl", and not to any partials nested further within.

### Use

CLI:

```shell
npm install feplet
```

JS:

```javascript
const Feplet = require('feplet');

const context = {
  place: 'World'
};

// These are references to Hogan.js methods:
const template = Feplet.compile('Hello {{place}}');
const output = template.render(context); // Hello World

// These are also references to Hogan.js methods:
const text = 'Hello <%place%>';
const delimiters = '<% %>';
const options = {delimiters};
const scanned = Feplet.scan(text, delimiters);
const parsed = Feplet.parse(scanned, text, options);
const generation = Feplet.generate(parsed, text, options);
const output1 = generation.render(context); // Hello World

// This is a Feplet implementation:
const partialTxt = '{{#nest}}{{#egg}}{{yolk}} {{place}}{{/egg}}{{/nest}}';
const partials = {
  partial_tpl: partialTxt
};
const includer = '{{> partial_tpl(nest: { egg: { yolk: "Yellow" } }) }}';
const output2 = Feplet.render(
  includer,
  context,
  partials
); // Yellow World

// Feplet.render() does not require the `partials` argument. You can just
// submit Feplet.render(templateTxt, context) if you have no partials to
// render.

// If you do have partials, you might want to instantiate the Feplet class
// to cache the context data if you need to use them more than once. Then,
// register partials so they get preprocessed with the context data cached
// within the feplet object. Then, render accordingly:
const feplet = new Feplet(context);
feplet.registerPartial('partial_tpl', partialTxt);
const output3 = feplet.render(includer); // Yellow World
```

For recent versions of Node.js:

```javascript
const Feplet = require('feplet')
```

For older versions of Node.js, not so supportive of ES6:

```javascript
var Feplet = require('feplet/dist/feplet.node.es5.js')
```

For browsers (ES5):

```html
<script src="feplet/dist/feplet.browser.min.js"></script>
<script>
  var Feplet = window.Feplet;
</script>
```

This browser implementation uses a minified ES5 bundle, which is slightly 
(_very_ slightly) slower than its ES6 counterpart. If you do not support 
older browsers, consider bundling the ES6 script directly for browser 
consumption.

Also for browsers (ES6):

```html
<script type="module">
  import Feplet from 'feplet/dist/feplet.browser.es6.min.js';
</script>
```

<h4><a href="https://github.com/electric-eloquence/feplet/blob/master/ABOUT.md">More &raquo;</a></h4>

[snyk-image]: https://snyk.io/test/github/electric-eloquence/feplet/master/badge.svg
[snyk-url]: https://snyk.io/test/github/electric-eloquence/feplet/master

[travis-image]: https://img.shields.io/travis/electric-eloquence/feplet.svg?label=mac%20%26%20linux
[travis-url]: https://travis-ci.org/electric-eloquence/feplet

[appveyor-image]: https://img.shields.io/appveyor/ci/e2tha-e/feplet.svg?label=windows
[appveyor-url]: https://ci.appveyor.com/project/e2tha-e/feplet

[coveralls-image]: https://img.shields.io/coveralls/electric-eloquence/feplet/master.svg
[coveralls-url]: https://coveralls.io/r/electric-eloquence/feplet

[license-image]: https://img.shields.io/github/license/electric-eloquence/feplet.svg
[license-url]: https://raw.githubusercontent.com/electric-eloquence/feplet/master/LICENSE
