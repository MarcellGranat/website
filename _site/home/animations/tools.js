// Small canvas animations for the tool posts (terminal, Neovim, just, tv, TUIs).
// Every scene is a pure function of time t (seconds); data-time freezes a frame.
const W = 640, H = 440;
const INK = '#14181c', MUTED = '#5d676f', TEAL = '#0f8f86', AMBER = '#d98a00', LINE = 'rgba(20,24,28,.12)';
const MONO = "'JetBrains Mono', ui-monospace, monospace", SANS = "'Inter', system-ui, sans-serif";
const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
const seg = (t, a, b) => clamp((t - a) / (b - a));

function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
function win(c, x, y, w, h, title, dark = true) {
  c.fillStyle = dark ? '#14181c' : '#fff'; rr(c, x, y, w, h, 14); c.fill();
  if (!dark) { c.strokeStyle = LINE; c.stroke(); }
  c.fillStyle = dark ? '#232a30' : '#f1f0ea'; rr(c, x, y, w, 30, [14, 14, 0, 0]); c.fill();
  ['#ff6b5e', '#f5b83d', '#3ccf6e'].forEach((col, i) => { c.fillStyle = col; c.beginPath(); c.arc(x + 20 + i * 18, y + 15, 5, 0, 7); c.fill(); });
  c.fillStyle = dark ? '#8d98a0' : MUTED; c.font = `500 11px ${MONO}`; c.textAlign = 'center'; c.fillText(title, x + w / 2, y + 19); c.textAlign = 'left';
}
const typed = (s, k) => s.slice(0, Math.round(s.length * clamp(k)));
function caret(c, x, y, t, col = '#e6e8ea', w = 8, h = 15) { if (Math.floor(t * 2.2) % 2 === 0) { c.fillStyle = col; c.fillRect(x, y - h + 3, w, h); } }

