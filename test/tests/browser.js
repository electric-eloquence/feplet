/* eslint-disable strict */

const expectations = require('./expectations');

async function waitUntilReady(i) {
  await (await $('.assertions-' + i)).waitUntil(
    async function () {
      return (await this.getHTML(false)) !== '';
    },
    {
      timeout: 60 * 1000,
      timeoutMsg: `Element .assertions-${i} failed to load!`
    }
  );
}

module.exports = () => {
  const assertions = [];

  it('0. Hydrates templates with variables', async () => {
    const i = 0;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('1. Hydrates templates with nested variables', async () => {
    const i = 1;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('2. Recursively hydrates templates with variables', async () => {
    const i = 2;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('3. Recursively hydrates templates with nested variables', async () => {
    const i = 3;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('4. Hydrates variables written in dot.notation', async () => {
    const i = 4;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('5. Hydrates variables within an array written in dot.notation', async () => {
    const i = 5;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('6. Recursively hydrates variables written in dot.notation', async () => {
    const i = 6;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('7. Recursively hydrates variables within an array written in dot.notation', async () => {
    const i = 7;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('8. Hydrates templates with variables passed per the Pattern Lab styleModifier convention', async () => {
    const i = 9;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('9. Recursively hydrates templates with variables passed per the Pattern Lab styleModifier convention\
', async () => {
    const i = 10;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('10. Hydrates templates with multiple classes passed per Pattern Lab styleModifier', async () => {
    const i = 11;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('11. Hydrates templates with both data parameters and a Pattern Lab styleModifier', async () => {
    const i = 12;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('12. Hydrates templates with both data parameters and a styleModifier with multiple classes', async () => {
    const i = 13;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('13. Recursively hydrates templates with multiple classes passed per Pattern Lab styleModifier', async () => {
    const i = 14;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('14. Recursively hydrates templates with both data parameters and a Pattern Lab styleModifier', async () => {
    const i = 15;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('15. Recursively hydrates templates with both data parameters and a styleModifier with multiple classes\
', async () => {
    const i = 16;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('16. Shuts off otherwise infinite recursion paths with default false conditions', async () => {
    const i = 17;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('17. Shuts off otherwise infinite recursion paths when flagged to do so by parameters', async () => {
    const i = 18;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('18. Renders a nested parameter variable differently than a non-parameter variable of the same name\
', async () => {
    const i = 23;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('19. Renders an array of nested parameter variables differently from non-parameter variables of the same name\
', async () => {
    const i = 24;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('20. Renders a more deeply nested parameter variable differently then a non-parameter variable of the same name\
', async () => {
    const i = 25;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('21. Renders a deeply nested dot.notation parameter differently than a non-parameter variable of the same name\
', async () => {
    const i = 26;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('22. Renders a deeply nested array of dot.notation parameters differently than non-parameter variables of the \
same name', async () => {
    const i = 27;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('23. Renders a moderately nested dot.notation parameter differently than a non-parameter variable of the same \
name', async () => {
    const i = 28;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('24. Renders a moderately nested array of dot.notation parameters differently than non-parameter variables of \
the same name', async () => {
    const i = 29;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('25. Renders a top-level dot.notation parameter that nests more tags', async () => {
    const i = 34;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('26. Renders an array of top-level dot.notation parameters that nest more tags', async () => {
    const i = 35;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('27. Renders a dot.notation parameter nested within a non-parameter', async () => {
    const i = 36;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('28. Renders an array of dot.notation parameters nested within a non-parameter', async () => {
    const i = 37;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('29. Renders dot.notation parameters nested aside each other within a non-parameter', async () => {
    const i = 38;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('30. Renders dot.notation parameter nested within another within a non-parameter', async () => {
    const i = 39;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('31. Renders a deeply nested dot.notation parameter containing an array', async () => {
    const i = 43;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('32. Renders a moderately nested dot.notation parameter containing an array', async () => {
    const i = 44;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });

  it('33. Renders a top-level dot.notation parameter containing an array', async () => {
    const i = 45;

    await waitUntilReady(i);

    assertions[i] = await (await $('.assertions-' + i)).getHTML(false);
    expect(assertions[i]).to.equal(expectations[i]);
  });
};
