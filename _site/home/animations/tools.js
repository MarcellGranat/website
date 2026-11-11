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

/* ---------- 6. CLAUDE.md rules -> agent behaviour (T = 13) ---------- */
function claude(c, t) {
  t %= 13;
  const rules = ['uv for Python', 'strict type hints', 'tests in tests/', 'minimal git', 'ask in bold'];
  const acts = [['$ uv run pytest', '42 passed'], ['$ pyright --strict', '0 errors'], ['$ uv run pytest tests/', 'ok'], ['$ git add -- changed.py', ''], ['**Which file?**', '']];
  c.fillStyle = '#fff'; rr(c, 30, 50, 250, 330, 14); c.fill(); c.strokeStyle = LINE; c.stroke();
  c.fillStyle = TEAL; c.font = `700 14px ${MONO}`; c.fillText('CLAUDE.md', 52, 86);
  c.fillStyle = LINE; c.fillRect(52, 98, 206, 1);
  win(c, 310, 50, 300, 330, 'claude · agent');
  const step = 1.9; let y = 140;
  rules.forEach((r, i) => {
    const at = 0.8 + i * step, shown = t > at, hot = t > at + 0.7 && t < at + step + 0.2;
    if (hot) { c.fillStyle = 'rgba(217,138,0,.16)'; c.fillRect(40, 124 + i * 44 - 4, 230, 34); }
    if (shown) { c.fillStyle = INK; c.font = `500 14px ${MONO}`; c.fillText(typed('- ' + r, seg(t, at, at + 0.7)), 52, 144 + i * 44); }
    const a = at + 0.9;
    if (t > a) {
      c.font = `500 12px ${MONO}`; c.fillStyle = '#7ee0d6'; c.fillText(typed(acts[i][0], seg(t, a, a + 0.6)), 326, 100 + i * 52);
      if (acts[i][1] && t > a + 0.7) { c.fillStyle = '#3ccf6e'; c.fillText('✓ ' + acts[i][1], 326, 118 + i * 52); }
    }
  });
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('write the rules once, every session follows them', 30, 412);
}

/* ---------- 7. OpenSpec: proposal -> design -> tasks -> archive (T = 14) ---------- */
function openspec(c, t) {
  t %= 14;
  const cards = [['proposal.md', 'what & why'], ['design.md', 'how'], ['tasks.md', 'steps'], ['specs/', 'archived']];
  const stage = Math.min(3, Math.floor(t / 3));
  cards.forEach(([name, sub], i) => {
    const x = 28 + i * 150, y = 100, w = 128, h = 190, on = i <= stage, cur = i === stage;
    c.fillStyle = '#fff'; rr(c, x, y, w, h, 12); c.fill(); c.strokeStyle = cur ? TEAL : LINE; c.lineWidth = cur ? 2.5 : 1; c.stroke(); c.lineWidth = 1;
    c.fillStyle = on ? INK : '#a5afb6'; c.font = `700 13px ${MONO}`; c.fillText(name, x + 14, y + 28);
    c.fillStyle = MUTED; c.font = `500 11px ${SANS}`; c.fillText(sub, x + 14, y + 46);
    const fill = on ? ease(seg(t - i * 3, 0, 1.6)) : 0;
    if (i < 2) for (let l = 0; l < 5; l++) { c.fillStyle = 'rgba(20,24,28,.08)'; c.fillRect(x + 14, y + 66 + l * 20, w - 28, 8); c.fillStyle = cur || on ? TEAL : '#c9d1d6'; c.fillRect(x + 14, y + 66 + l * 20, (w - 28) * clamp(fill * 1.4 - l * 0.12) * (l === 4 ? 0.6 : 1), 8); }
    if (i === 2) ['write spec', 'implement', 'run tests'].forEach((tk, l) => {
      const ticked = t > 6 + l * 1.1 + 0.5 && t < 12.6; c.strokeStyle = '#8d98a0'; c.strokeRect(x + 14, y + 66 + l * 34, 14, 14);
      if (ticked) { c.fillStyle = TEAL; c.fillRect(x + 14, y + 66 + l * 34, 14, 14); c.strokeStyle = '#fff'; c.lineWidth = 2; c.beginPath(); c.moveTo(x + 17, y + 73 + l * 34); c.lineTo(x + 21, y + 77 + l * 34); c.lineTo(x + 26, y + 69 + l * 34); c.stroke(); c.lineWidth = 1; }
      c.fillStyle = on ? INK : '#a5afb6'; c.font = `500 11px ${SANS}`; c.fillText(tk, x + 36, y + 77 + l * 34);
    });
    if (i === 3) { c.fillStyle = on ? '#3ccf6e' : '#c9d1d6'; c.font = `700 30px ${SANS}`; c.fillText(t > 9.4 ? '✓' : '·', x + 14, y + 100); c.fillStyle = MUTED; c.font = `500 11px ${SANS}`; c.fillText('deltas merged', x + 14, y + 126); c.fillText('into the specs', x + 14, y + 142); }
    if (i < 3) { c.fillStyle = on && i < stage ? TEAL : '#c9d1d6'; c.font = `700 20px ${SANS}`; c.fillText('›', x + w + 6, y + h / 2); }
  });
  const px = 28 + stage * 150 + 64; c.fillStyle = AMBER; c.beginPath(); c.arc(px, 322, 7, 0, 7); c.fill();
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.textAlign = 'center'; c.fillText(['propose', 'design', 'apply the tasks', 'archive'][stage], px, 350); c.textAlign = 'left';
  c.font = `500 12px ${SANS}`; c.fillText('agree on the change in plain Markdown before any code is written', 30, 412);
}

