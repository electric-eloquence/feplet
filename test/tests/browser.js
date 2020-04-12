/* eslint-disable strict */

const expectation = require('./expectation');
let delay = 0;

module.exports = function () {
  it('0. Hydrates templates with variables', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-0').getHTML(false)).to.equal(expectation[0]);
  });

  it('1. Hydrates templates with nested variables', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-1').getHTML(false)).to.equal(expectation[1]);
  });

  it('2. Recursively hydrates templates with variables', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-2').getHTML(false)).to.equal(expectation[2]);
  });

  it('3. Recursively hydrates templates with nested variables', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-3').getHTML(false)).to.equal(expectation[3]);
  });

  it('4. Hydrates variables written in dot.notation', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-4').getHTML(false)).to.equal(expectation[4]);
  });

  it('5. Hydrates variables within an array written in dot.notation', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-5').getHTML(false)).to.equal(expectation[5]);
  });

  it('6. Recursively hydrates variables written in dot.notation', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-6').getHTML(false)).to.equal(expectation[6]);
  });

  it('7. Recursively hydrates variables within an array written in dot.notation', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-7').getHTML(false)).to.equal(expectation[7]);
  });

  it('9. Hydrates templates with variables passed per the Pattern Lab styleModifier convention', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-9').getHTML(false)).to.equal(expectation[9]);
  });

  it('10. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-10').getHTML(false)).to.equal(expectation[10]);
  });

  it('11. Hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-11').getHTML(false)).to.equal(expectation[11]);
  });

  it('12. Hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-12').getHTML(false)).to.equal(expectation[12]);
  });

  it('13. Hydrates templates with both data parameters and a styleModifier with multiple classes', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-13').getHTML(false)).to.equal(expectation[13]);
  });

  it('14. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-14').getHTML(false)).to.equal(expectation[14]);
  });

  it('15. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-15').getHTML(false)).to.equal(expectation[15]);
  });

  it('16. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-16').getHTML(false)).to.equal(expectation[16]);
  });

  it('17. Shuts off otherwise infinite recursion paths with default false conditions', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-17').getHTML(false)).to.equal(expectation[17]);
  });

  it('18. Shuts off otherwise infinite recursion paths when flagged to do so by parameters', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-18').getHTML(false)).to.equal(expectation[18]);
  });

  it('23. Renders a nested parameter variable differently than a non-parameter variable of the same name\
', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-23').getHTML(false)).to.equal(expectation[23]);
  });

  it('24. Renders an array of nested parameter variables differently from non-parameter variables of the same name\
', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-24').getHTML(false)).to.equal(expectation[24]);
  });

  it('25. Renders a more deeply nested parameter variable differently then a non-parameter variable of the same name\
', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-25').getHTML(false)).to.equal(expectation[25]);
  });

  it('26. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name\
', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-26').getHTML(false)).to.equal(expectation[26]);
  });

  it('27. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the \
same name', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-27').getHTML(false)).to.equal(expectation[27]);
  });

  it('28. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same \
name', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-28').getHTML(false)).to.equal(expectation[28]);
  });

  it('29. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of \
the same name', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-29').getHTML(false)).to.equal(expectation[29]);
  });

  it('34. Renders a top-level dot.notation parameter that nests more tags', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-34').getHTML(false)).to.equal(expectation[34]);
  });

  it('35. Renders an array of top-level dot.notation parameters that nest more tags', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-35').getHTML(false)).to.equal(expectation[35]);
  });

  it('36. Renders a dot.notation parameter nested within a non-parameter', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-36').getHTML(false)).to.equal(expectation[36]);
  });

  it('37. Renders an array of dot.notation parameters nested within a non-parameter', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-37').getHTML(false)).to.equal(expectation[37]);
  });

  it('38. Renders dot.notation parameters nested aside each other within a non-parameter', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-38').getHTML(false)).to.equal(expectation[38]);
  });

  it('39. Renders dot.notation parameter nested within another within a non-parameter', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-39').getHTML(false)).to.equal(expectation[39]);
  });

  it('43. Renders a deeply nested dot.notation parameter containing an array', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-43').getHTML(false)).to.equal(expectation[43]);
  });

  it('44. Renders a moderately nested dot.notation parameter containing an array', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-44').getHTML(false)).to.equal(expectation[44]);
  });

  it('45. Renders a top-level dot.notation parameter containing an array', function () {
    delay += 10
    browser.pause(delay);
    expect($('.assertion-45').getHTML(false)).to.equal(expectation[45]);
  });
};
