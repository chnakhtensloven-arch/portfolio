// Broad sweep: many widths, EN + RTL, report overflow + widest offenders
const { spawn } = require('child_process');
const { pathToFileURL } = require('url');
const path = require('path');
const fs = require('fs');
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9336;
const FILE_URL = pathToFileURL(path.resolve(process.argv[2])).href;
const WIDTHS = [280, 300, 320, 340, 360, 375, 390, 400, 412, 428, 480, 540, 600, 639, 640, 700, 768, 820, 900, 1024, 1280];
function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }
(async () => {
  const userDataDir = fs.mkdtempSync(require('os').tmpdir() + '\\chrome-sweep-');
  const chrome = spawn(CHROME, ['--headless=new', '--remote-debugging-port=' + PORT, '--user-data-dir=' + userDataDir, '--no-first-run', '--disable-gpu', '--disable-extensions', 'about:blank'], { stdio: 'ignore' });
  let targets = null;
  for (let i = 0; i < 50; i++) { try { const r = await fetch('http://127.0.0.1:' + PORT + '/json/list'); targets = await r.json(); if (targets.some(t => t.type === 'page')) break; } catch { } await sleep(200); }
  const page = targets.find(t => t.type === 'page');
  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
  let id = 0; const pending = new Map();
  ws.onmessage = (ev) => {
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.reject(new Error(m.error.message)) : p.resolve(m.result); }
  };
  const send = (method, params = {}) => { const mid = ++id; return new Promise((resolve, reject) => { pending.set(mid, { resolve, reject }); ws.send(JSON.stringify({ id: mid, method, params })); }); };
  await send('Page.enable'); await send('Runtime.enable');

  const probe = `(() => {
    const cw = document.documentElement.clientWidth;
    const sw = document.documentElement.scrollWidth;
    const bsw = document.body.scrollWidth;
    const bad = [];
    document.querySelectorAll('body *').forEach(el => {
      const r = el.getBoundingClientRect();
      if (!r.width && !r.height) return;
      if (r.right > cw + 0.5 || r.left < -0.5) {
        bad.push(el.tagName.toLowerCase() + '.' + String(el.className.baseVal ?? el.className ?? '').split(' ').slice(0,4).join('.') + ' [' + Math.round(r.left) + '..' + Math.round(r.right) + ']');
      }
    });
    return { cw, sw, bsw, bad: bad.slice(0, 8) };
  })()`;

  for (const rtl of [false, true]) {
    for (const width of WIDTHS) {
      await send('Emulation.setDeviceMetricsOverride', { width, height: 800, deviceScaleFactor: 2, mobile: true });
      await send('Page.navigate', { url: FILE_URL });
      await sleep(1800);
      if (rtl) {
        await send('Runtime.evaluate', { expression: "document.documentElement.dir='rtl'; document.documentElement.lang='ar';" });
        await sleep(300);
      }
      const r = await send('Runtime.evaluate', { expression: probe, returnByValue: true, awaitPromise: false });
      if (r.exceptionDetails) {
        console.log(`${rtl ? 'RTL' : 'EN '} ${width}: EVAL ERROR ${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description || ''}`);
        continue;
      }
      const d = r.result?.value;
      if (!d) {
        console.log(`${rtl ? 'RTL' : 'EN '} ${width}: NO VALUE ${JSON.stringify(r.result)}`);
        continue;
      }
      const over = d.sw > d.cw || d.bsw > d.cw || d.bad.length;
      console.log(`${rtl ? 'RTL' : 'EN '} ${String(width).padStart(4)}: cw=${d.cw} sw=${d.sw} bsw=${d.bsw} ${over ? 'OVERFLOW' : 'ok'}${d.bad.length ? ' | ' + d.bad.join(' ; ') : ''}`);
    }
  }
  ws.close(); chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch { }
})();