/* ---------- 8. herdr: workspaces and agent states in one sidebar (T = 12) ---------- */
function herdr(c, t) {
  t %= 12;
  win(c, 30, 40, 580, 340, 'herdr');
  const names = ['website', 'compass', 'housing', 'tokyo'], st = ['working', 'waiting', 'done', 'idle'];
  const state = (i) => st[(Math.floor(t / 3) + i) % 4];
  c.fillStyle = '#1b2227'; c.fillRect(30, 70, 190, 280);
  names.forEach((n, i) => {
    const y = 104 + i * 62, s = state(i), col = { working: '#7ee0d6', waiting: '#f5b83d', done: '#3ccf6e', idle: '#6b757c' }[s];
    c.fillStyle = 'rgba(255,255,255,.04)'; rr(c, 42, y - 22, 166, 52, 8); c.fill();
    c.fillStyle = col;
    if (s === 'working') { const a = t * 6; c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.arc(64, y - 2, 8, a, a + 4.2); c.stroke(); c.lineWidth = 1; }
    else if (s === 'waiting') { c.font = `700 18px ${MONO}`; c.fillText('!', 59, y + 4); } else if (s === 'done') { c.font = `700 16px ${MONO}`; c.fillText('✓', 56, y + 4); } else { c.beginPath(); c.arc(64, y - 2, 5, 0, 7); c.fill(); }
    c.fillStyle = '#e6e8ea'; c.font = `600 13px ${MONO}`; c.fillText(n, 84, y - 4);
    c.fillStyle = '#8d98a0'; c.font = `500 10px ${MONO}`; c.fillText(`main · ${s}`, 84, y + 14);
  });
  // panes
  [[236, 70], [424, 70], [236, 212], [424, 212]].forEach(([x, y], i) => {
    const s = state(i), col = { working: '#7ee0d6', waiting: '#f5b83d', done: '#3ccf6e', idle: '#4a5560' }[s];
    c.strokeStyle = col; c.lineWidth = s === 'waiting' ? 2.5 : 1.5; rr(c, x, y, 176, 128, 8); c.stroke(); c.lineWidth = 1;
    c.fillStyle = col; c.font = `700 10px ${MONO}`; c.fillText(`claude · ${names[i]}`, x + 10, y + 18);
    for (let l = 0; l < 4; l++) { c.fillStyle = 'rgba(255,255,255,.14)'; c.fillRect(x + 10, y + 36 + l * 20, 60 + ((l * 37 + i * 23) % 90), 7); }
    if (s === 'waiting') { c.fillStyle = '#f5b83d'; c.font = `500 11px ${MONO}`; c.fillText('approve edit? y/n', x + 10, y + 118); }
  });
  // bar
  c.fillStyle = '#232a30'; c.fillRect(30, 350, 580, 30);
  c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`; c.fillText('1 website   2 shell   3 yazi', 44, 369);
  c.fillStyle = '#f38ba8'; c.textAlign = 'right'; c.fillText('● 18:42', 520, 369); c.fillStyle = '#8d98a0'; c.fillText('14:32', 594, 369); c.textAlign = 'left';
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('every workspace and its agent, at a glance', 30, 412);
}

/* ---------- 9. herdr-pomodoro: focus filters the agent list (T = 16) ---------- */
function pomodoro(c, t) {
  t %= 16;
  const focus = t < 10, p = focus ? t / 10 : (t < 13 ? (t - 10) / 3 : 1);
  const cx = 190, cy = 210, R = 110;
  c.lineWidth = 16; c.lineCap = 'round';
  c.strokeStyle = 'rgba(20,24,28,.08)'; c.beginPath(); c.arc(cx, cy, R, 0, 7); c.stroke();
  c.strokeStyle = focus ? '#f38ba8' : (t < 13 ? TEAL : 'rgba(20,24,28,.12)');
  c.beginPath(); c.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (focus ? 1 - p : (t < 13 ? 1 - p : 0)) + 0.001); c.stroke(); c.lineWidth = 1;
  const secs = focus ? Math.round(25 * 60 * (1 - p)) : (t < 13 ? Math.round(5 * 60 * (1 - p)) : 0);
  c.fillStyle = INK; c.font = `700 44px ${MONO}`; c.textAlign = 'center';
  c.fillText(`${String(Math.floor(secs / 60)).padStart(2, '0')}:${String(secs % 60).padStart(2, '0')}`, cx, cy + 10);
  c.fillStyle = MUTED; c.font = `600 14px ${SANS}`; c.fillText(focus ? 'focus' : (t < 13 ? 'break' : 'idle'), cx, cy + 40); c.textAlign = 'left';
  // sidebar: only the focus workspace while focusing
  c.fillStyle = '#14181c'; rr(c, 360, 70, 250, 280, 14); c.fill();
  c.fillStyle = '#8d98a0'; c.font = `600 11px ${MONO}`; c.fillText(focus ? 'agents · focus workspace only' : 'agents · all workspaces', 376, 98);
  ['website', 'compass', 'housing', 'tokyo'].forEach((n, i) => {
    const show = !focus || i === 0, y = 132 + i * 52, a = show ? 1 : 0.1; c.globalAlpha = a;
    c.fillStyle = 'rgba(255,255,255,.05)'; rr(c, 374, y - 22, 222, 42, 8); c.fill();
    c.fillStyle = i === 0 ? '#7ee0d6' : '#f5b83d'; c.beginPath(); c.arc(394, y - 1, 5, 0, 7); c.fill();
    c.fillStyle = '#e6e8ea'; c.font = `600 13px ${MONO}`; c.fillText(n, 412, y + 4); c.globalAlpha = 1;
  });
  c.fillStyle = '#f38ba8'; c.font = `500 11px ${MONO}`; c.fillText(focus ? 'sidebar toggle locked' : '', 376, 330);
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('25 minutes of focus, then a break; the agents of other projects wait', 30, 412);
}

/* ---------- 10. uv: commands -> pyproject, lockfile, environment (T = 13) ---------- */
function uv(c, t) {
  t %= 13;
  win(c, 30, 50, 320, 330, 'uv');
  const cmds = [['$ uv init analysis', 'Initialized project'], ['$ uv add duckdb', 'Resolved 4 packages'], ['$ uv add --dev pytest', 'Added pytest'], ['$ uv run pytest', '42 passed']];
  cmds.forEach(([cmd, out], i) => {
    const at = 0.6 + i * 2.7; if (t < at) return;
    const y = 96 + i * 62; c.font = `500 13px ${MONO}`; c.fillStyle = '#7ee0d6'; c.fillText(typed(cmd, seg(t, at, at + 0.9)), 48, y);
    if (t > at + 1.1) { c.fillStyle = '#3ccf6e'; c.fillText('✓ ' + out, 48, y + 22); }
  });
  // files
  const card = (x, y, w, h, name, on) => { c.globalAlpha = on; c.fillStyle = '#fff'; rr(c, x, y, w, h, 12); c.fill(); c.strokeStyle = LINE; c.stroke(); c.fillStyle = INK; c.font = `700 13px ${MONO}`; c.fillText(name, x + 14, y + 26); };
  card(370, 50, 240, 150, 'pyproject.toml', ease(seg(t, 1.2, 1.8)));
  c.font = `500 12px ${MONO}`; c.fillStyle = MUTED; c.fillText('[project]', 384, 92); c.fillText('name = "analysis"', 384, 112);
  if (t > 3.6) { c.fillStyle = TEAL; c.fillText('dependencies = [', 384, 134); c.fillText('  "duckdb",', 384, 152); c.fillText(']', 384, 170); }
  if (t > 6.4) { c.fillStyle = AMBER; c.fillText('dev = ["pytest"]', 384, 188); }
  c.globalAlpha = 1;
  card(370, 214, 240, 80, 'uv.lock', ease(seg(t, 3.6, 4.2)));
  for (let l = 0; l < 3; l++) { c.fillStyle = 'rgba(20,24,28,.08)'; c.fillRect(384, 242 + l * 14, 210, 7); c.fillStyle = '#6d4fc2'; c.fillRect(384, 242 + l * 14, 210 * clamp((t - 4 - l * 0.3) / 1.2) * (l === 2 ? 0.55 : 1), 7); }
  c.globalAlpha = 1;
  card(370, 308, 240, 72, '.venv/', ease(seg(t, 4.0, 4.6)));
  c.fillStyle = MUTED; c.font = `500 11px ${SANS}`; c.fillText(t > 8 ? 'managed by uv, never activated' : 'created on demand', 384, 358);
  c.globalAlpha = 1; c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('one tool for Python versions, environments and dependencies', 30, 412);
}

/* ---------- 11. marimo: reactive cells, remote URL (T = 14) ---------- */
function marimo(c, t) {
  t %= 14;
  c.fillStyle = '#fff'; rr(c, 30, 40, 580, 340, 14); c.fill(); c.strokeStyle = LINE; c.stroke();
  c.fillStyle = '#f1f0ea'; rr(c, 30, 40, 580, 36, [14, 14, 0, 0]); c.fill();
  c.fillStyle = '#fff'; rr(c, 120, 49, 360, 18, 9); c.fill(); c.fillStyle = MUTED; c.font = `500 11px ${MONO}`; c.textAlign = 'center'; c.fillText('home-pc:6061', 300, 62); c.textAlign = 'left';
  const k = (t < 7 ? ease(seg(t, 1.2, 3)) : 1 - ease(seg(t, 8, 10.4))) , n = Math.round(1 + k * 8);
  const hot = (a, b) => (t > a && t < b);
  // cell 1: slider
  c.strokeStyle = hot(1.2, 3.4) || hot(8, 10.6) ? AMBER : LINE; c.lineWidth = hot(1.2, 3.4) || hot(8, 10.6) ? 2.5 : 1; rr(c, 50, 92, 540, 62, 10); c.stroke(); c.lineWidth = 1;
  c.fillStyle = MUTED; c.font = `500 12px ${MONO}`; c.fillText('rooms = mo.ui.slider(1, 10)', 66, 118);
  c.fillStyle = 'rgba(20,24,28,.12)'; rr(c, 330, 108, 200, 6, 3); c.fill(); c.fillStyle = TEAL; rr(c, 330, 108, 200 * (n - 1) / 9, 6, 3); c.fill();
  c.fillStyle = '#fff'; c.strokeStyle = TEAL; c.lineWidth = 2; c.beginPath(); c.arc(330 + 200 * (n - 1) / 9, 111, 9, 0, 7); c.fill(); c.stroke(); c.lineWidth = 1;
  c.fillStyle = INK; c.font = `700 13px ${MONO}`; c.fillText(String(n), 548, 116);
  // cell 2: SQL
  const upd = hot(1.6, 3.8) || hot(8.4, 10.8);
  c.strokeStyle = upd ? AMBER : LINE; c.lineWidth = upd ? 2.5 : 1; rr(c, 50, 166, 540, 78, 10); c.stroke(); c.lineWidth = 1;
  c.fillStyle = '#6d4fc2'; c.font = `700 11px ${MONO}`; c.fillText('SQL', 66, 190);
  c.fillStyle = MUTED; c.font = `500 12px ${MONO}`; c.fillText('SELECT city, count(*) FROM prices', 100, 190); c.fillText(`WHERE rooms >= ${n} GROUP BY city`, 100, 210);
  c.fillStyle = INK; c.font = `600 12px ${MONO}`; c.fillText(`${Math.round(9400 / (n * 0.9 + 1))} rows`, 66, 232);
  // cell 3: chart
  c.strokeStyle = upd ? AMBER : LINE; c.lineWidth = upd ? 2.5 : 1; rr(c, 50, 256, 540, 108, 10); c.stroke(); c.lineWidth = 1;
  [1, 0.72, 0.5, 0.36, 0.25].forEach((v, i) => { const h = 70 * v * (1 - (n - 1) * 0.07) + 6; c.fillStyle = i === 0 ? TEAL : 'rgba(15,143,134,.45)'; rr(c, 90 + i * 70, 352 - h, 44, h, 4); c.fill(); });
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('change one value, every dependent cell re-runs', 30, 412);
}

/* ---------- 12. quarto: one source, many outputs (T = 14) ---------- */
function quarto(c, t) {
  t %= 14;
  c.fillStyle = '#fff'; rr(c, 30, 50, 230, 320, 14); c.fill(); c.strokeStyle = LINE; c.stroke();
  c.fillStyle = TEAL; c.font = `700 13px ${MONO}`; c.fillText('report.qmd', 48, 80);
  const src = ['---', 'title: "Results"', 'format: html', '---', '', '## Method', 'We estimate...', '', '```{python}', 'plot(df)', '```'];
  src.forEach((ln, i) => { const a = 0.4 + i * 0.28; if (t > a) { c.fillStyle = ln.startsWith('#') ? INK : (ln.startsWith('`') || ln.startsWith('plot') ? '#6d4fc2' : MUTED); c.font = `500 12px ${MONO}`; c.fillText(typed(ln, seg(t, a, a + 0.3)), 48, 108 + i * 22); } });
  const go = t > 4.2; c.fillStyle = go ? AMBER : '#c9d1d6'; c.font = `700 44px ${SANS}`; c.fillText('›', 282, 226); c.font = `700 11px ${MONO}`; c.fillText('quarto render', 330, 56);
  [['HTML', '#0f8f86', 330, 70], ['PDF', '#e5484d', 470, 70], ['Word', '#2f6fb0', 330, 200], ['Slides', '#d98a00', 470, 200]].forEach(([nm, col, x, y], i) => {
    const a = ease(seg(t, 4.6 + i * 0.5, 5.4 + i * 0.5)); c.globalAlpha = a;
    const dy = (1 - a) * 18; c.fillStyle = '#fff'; rr(c, x, y + dy, 120, 110, 10); c.fill(); c.strokeStyle = LINE; c.stroke();
    c.fillStyle = col; c.fillRect(x, y + dy, 120, 22); c.fillStyle = '#fff'; c.font = `700 12px ${SANS}`; c.fillText(nm, x + 12, y + dy + 16);
    for (let l = 0; l < 4; l++) { c.fillStyle = 'rgba(20,24,28,.12)'; c.fillRect(x + 12, y + dy + 38 + l * 14, l === 3 ? 50 : 96, 6); }
    c.fillStyle = TEAL; c.fillRect(x + 12, y + dy + 90, 36, 12); c.globalAlpha = 1;
  });
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('write once in Markdown with code, publish as anything', 30, 412);
}

