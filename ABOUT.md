# About Feplet

### Why another Mustache-compatible template engine?

This project arose from the needs of 
<a href="http://fepper.io" target="blank">Fepper</a> and its implementation of 
Pattern Lab. Fepper requires the simplicity of Mustache's tag-to-data matching 
scheme, and the flexibility that comes with that simplicity. Fepper also 
requires raw brute processing speed for the purpose of compiling and rendering 
large template sets.

### Why functional programming?

There needs to be a clear direction on how Feplet is implemented. Feplet needs 
to accomplish these tasks (at a minimum):

* Precompile partials with data parameters distinctly from those without.
* On each precompilation, hydrate partials only with data passed as parameters.
* On each precompilation, leave tags that are not targeted by data parameters, 
  but are targeted by context data, unrendered.
* On each template compilation, recursively include the precompiled partials.
* Render the compiled template according to Mustache's flexible tag-to-data 
  matching scheme.

The overarching task at hand is recursing through nested, branching, fractal 
structures.

### Object-oriented programming?

Feplet exposes a class which can be instantiated for the purpose of caching 
context data if they need to be used more than once. It also exposes static 
methods by which instantiation can be skipped entirely.

### Procedural programming?

Would it make sense to emulate inexperienced programmers (or even experienced 
COBOL programmers) and just program procedurally? Let's just leave that as a 
rhetorical question.

We've all heard developers evangelize their way of doing things because of a 
performance gain of literally milliseconds. But when compiling and rendering 
megabtyes of templates, performance actually matters to people with other things 
to do. The choice of template engine can yield performance gains (or losses) 
of minutes per build.

### How is this functional programming?

We are primarily concerned with the evaluation of expressions, not the execution 
of commands. This leads to the extensive use of recursion. As we recurse, we 
don't concern ourselves with side-effects or state. Data are transmitted through 
functions, but we don't mutate or do horrible things to them. Data structures 
are generally treated as stacks. They are added to, but the older parts are 
never changed. They are certainly never knocked down and substituted with a 
different stack, the public none-the-wiser that the original stack is buried 
somewhere never to be seen again.

### Where does the name come from?

Feplet is the spelled-out sound of a contraction of "Fepper template." (Fepper 
is a contraction of "front end prototyper.") It could also be the diminutive of 
"Fepper." It is very much the engine that drives Fepper.

<h4><a href="https://github.com/electric-eloquence/template-engine-benchoff" target="_blank">Template Engine Benchoff &raquo;</a></h4>
