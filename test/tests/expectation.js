/* eslint-disable strict */

var expectation = [];
expectation[0] = 'foo\nbar\n';
expectation[1] = '\nYes\n';
expectation[2] = 'foo\nbar\n';
expectation[3] = '\nYes\n';
expectation[4] = 'foo\nbar\n';
expectation[5] = 'foo\nbar\n';
expectation[6] = 'foo\nbar\n';
expectation[7] = 'foo\nbar\n';
expectation[8] = '';
expectation[9] = '<span class="test_base test_1">\n    \n    DESCRIPTION\n</span>\n';
expectation[10] = '<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n';
expectation[11] = '<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n';
expectation[12] = '<span class="test_base test_2">\n    0\n    DESCRIPTION\n</span>\n';
expectation[13] = '<span class="test_base foo1 foo2">\n    1\n    DESCRIPTION\n</span>\n';
expectation[14] = '<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n';
expectation[15] = '<span class="test_base test_2">\n    0\n    DESCRIPTION\n</span>\n';
expectation[16] = '<span class="test_base foo1 foo2">\n    1\n    DESCRIPTION\n</span>\n';
expectation[17] = 'No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n';
expectation[18] = 'No\n\nfoo\nMESSAGE\n  No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n  bar\n  MESSAGE\n';
expectation[19] = '';
expectation[20] = '';
expectation[21] = '';
expectation[22] = '';
expectation[23] = 'hack heck\n  hick hock\n';
expectation[24] = 'hack heck\n  hick hock\n  huck hyck\n';
expectation[25] = 'hack heck\n  hick hock\n';
expectation[26] = 'hack\n    heck\n';
expectation[27] = 'hack\n    heck\n    hick\n';
expectation[28] = '  hack\n    heck\n';
expectation[29] = '  hack\n  heck\n    hick\n    hock\n';
expectation[30] = '';
expectation[31] = '';
expectation[32] = '';
expectation[33] = '';
expectation[34] = '  hack\n';
expectation[35] = '  hack\n  heck\n';
expectation[36] = '  hack\n    heck\n';
expectation[37] = '  hack\n    heck\n    hick\n';
expectation[38] = '    heck\n    hick\n';
expectation[39] = '    heck\n';
expectation[40] = '';
expectation[41] = '';
expectation[42] = '';
expectation[43] = '    heck\n';
expectation[44] = '    heck\n';
expectation[45] = '  heck\n';

if (typeof global === 'object' && typeof module === 'object' && typeof module.exports === 'object') {
  module.exports = expectation;
}
else if (typeof window === 'object') {
  window.expectation = expectation;
}
