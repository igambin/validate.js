const fs = require('node:fs');
const path = require('node:path');
const { spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
let child;
let timer;
let pending = false;

function run() {
  if (child) {
    pending = true;
    return;
  }
  pending = false;
  child = spawn(process.execPath, [require.resolve('grunt/bin/grunt'), 'test'], {
    cwd: root,
    stdio: 'inherit'
  });
  child.on('exit', function() {
    child = undefined;
    if (pending) {
      run();
    }
  });
}

fs.watch(root, { recursive: true }, function(event, filename) {
  if (!filename) {
    return;
  }
  const relative = filename.replace(/\\/g, '/');
  if (!/^(validate\.js|Gruntfile\.js|specs\/.*\.js|scripts\/.*\.cjs)$/.test(relative)) {
    return;
  }
  clearTimeout(timer);
  timer = setTimeout(run, 100);
});

run();