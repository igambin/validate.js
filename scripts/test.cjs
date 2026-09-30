const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const Jasmine = require('jasmine');
const { JSDOM } = require('jsdom');

async function main() {
  const root = path.resolve(__dirname, '..');
  const commonjs = require('../validate.js');
  assert.equal(commonjs({ name: 'Ada' }, { name: { presence: true } }), undefined);
  assert.deepEqual(commonjs({}, { name: { presence: true } }), {
    name: ["Name can't be blank"]
  });

  const runner = new Jasmine({ projectBaseDir: root });
  const dom = new JSDOM('', { runScripts: 'outside-only', url: 'https://example.test/' });
  runner.exitOnCompletion = false;

  try {
    ['describe', 'it', 'beforeEach', 'afterEach', 'beforeAll', 'afterAll',
      'expect', 'spyOn', 'jasmine', 'fail', 'pending'].forEach(function(name) {
      dom.window[name] = global[name];
    });
    dom.window.$ = require('jquery/factory').jQueryFactory(dom.window);
    dom.window.moment = require('moment');
    dom.window.it.promise = dom.window.it;
    runner.env.configure({ random: false });

    const files = ['validate.js', 'specs/helpers.js'].concat(
      Array.from(fs.globSync('specs/**/*-spec.js', { cwd: root })).sort()
    );
    files.forEach(function(file) {
      const filename = path.join(root, file);
      new vm.Script(fs.readFileSync(filename, 'utf8'), { filename })
        .runInContext(dom.getInternalVMContext());
    });

    const result = await runner.execute();
    process.exitCode = result.overallStatus === 'passed' ? 0 : 1;
  } finally {
    dom.window.close();
  }
}

main().catch(function(error) {
  console.error(error);
  process.exitCode = 1;
});