/* ---------- 1. phone -> tailscale -> always-on computer (T = 14) ---------- */
function remote(c, t) {
  t %= 14;
  // home computer
  const hx = 380, hy = 90;
  c.fillStyle = '#fff'; rr(c, hx, hy, 230, 190, 14); c.fill(); c.strokeStyle = LINE; c.stroke();
  c.fillStyle = MUTED; c.font = `500 11px ${MONO}`; c.fillText('home-pc · always on', hx + 18, hy + 26);
  const job = clamp((t + 0.5) / 14);
  c.fillStyle = INK; c.font = `600 15px ${SANS}`; c.fillText('scraper', hx + 18, hy + 62);
  c.fillStyle = 'rgba(20,24,28,.08)'; rr(c, hx + 18, hy + 76, 194, 12, 6); c.fill();
  c.fillStyle = TEAL; rr(c, hx + 18, hy + 76, Math.max(12, 194 * job), 12, 6); c.fill();
  c.fillStyle = MUTED; c.font = `400 12px ${MONO}`;
  c.fillText(`page ${Math.round(41000 * job).toLocaleString('en')} / 41,000`, hx + 18, hy + 112);
  c.fillText(`running ${Math.floor(job * 38) + 1} h`, hx + 18, hy + 134);
  const a = (t * 5) % (Math.PI * 2);
  c.strokeStyle = AMBER; c.lineWidth = 3; c.beginPath(); c.arc(hx + 196, hy + 142, 9, a, a + 4.2); c.stroke(); c.lineWidth = 1;
  // stand
  c.fillStyle = 'rgba(20,24,28,.14)'; c.fillRect(hx + 95, hy + 190, 40, 14); c.fillRect(hx + 70, hy + 204, 90, 6);
  // phone
  const px = 60, py = 140, awake = t < 10.2 && t > 0.8;
  c.fillStyle = INK; rr(c, px, py, 130, 250, 22); c.fill();
  c.fillStyle = awake ? '#14181c' : '#0b0d0f'; rr(c, px + 8, py + 10, 114, 230, 16); c.fill();
  if (awake) {
    c.font = `500 10px ${MONO}`; c.fillStyle = '#7ee0d6';
    const l1 = typed('$ ssh home-pc', seg(t, 1, 2.4));
    c.fillText(l1, px + 16, py + 40);
    if (t > 2.8) { c.fillStyle = '#8d98a0'; c.fillText('connected', px + 16, py + 58); }
    if (t > 3.6) { c.fillStyle = '#7ee0d6'; c.fillText(typed('$ tmux attach', seg(t, 3.6, 4.8)), px + 16, py + 76); }
    if (t > 5.2) {
      c.fillStyle = '#f5b83d'; c.fillText('[scrape]', px + 16, py + 100);
      c.fillStyle = '#e6e8ea'; c.fillText(`${Math.round(job * 41)}k / 41k`, px + 16, py + 116);
      c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(px + 16, py + 128, 90, 5); c.fillStyle = TEAL; c.fillRect(px + 16, py + 128, 90 * job, 5);
    }
    caret(c, px + 16 + (t < 2.6 ? 6.1 * Math.round(13 * seg(t, 1, 2.4)) : 6.1 * 2), py + 40, t, '#e6e8ea', 6, 11);
  } else {
    c.fillStyle = '#8d98a0'; c.font = `500 10px ${MONO}`; c.textAlign = 'center'; c.fillText(t > 10 ? 'screen off' : '', px + 65, py + 125); c.textAlign = 'left';
  }
  // tunnel
  const ax = px + 134, bx = hx - 4, ay = py + 60, by = hy + 95;
  c.strokeStyle = 'rgba(15,143,134,.35)'; c.lineWidth = 3; c.setLineDash([2, 9]); c.lineCap = 'round';
  c.beginPath(); c.moveTo(ax, ay); c.bezierCurveTo(ax + 70, ay, bx - 70, by, bx, by); c.stroke(); c.setLineDash([]); c.lineWidth = 1;
  c.fillStyle = TEAL; c.font = `600 12px ${SANS}`; c.textAlign = 'center'; c.fillText('Tailscale', (ax + bx) / 2, 168); c.textAlign = 'left';
  if (t > 1.4 && t < 10) {
    for (let i = 0; i < 4; i++) {
      const u = ((t * 0.55 + i / 4) % 1), x = ax + (bx - ax) * u;
      const y = ay + (by - ay) * (u * u * (3 - 2 * u));
      c.fillStyle = i % 2 ? AMBER : TEAL; c.beginPath(); c.arc(x, y, 4, 0, 7); c.fill();
    }
  }
  c.fillStyle = MUTED; c.font = `500 11px ${SANS}`; c.textAlign = 'center'; c.fillText(awake ? 'attached from the phone: the job runs at home' : 'phone off: the job keeps running', 320, 420); c.textAlign = 'left';
}

