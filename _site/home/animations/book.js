// Research animation (Compass project): a scanned page of an old financial yearbook is read
// row by row. Rules parse most rows, a vision-language model reads the hard ones, the sum is
// checked against the printed total, a mismatch triggers a retry, and the table ends up as JSON.
// Drawn in a fixed 640x440 space and scaled to fit. Light-theme palette.
export function mount(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  const W = 640, H = 440, PERIOD = 13;
  const TEAL = '15, 143, 134', AMBER = '217, 138, 0';
  const ROWS = [
    { k: 'Pénztár', v: '412,300', how: 'rules' },
    { k: 'Váltók', v: '380,120', how: 'rules' },
    { k: 'Adósok', v: '395,280', fix: '445,900', how: 'VLM' },
    { k: 'Értékpapírok', v: '520,845', how: 'rules' },
    { k: 'Ingatlan', v: '285,000', how: 'rules' },
  ];
  let w = 0, h = 0, dpr = 1, raf = 0, running = false, start = performance.now();
  const frozen = canvas.dataset.time !== undefined ? +canvas.dataset.time : null;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const rowY = (i) => 128 + i * 26;
  const scanAt = (i) => 1.4 + i * 0.95;           // time the scanner reaches row i
  const SERIF = 'Georgia, "Times New Roman", serif', MONO = '"JetBrains Mono", ui-monospace, monospace';

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    draw(frozen ?? ((performance.now() - start) / 1000) % PERIOD);
  }
  const rr = (x, y, ww, hh, r) => { ctx.beginPath(); ctx.roundRect(x, y, ww, hh, r); };

  function draw(s) {
    const sc = Math.min(w / W, h / H);
    ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * (w - W * sc) / 2, dpr * (h - H * sc) / 2);
    ctx.clearRect(0, 0, W, H);
    const fade = clamp(s / 0.8) * (1 - clamp((s - 11.8) / 1.2));
    ctx.globalAlpha = fade;

    // --- the old printed page ---
    ctx.save(); ctx.shadowColor = 'rgba(20,24,28,.22)'; ctx.shadowBlur = 24; ctx.shadowOffsetY = 10;
    ctx.fillStyle = '#f6efdc'; rr(12, 14, 320, 412, 6); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(120,90,40,.28)'; rr(12, 14, 320, 412, 6); ctx.stroke();
    ctx.fillStyle = '#3b3328'; ctx.textBaseline = 'alphabetic';
    ctx.font = `600 9px ${SERIF}`; ctx.textAlign = 'center'; ctx.fillText('MAGYAR COMPASS · 1912', 172, 38);
    ctx.font = `700 13px ${SERIF}`; ctx.fillText('Magyar Általános Hitelbank', 172, 68);
    ctx.font = `italic 9px ${SERIF}`; ctx.fillStyle = '#6d6350'; ctx.fillText('Mérleg december 31-én', 172, 82);
    ctx.textAlign = 'left'; ctx.fillStyle = '#3b3328'; ctx.font = `700 9px ${SERIF}`; ctx.fillText('AKTÍVÁK', 40, 112);
    ctx.fillStyle = 'rgba(59,51,40,.28)';
    for (let k = 0; k < 6; k++) { ctx.fillRect(34, 292 + k * 18, 270 - (k % 3) * 34, 4); }   // body text lines
    ROWS.forEach((r, i) => {
      const y = rowY(i), v = i === 2 && s > 8.4 ? r.fix : r.v;
      const t = ease(clamp((s - scanAt(i)) / 0.5));
      if (t > 0) { // detection highlight
        const col = r.how === 'VLM' ? AMBER : TEAL;
        ctx.fillStyle = `rgba(${col},${0.16 * t})`; rr(30, y - 15, 280, 21, 4); ctx.fill();
        ctx.strokeStyle = `rgba(${col},${0.5 * t})`; rr(30, y - 15, 280, 21, 4); ctx.stroke();
      }
      ctx.fillStyle = '#3b3328'; ctx.font = `11px ${SERIF}`; ctx.fillText(r.k, 40, y);
      const lw = ctx.measureText(r.k).width;
      ctx.fillStyle = '#a89f8a'; for (let x = 40 + lw + 6; x < 238; x += 5) ctx.fillRect(x, y - 1, 1.4, 1.4);   // dotted leaders
      ctx.textAlign = 'right'; ctx.fillStyle = '#3b3328'; ctx.fillText(v, 298, y); ctx.textAlign = 'left';
    });
    const totalOK = s > 9.2;
    ctx.fillStyle = 'rgba(59,51,40,.55)'; ctx.fillRect(40, 264, 258, 1);
    ctx.fillStyle = '#3b3328'; ctx.font = `700 11px ${SERIF}`; ctx.fillText('Összesen', 40, 284);
    ctx.textAlign = 'right'; ctx.fillText('2.044,165', 298, 284); ctx.textAlign = 'left';
    if (totalOK) { ctx.strokeStyle = `rgba(${TEAL},${ease(clamp((s - 9.2) / 0.5))})`; ctx.lineWidth = 2.4; ctx.beginPath(); ctx.moveTo(304, 279); ctx.lineTo(309, 285); ctx.lineTo(319, 272); ctx.stroke(); ctx.lineWidth = 1; }

    // --- scanner ---
    const sy = 104 + clamp((s - 1.0) / 4.9) * 170;
    if (s > 1.0 && s < 6.2) {
      const g = ctx.createLinearGradient(0, sy - 16, 0, sy + 2); g.addColorStop(0, `rgba(${TEAL},0)`); g.addColorStop(1, `rgba(${TEAL},.30)`);
      ctx.fillStyle = g; ctx.fillRect(26, sy - 16, 290, 18); ctx.fillStyle = `rgba(${TEAL},.8)`; ctx.fillRect(26, sy + 1, 290, 1.5);
    }

    // --- JSON card ---
    ctx.save(); ctx.shadowColor = 'rgba(20,24,28,.12)'; ctx.shadowBlur = 20; ctx.shadowOffsetY = 8;
    ctx.fillStyle = '#ffffff'; rr(352, 60, 276, 300, 14); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(20,24,28,.10)'; rr(352, 60, 276, 300, 14); ctx.stroke();
    ctx.fillStyle = '#5d676f'; ctx.font = `500 10px ${MONO}`; ctx.fillText('balance_sheet.json', 372, 88);
    ctx.fillStyle = 'rgba(20,24,28,.08)'; ctx.fillRect(352, 98, 276, 1);
    ROWS.forEach((r, i) => {
      const t = ease(clamp((s - scanAt(i) - 0.35) / 0.45)); if (t <= 0) return;
      const y = 124 + i * 30, fixed = i === 2 && s > 8.4, v = fixed ? r.fix : r.v;
      const col = r.how === 'VLM' ? AMBER : TEAL;
      ctx.globalAlpha = fade * t; const dx = (1 - t) * 14;
      ctx.fillStyle = '#14181c'; ctx.font = `500 11px ${MONO}`; ctx.fillText(`"${r.k}"`, 372 + dx, y);
      ctx.fillStyle = `rgb(${fixed ? TEAL : (i === 2 && s > 6.0 ? AMBER : '20, 24, 28')})`; ctx.textAlign = 'right'; ctx.fillText(v, 548 + dx, y); ctx.textAlign = 'left';
      const label = fixed ? 'VLM retry' : r.how, cw = ctx.measureText(label).width + 14;
      ctx.fillStyle = `rgba(${col},.14)`; rr(560 + dx, y - 12, 56, 17, 8.5); ctx.fill();
      ctx.fillStyle = `rgb(${col})`; ctx.font = `600 9px ${MONO}`; ctx.textAlign = 'center'; ctx.fillText(label === 'VLM retry' ? 'retry' : label, 588 + dx, y); ctx.textAlign = 'left';
    });
    ctx.globalAlpha = fade;
    // validation line
    if (s > 6.2) {
      const t = ease(clamp((s - 6.2) / 0.5)), ok = s > 9.0, y = 124 + 5 * 30 + 6;
      ctx.globalAlpha = fade * t; ctx.fillStyle = `rgba(${ok ? TEAL : AMBER},.10)`; rr(366, y - 14, 248, 44, 8); ctx.fill();
      ctx.font = `500 10px ${MONO}`; ctx.fillStyle = `rgb(${ok ? TEAL : AMBER})`;
      ctx.fillText(ok ? '✓ sum matches the sheet' : '! sum does not match', 378, y + 2);
      ctx.fillStyle = '#5d676f'; ctx.fillText(ok ? 'Σ 2.044,165 = 2.044,165' : 'Σ 1.993,545 ≠ 2.044,165', 378, y + 20);
      if (s > 7.6 && s < 8.9) { ctx.fillStyle = `rgb(${AMBER})`; ctx.fillText('→ feedback to model, retry', 378, y + 38); }
    }
    ctx.globalAlpha = 1;
  }

  function loop() { draw(((performance.now() - start) / 1000) % PERIOD); raf = requestAnimationFrame(loop); }
  const go = () => { if (!running && !reduced && frozen === null) { running = true; raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? go() : stop())); io.observe(canvas);
  if (reduced && frozen === null) canvas.setAttribute('data-time', '10.5');
  resize();
  return { unmount() { stop(); ro.disconnect(); io.disconnect(); } };
}
