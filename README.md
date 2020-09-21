# Feplet: a Mustache-compatible template engine.

[![Known Vulnerabilities][snyk-image]][snyk-url]
[![Linux Build Status][linux-image]][linux-url]
[![Mac Build Status][mac-image]][mac-url]
[![Windows Build Status][windows-image]][windows-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![License][license-image]][license-url]

## Powerful under the hood. Simple behind the wheel.

Feplet mostly adheres to the 
<a href="https://github.com/mustache/spec" target="_blank">Mustache spec</a>. 
These are the main differences:

* Feplet does not allow space between an opening delimiter and a command 
  character, such as `#`, `/`, or `>`. For example:
  * `{{> partial }}` is allowed.
  * `{{ > partial }}` is not allowed.
* Feplet allows the passing of data parameters per template.

```handlebars
{{> partial_tpl(place: 'World') }}
```

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

const text = 'Hello {{place}}';
const context = {
  place: 'World'
};

// These are references to Hogan.js methods:
const template = Feplet.compile(text);
const output = template.render(context); // Hello World

// These are also references to Hogan.js methods:
const scanned = Feplet.scan(text);
const parsed = Feplet.parse(scanned, text);
const generation = Feplet.generate(parsed, text);
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
// to cache the context data if you need to use them more than once.
// Then, register partials so they get preprocessed with the context data
// cached within the feplet object.
// Then, render accordingly:
const feplet = new Feplet(context);
feplet.registerPartial('partial_tpl', partialTxt);
const output3 = feplet.render(includer); // Yellow World
```

For Node.js:

```javascript
const Feplet = require('feplet')
```

For browsers (ES6):

```html
<script type="module">
  import Feplet from 'feplet/dist/feplet.browser.es6.min.js';
</script>
```

Also for browsers (ES5):

```html
<script src="feplet/dist/feplet.browser.min.js"></script>
<script>
  var Feplet = window.Feplet;
</script>
```

### Where does the name come from?

Feplet is the spelled-out sound of a contraction of "Fepper template." 
(<a href="https://fepper.io" target="blank">Fepper</a> is a contraction of 
"front end prototyper.") It could also be the diminutive of
"Fepper." It is very much the engine that drives Fepper.

[snyk-image]: https://snyk.io/test/github/electric-eloquence/feplet/master/badge.svg
[snyk-url]: https://snyk.io/test/github/electric-eloquence/feplet/master

[linux-image]: https://github.com/electric-eloquence/feplet/workflows/Linux%20build/badge.svg?branch=master
[linux-url]: https://github.com/electric-eloquence/feplet/actions?query=workflow%3A"Linux+build"

[mac-image]: https://github.com/electric-eloquence/feplet/workflows/Mac%20build/badge.svg?branch=master
[mac-url]: https://github.com/electric-eloquence/feplet/actions?query=workflow%3A"Mac+build"

[windows-image]: https://github.com/electric-eloquence/feplet/workflows/Windows%20build/badge.svg?branch=master
[windows-url]: https://github.com/electric-eloquence/feplet/actions?query=workflow%3A"Windows+build"

[coveralls-image]: https://img.shields.io/coveralls/electric-eloquence/feplet/master.svg
[coveralls-url]: https://coveralls.io/r/electric-eloquence/feplet

[license-image]: https://img.shields.io/github/license/electric-eloquence/feplet.svg
[license-url]: https://raw.githubusercontent.com/electric-eloquence/feplet/master/LICENSE