/* ---------- 2. Neovim flash: jump anywhere (T = 12) ---------- */
const CODE = [
  'import duckdb', 'from pathlib import Path', '', 'def load(path: Path) -> Frame:',
  '    con = duckdb.connect()', '    rows = con.sql(QUERY)', '    return rows.df()', '', 'def clean(frame: Frame) -> Frame:', '    return frame.dropna()',
];
function neovim(c, t) {
  t %= 12;
  win(c, 40, 40, 560, 340, 'nvim · analysis.py');
  c.font = `500 14px ${MONO}`; const cw = c.measureText('m').width, lh = 25, ox = 86, oy = 96;
  const starts = (ch) => { const out = []; CODE.forEach((ln, i) => { for (let j = 0; j < ln.length; j++) if (ln[j] === ch && (j === 0 || !/[a-z0-9_]/i.test(ln[j - 1]))) out.push([i, j]); }); return out.slice(0, 6); };
  const jumps = [{ ch: 'd', to: 3 }, { ch: 'r', to: 1 }].map((j) => ({ ...j, m: starts(j.ch) }));
  const end0 = jumps[0].m[jumps[0].to], end1 = jumps[1].m[jumps[1].to];
  const P = 6, k = Math.floor(t / P) % 2, jt = t % P, J = jumps[k], from = k === 0 ? end1 : end0, dest = J.m[J.to];
  const mv = ease(seg(jt, 3.3, 3.9));
  const cl = from[0] + (dest[0] - from[0]) * mv, cc = from[1] + (dest[1] - from[1]) * mv;
  const labels = jt > 1.4 && jt < 3.3;
  CODE.forEach((ln, i) => { c.fillStyle = labels ? '#6c767d' : (i === Math.round(cl) ? '#e6e8ea' : '#a5afb6'); c.fillText(ln, ox, oy + i * lh); });
  if (labels) J.m.forEach(([l, col], idx) => {
    const x = ox + col * cw, y = oy + l * lh, lab = 'asdfgh'[idx];
    c.fillStyle = '#ffd966'; c.fillRect(x - 1, y - 16, cw + 2, 21); c.fillStyle = INK; c.fillText(J.ch, x, y);
    c.fillStyle = idx === J.to ? '#ff6b9d' : TEAL; c.fillRect(x + cw + 1, y - 16, cw + 3, 21);
    c.fillStyle = '#fff'; c.font = `700 14px ${MONO}`; c.fillText(lab, x + cw + 3, y); c.font = `500 14px ${MONO}`;
  });
  const row = Math.round(cl), col = Math.round(cc);
  if (!labels) { c.fillStyle = '#e6e8ea'; c.fillRect(ox + cc * cw, oy + cl * lh - 16, cw, 21); c.fillStyle = INK; c.fillText((CODE[row] || ' ')[col] || ' ', ox + cc * cw, oy + cl * lh); }
  c.fillStyle = '#232a30'; c.fillRect(40, 350, 560, 30);
  c.fillStyle = labels ? AMBER : TEAL; c.fillRect(40, 350, 70, 30); c.fillStyle = '#fff'; c.font = `700 12px ${MONO}`; c.fillText(labels ? 'FLASH' : 'NORMAL', 50, 369);
  c.fillStyle = '#8d98a0'; c.font = `500 12px ${MONO}`;
  const lab = 'asdfgh'[J.to];
  c.fillText(jt < 0.7 ? '' : jt < 1.4 ? 's' : jt < 3.3 ? 's' + J.ch : jt < 4.2 ? 's' + J.ch + lab : '', 130, 369);
  c.textAlign = 'right'; c.fillText(`${row + 1}:${col + 1}`, 584, 369); c.textAlign = 'left';
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('s + a character + a label: land anywhere in three keys', 40, 412);
}

/* ---------- 3. just: one word runs the task (T = 12) ---------- */
function just(c, t) {
  t %= 12;
  win(c, 40, 40, 560, 340, 'just');
  c.font = `500 15px ${MONO}`;
  const recipes = ['check', 'test', 'run', 'docs'];
  const outs = [
    [['ruff check --fix', '  All checks passed!'], ['pyright', '  0 errors, 0 warnings'], ['ruff format', '  14 files unchanged']],
    [['uv run pytest', '  ============ 42 passed in 3.1s ============']],
  ];
  const k = Math.floor(t / 6) % 2, rt = t % 6, name = k === 0 ? 'check' : 'test', sel = recipes.indexOf(name);
  let y = 84;
  c.fillStyle = '#7ee0d6'; c.fillText('$ ', 62, y);
  c.fillStyle = '#e6e8ea'; c.fillText(typed('just --list', seg(rt, 0.2, 1.0)), 80, y);
  if (rt > 1.2) {
    y += 28; c.fillStyle = '#8d98a0'; c.fillText('Available recipes:', 62, y);
    recipes.forEach((r, i) => { y += 26; const on = i === sel && rt > 2.2; if (on) { c.fillStyle = 'rgba(245,184,61,.16)'; c.fillRect(54, y - 17, 280, 23); } c.fillStyle = on ? '#f5b83d' : '#e6e8ea'; c.fillText('    ' + r, 62, y); });
  }
  if (rt > 2.6) {
    y += 38; c.fillStyle = '#7ee0d6'; c.fillText('$ ', 62, y); c.fillStyle = '#e6e8ea'; c.fillText(typed('just ' + name, seg(rt, 2.6, 3.4)), 80, y);
  }
  let n = 0;
  outs[k].forEach(([cmd, res], i) => {
    const at = 3.6 + i * 0.7;
    if (rt > at) { y += 24; c.fillStyle = '#8d98a0'; c.font = `500 13px ${MONO}`; c.fillText('› ' + cmd, 62, y); }
    if (rt > at + 0.35) { y += 22; c.fillStyle = '#3ccf6e'; c.fillText('✓' + res, 62, y); }
    n++;
  });
  c.font = `500 12px ${SANS}`; c.fillStyle = MUTED; c.fillText('same words in every project: check, test, run', 40, 412);
}

