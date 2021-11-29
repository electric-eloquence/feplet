/* eslint-disable strict */

const expectation = require('./expectation');
const delay = 60;

module.exports = () => {
  it('0. Hydrates templates with variables', async () => {
    const assertion0 = await $('.assertion-0');
    await browser.pause(delay);
    const assertion0Html = await assertion0.getHTML(false);

    expect(assertion0Html).to.equal(expectation[0]);
  });

  it('1. Hydrates templates with nested variables', async () => {
    const assertion1 = await $('.assertion-1');
    await browser.pause(delay);
    const assertion1Html = await assertion1.getHTML(false);

    expect(assertion1Html).to.equal(expectation[1]);
  });

  it('2. Recursively hydrates templates with variables', async () => {
    const assertion2 = await $('.assertion-2');
    await browser.pause(delay);
    const assertion2Html = await assertion2.getHTML(false);

    expect(assertion2Html).to.equal(expectation[2]);
  });

  it('3. Recursively hydrates templates with nested variables', async () => {
    const assertion3 = await $('.assertion-3');
    await browser.pause(delay);
    const assertion3Html = await assertion3.getHTML(false);

    expect(assertion3Html).to.equal(expectation[3]);
  });

  it('4. Hydrates variables written in dot.notation', async () => {
    const assertion4 = await $('.assertion-4');
    browser.pause(delay);
    const assertion4Html = await assertion4.getHTML(false);

    expect(assertion4Html).to.equal(expectation[4]);
  });

  it('5. Hydrates variables within an array written in dot.notation', async () => {
    const assertion5 = await $('.assertion-5');
    await browser.pause(delay);
    const assertion5Html = await assertion5.getHTML(false);

    expect(assertion5Html).to.equal(expectation[5]);
  });

  it('6. Recursively hydrates variables written in dot.notation', async () => {
    const assertion6 = await $('.assertion-6');
    await browser.pause(delay);
    const assertion6Html = await assertion6.getHTML(false);

    expect(assertion6Html).to.equal(expectation[6]);
  });

  it('7. Recursively hydrates variables within an array written in dot.notation', async () => {
    const assertion7 = await $('.assertion-7');
    await browser.pause(delay);
    const assertion7Html = await assertion7.getHTML(false);

    expect(assertion7Html).to.equal(expectation[7]);
  });

  it('9. Hydrates templates with variables passed per the Pattern Lab styleModifier convention', async () => {
    const assertion9 = await $('.assertion-9');
    await browser.pause(delay);
    const assertion9Html = await assertion9.getHTML(false);

    expect(assertion9Html).to.equal(expectation[9]);
  });

  it('10. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
', async () => {
    const assertion10 = await $('.assertion-10');
    await browser.pause(delay);
    const assertion10Html = await assertion10.getHTML(false);

    expect(assertion10Html).to.equal(expectation[10]);
  });

  it('11. Hydrates templates with multiple classes passed per Pattern Lab styleModifier', async () => {
    const assertion11 = await $('.assertion-11');
    await browser.pause(delay);
    const assertion11Html = await assertion11.getHTML(false);

    expect(assertion11Html).to.equal(expectation[11]);
  });

  it('12. Hydrates templates with both data parameters and a Pattern Lab styleModifier', async () => {
    const assertion12 = await $('.assertion-12');
    await browser.pause(delay);
    const assertion12Html = await assertion12.getHTML(false);

    expect(assertion12Html).to.equal(expectation[12]);
  });

  it('13. Hydrates templates with both data parameters and a styleModifier with multiple classes', async () => {
    const assertion13 = await $('.assertion-13');
    await browser.pause(delay);
    const assertion13Html = await assertion13.getHTML(false);

    expect(assertion13Html).to.equal(expectation[13]);
  });

  it('14. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier', async () => {
    const assertion14 = await $('.assertion-14');
    await browser.pause(delay);
    const assertion14Html = await assertion14.getHTML(false);

    expect(assertion14Html).to.equal(expectation[14]);
  });

  it('15. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', async () => {
    const assertion15 = await $('.assertion-15');
    await browser.pause(delay);
    const assertion15Html = await assertion15.getHTML(false);

    expect(assertion15Html).to.equal(expectation[15]);
  });

  it('16. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
', async () => {
    const assertion16 = await $('.assertion-16');
    await browser.pause(delay);
    const assertion16Html = await assertion16.getHTML(false);

    expect(assertion16Html).to.equal(expectation[16]);
  });

  it('17. Shuts off otherwise infinite recursion paths with default false conditions', async () => {
    const assertion17 = await $('.assertion-17');
    await browser.pause(delay);
    const assertion17Html = await assertion17.getHTML(false);

    expect(assertion17Html).to.equal(expectation[17]);
  });

  it('18. Shuts off otherwise infinite recursion paths when flagged to do so by parameters', async () => {
    const assertion18 = await $('.assertion-18');
    await browser.pause(delay);
    const assertion18Html = await assertion18.getHTML(false);

    expect(assertion18Html).to.equal(expectation[18]);
  });

  it('23. Renders a nested parameter variable differently than a non-parameter variable of the same name\
', async () => {
    const assertion23 = await $('.assertion-23');
    await browser.pause(delay);
    const assertion23Html = await assertion23.getHTML(false);

    expect(assertion23Html).to.equal(expectation[23]);
  });

  it('24. Renders an array of nested parameter variables differently from non-parameter variables of the same name\
', async () => {
    const assertion24 = await $('.assertion-24');
    await browser.pause(delay);
    const assertion24Html = await assertion24.getHTML(false);

    expect(assertion24Html).to.equal(expectation[24]);
  });

  it('25. Renders a more deeply nested parameter variable differently then a non-parameter variable of the same name\
', async () => {
    const assertion25 = await $('.assertion-25');
    await browser.pause(delay);
    const assertion25Html = await assertion25.getHTML(false);

    expect(assertion25Html).to.equal(expectation[25]);
  });

  it('26. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name\
', async () => {
    const assertion26 = await $('.assertion-26');
    await browser.pause(delay);
    const assertion26Html = await assertion26.getHTML(false);

    expect(assertion26Html).to.equal(expectation[26]);
  });

  it('27. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the \
same name', async () => {
    const assertion27 = await $('.assertion-27');
    await browser.pause(delay);
    const assertion27Html = await assertion27.getHTML(false);

    expect(assertion27Html).to.equal(expectation[27]);
  });

  it('28. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same \
name', async () => {
    const assertion28 = await $('.assertion-28');
    await browser.pause(delay);
    const assertion28Html = await assertion28.getHTML(false);

    expect(assertion28Html).to.equal(expectation[28]);
  });

  it('29. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of \
the same name', async () => {
    const assertion29 = await $('.assertion-29');
    await browser.pause(delay);
    const assertion29Html = await assertion29.getHTML(false);

    expect(assertion29Html).to.equal(expectation[29]);
  });

  it('34. Renders a top-level dot.notation parameter that nests more tags', async () => {
    const assertion34 = await $('.assertion-34');
    await browser.pause(delay);
    const assertion34Html = await assertion34.getHTML(false);

    expect(assertion34Html).to.equal(expectation[34]);
  });

  it('35. Renders an array of top-level dot.notation parameters that nest more tags', async () => {
    const assertion35 = await $('.assertion-35');
    await browser.pause(delay);
    const assertion35Html = await assertion35.getHTML(false);

    expect(assertion35Html).to.equal(expectation[35]);
  });

  it('36. Renders a dot.notation parameter nested within a non-parameter', async () => {
    const assertion36 = await $('.assertion-36');
    await browser.pause(delay);
    const assertion36Html = await assertion36.getHTML(false);

    expect(assertion36Html).to.equal(expectation[36]);
  });

  it('37. Renders an array of dot.notation parameters nested within a non-parameter', async () => {
    const assertion37 = await $('.assertion-37');
    await browser.pause(delay);
    const assertion37Html = await assertion37.getHTML(false);

    expect(assertion37Html).to.equal(expectation[37]);
  });

  it('38. Renders dot.notation parameters nested aside each other within a non-parameter', async () => {
    const assertion38 = await $('.assertion-38');
    await browser.pause(delay);
    const assertion38Html = await assertion38.getHTML(false);

    expect(assertion38Html).to.equal(expectation[38]);
  });

  it('39. Renders dot.notation parameter nested within another within a non-parameter', async () => {
    const assertion39 = await $('.assertion-39');
    await browser.pause(delay);
    const assertion39Html = await assertion39.getHTML(false);

    expect(assertion39Html).to.equal(expectation[39]);
  });

  it('43. Renders a deeply nested dot.notation parameter containing an array', async () => {
    const assertion43 = await $('.assertion-43');
    await browser.pause(delay);
    const assertion43Html = await assertion43.getHTML(false);

    expect(assertion43Html).to.equal(expectation[43]);
  });

  it('44. Renders a moderately nested dot.notation parameter containing an array', async () => {
    const assertion44 = await $('.assertion-44');
    await browser.pause(delay);
    const assertion44Html = await assertion44.getHTML(false);

    expect(assertion44Html).to.equal(expectation[44]);
  });

  it('45. Renders a top-level dot.notation parameter containing an array', async () => {
    const assertion45 = await $('.assertion-45');
    await browser.pause(delay);
    const assertion45Html = await assertion45.getHTML(false);

    expect(assertion45Html).to.equal(expectation[45]);
  });
};
