describe('sn', () => {
  const snSelector = '.nebulajs-sn';
  const errorSelector = '.nebulajs-cell [data-tid="error-title"]';

  it('should render with translation', async () => {
    await page.goto('http://localhost:8000/render/?fixture=./object/sn-locale.fix.js&language=sv-SE');

    await page.waitForSelector(snSelector, { visible: true });
    const text = await page.$eval(snSelector, el => el.textContent);
    expect(text).to.equal('Hej motor!');
  });

  it('should show incomplete visualization', async () => {
    await page.goto('http://localhost:8000/render/?fixture=./object/sn-incomplete.fix.js&theme=dark');

    await page.waitForSelector(errorSelector, { visible: true });
    const text = await page.$eval(errorSelector, el => el.textContent);
    expect(text).to.equal('Incomplete visualization');
  });

  it('should show error caused during load', async () => {
    await page.goto('http://localhost:8000/render/?fixture=./object/sn-error.fix.js');

    await page.waitForSelector(errorSelector, { visible: true });
    const text = await page.$eval(errorSelector, el => el.textContent);
    expect(text).to.equal('hahaha');
  });
});