/* ---------- 13. duckdb: SQL straight on files (T = 14) ---------- */
function duckdb(c, t) {
  t %= 14;
  win(c, 30, 50, 580, 320, 'duckdb');
  const files = [['prices.parquet', 0], ['rents.csv', 1], ['events.jsonl', 2]];
  files.forEach(([f, i]) => { const on = t > 3.2 && t < 8; c.fillStyle = on ? 'rgba(245,184,61,.2)' : 'rgba(255,255,255,.05)'; rr(c, 46, 92 + i * 34, 150, 26, 6); c.fill(); c.fillStyle = on ? '#f5b83d' : '#8d98a0'; c.font = `500 12px ${MONO}`; c.fillText(f, 58, 110 + i * 34); });
  c.fillStyle = '#7ee0d6'; c.font = `500 13px ${MONO}`;
  const q = ['SELECT city, avg(price)', "FROM 'prices.parquet'", 'GROUP BY city', 'ORDER BY 2 DESC;'];
  q.forEach((ln, i) => { c.fillStyle = i === 1 ? '#f5b83d' : '#7ee0d6'; c.fillText(typed((i === 0 ? 'D ' : '  ') + ln, seg(t, 0.4 + i * 0.7, 1.1 + i * 0.7)), 220, 100 + i * 24); });
  if (t > 3.6) {
    const a = ease(seg(t, 3.6, 4.2)); c.globalAlpha = a; c.fillStyle = '#1b2227'; rr(c, 220, 214, 372, 136, 8); c.fill();
    c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`; c.fillText('city          avg(price)', 236, 238);
    [['Budapest', 612, 1], ['Debrecen', 318, 0.52], ['Szeged', 297, 0.48], ['Pécs', 281, 0.46]].forEach(([nm, v, w], i) => {
      c.fillStyle = '#e6e8ea'; c.fillText(nm, 236, 258 + i * 20); c.fillText(String(v), 326, 258 + i * 20);
      c.fillStyle = TEAL; c.fillRect(372, 249 + i * 20, 190 * w * a, 9);
    });
    c.fillStyle = '#3ccf6e'; c.fillText('4 rows · 0.04 s', 236, 340); c.globalAlpha = 1;
  }
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('no import step: query the files where they are', 30, 412);
}

/* ---------- 14. visidata: heatmap and regression tree (T = 16) ---------- */
function visidata(c, t) {
  t %= 16;
  const tree = t >= 8;
  win(c, 30, 40, 580, 340, tree ? 'vd · decision-tree' : 'vd · events.jsonl');
  c.font = `500 12px ${MONO}`;
  if (!tree) {
    const cols = ['price', 'size', 'rooms', 'age'], r = [[1, .82, .64, -.3], [.82, 1, .71, -.2], [.64, .71, 1, -.1], [-.3, -.2, -.1, 1]];
    c.fillStyle = '#8d98a0'; c.fillText(t > 2 ? 'gA  association-heatmap' : 'vd events.jsonl', 52, 80);
    if (t < 2) { ['price  size  rooms  age', '612    74    3      12', '540    58    2      31', '801    98    4      7'].forEach((ln, i) => { c.fillStyle = i ? '#cfd6db' : '#7ee0d6'; c.fillText(ln, 52, 112 + i * 26); }); }
    else cols.forEach((cn, i) => { c.fillStyle = '#7ee0d6'; c.fillText(cn, 150 + i * 92, 110); c.fillStyle = '#7ee0d6'; c.fillText(cn, 52, 148 + i * 52);
      cols.forEach((_, j) => { const v = r[i][j], a = ease(seg(t, 2.2 + (i + j) * 0.3, 3 + (i + j) * 0.3)); c.fillStyle = v >= 0 ? `rgba(15,143,134,${.15 + .7 * Math.abs(v) * a})` : `rgba(229,72,77,${.15 + .7 * Math.abs(v) * a})`; c.fillRect(140 + j * 92, 124 + i * 52, 84, 44); c.fillStyle = '#fff'; c.globalAlpha = a; c.fillText(v.toFixed(2), 160 + j * 92, 152 + i * 52); c.globalAlpha = 1; }); });
    c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`; c.fillText('Pearson r · Cramér\'s V · eta²', 52, 360);
  } else {
    const nodes = [[310, 90, 'size < 65?', 0], [190, 190, 'age < 20?', 1.2], [430, 190, 'rooms < 4?', 1.2], [120, 300, '£ 310', 2.4], [260, 300, '£ 470', 2.4], [360, 300, '£ 590', 2.4], [500, 300, '£ 810', 2.4]];
    const edges = [[0, 1], [0, 2], [1, 3], [1, 4], [2, 5], [2, 6]];
    edges.forEach(([a, b]) => { const A = nodes[a], B = nodes[b], k = ease(seg(t - 8, B[3], B[3] + 0.8)); c.strokeStyle = `rgba(255,255,255,${.3 * k})`; c.beginPath(); c.moveTo(A[0], A[1] + 16); c.lineTo(A[0] + (B[0] - A[0]) * k, A[1] + 16 + (B[1] - A[1] - 32) * k); c.stroke(); });
    nodes.forEach(([x, y, lab, at]) => { const k = ease(seg(t - 8, at, at + 0.8)); c.globalAlpha = k; const leaf = lab.startsWith('£'); c.fillStyle = leaf ? 'rgba(245,184,61,.2)' : 'rgba(126,224,214,.16)'; rr(c, x - 52, y - 16, 104, 32, 8); c.fill(); c.fillStyle = leaf ? '#f5b83d' : '#7ee0d6'; c.textAlign = 'center'; c.fillText(lab, x, y + 4); c.textAlign = 'left'; c.globalAlpha = 1; });
    c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`; c.fillText('gD  decision-tree: a regression tree on the sheet', 52, 360);
  }
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('a terminal spreadsheet that I extend with Python', 30, 412);
}

/* ---------- shared: a pipeline of steps that re-runs only what is outdated ---------- */
function dag(c, t, o) {
  t %= 14;
  win(c, 30, 40, 580, 340, o.title);
  const n = o.nodes.length, step = (580 - 80) / n, y = 168;
  // phase A (0-5): everything runs; phase B (7-12): one input changes, only the downstream steps re-run
  const runA = (i) => seg(t, 0.8 + i * 1.0, 1.6 + i * 1.0);
  const B0 = 7.4, runB = (i) => (i < o.hit ? 0 : seg(t, B0 + 0.4 + (i - o.hit) * 1.0, B0 + 1.2 + (i - o.hit) * 1.0));
  c.fillStyle = '#8d98a0'; c.font = `500 12px ${MONO}`;
  c.fillText(t < 6.6 ? '$ ' + typed(o.cmd, seg(t, 0.2, 0.9)) : '# ' + o.edit, 52, 76);
  o.nodes.forEach((nm, i) => {
    const x = 50 + i * step + 4, w = step - 26;
    const a = runA(i), b = runB(i), inB = t >= B0;
    let state = 'idle'; if (!inB) state = a >= 1 ? 'done' : a > 0 ? 'run' : 'idle'; else state = i < o.hit ? 'skip' : (b >= 1 ? 'done2' : b > 0 ? 'run' : 'stale');
    const col = { idle: '#4a5560', run: '#7ee0d6', done: '#3ccf6e', skip: '#6b757c', stale: '#f5b83d', done2: '#3ccf6e' }[state];
    c.fillStyle = 'rgba(255,255,255,.05)'; rr(c, x, y - 36, w, 72, 10); c.fill(); c.strokeStyle = col; c.lineWidth = state === 'run' ? 3 : 1.5; rr(c, x, y - 36, w, 72, 10); c.stroke(); c.lineWidth = 1;
    c.fillStyle = '#e6e8ea'; c.font = `600 11px ${MONO}`; c.textAlign = 'center'; c.fillText(nm, x + w / 2, y - 6);
    c.fillStyle = col; c.font = `500 10px ${MONO}`; c.fillText(state === 'skip' ? 'up to date' : state === 'stale' ? 'outdated' : state === 'run' ? 'running…' : state === 'idle' ? '' : 'done', x + w / 2, y + 16); c.textAlign = 'left';
    if (i < n - 1) { c.strokeStyle = 'rgba(255,255,255,.25)'; c.beginPath(); c.moveTo(x + w + 2, y); c.lineTo(x + w + 22, y); c.stroke(); c.fillStyle = 'rgba(255,255,255,.35)'; c.fillText('›', x + w + 14, y + 4); }
  });
  // log lines
  const lines = t < 6.6 ? o.nodes.map((nm, i) => [runA(i) > 0, (runA(i) >= 1 ? '✓ ' : '› ') + nm]) : o.nodes.map((nm, i) => [i >= o.hit ? runB(i) > 0 : t > B0 + 0.2, i < o.hit ? '· ' + nm + ' (skipped)' : (runB(i) >= 1 ? '✓ ' : '› ') + nm]);
  lines.forEach(([show, ln], i) => { if (!show) return; c.fillStyle = ln.startsWith('·') ? '#6b757c' : ln.startsWith('✓') ? '#3ccf6e' : '#7ee0d6'; c.font = `500 12px ${MONO}`; c.fillText(ln, 52 + (i % 2) * 280, 262 + Math.floor(i / 2) * 22); });
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText(o.caption, 30, 412);
}
function snakemake(c, t) { dag(c, t, { title: 'snakemake', cmd: 'snakemake --cores 4', edit: 'edit run_model.py, then snakemake again', nodes: ['preprocess', 'run_model', 'prediction', 'visualize'], hit: 1, caption: 'rules with inputs and outputs: only the outdated ones run again' }); }
function targets(c, t) { dag(c, t, { title: 'R · targets', cmd: 'tar_make()', edit: 'change clean(), then tar_make() again', nodes: ['raw', 'clean', 'model', 'report'], hit: 1, caption: 'a pipeline of R objects that rebuilds only what changed' }); }
function dvc(c, t) { dag(c, t, { title: 'dvc repro', cmd: 'dvc repro', edit: 'params.yaml: lr 0.1 → 0.2, then dvc repro', nodes: ['panel', 'split', 'fit', 'evaluate'], hit: 2, caption: 'stages with dependencies, params and outputs, tracked next to git' }); }

/* ---------- git: commits, a branch and a merge (T = 14) ---------- */
function git(c, t) {
  t %= 14;
  win(c, 30, 40, 580, 340, 'git');
  const main = [[90, 150], [180, 150], [270, 150], [440, 150], [530, 150]], feat = [[270, 250], [360, 250]];
  const cmds = [[0.4, '$ git commit -m "add loader"'], [3.6, '$ git switch -c feature'], [5.4, '$ git commit -m "try new model"'], [8.6, '$ git merge feature']];
  const cur = [...cmds].reverse().find(([at]) => t > at); if (cur) { c.fillStyle = '#7ee0d6'; c.font = `500 13px ${MONO}`; c.fillText(typed(cur[1], seg(t, cur[0], cur[0] + 0.9)), 52, 82); }
  const showMain = [0.9, 1.7, 2.5, 9.6, 10.2];
  const edge = (a, b, col, k) => { c.strokeStyle = col; c.lineWidth = 3; c.beginPath(); c.moveTo(a[0], a[1]); c.lineTo(a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k); c.stroke(); c.lineWidth = 1; };
  for (let i = 1; i < 3; i++) edge(main[i - 1], main[i], '#6aa7ff', ease(seg(t, showMain[i] - 0.4, showMain[i] + 0.2)));
  edge(main[2], main[3], '#6aa7ff', ease(seg(t, 9.0, 10)));
  edge(main[3], main[4], '#6aa7ff', ease(seg(t, 10.0, 10.6)));
  edge(main[2], [feat[0][0] + 0, feat[0][1]], '#f5b83d', ease(seg(t, 4.2, 4.9)));
  edge(feat[0], feat[1], '#f5b83d', ease(seg(t, 6.2, 6.9)));
  edge(feat[1], main[3], '#f5b83d', ease(seg(t, 9.0, 9.8)));
  const dot = (p, col, at, lab) => { const k = ease(seg(t, at, at + 0.4)); if (k <= 0) return; c.globalAlpha = k; c.fillStyle = col; c.beginPath(); c.arc(p[0], p[1], 11, 0, 7); c.fill(); c.fillStyle = '#14181c'; c.beginPath(); c.arc(p[0], p[1], 4, 0, 7); c.fill(); if (lab) { c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`; c.textAlign = 'center'; c.fillText(lab, p[0], p[1] + 30); c.textAlign = 'left'; } c.globalAlpha = 1; };
  main.forEach((p, i) => dot(p, '#6aa7ff', showMain[i] - 0.2, i === 4 ? 'merged' : i === 3 ? 'merge' : ''));
  dot(feat[0], '#f5b83d', 5.2, ''); dot(feat[1], '#f5b83d', 7.0, 'feature');
  if (t > 1) { c.fillStyle = '#3ccf6e'; c.font = `700 11px ${MONO}`; c.fillText('main', 74, 120); }
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('snapshots of the whole project, branches for ideas', 30, 412);
}

