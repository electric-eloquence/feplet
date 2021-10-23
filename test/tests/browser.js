/* eslint-disable strict */

const expectation = require('./expectation');
const increment = 30;
let delay = 0;

module.exports = () => {
  it('0. Hydrates templates with variables', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion0 = await (await $('.assertion-0')).getHTML(false);
    expect(assertion0).to.equal(expectation[0]);
  });

  it('1. Hydrates templates with nested variables', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion1 = await (await $('.assertion-1')).getHTML(false);
    expect(assertion1).to.equal(expectation[1]);
  });

  it('2. Recursively hydrates templates with variables', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion2 = await (await $('.assertion-2')).getHTML(false);
    expect(assertion2).to.equal(expectation[2]);
  });

  it('3. Recursively hydrates templates with nested variables', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion3 = await (await $('.assertion-3')).getHTML(false);
    expect(assertion3).to.equal(expectation[3]);
  });

  it('4. Hydrates variables written in dot.notation', async () => {
    const assertion4 = await (await $('.assertion-4')).getHTML(false);
    delay += increment;

    browser.pause(delay);
    expect(assertion4).to.equal(expectation[4]);
  });

  it('5. Hydrates variables within an array written in dot.notation', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion5 = await (await $('.assertion-5')).getHTML(false);
    expect(assertion5).to.equal(expectation[5]);
  });

  it('6. Recursively hydrates variables written in dot.notation', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion6 = await (await $('.assertion-6')).getHTML(false);
    expect(assertion6).to.equal(expectation[6]);
  });

  it('7. Recursively hydrates variables within an array written in dot.notation', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion7 = await (await $('.assertion-7')).getHTML(false);
    expect(assertion7).to.equal(expectation[7]);
  });

  it('9. Hydrates templates with variables passed per the Pattern Lab styleModifier convention', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion9 = await (await $('.assertion-9')).getHTML(false);
    expect(assertion9).to.equal(expectation[9]);
  });

  it('10. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion10 = await (await $('.assertion-10')).getHTML(false);
    expect(assertion10).to.equal(expectation[10]);
  });

  it('11. Hydrates templates with multiple classes passed per Pattern Lab styleModifier', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion11 = await (await $('.assertion-11')).getHTML(false);
    expect(assertion11).to.equal(expectation[11]);
  });

  it('12. Hydrates templates with both data parameters and a Pattern Lab styleModifier', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion12 = await (await $('.assertion-12')).getHTML(false);
    expect(assertion12).to.equal(expectation[12]);
  });

  it('13. Hydrates templates with both data parameters and a styleModifier with multiple classes', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion13 = await (await $('.assertion-13')).getHTML(false);
    expect(assertion13).to.equal(expectation[13]);
  });

  it('14. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion14 = await (await $('.assertion-14')).getHTML(false);
    expect(assertion14).to.equal(expectation[14]);
  });

  it('15. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion15 = await (await $('.assertion-15')).getHTML(false);
    expect(assertion15).to.equal(expectation[15]);
  });

  it('16. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion16 = await (await $('.assertion-16')).getHTML(false);
    expect(assertion16).to.equal(expectation[16]);
  });

  it('17. Shuts off otherwise infinite recursion paths with default false conditions', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion17 = await (await $('.assertion-17')).getHTML(false);
    expect(assertion17).to.equal(expectation[17]);
  });

  it('18. Shuts off otherwise infinite recursion paths when flagged to do so by parameters', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion18 = await (await $('.assertion-18')).getHTML(false);
    expect(assertion18).to.equal(expectation[18]);
  });

  it('23. Renders a nested parameter variable differently than a non-parameter variable of the same name\
', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion23 = await (await $('.assertion-23')).getHTML(false);
    expect(assertion23).to.equal(expectation[23]);
  });

  it('24. Renders an array of nested parameter variables differently from non-parameter variables of the same name\
', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion24 = await (await $('.assertion-24')).getHTML(false);
    expect(assertion24).to.equal(expectation[24]);
  });

  it('25. Renders a more deeply nested parameter variable differently then a non-parameter variable of the same name\
', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion25 = await (await $('.assertion-25')).getHTML(false);
    expect(assertion25).to.equal(expectation[25]);
  });

  it('26. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name\
', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion26 = await (await $('.assertion-26')).getHTML(false);
    expect(assertion26).to.equal(expectation[26]);
  });

  it('27. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the \
same name', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion27 = await (await $('.assertion-27')).getHTML(false);
    expect(assertion27).to.equal(expectation[27]);
  });

  it('28. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same \
name', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion28 = await (await $('.assertion-28')).getHTML(false);
    expect(assertion28).to.equal(expectation[28]);
  });

  it('29. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of \
the same name', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion29 = await (await $('.assertion-29')).getHTML(false);
    expect(assertion29).to.equal(expectation[29]);
  });

  it('34. Renders a top-level dot.notation parameter that nests more tags', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion34 = await (await $('.assertion-34')).getHTML(false);
    expect(assertion34).to.equal(expectation[34]);
  });

  it('35. Renders an array of top-level dot.notation parameters that nest more tags', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion35 = await (await $('.assertion-35')).getHTML(false);
    expect(assertion35).to.equal(expectation[35]);
  });

  it('36. Renders a dot.notation parameter nested within a non-parameter', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion36 = await (await $('.assertion-36')).getHTML(false);
    expect(assertion36).to.equal(expectation[36]);
  });

  it('37. Renders an array of dot.notation parameters nested within a non-parameter', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion37 = await (await $('.assertion-37')).getHTML(false);
    expect(assertion37).to.equal(expectation[37]);
  });

  it('38. Renders dot.notation parameters nested aside each other within a non-parameter', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion38 = await (await $('.assertion-38')).getHTML(false);
    expect(assertion38).to.equal(expectation[38]);
  });

  it('39. Renders dot.notation parameter nested within another within a non-parameter', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion39 = await (await $('.assertion-39')).getHTML(false);
    expect(assertion39).to.equal(expectation[39]);
  });

  it('43. Renders a deeply nested dot.notation parameter containing an array', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion43 = await (await $('.assertion-43')).getHTML(false);
    expect(assertion43).to.equal(expectation[43]);
  });

  it('44. Renders a moderately nested dot.notation parameter containing an array', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion44 = await (await $('.assertion-44')).getHTML(false);
    expect(assertion44).to.equal(expectation[44]);
  });

  it('45. Renders a top-level dot.notation parameter containing an array', async () => {
    delay += increment;
    await browser.pause(delay);

    const assertion45 = await (await $('.assertion-45')).getHTML(false);
    expect(assertion45).to.equal(expectation[45]);
  });
};
