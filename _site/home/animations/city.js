// Research animation: an isometric block of buildings. Scattered, hand-typed "address" pins
// drift above the city, then snap onto the buildings they belong to (address reconstruction +
// spatial matching). Loops. Light-theme palette; pauses off-screen; static frame if reduced motion.
export function mount(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  const N = 7, PERIOD = 10;
  const TEAL = '15, 143, 134', AMBER = '217, 138, 0';
  const LABELS = ['Batthány Lajos u.', 'Andrasy ut', 'Váci ut.', 'Bajcsy-Zsilinsky u.', 'Üllöi út', 'Rákóczy u.']; // typo-style variants of real Budapest streets
  let w = 0, h = 0, dpr = 1, raf = 0, running = false, start = performance.now();
  const frozen = canvas.dataset.time !== undefined ? +canvas.dataset.time : null;

  function rng(seed) { return () => (seed = (seed * 16807) % 2147483647) / 2147483647; }
  const rand = rng(11);
  const buildings = [];
  for (let gy = 0; gy < N; gy++) for (let gx = 0; gx < N; gx++) {
    if (rand() < 0.12) continue; // gaps = small squares
    buildings.push({ gx, gy, z: 0.5 + rand() * 2.2 });
  }
  buildings.sort((a, b) => a.gx + a.gy - (b.gx + b.gy));
  const pickRand = rng(5);
  const targets = [...buildings].sort(() => pickRand() - 0.5).slice(0, 13);
  const pins = targets.map((b, i) => ({ b, i, sx: i < LABELS.length ? 0.14 + (i / (LABELS.length - 1)) * 0.72 : 0.08 + pickRand() * 0.84, sy: i < LABELS.length ? (i % 2 ? 0.27 : 0.14) : 0.15 + pickRand() * 0.3, ph: pickRand() * 6.28, label: i < LABELS.length ? LABELS[i] : null }));

  let u = 40, cx = 0, cy = 0;
  const P = (gx, gy, z = 0) => [cx + (gx - gy) * u, cy + (gx + gy) * u * 0.5 - z * u * 0.85];
  const poly = (pts, fill, stroke) => {
    ctx.beginPath(); pts.forEach(([x, y], k) => (k ? ctx.lineTo(x, y) : ctx.moveTo(x, y))); ctx.closePath();
    if (fill) { ctx.fillStyle = fill; ctx.fill(); }
    if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 1; ctx.stroke(); }
  };
  const mix = (c, a) => `rgb(${c.map((v, i) => Math.round(v + ([15, 143, 134][i] - v) * a)).join(',')})`;
  const ease = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const clamp = (v) => Math.min(1, Math.max(0, v));

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    u = Math.min(w / (N * 2 + 1), h / (N + 3.2));
    cx = w / 2; cy = h * 0.5 - N * u * 0.5 + u * 0.9;
    draw((frozen ?? (performance.now() - start) / 1000) % PERIOD);
  }

  function draw(s) {
    ctx.clearRect(0, 0, w, h);
    // ground diamond + faint grid
    poly([P(-0.3, -0.3), P(N + 0.3, -0.3), P(N + 0.3, N + 0.3), P(-0.3, N + 0.3)], 'rgba(15,143,134,.05)', 'rgba(20,24,28,.07)');
    ctx.strokeStyle = 'rgba(20,24,28,.05)';
    for (let k = 1; k < N; k++) { ctx.beginPath(); ctx.moveTo(...P(k, -0.3)); ctx.lineTo(...P(k, N + 0.3)); ctx.moveTo(...P(-0.3, k)); ctx.lineTo(...P(N + 0.3, k)); ctx.stroke(); }
    const fadeOut = 1 - clamp((s - 8.6) / 1.2);                       // reset at the end of each loop
    const hit = (b) => { const i = targets.indexOf(b); return i < 0 ? 0 : ease(clamp((s - (3.2 + i * 0.16)) / 1.6)); };
    buildings.forEach((b) => {
      const m = hit(b) * fadeOut, x0 = b.gx + 0.12, x1 = b.gx + 0.88, y0 = b.gy + 0.12, y1 = b.gy + 0.88;
      poly([P(x0, y1), P(x1, y1), P(x1, y1, b.z), P(x0, y1, b.z)], mix([232, 236, 235], 0.28 * m), 'rgba(20,24,28,.10)');
      poly([P(x1, y0), P(x1, y1), P(x1, y1, b.z), P(x1, y0, b.z)], mix([214, 222, 220], 0.4 * m), 'rgba(20,24,28,.10)');
      poly([P(x0, y0, b.z), P(x1, y0, b.z), P(x1, y1, b.z), P(x0, y1, b.z)], mix([255, 255, 255], 0.42 * m), m ? `rgba(${TEAL},${0.55 * m})` : 'rgba(20,24,28,.14)');
    });
    pins.forEach((p) => {
      const [tx, ty] = P(p.b.gx + 0.5, p.b.gy + 0.5, p.b.z);
      const wob = Math.sin(s * 1.6 + p.ph);
      const sx = p.sx * w + Math.cos(s * 1.1 + p.ph) * 8, sy = p.sy * h + wob * 8;
      const k = ease(clamp((s - (2.6 + p.i * 0.16)) / 1.7));
      const x = sx + (tx - sx) * k, y = sy + (ty - sy) * k - Math.sin(k * Math.PI) * u * 0.9;
      const a = fadeOut * clamp(s / 0.8);
      if (k > 0 && k < 1) { ctx.strokeStyle = `rgba(${TEAL},${0.35 * a})`; ctx.setLineDash([3, 5]); ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(x, y); ctx.stroke(); ctx.setLineDash([]); }
      const col = k > 0.98 ? TEAL : AMBER;
      if (p.label && k < 0.6) {
        ctx.font = '600 11px Inter, system-ui, sans-serif';
        const tw = ctx.measureText(p.label).width, la = a * (1 - k / 0.6);
        ctx.fillStyle = `rgba(255,255,255,${0.92 * la})`; ctx.strokeStyle = `rgba(${AMBER},${0.55 * la})`;
        ctx.beginPath(); ctx.roundRect(x - tw / 2 - 7, y - 30, tw + 14, 20, 10); ctx.fill(); ctx.stroke();
        ctx.fillStyle = `rgba(20,24,28,${la})`; ctx.fillText(p.label, x - tw / 2, y - 16);
      }
      ctx.fillStyle = `rgba(${col},${a})`; ctx.beginPath(); ctx.arc(x, y, k > 0.98 ? 5 : 4, 0, 6.28); ctx.fill();
      if (k > 0.98) { const r = 6 + ((s * 1.5 + p.i) % 1) * 12; ctx.strokeStyle = `rgba(${TEAL},${0.4 * a * (1 - (r - 6) / 12)})`; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.28); ctx.stroke(); }
    });
  }

  function loop() { draw(((performance.now() - start) / 1000) % PERIOD); raf = requestAnimationFrame(loop); }
  const go = () => { if (!running && !reduced && frozen === null) { running = true; raf = requestAnimationFrame(loop); } };
  const stop = () => { running = false; cancelAnimationFrame(raf); };
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? go() : stop())); io.observe(canvas);
  if (reduced) frozen === null && canvas.setAttribute('data-time', '7.5');
  resize();
  return { unmount() { stop(); ro.disconnect(); io.disconnect(); } };
}