/* ---------- jj: an editable working copy, undo, and the DVC catch (T = 15) ---------- */
function jj(c, t) {
  t %= 15;
  win(c, 30, 40, 580, 340, 'jj');
  const rows = [['@', 'qpvuntsm', 'try a new idea', '#f5b83d'], ['○', 'kkmpptxz', 'add the loader', '#6aa7ff'], ['○', 'zzzzzzzz', 'root()', '#6b757c']];
  const ids = t < 4.5 ? ['qpvuntsm', 'a1f3c9e0'] : t < 7 ? ['qpvuntsm', '7be2d041'] : ['qpvuntsm', 'c90e5518'];
  const act = t < 2 ? '$ jj log' : t < 4.5 ? '# edit a file: the working copy is already a commit' : t < 7 ? '$ jj undo' : t < 9.5 ? '# one more edit...' : '$ dvc exp run';
  c.fillStyle = t < 9.5 ? '#7ee0d6' : '#f5b83d'; c.font = `500 13px ${MONO}`; c.fillText(act, 52, 82);
  rows.forEach(([g, id, msg, col], i) => { const y = 124 + i * 46; c.fillStyle = col; c.font = `700 18px ${MONO}`; c.fillText(g, 56, y); c.font = `600 13px ${MONO}`; c.fillStyle = col; c.fillText(id, 90, y - 2); c.fillStyle = '#e6e8ea'; c.fillText(msg, 200, y - 2); c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`; c.fillText(i === 0 ? 'commit ' + ids[1] : i === 1 ? 'commit 3d90ab12' : '', 90, y + 14); });
  c.fillStyle = 'rgba(255,255,255,.06)'; c.fillRect(46, 262, 548, 1);
  c.fillStyle = '#8d98a0'; c.font = `500 12px ${MONO}`; c.fillText('change id stays, commit id follows every edit', 52, 286);
  if (t > 9.5) { const k = ease(seg(t, 10, 10.8)); c.globalAlpha = k; c.fillStyle = 'rgba(229,72,77,.14)'; rr(c, 46, 296, 548, 66, 10); c.fill(); c.strokeStyle = '#e5484d'; c.stroke(); c.fillStyle = '#ff7b80'; c.font = `700 13px ${MONO}`; c.fillText('✗ dvc: needs git state that jj does not give it', 62, 322); c.fillStyle = '#e6e8ea'; c.font = `500 12px ${MONO}`; c.fillText('so I stay with git', 62, 346); c.globalAlpha = 1; }
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('nice ideas, but not compatible with DVC', 30, 412);
}

/* ---------- dvcat: the pipeline in a terminal UI (T = 14) ---------- */
function dvcat(c, t) {
  t %= 14;
  win(c, 30, 40, 580, 340, 'dvcat');
  const stages = ['panel', 'split', 'fit', 'evaluate'], run = t > 5.6, fin = (i) => i < 2 || (i === 2 && t > 10.4);
  c.fillStyle = '#1b2227'; c.fillRect(30, 70, 200, 310);
  stages.forEach((nm, i) => {
    const y = 104 + i * 40, stale = i >= 2 && !fin(i), cur = i === 2;
    if (cur) { c.fillStyle = 'rgba(203,166,247,.18)'; c.fillRect(30, y - 20, 200, 34); }
    c.fillStyle = stale ? '#f9e2af' : '#a6e3a1'; c.font = `700 14px ${MONO}`; c.fillText(stale ? '●' : '✓', 46, y); c.fillStyle = '#cdd6f4'; c.font = `600 13px ${MONO}`; c.fillText(nm, 72, y);
    c.fillStyle = '#6c7086'; c.font = `500 10px ${MONO}`; c.fillText(stale ? 'stale' : 'fresh', 160, y);
  });
  c.fillStyle = '#cba6f7'; c.font = `700 12px ${MONO}`; c.fillText(t > 10.4 ? 'fit · fresh' : run ? 'fit · running' : 'fit · stale', 250, 100);
  c.fillStyle = '#9399b2'; c.font = `500 12px ${MONO}`;
  if (!run) { ['why stale:', '  params changed: train.lr', '  0.1 → 0.2', '', 'r  run this stage', 'R  run with upstream'].forEach((ln, i) => { c.fillStyle = i === 0 ? '#f9e2af' : (ln.startsWith('r') || ln.startsWith('R') ? '#89b4fa' : '#cdd6f4'); c.fillText(ln, 250, 132 + i * 24); }); }
  else { const logs = ['$ dvc repro --single-item fit', 'Running stage \'fit\':', 'epoch 1  loss 0.412', 'epoch 2  loss 0.297', 'epoch 3  loss 0.251', 'Updating lock file', '✓ fit done']; logs.forEach((ln, i) => { if (t > 5.8 + i * 0.7) { c.fillStyle = i === 6 ? '#a6e3a1' : (i === 0 ? '#89b4fa' : '#cdd6f4'); c.fillText(ln, 250, 132 + i * 24); } }); }
  c.fillStyle = '#6c7086'; c.font = `500 11px ${MONO}`; c.fillText('j/k move · r run · e experiments · g graph · q quit', 46, 366);
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('see what is stale, and why, then run it', 30, 412);
}

/* ---------- table hashes: revs of tables and views decide what reruns (T = 14) ---------- */
function reruns(c, t) {
  t %= 14;
  win(c, 30, 40, 580, 340, 'dvc repro · table hashes');
  const B0 = 7.4, inB = t >= B0;
  const nodes = {
    build: { x: 48, y: 170, w: 120 }, daily: { x: 262, y: 100, w: 100 }, summary: { x: 456, y: 100, w: 120 }, export: { x: 262, y: 240, w: 100 },
  };
  // phase A: everything runs. phase B: channel is relabelled, only build and export rerun
  const at = { build: [0.8, 1.8, 7.8, 8.8], daily: [2.4, 3.4], export: [2.4, 3.4, 9.6, 10.6], summary: [4.2, 5.2] };
  const stateOf = (k) => {
    const [a0, a1, b0, b1] = at[k];
    if (!inB) return t >= a1 ? 'done' : t >= a0 ? 'run' : 'idle';
    if (b0 === undefined) return 'skip';
    return t >= b1 ? 'done' : t >= b0 ? 'run' : 'stale';
  };
  c.fillStyle = '#8d98a0'; c.font = `500 12px ${MONO}`;
  c.fillText(!inB ? '$ ' + typed('dvc repro', seg(t, 0.2, 0.8)) : '# raw data: web → online (channel only), dvc repro', 52, 76);
  // edges with the rev that travels on them
  const salesRev = t >= 8.8 ? 'c7d2e91a' : 'a41f03bb', viewRev = '90938a2e';
  const edge = (a, b, label, col) => {
    c.strokeStyle = 'rgba(255,255,255,.28)'; c.lineWidth = 1.5; c.beginPath(); c.moveTo(a.x + a.w, a.y + 28); c.lineTo(b.x, b.y + 28); c.stroke(); c.lineWidth = 1;
    const mx = (a.x + a.w + b.x) / 2, my = (a.y + b.y) / 2 + 28;
    c.textAlign = 'center'; c.fillStyle = '#8d98a0'; c.font = `500 9px ${MONO}`; c.fillText(label[0], mx, my - 12); c.fillStyle = col; c.font = `700 10px ${MONO}`; c.fillText(label[1], mx, my + 1); c.textAlign = 'left';
  };
  edge(nodes.build, nodes.daily, ['v_sales_by_day', viewRev], '#7ee0d6');
  edge(nodes.build, nodes.export, ['sales', salesRev], t >= 8.8 ? '#f5b83d' : '#7ee0d6');
  edge(nodes.daily, nodes.summary, ['daily.csv', ''], '#7ee0d6');
  // stage boxes
  Object.entries(nodes).forEach(([k, n]) => {
    const st = stateOf(k);
    const col = { idle: '#4a5560', run: '#7ee0d6', done: '#3ccf6e', skip: '#6b757c', stale: '#f5b83d' }[st];
    c.fillStyle = 'rgba(255,255,255,.05)'; rr(c, n.x, n.y, n.w, 56, 10); c.fill();
    c.strokeStyle = col; c.lineWidth = st === 'run' ? 3 : 1.5; rr(c, n.x, n.y, n.w, 56, 10); c.stroke(); c.lineWidth = 1;
    c.textAlign = 'center'; c.fillStyle = '#e6e8ea'; c.font = `600 12px ${MONO}`; c.fillText(k, n.x + n.w / 2, n.y + 24);
    c.fillStyle = col; c.font = `500 10px ${MONO}`;
    c.fillText(st === 'skip' ? 'rev unchanged: skipped' : st === 'stale' ? 'rev changed' : st === 'run' ? 'running…' : st === 'done' ? 'done' : '', n.x + n.w / 2, n.y + 43); c.textAlign = 'left';
  });
  // the database that build modifies, shown as a small cylinder
  c.fillStyle = '#232a30'; rr(c, 48, 262, 120, 54, 10); c.fill();
  c.fillStyle = '#ffc400'; c.font = `700 11px ${MONO}`; c.fillText('wh.duckdb', 62, 284);
  c.fillStyle = '#8d98a0'; c.font = `500 10px ${MONO}`; c.fillText('one file, edited in place', 62, 302);
  c.fillStyle = '#8d98a0'; c.font = `500 11px ${MONO}`;
  c.fillText(!inB ? 'revs written: sales, v_sales_by_day' : 'clean: sales rev stale, view rev still matches', 52, 352);
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('a rev per table and view: only what really changed reruns', 30, 412);
}

/* ---------- Google Cloud: a daily job (T = 14) ---------- */
function gcloud(c, t) {
  t %= 14;
  const box = (x, y, w, h, title, sub, col, on) => { c.fillStyle = '#fff'; rr(c, x, y, w, h, 12); c.fill(); c.strokeStyle = on ? col : LINE; c.lineWidth = on ? 2.5 : 1; c.stroke(); c.lineWidth = 1; c.fillStyle = INK; c.font = `700 13px ${SANS}`; c.textAlign = 'center'; c.fillText(title, x + w / 2, y + 28); c.fillStyle = MUTED; c.font = `500 11px ${MONO}`; c.fillText(sub, x + w / 2, y + 48); c.textAlign = 'left'; };
  const ph = t < 4 ? 0 : t < 7 ? 1 : 2; // 0 release, 1 scheduled run, 2 results
  box(30, 60, 150, 70, 'just release', 'build · update', AMBER, ph === 0);
  box(245, 60, 150, 70, 'Artifact Registry', 'image v12', TEAL, ph === 0 && t > 1.6);
  box(460, 60, 150, 70, 'Cloud Run job', 'the pipeline', '#4285f4', ph >= 1);
  box(245, 230, 150, 70, 'Cloud Scheduler', '0 3 * * *', '#d98a00', ph === 1);
  box(460, 230, 150, 70, 'Prefect', 'run history', '#6d4fc2', ph === 2);
  box(30, 230, 150, 70, 'the shop', 'updated', '#3ccf6e', ph === 2 && t > 9);
  const arrow = (x1, y1, x2, y2, k, col) => { c.strokeStyle = col; c.lineWidth = 3; c.setLineDash([6, 6]); c.beginPath(); c.moveTo(x1, y1); c.lineTo(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k); c.stroke(); c.setLineDash([]); c.lineWidth = 1; c.fillStyle = col; c.beginPath(); c.arc(x1 + (x2 - x1) * k, y1 + (y2 - y1) * k, 5, 0, 7); c.fill(); };
  arrow(180, 95, 245, 95, ease(seg(t, 0.8, 1.8)), AMBER); arrow(395, 95, 460, 95, ease(seg(t, 2.2, 3.2)), TEAL);
  arrow(395, 265, 500, 130, ease(seg(t, 4.4, 5.8)), '#d98a00');
  arrow(535, 130, 535, 230, ease(seg(t, 7.2, 8.2)), '#6d4fc2'); arrow(460, 265, 180, 265, ease(seg(t, 9, 10.4)), '#3ccf6e');
  // clock
  c.strokeStyle = '#d98a00'; c.lineWidth = 2; c.beginPath(); c.arc(300, 340, 22, 0, 7); c.stroke(); c.lineWidth = 1;
  const a = -Math.PI / 2 + (t / 14) * Math.PI * 2 * 3; c.beginPath(); c.moveTo(300, 340); c.lineTo(300 + Math.cos(a) * 16, 340 + Math.sin(a) * 16); c.stroke();
  c.fillStyle = '#d98a00'; c.font = `700 13px ${MONO}`; c.fillText(ph === 1 || ph === 2 ? '03:00' : '', 334, 345);
  c.fillStyle = MUTED; c.font = `500 12px ${SANS}`; c.fillText('release once, then it runs every night without my laptop', 30, 412);
}

const SCENES = { remote, neovim, just, tv, tuis, claude, openspec, herdr, pomodoro, uv, marimo, quarto, duckdb, visidata, snakemake, targets, dvc, git, jj, dvcat, reruns, gcloud };
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
