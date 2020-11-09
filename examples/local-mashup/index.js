/* eslint-disable */
const { useElement } = stardust;
const bar = window['@nebula.js/sn-bar-chart'];

connect().then((app) => {
  const sn = {
    component() {
      useElement().innerHTML = 'Hello';
    },
  };

  const nebbie = stardust.embed(app, {
    types: [
      {
        name: 'bar',
        load: () => Promise.resolve(bar),
      },
    ],
  });

  nebbie.selections().then((s) => s.mount(document.querySelector('.toolbar')));

  nebbie.field('AsciiAlpha').mount(document.querySelector('.listbox'));

  document.querySelectorAll('.object').forEach((el) => {
    const type = el.getAttribute('data-type');

    nebbie.render({
      type,
      element: el,
      fields: ['AsciiAlpha', '=avg(Num)'],
    });
  });
});
