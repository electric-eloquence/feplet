'use strict';

let defineArgs;
global.define = function () {
  defineArgs = arguments;
};

// Require Feplet after global.define is set.
require('../src/index');

const Feplet = defineArgs[0]();
const tests = require('./tests/tests-node');

describe('Feplet', function () {
  describe('via AMD', tests(Feplet));
});
