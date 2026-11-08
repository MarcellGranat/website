// Research animation (Russo-Ukrainian paper): the gap between each asset's price and its
// post-outbreak ("liquidation") value. Months of noise, then from about 50 days before the
// outbreak the gaps close in - the market starts pricing the war. Drawn in a fixed 640x440
// space and scaled to fit. Light-theme palette.
export function mount(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  const W = 640, H = 440, PERIOD = 13.5;
  const TEAL = '15, 143, 134', AMBER = '217, 138, 0', INK = '20, 24, 28';
  const L = 64, R = 616, T = 72, B = 372, ZERO = 222;      // plot box and the zero line
  const DAYS = 152, START = 97, OUTBREAK = 146;            // Oct 1 -> Mar 1; Jan 6; Feb 24
  const X = (d) => L + (d / DAYS) * (R - L);
  let w = 0, h = 0, dpr = 1, raf = 0, running = false, begin = performance.now();
  const frozen = canvas.dataset.time !== undefined ? +canvas.dataset.time : null;
  const clamp = (v) => Math.min(1, Math.max(0, v));
  const ease = (t) => 1 - Math.pow(1 - t, 3);

  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  const rand = rng(23);
  const gauss = () => (rand() + rand() + rand() - 1.5) * 2;
  const paths = Array.from({ length: 10 }, (_, i) => {
    const level = (i % 2 ? 1 : -1) * (28 + rand() * 78), ys = [];
    let noise = 0;
    for (let d = 0; d <= DAYS; d++) {
      noise = noise * 0.86 + gauss() * 5.2;
      // before START the gap just wanders; after it the pull to zero grows as the outbreak nears
      const pull = d < START ? 1 : Math.max(0, 1 - Math.pow((d - START) / (OUTBREAK - START), 1.7));
      ys.push(d > OUTBREAK ? gauss() * 1.6 : (level + noise) * pull + (d >= START ? 0 : 0));
    }
    return ys;
  });

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    draw(frozen ?? ((performance.now() - begin) / 1000) % PERIOD);
  }
  const rr = (x, y, ww, hh, r) => { ctx.beginPath(); ctx.roundRect(x, y, ww, hh, r); };
  const MONO = '"JetBrains Mono", ui-monospace, monospace', SANS = 'Inter, system-ui, sans-serif';

  function draw(s) {
    const sc = Math.min(w / W, h / H);
    ctx.setTransform(dpr * sc, 0, 0, dpr * sc, dpr * (w - W * sc) / 2, dpr * (h - H * sc) / 2);
    ctx.clearRect(0, 0, W, H);
    const fade = clamp(s / 0.7) * (1 - clamp((s - 12.3) / 1.2));
    ctx.globalAlpha = fade;
    const tc = clamp((s - 0.8) / 7.6) * DAYS;               // the "now" cursor, in days

    // panel
    ctx.save(); 
    ctx.fillStyle = '#ffffff'; rr(14, 16, 612, 408, 16); ctx.fill(); ctx.restore();
    ctx.strokeStyle = 'rgba(20,24,28,.09)'; rr(14, 16, 612, 408, 16); ctx.stroke();
    ctx.fillStyle = '#5d676f'; ctx.font = `500 10px ${MONO}`; ctx.textAlign = 'left';
    ctx.fillText('price gap to post-outbreak value', 36, 46);

    // amber "pricing" window, appears once the cursor passes the start
    if (tc >= START) {
      const e = Math.min(tc, OUTBREAK);
      ctx.fillStyle = `rgba(${AMBER},.07)`; ctx.fillRect(X(START), T, X(e) - X(START), B - T);
    }
    // grid, month ticks
    ctx.strokeStyle = 'rgba(20,24,28,.06)'; ctx.lineWidth = 1;
    [['Oct', 0], ['Nov', 31], ['Dec', 61], ['Jan', 92], ['Feb', 123], ['Mar', 151]].forEach(([m, d]) => {
      ctx.beginPath(); ctx.moveTo(X(d), T); ctx.lineTo(X(d), B); ctx.stroke();
      ctx.fillStyle = '#5d676f'; ctx.font = `500 10px ${MONO}`; ctx.textAlign = 'left'; ctx.fillText(m, X(d) + 4, B + 18);
    });
    // zero line = the value after the outbreak
    ctx.strokeStyle = `rgba(${INK},.55)`; ctx.setLineDash([5, 5]); ctx.beginPath(); ctx.moveTo(L, ZERO); ctx.lineTo(R, ZERO); ctx.stroke(); ctx.setLineDash([]);

    // price-gap paths
    paths.forEach((ys, i) => {
      const last = Math.floor(tc);
      ctx.lineWidth = 1.8; ctx.lineJoin = 'round';
      for (let d = 1; d <= last; d++) {
        const late = d >= START;
        ctx.strokeStyle = `rgba(${TEAL},${late ? 0.75 : 0.32})`;
        ctx.beginPath(); ctx.moveTo(X(d - 1), ZERO - ys[d - 1]); ctx.lineTo(X(d), ZERO - ys[d]); ctx.stroke();
      }
      if (tc > 0 && tc < DAYS) { ctx.fillStyle = `rgb(${AMBER})`; ctx.beginPath(); ctx.arc(X(last), ZERO - ys[last], 2.8, 0, 6.28); ctx.fill(); }
    });
    ctx.lineWidth = 1;
    ctx.fillStyle = 'rgba(255,255,255,.92)'; rr(L + 8, ZERO - 11, 104, 20, 10); ctx.fill();
    ctx.fillStyle = `rgba(${INK},.75)`; ctx.font = `500 10px ${MONO}`; ctx.textAlign = 'left'; ctx.fillText('liquidation value', L + 17, ZERO + 3);

    // start of pricing (Jan 6)
    if (tc >= START) {
      const a = ease(clamp((tc - START) / 6));
      ctx.globalAlpha = fade * a; ctx.strokeStyle = `rgb(${AMBER})`; ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(X(START), T - 6); ctx.lineTo(X(START), B); ctx.stroke(); ctx.setLineDash([]);
      ctx.fillStyle = `rgba(${AMBER},.14)`; rr(X(START) - 72, T - 34, 144, 22, 11); ctx.fill();
      ctx.fillStyle = `rgb(${AMBER})`; ctx.font = `600 10.5px ${SANS}`; ctx.textAlign = 'center'; ctx.fillText('Jan 6 · pricing starts', X(START), T - 19);
    }
    // outbreak (Feb 24)
    if (tc >= OUTBREAK) {
      const a = ease(clamp((tc - OUTBREAK) / 4));
      ctx.globalAlpha = fade * a; ctx.strokeStyle = `rgba(${INK},.85)`; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(X(OUTBREAK), T - 6); ctx.lineTo(X(OUTBREAK), B); ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = `rgb(${INK})`; rr(X(OUTBREAK) - 100, T - 34, 98, 22, 11); ctx.fill();
      ctx.fillStyle = '#fff'; ctx.font = `600 10.5px ${SANS}`; ctx.textAlign = 'center'; ctx.fillText('Feb 24 · outbreak', X(OUTBREAK) - 51, T - 19);
    }
    // the 50-day span
    if (s > 8.6) {
      const a = ease(clamp((s - 8.6) / 0.7)), y = B - 26;
      ctx.globalAlpha = fade * a; ctx.strokeStyle = `rgb(${AMBER})`; ctx.fillStyle = `rgb(${AMBER})`; ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(X(START), y); ctx.lineTo(X(OUTBREAK), y);
      ctx.moveTo(X(START) + 6, y - 4); ctx.lineTo(X(START), y); ctx.lineTo(X(START) + 6, y + 4);
      ctx.moveTo(X(OUTBREAK) - 6, y - 4); ctx.lineTo(X(OUTBREAK), y); ctx.lineTo(X(OUTBREAK) - 6, y + 4); ctx.stroke(); ctx.lineWidth = 1;
      ctx.font = `700 12px ${SANS}`; ctx.textAlign = 'center'; ctx.fillText('50 days', (X(START) + X(OUTBREAK)) / 2, y - 8);
    }
    ctx.globalAlpha = 1;
  }

  function loop() { draw(((performance.now() - begin) / 1000) % PERIOD); raf = requestAnimationFrame(loop); }
  const go = () => { if (!running && !reduced && frozen === null) { running = true; raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? go() : stop())); io.observe(canvas);
  if (reduced && frozen === null) canvas.setAttribute('data-time', '10.5');
  resize();
  return { unmount() { stop(); ro.disconnect(); io.disconnect(); } };
}
