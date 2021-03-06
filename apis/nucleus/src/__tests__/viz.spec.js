const doMock = ({ glue = () => {}, getPatches = () => {} } = {}) =>
  aw.mock(
    [
      ['**/components/glue.jsx', () => glue],
      ['**/utils/patcher.js', () => getPatches],
    ],
    ['../viz.js']
  );

describe('viz', () => {
  let api;
  let sandbox;
  let glue;
  let create;
  let mounted;
  let unmount;
  let model;
  let getPatches;
  let cellRef;
  let setSnOptions;
  let setSnContext;
  let takeSnapshot;
  let exportImage;
  before(() => {
    sandbox = sinon.createSandbox();
    unmount = sandbox.spy();
    setSnOptions = sandbox.spy();
    setSnContext = sandbox.spy();
    takeSnapshot = sandbox.spy();
    exportImage = sandbox.spy();
    cellRef = {
      current: {
        setSnOptions,
        setSnContext,
        takeSnapshot,
        exportImage,
      },
    };
    glue = sandbox.stub().returns([unmount, cellRef]);
    getPatches = sandbox.stub().returns(['patch']);
    [{ default: create }] = doMock({ glue, getPatches });
    model = {
      getEffectiveProperties: sandbox.stub().returns('old'),
      applyPatches: sandbox.spy(),
      on: sandbox.spy(),
      once: sandbox.spy(),
      emit: sandbox.spy(),
    };
    api = create({
      model,
      corona: { public: {} },
    });
  });
  after(() => {
    sandbox.restore();
  });
  describe('api', () => {
    it('should have a mount method', () => {
      expect(api.mount).to.be.a('function');
    });

    it('should have a setTemporaryProperties method', () => {
      expect(api.setTemporaryProperties).to.be.a('function');
    });

    it('should have an exportImage method', () => {
      expect(api.exportImage).to.be.a('function');
    });
  });

  describe('mounting', () => {
    it('should mount', async () => {
      mounted = api.mount('element');
      const { onMount } = glue.getCall(0).args[0];
      onMount();
      await mounted;
      expect(glue.callCount).to.equal(1);
    });
    it('should throw if already mounted', async () => {
      expect(api.mount.bind('element2')).to.throw();
    });
  });

  describe('setTemporaryProperties', () => {
    it('should apply patches when there are some', async () => {
      await api.setTemporaryProperties('new');
      expect(model.getEffectiveProperties.callCount).to.equal(1);
      expect(getPatches).to.have.been.calledWithExactly('/', 'new', 'old');
      expect(model.applyPatches).to.have.been.calledWithExactly(['patch'], true);
    });

    it('should not apply patches when there is no diff', async () => {
      model.getEffectiveProperties.resetHistory();
      await api.setTemporaryProperties('new');
      getPatches.returns([]);
      model.applyPatches.resetHistory();
      expect(model.getEffectiveProperties.callCount).to.equal(1);
      expect(getPatches).to.have.been.calledWithExactly('/', 'new', 'old');
      expect(model.applyPatches.callCount).to.equal(0);
    });
  });

  describe('destroy', () => {
    it('should cleanup', async () => {
      await api.destroy();
      expect(unmount).to.have.been.calledWithExactly();
    });
  });

  describe('options', () => {
    it('should set sn options', async () => {
      const opts = {};
      api.options(opts);
      await mounted;
      expect(cellRef.current.setSnOptions).to.have.been.calledWithExactly(opts);
    });
  });

  describe('snapshot', () => {
    it('should take a snapshot', async () => {
      api.takeSnapshot();
      expect(cellRef.current.takeSnapshot).to.have.been.calledWithExactly();
    });
  });

  describe('export', () => {
    it('should export image', async () => {
      api.exportImage();
      expect(cellRef.current.exportImage).to.have.been.calledWithExactly();
    });
  });
});