/* ---------- 4. tv: a channel with preview (T = 14) ---------- */
const TESTS = ['tests/test_io.py::test_load_csv', 'tests/test_io.py::test_load_json', 'tests/test_clean.py::test_drop_na', 'tests/test_clean.py::test_load_rules', 'tests/test_model.py::test_fit', 'tests/test_model.py::test_predict', 'tests/test_cli.py::test_help'];
function tv(c, t) {
  t %= 14;
  win(c, 30, 40, 580, 340, 'tv · pytest');
  const q = 'load', nq = Math.round(q.length * seg(t, 1, 3.2));
  const query = q.slice(0, nq);
  const matches = (s) => { let i = 0; for (const ch of s) if (i < query.length && ch === query[i]) i++; return i === query.length; };
  const items = TESTS.filter(matches);
  const ran = t > 8.2;
  c.fillStyle = '#232a30'; c.fillRect(46, 78, 270, 30);
  c.font = `500 14px ${MONO}`; c.fillStyle = '#7ee0d6'; c.fillText('> ', 56, 98); c.fillStyle = '#e6e8ea'; c.fillText(query, 78, 98);
  if (!ran) caret(c, 78 + 8.4 * query.length, 98, t, '#e6e8ea', 8, 15);
  c.font = `500 12px ${MONO}`; c.fillStyle = '#8d98a0'; c.fillText(`${items.length}/${TESTS.length}`, 258, 98);
  const selIdx = nq === 4 ? Math.floor(seg(t, 4.2, 5.2) * 1.99) : 0;
  const sel = Math.min(selIdx, items.length - 1);
  items.forEach((s, i) => {
    const y = 134 + i * 28;
    if (i === sel && nq > 0) { c.fillStyle = 'rgba(245,184,61,.18)'; c.fillRect(46, y - 17, 270, 24); c.fillStyle = '#f5b83d'; c.fillText('▌', 46, y); }
    // highlight matched characters
    let qi = 0, x = 62; c.font = `500 11px ${MONO}`;
    for (const ch of s.replace('tests/', '')) {
      const hit = qi < query.length && ch === query[qi]; if (hit) qi++;
      c.fillStyle = hit ? '#7ee0d6' : (i === sel ? '#fff' : '#b8c0c6'); c.fillText(ch, x, y); x += 6.6;
    }
  });
  // preview pane
  c.fillStyle = '#1b2227'; c.fillRect(330, 78, 264, 286);
  c.font = `500 11px ${MONO}`;
  const chosen = items[sel] || '';
  c.fillStyle = '#8d98a0'; c.fillText(chosen ? chosen.split('::')[0] : 'preview', 344, 98);
  if (chosen) {
    const fn = chosen.split('::')[1];
    ['import pytest', '', `def ${fn}(tmp_path):`, '    path = tmp_path / "a.csv"', '    frame = load(path)', '    assert len(frame) == 3'].forEach((ln, i) => {
      c.fillStyle = i === 2 ? '#f5b83d' : '#cfd6db'; c.fillText(ln, 344, 126 + i * 20);
    });
  }
  if (ran) {
    c.fillStyle = 'rgba(60,207,110,.14)'; c.fillRect(330, 296, 264, 68);
    c.fillStyle = '#3ccf6e'; c.font = `700 13px ${MONO}`; c.fillText('uv run pytest -s', 344, 320);
    c.font = `500 12px ${MONO}`; c.fillText('1 passed in 0.04s', 344, 342);
  }
  c.font = `500 12px ${SANS}`; c.fillStyle = MUTED; c.fillText('type, preview, press Enter: a channel is just a small TOML file', 30, 412);
}

