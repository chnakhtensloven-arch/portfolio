// CDP audit: find elements causing horizontal overflow at mobile widths
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const { pathToFileURL } = require('url');

const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9333;
const FILE_URL = pathToFileURL(path.resolve(process.argv[2] || 'index.html')).href;
const WIDTHS = [320, 360, 390, 414];

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function main() {
  const userDataDir = fs.mkdtempSync(require('os').tmpdir() + '\\chrome-audit-');
  const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--no-first-run', '--no-default-browser-check', '--disable-gpu',
    '--disable-extensions',
    'about:blank'
  ], { stdio: 'ignore' });

  let targets = null;
  for (let i = 0; i < 50; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${PORT}/json/list`);
      targets = await res.json();
      if (targets.some(t => t.type === 'page')) break;
    } catch { }
    await sleep(200);
  }
  const page = targets?.find(t => t.type === 'page');
  if (!page) { console.error('No page target'); chrome.kill(); process.exit(1); }

  const ws = new WebSocket(page.webSocketDebuggerUrl);
  await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });

  let id = 0;
  const pending = new Map();
  ws.onmessage = (ev) => {
    const msg = JSON.parse(ev.data);
    if (msg.id && pending.has(msg.id)) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) reject(new Error(msg.error.message));
      else resolve(msg.result);
    }
  };
  function send(method, params = {}) {
    const mid = ++id;
    return new Promise((resolve, reject) => {
      pending.set(mid, { resolve, reject });
      ws.send(JSON.stringify({ id: mid, method, params }));
    });
  }

  await send('Page.enable');
  await send('Runtime.enable');

  for (const width of WIDTHS) {
    await send('Emulation.setDeviceMetricsOverride', {
      width, height: 800, deviceScaleFactor: 2, mobile: true
    });
    const nav = await send('Page.navigate', { url: FILE_URL });
    if (nav.errorText) { console.error(`nav failed @${width}: ${nav.errorText}`); continue; }
    await sleep(3000); // fonts + tailwind CDN JIT

    const result = await send('Runtime.evaluate', {
      expression: `(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const offenders = [];
        document.querySelectorAll('body *').forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.width === 0 && r.height === 0) return;
          if (r.right > docWidth + 0.5 || r.left < -0.5) {
            const style = getComputedStyle(el);
            if (style.position === 'fixed') return;
            offenders.push({
              tag: el.tagName.toLowerCase(),
              cls: (el.className && el.className.baseVal !== undefined ? el.className.baseVal : String(el.className || '')).slice(0, 90),
              left: Math.round(r.left * 10) / 10,
              right: Math.round(r.right * 10) / 10,
              width: Math.round(r.width * 10) / 10,
              position: style.position,
              parentCls: String(el.parentElement?.className || '').slice(0, 60)
            });
          }
        });
        return JSON.stringify({ docWidth, scrollWidth, bodyScroll: document.body.scrollWidth, innerWidth: window.innerWidth, count: offenders.length, offenders: offenders.slice(0, 30) });
      })()`,
      returnByValue: true
    });
    const data = JSON.parse(result.result.value);
    console.log(`\n=== ${width}px (inner=${data.innerWidth} client=${data.docWidth} scroll=${data.scrollWidth} bodyScroll=${data.bodyScroll}) offenders=${data.count} ===`);
    for (const o of data.offenders) {
      console.log(`  <${o.tag} class="${o.cls}"> L=${o.left} R=${o.right} W=${o.width} pos=${o.position} parent="${o.parentCls}"`);
    }
  }

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch { }
}

main().catch(e => { console.error(e); process.exit(1); });
