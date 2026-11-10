const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9335;
const FILE_URL = pathToFileURL(path.resolve(process.argv[2])).href;
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
(async () => {
  const userDataDir = fs.mkdtempSync(require('os').tmpdir() + '\\chrome-t-');
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + userDataDir, '--no-first-run', '--disable-gpu', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
  let targets = null;
  for (let i = 0; i < 50; i++) { try { const r = await fetch('http://127.0.0.1:' + PORT + '/json/list'); targets = await r.json(); if (targets.some(t => t.type === 'page')) break; } catch { } await sleep(200); }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map(); const failed = [];
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); }
    else if (m.method === 'Network.loadingFailed') failed.push(m.params.errorText);
    else if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) failed.push(m.params.response.url + ' ' + m.params.response.status);
  };
  ws.onmessage = ws.onmessage;
  // fix: parse properly
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); }
    else if (m.method === 'Network.loadingFailed') failed.push(m.params.errorText + ' ' + (m.params.blockedReason || ''));
    else if (m.method === 'Network.responseReceived' && m.params.response.status >= 400) failed.push(m.params.response.url + ' -> ' + m.params.response.status);
  };
  const send = (method, params = {}) => { const mid = ++id; return new Promise((resolve, reject) => { pending.set(mid, { resolve, reject }); ws.send(JSON.stringify({ id: mid, method, params })); }); };
  await send('Page.enable'); await send('Runtime.enable'); await send('Network.enable');
  await send('Emulation.setDeviceMetricsOverride', { width: 320, height: 800, deviceScaleFactor: 2, mobile: true });
  await send('Page.navigate', { url: FILE_URL });
  await sleep(5000);
  const expr = `JSON.stringify({
    styleTags: document.querySelectorAll('style').length,
    sheets: [...document.styleSheets].map(s => { let n = -1; try { n = s.cssRules.length } catch (e) { n = 'cors' } return { href: s.href, n } }),
    bodyBg: getComputedStyle(document.body).backgroundColor,
    heroCircle: (() => { const el = document.querySelector('#home .w-80'); if (!el) return 'MISSING'; const r = el.getBoundingClientRect(); return { w: r.width, left: Math.round(r.left), right: Math.round(r.right) } })(),
    mainW: document.querySelector('main')?.getBoundingClientRect().width,
    scrollW: document.documentElement.scrollWidth,
    clientW: document.documentElement.clientWidth,
    imgLoaded: [...document.images].map(i => ({ src: i.currentSrc.slice(-20), complete: i.complete, w: i.naturalWidth }))
  })`;
  const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true });
  console.log(r.result.value);
  console.log('network failures:', JSON.stringify(failed.slice(0, 10)));
  ws.close(); chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch { }
})();