/* ---------- 5. TUIs: lazygit, yazi, VisiData (T = 18) ---------- */
function tuis(c, t) {
  t %= 18;
  const k = Math.floor(t / 6), rt = t % 6, names = ['lazygit', 'yazi', 'vd'];
  const fadeIn = ease(rt / 0.5), fadeOut = 1 - ease((rt - 5.5) / 0.5);
  c.globalAlpha = Math.min(fadeIn, fadeOut);
  win(c, 40, 40, 560, 340, names[k] === 'vd' ? 'vd · prices.parquet' : names[k]);
  c.font = `500 13px ${MONO}`;
  if (k === 0) { // lazygit: files staged one by one, commit graph grows
    c.fillStyle = '#8d98a0'; c.fillText('Files', 62, 82);
    ['M  analysis.py', 'M  Justfile', 'A  notes.md', '?? scratch.csv'].forEach((f, i) => {
      const y = 108 + i * 26, staged = i < 3 && rt > 1 + i * 0.9;
      c.fillStyle = staged ? '#3ccf6e' : '#f5b83d'; c.fillText(staged ? '✓' : '·', 62, y);
      c.fillStyle = i === 3 ? '#8d98a0' : '#e6e8ea'; c.fillText(f.slice(3), 86, y);
    });
    c.fillStyle = '#8d98a0'; c.fillText('Commits', 340, 82);
    const commits = ['fix: handle empty frame', 'add pytest for load()', 'refactor: split clean()'];
    const n = rt > 4 ? 4 : 3;
    for (let i = 0; i < n; i++) {
      const y = 112 + i * 36, newest = n === 4 && i === 0;
      const msg = newest ? 'update: analysis, just' : commits[i - (n === 4 ? 1 : 0)];
      const a = newest ? ease(seg(rt, 4, 4.6)) : 1; c.globalAlpha = Math.min(fadeIn, fadeOut) * a;
      c.fillStyle = i === 0 ? '#f5b83d' : TEAL; c.beginPath(); c.arc(350, y - 4, 6, 0, 7); c.fill();
      if (i < n - 1) { c.fillStyle = 'rgba(255,255,255,.2)'; c.fillRect(349, y + 2, 2, 30); }
      c.fillStyle = '#e6e8ea'; c.fillText(msg, 368, y);
    }
    c.globalAlpha = Math.min(fadeIn, fadeOut);
    c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`; c.fillText('space stage   c commit   P push', 62, 354);
  } else if (k === 1) { // yazi: three columns, cursor moves, preview changes
    const parents = ['archive', 'data', 'notebooks', 'src'], files = ['prices.parquet', 'rents.csv', 'city.duckdb', 'notes.md'];
    parents.forEach((p, i) => { c.fillStyle = i === 1 ? '#f5b83d' : '#8d98a0'; c.fillText((i === 1 ? '▌' : ' ') + p, 54, 90 + i * 26); });
    const sel = Math.min(3, Math.floor(rt / 1.3));
    files.forEach((f, i) => { const y = 90 + i * 26; if (i === sel) { c.fillStyle = 'rgba(245,184,61,.18)'; c.fillRect(196, y - 17, 190, 24); } c.fillStyle = i === sel ? '#fff' : '#b8c0c6'; c.fillText(f, 206, y); });
    c.fillStyle = '#1b2227'; c.fillRect(400, 60, 190, 310);
    c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`;
    const prev = [['city  n  mean', 'Bud  9314  612', 'Deb  1208  318', 'Sze   944  297'], ['date  rent', '2024  214', '2025  231', '2026  249'], ['tables:', '  prices', '  rents', '↵ opens DuckDB'], ['# Notes', '- check merge', '- redo plot', '']][sel];
    prev.forEach((ln, i) => { c.fillStyle = i === 0 ? '#f5b83d' : '#cfd6db'; c.fillText(ln, 412, 90 + i * 22); });
    c.font = `500 11px ${MONO}`; c.fillStyle = '#8d98a0'; c.fillText('j/k move   l enter   ↵ open   ctrl-d diff', 62, 354);
  } else { // VisiData: frequency table + heat cells
    const hdr = ['city', 'rooms', 'price', 'size'], cols = [62, 190, 290, 410];
    hdr.forEach((h, i) => { c.fillStyle = i === (rt > 3 ? 0 : 99) ? '#f5b83d' : '#7ee0d6'; c.fillText(h, cols[i], 84); });
    const rows = [['Budapest', 3, 612, 74], ['Budapest', 2, 540, 58], ['Debrecen', 3, 318, 71], ['Szeged', 2, 297, 55], ['Budapest', 4, 801, 98], ['Pécs', 2, 281, 52]];
    rows.forEach((r, i) => {
      const y = 112 + i * 26;
      if (rt < 3 || true) { const heat = clamp((r[2] - 250) / 560); c.fillStyle = `rgba(217,138,0,${0.12 + heat * 0.5})`; c.fillRect(280, y - 17, 100, 23); }
      c.fillStyle = '#e6e8ea'; c.fillText(String(r[0]), cols[0], y); c.fillText(String(r[1]), cols[1], y); c.fillText(String(r[2]), cols[2], y); c.fillText(String(r[3]), cols[3], y);
    });
    if (rt > 3) {
      const a = ease(seg(rt, 3, 3.6)); c.globalAlpha = Math.min(fadeIn, fadeOut) * a;
      c.fillStyle = '#232a30'; rr(c, 330, 150, 250, 150, 10); c.fill(); c.strokeStyle = 'rgba(255,255,255,.1)'; c.stroke();
      c.fillStyle = '#7ee0d6'; c.fillText('F  frequency: city', 346, 176);
      [['Budapest', 3], ['Debrecen', 1], ['Szeged', 1], ['Pécs', 1]].forEach(([nm, v], i) => {
        const y = 204 + i * 24; c.fillStyle = '#e6e8ea'; c.font = `500 12px ${MONO}`; c.fillText(nm, 346, y);
        c.fillStyle = TEAL; c.fillRect(444, y - 11, 24 * v * ease(seg(rt, 3.3, 4.2)), 13);
      });
      c.font = `500 13px ${MONO}`; c.globalAlpha = Math.min(fadeIn, fadeOut);
    }
    c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`; c.fillText('Shift-F frequency   Shift-I describe   + my own extensions', 62, 354);
  }
  c.globalAlpha = 1;
  // tab pills under the window
  ['lazygit', 'yazi', 'VisiData'].forEach((nme, i) => {
    const x = 40 + i * 106; c.fillStyle = i === k ? INK : 'transparent'; rr(c, x, 396, 98, 26, 13); c.fill(); c.strokeStyle = LINE; c.stroke();
    c.fillStyle = i === k ? '#fff' : MUTED; c.font = `600 12px ${SANS}`; c.textAlign = 'center'; c.fillText(nme, x + 49, 413); c.textAlign = 'left';
  });
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.textAlign = 'right'; c.fillText('same apps on laptop · iPad · phone', 600, 413); c.textAlign = 'left';
}

const SCENES = { remote, neovim, just, tv, tuis };
export function mount(cv, { reduced = false } = {}) {
  const c = cv.getContext('2d'), scene = SCENES[cv.dataset.tool];
  const frozen = cv.dataset.time !== undefined ? +cv.dataset.time : null;
  let vis = false, raf = 0, t0 = 0;
  const paint = (now) => { c.clearRect(0, 0, W, H); c.textBaseline = 'alphabetic'; c.textAlign = 'left'; scene(c, frozen ?? (reduced ? 6.5 : (now - t0) / 1000)); };
  function size() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    c.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0); paint(performance.now());
  }
  const loop = (now) => { if (!vis) return; paint(now); raf = requestAnimationFrame(loop); };
  new ResizeObserver(size).observe(cv);
  new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis && !reduced && frozen === null) { t0 = t0 || performance.now(); raf = requestAnimationFrame(loop); } }, { threshold: 0.05 }).observe(cv);
  size();
}
