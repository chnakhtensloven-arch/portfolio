const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9338;
const FILE_URL = pathToFileURL(path.resolve(process.argv[2])).href;
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
(async () => {
  const userDataDir = fs.mkdtempSync(require('os').tmpdir() + '\\chrome-e-');
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + userDataDir, '--no-first-run', '--disable-gpu', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
  let targets = null;
  for (let i = 0; i < 50; i++) { try { const r = await fetch('http://127.0.0.1:' + PORT + '/json/list'); targets = await r.json(); if (targets.some(t => t.type === 'page')) break; } catch { } await sleep(200); }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const exceptions = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); }
    else if (m.method === 'Runtime.exceptionThrown') exceptions.push(m.params.exceptionDetails.exception?.description || m.params.exceptionDetails.text);
  };
  const send = (method, params = {}) => { const mid = ++id; return new Promise((resolve, reject) => { pending.set(mid, { resolve, reject }); ws.send(JSON.stringify({ id: mid, method, params })); }); };
  await send('Page.enable'); await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 2, mobile: true });
  const nav = await send('Page.navigate', { url: FILE_URL });
  console.log('nav:', JSON.stringify(nav));
  await sleep(3000);
  const r = await send('Runtime.evaluate', { expression: '({href: location.href, cw: document.documentElement.clientWidth})', returnByValue: true });
  console.log('eval:', JSON.stringify(r));
  console.log('exceptions:', exceptions.slice(0, 5));
  ws.close(); chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch { }
})();
