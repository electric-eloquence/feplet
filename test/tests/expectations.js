'use strict';

var expectations = [];
expectations[0] = 'foo\nbar\n';
expectations[1] = '\nYes\n';
expectations[2] = 'foo\nbar\n';
expectations[3] = '\nYes\n';
expectations[4] = 'foo\nbar\n';
expectations[5] = 'foo\nbar\n';
expectations[6] = 'foo\nbar\n';
expectations[7] = 'foo\nbar\n';
expectations[8] = '';
expectations[9] = '<span class="test_base test_1">\n    \n    DESCRIPTION\n</span>\n';
expectations[10] = '<span class="test_base test_1">\n    MESSAGE\n    DESCRIPTION\n</span>\n';
expectations[11] = '<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n';
expectations[12] = '<span class="test_base test_2">\n    0\n    DESCRIPTION\n</span>\n';
expectations[13] = '<span class="test_base foo1 foo2">\n    1\n    DESCRIPTION\n</span>\n';
expectations[14] = '<span class="test_base foo1 foo2">\n    MESSAGE\n    DESCRIPTION\n</span>\n';
expectations[15] = '<span class="test_base test_2">\n    0\n    DESCRIPTION\n</span>\n';
expectations[16] = '<span class="test_base foo1 foo2">\n    1\n    DESCRIPTION\n</span>\n';
expectations[17] = 'No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n';
expectations[18] = 'No\n\nfoo\nMESSAGE\n  No\n\nfoo\nMESSAGE\n  bar\n  MESSAGE\n  bar\n  MESSAGE\n';
expectations[19] = '';
expectations[20] = '';
expectations[21] = '';
expectations[22] = '';
expectations[23] = 'hack heck\n  hick hock\n';
expectations[24] = 'hack heck\n  hick hock\n  huck hyck\n';
expectations[25] = 'hack heck\n  hick hock\n';
expectations[26] = 'hack\n    heck\n';
expectations[27] = 'hack\n    heck\n    hick\n';
expectations[28] = '  hack\n    heck\n';
expectations[29] = '  hack\n  heck\n    hick\n    hock\n';
expectations[30] = '';
expectations[31] = '';
expectations[32] = '';
expectations[33] = '';
expectations[34] = '  hack\n';
expectations[35] = '  hack\n  heck\n';
expectations[36] = '  hack\n    heck\n';
expectations[37] = '  hack\n    heck\n    hick\n';
expectations[38] = '    heck\n    hick\n';
expectations[39] = '    heck\n';
expectations[40] = '';
expectations[41] = '';
expectations[42] = '';
expectations[43] = '    heck\n';
expectations[44] = '    heck\n';
expectations[45] = '  heck\n';

module.exports = expectations;
