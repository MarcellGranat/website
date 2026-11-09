// A Star Wars fleet hovers over the dunes, nose tilted up towards the top right corner: the Millennium
// Falcon on top, with X-wings, Y-wings, A-wings and Jedi starfighters stepping down behind it, each
// carrying a tool tag. Everything is a pure function of time t (seconds), so a frame can be frozen
// with data-time.
const TOOLS = [
  ['Python', '#0f8f86'], ['DuckDB', '#d98a00'], ['Rust', '#b4492b'], ['R', '#2f6fb0'],
  ['uv', '#6d4fc2'], ['Quarto', '#2a8a5b'], ['git', '#14181c'], ['Claude Code', '#c46a2d'],
  ['pytest', '#0f8f86'], ['Parquet', '#2f6fb0'],
];
// Formation: a diagonal climbing to the top right. dx behind the Falcon, y = hover height (canvas units).
const SHIPS = [
  { type: 'falcon', dx: 0, y: 172 },
  { type: 'xwing', dx: -115, y: 205 }, { type: 'xwing', dx: -115, y: 272 },
  { type: 'jedi', dx: -230, y: 240 }, { type: 'ywing', dx: -230, y: 310 },
  { type: 'awing', dx: -345, y: 276 }, { type: 'awing', dx: -345, y: 344 },
  { type: 'jedi', dx: -460, y: 298 }, { type: 'ywing', dx: -460, y: 358 }, { type: 'xwing', dx: -575, y: 332 },
];
const SCALE = 0.85; // ship size
const TILT = -0.22; // radians: the nose points to the top right corner
const SPAN = 720; // formation width in canvas units; it is squeezed on narrow screens
const H = 420, G = 382, BOLT_EVERY = 1.1, BOLT_LIFE = 1.6, BOLT_SPEED = 420;
// Every PERIOD seconds the whole fleet jumps to hyperspace (streaks off to the top right) and drops back in.
const PERIOD = 18, T_OUT = 13.2, OUT_D = 0.6, T_IN = 14.6, IN_D = 1.1, STAGGER = 0.05, JUMP_DIST = 1100;
const INK = '#14181c', MONO = "'JetBrains Mono', ui-monospace, monospace";
const HULL = '#e9ecee', HULL_EDGE = '#8c939a', METAL = '#8f969c', GLASS = '#3a4a5c';

function rr(c, x, y, w, h, r) { c.beginPath(); c.roundRect(x, y, w, h, r); }
const poly = (c, pts) => { c.beginPath(); pts.forEach(([x, y], i) => (i ? c.lineTo(x, y) : c.moveTo(x, y))); c.closePath(); };
const hill = (c, W, amp, base, seed, color) => {
  c.fillStyle = color; c.beginPath(); c.moveTo(0, G);
  for (let x = 0; x <= W; x += 8) c.lineTo(x, base - amp * (0.55 * Math.sin(x / 140 + seed) + 0.45 * Math.sin(x / 63 + seed * 2.1)));
  c.lineTo(W, G); c.closePath(); c.fill();
};

// ---- ships, seen from above, nose pointing right, centred on the origin ----
function falcon(c) {
  c.fillStyle = '#d3d7da'; c.strokeStyle = HULL_EDGE; c.lineWidth = 1.5; c.lineJoin = 'round';
  poly(c, [[18, -17], [54, -10], [54, -4], [28, -4], [28, 4], [54, 4], [54, 10], [18, 17]]); c.fill(); c.stroke();
  rr(c, 12, 20, 32, 9, 4); c.fillStyle = '#b6bcc1'; c.fill(); c.stroke();           // cockpit tube
  c.fillStyle = GLASS; c.beginPath(); c.ellipse(40, 24.5, 3.5, 2.5, 0, 0, 7); c.fill();
  c.fillStyle = '#d3d7da'; c.beginPath(); c.arc(0, 0, 30, 0, 7); c.fill(); c.stroke();
  c.strokeStyle = '#aab0b6'; c.beginPath(); c.arc(0, 0, 19, 0, 7); c.stroke();
  c.beginPath(); c.arc(-8, -13, 5, 0, 7); c.stroke(); c.moveTo(-8, -13); c.lineTo(-2, -19); c.stroke();   // dish
  c.fillStyle = '#6b7078'; c.fillRect(-35, -16, 6, 32);
  c.fillStyle = '#7fb4ff'; c.fillRect(-36, -12, 2.5, 24);
}
function xwing(c) {
  for (const s of [-1, 1]) {
    c.fillStyle = '#dfe3e6'; c.strokeStyle = HULL_EDGE; c.lineWidth = 1.2; c.lineJoin = 'round';
    poly(c, [[6, s * 4], [-22, s * 26], [-6, s * 26], [18, s * 4]]); c.fill(); c.stroke();
    c.strokeStyle = '#c0392b'; c.lineWidth = 2; c.beginPath(); c.moveTo(-10, s * 20); c.lineTo(4, s * 12); c.stroke();
    c.strokeStyle = '#6b7078'; c.lineWidth = 1.6; c.beginPath(); c.moveTo(-6, s * 27); c.lineTo(26, s * 27); c.stroke();
    c.fillStyle = METAL; rr(c, -36, s * 24 - 4.5, 28, 9, 3); c.fill();
  }
  c.fillStyle = '#eef0f1'; c.strokeStyle = HULL_EDGE; c.lineWidth = 1.2;
  poly(c, [[-30, -5], [26, -5], [48, 0], [26, 5], [-30, 5]]); c.fill(); c.stroke();
  c.fillStyle = GLASS; c.beginPath(); c.ellipse(12, 0, 7, 3.2, 0, 0, 7); c.fill();
  c.fillStyle = '#6b7078'; c.beginPath(); c.arc(-14, 0, 3.6, 0, 7); c.fill();
  c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(-14, 0, 1.2, 0, 7); c.fill();
}
function ywing(c) {
  c.lineJoin = 'round'; c.lineWidth = 1.2; c.strokeStyle = '#7a6a45';
  c.fillStyle = '#8a7a52'; c.fillRect(-20, -14, 7, 28);
  for (const s of [-1, 1]) { c.fillStyle = '#b9a36f'; rr(c, -44, s * 15 - 5, 52, 10, 4); c.fill(); c.stroke(); c.fillStyle = '#5d6269'; rr(c, -44, s * 15 - 5, 7, 10, 3); c.fill(); }
  c.fillStyle = '#c9b27c'; rr(c, -14, -5, 62, 10, 5); c.fill(); c.stroke();
  c.fillStyle = GLASS; c.beginPath(); c.ellipse(24, 0, 7, 3.4, 0, 0, 7); c.fill();
  c.fillStyle = '#6b7078'; c.beginPath(); c.arc(-14, 0, 4, 0, 7); c.fill();
}
function awing(c) {
  c.fillStyle = METAL; rr(c, -40, -17, 16, 7, 3); c.fill(); rr(c, -40, 10, 16, 7, 3); c.fill();
  c.fillStyle = '#eef0f1'; c.strokeStyle = HULL_EDGE; c.lineWidth = 1.2; c.lineJoin = 'round';
  poly(c, [[46, 0], [-4, -9], [-28, -24], [-34, -12], [-26, -4], [-26, 4], [-34, 12], [-28, 24], [-4, 9]]); c.fill(); c.stroke();
  c.strokeStyle = '#c0392b'; c.lineWidth = 2; c.beginPath(); c.moveTo(-6, -8); c.lineTo(-24, -20); c.moveTo(-6, 8); c.lineTo(-24, 20); c.stroke();
  c.fillStyle = '#2f4a66'; c.beginPath(); c.ellipse(14, 0, 9, 3.5, 0, 0, 7); c.fill();
}
function jedi(c) {
  c.fillStyle = METAL; rr(c, -40, -3.5, 10, 7, 2); c.fill();
  c.fillStyle = '#e0b030'; c.strokeStyle = '#9b6a10'; c.lineWidth = 1.2; c.lineJoin = 'round';
  poly(c, [[48, 0], [8, -7], [-20, -8], [-28, -19], [-35, -19], [-31, -6], [-31, 6], [-35, 19], [-28, 19], [-20, 8], [8, 7]]); c.fill(); c.stroke();
  c.strokeStyle = '#9b6a10'; c.beginPath(); c.moveTo(34, 0); c.lineTo(-14, 0); c.stroke();
  c.fillStyle = '#6b7078'; c.beginPath(); c.arc(-6, 0, 4.6, 0, 7); c.fill();
  c.fillStyle = '#3b82f6'; c.beginPath(); c.arc(-6, 0, 1.4, 0, 7); c.fill();
}
const KIND = {
  falcon: { draw: falcon, engines: [-9, 9], tail: -36, rgb: '120,175,255', len: 100, bolt: '#5aa0ff', nose: 54 },
  xwing: { draw: xwing, engines: [-24, 24], tail: -36, rgb: '255,150,70', len: 74, bolt: '#ff4d4d', nose: 48 },
  ywing: { draw: ywing, engines: [-15, 15], tail: -44, rgb: '255,150,70', len: 70, bolt: '#ff4d4d', nose: 48 },
  awing: { draw: awing, engines: [-13.5, 13.5], tail: -40, rgb: '120,175,255', len: 66, bolt: '#46e08a', nose: 46 },
  jedi: { draw: jedi, engines: [0], tail: -40, rgb: '120,175,255', len: 66, bolt: '#46e08a', nose: 48 },
};

function trails(c, k, t, i) {
  for (const y of k.engines) {
    const pulse = 0.85 + 0.15 * Math.sin(t * 9 + i * 2 + y);
    // soft bloom around the nozzle
    const b = c.createRadialGradient(k.tail + 2, y, 0, k.tail + 2, y, 17);
    b.addColorStop(0, `rgba(${k.rgb},${0.45 * pulse})`); b.addColorStop(1, `rgba(${k.rgb},0)`);
    c.fillStyle = b; c.beginPath(); c.arc(k.tail + 2, y, 17, 0, 7); c.fill();
    // flame
    const len = k.len * (0.88 + 0.12 * Math.sin(t * 31 + i * 2 + y));
    const g = c.createLinearGradient(k.tail, 0, k.tail - len, 0);
    g.addColorStop(0, `rgba(${k.rgb},.85)`); g.addColorStop(1, `rgba(${k.rgb},0)`);
    c.fillStyle = g; c.beginPath(); c.moveTo(k.tail, y - 3.4); c.lineTo(k.tail - len, y); c.lineTo(k.tail, y + 3.4); c.closePath(); c.fill();
    c.fillStyle = 'rgba(255,255,255,.85)'; c.beginPath(); c.arc(k.tail + 1, y, 2.4, 0, 7); c.fill();
    // sparks drifting back
    for (let j = 0; j < 5; j++) {
      const u = (t * 1.6 + j * 0.2 + i * 0.137 + y * 0.01) % 1, cyc = Math.floor(t * 1.6 + j * 0.2 + i * 0.137 + y * 0.01);
      const sy = y + Math.sin(j * 12.99 + i * 78.2 + cyc * 43.7) * 5 * u;
      c.fillStyle = `rgba(${k.rgb},${0.8 * (1 - u)})`; c.beginPath(); c.arc(k.tail - 8 - u * 58, sy, 0.5 + 1.5 * (1 - u), 0, 7); c.fill();
    }
  }
}

// Hyperspace: stretch out and shoot off to the top right, then drop back in from the bottom left.
function jump(t, i) {
  const p = (((t - i * STAGGER) % PERIOD) + PERIOD) % PERIOD;
  if (p >= T_OUT && p < T_OUT + OUT_D) { const q = (p - T_OUT) / OUT_D; return { off: q ** 3 * JUMP_DIST, stretch: 1 + q * 5, alpha: 1 - Math.max(0, q - 0.6) / 0.4 }; }
  if (p >= T_OUT + OUT_D && p < T_IN) return { off: 0, stretch: 1, alpha: 0 };
  if (p >= T_IN && p < T_IN + IN_D) { const q = (p - T_IN) / IN_D, r = 1 - q; return { off: -(r ** 3) * JUMP_DIST, stretch: 1 + r * 5, alpha: Math.min(1, q / 0.3) }; }
  return { off: 0, stretch: 1, alpha: 1 };
}

function tag(c, x, y, i) {
  const [name, color] = TOOLS[i % TOOLS.length];
  c.font = `700 ${name.length > 7 ? 9.5 : 10.5}px ${MONO}`;
  const w = c.measureText(name).width + 14;
  c.fillStyle = color; rr(c, x - w / 2, y, w, 15, 5); c.fill();
  c.fillStyle = '#fff'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(name, x, y + 8); c.textBaseline = 'alphabetic';
}

function sky(c, W) {
  // twin suns and a distant Death Star, kept faint so the heading stays readable
  c.fillStyle = 'rgba(217,138,0,.35)'; c.beginPath(); c.arc(W * 0.93, 70, 17, 0, 7); c.fill();
  c.fillStyle = 'rgba(217,138,0,.22)'; c.beginPath(); c.arc(W * 0.93 - 34, 92, 11, 0, 7); c.fill();
  c.fillStyle = 'rgba(20,24,28,.075)'; c.beginPath(); c.arc(W * 0.76, 104, 42, 0, 7); c.fill();
  c.strokeStyle = 'rgba(20,24,28,.09)'; c.lineWidth = 2; c.beginPath(); c.moveTo(W * 0.76 - 42, 104); c.lineTo(W * 0.76 + 42, 104); c.stroke();
  c.fillStyle = 'rgba(20,24,28,.09)'; c.beginPath(); c.arc(W * 0.76 + 16, 90, 10, 0, 7); c.fill();
}

function draw(c, W, t, still) {
  const fx = Math.min(1, Math.max(0.5, (W - 60) / SPAN)); // squeeze the formation on narrow screens
  const L = W - 90 * fx - 30, sc = SCALE * Math.max(0.72, fx);
  const pos = (s, i) => [L + s.dx * fx + Math.sin(t * 0.9 + i * 1.7) * 2, s.y + Math.sin(t * 1.8 + i * 1.3) * 5];
  c.clearRect(0, 0, W, H);
  sky(c, W);
  // Tatooine dunes
  hill(c, W, 38, G - 60, 1.3, 'rgba(217,138,0,.10)');
  hill(c, W, 24, G - 24, 4.1, 'rgba(217,138,0,.16)');
  c.fillStyle = 'rgba(217,138,0,.18)'; c.fillRect(0, G, W, H - G);

  // ground shadows: the higher a ship hovers, the fainter and smaller its shadow
  SHIPS.forEach((s, i) => {
    const [x, y] = pos(s, i), lift = (G - y) / G, a = still ? 1 : jump(t, i).alpha;
    if (a <= 0) return;
    c.fillStyle = `rgba(20,24,28,${(0.14 - lift * 0.08) * a})`; c.beginPath(); c.ellipse(x, G + 9, 30 * sc * (1.1 - lift * 0.5), 5, 0, 0, 7); c.fill();
  });
  const dirx = Math.cos(TILT), diry = Math.sin(TILT);
  SHIPS.forEach((s, i) => {
    const k = KIND[s.type], [x, y] = pos(s, i), j = still ? { off: 0, stretch: 1, alpha: 1 } : jump(t, i);
    if (j.alpha <= 0) return;
    const bank = Math.cos(t * 1.8 + i * 1.3) * 9 * 0.004; // banks into its own up and down motion
    c.save(); c.globalAlpha = j.alpha;
    c.translate(x + dirx * j.off, y + diry * j.off); c.rotate(TILT + bank + Math.sin(t * 1.4 + i) * 0.02);
    c.scale(sc * j.stretch, sc * (1 - 0.1 * Math.abs(Math.sin(t * 0.8 + i * 2.1)))); // a slow roll
    if (j.stretch > 1.3) { c.strokeStyle = 'rgba(200,225,255,.85)'; c.lineWidth = 2; c.beginPath(); c.moveTo(-60, 0); c.lineTo(-14 * j.stretch, 0); c.stroke(); }
    trails(c, k, t, i); k.draw(c);
    c.restore();
  });
  // tool tags go on top so no ship covers them
  SHIPS.forEach((s, i) => {
    const [x, y] = pos(s, i), j = still ? { off: 0, alpha: 1 } : jump(t, i), a = Math.max(0, (j.alpha - 0.5) * 2);
    if (a <= 0) return;
    c.globalAlpha = a; tag(c, x - 4 + dirx * j.off, y + 26 + diry * j.off, i); c.globalAlpha = 1;
  });

  if (!still) { // laser bolts fly out along the tilt
    const born = Math.floor(t / BOLT_EVERY);
    for (let n = born; n > born - BOLT_LIFE / BOLT_EVERY; n--) {
      const age = t - n * BOLT_EVERY; if (n < 0 || age < 0) continue;
      const i = (n * 3 + 1) % SHIPS.length, s = SHIPS[i], k = KIND[s.type], a = 1 - age / BOLT_LIFE;
      const [sx, sy] = pos(s, i);
      const d = k.nose * sc + age * BOLT_SPEED, bx = sx + dirx * d, by = sy + diry * d;
      c.lineCap = 'round'; c.strokeStyle = k.bolt;
      c.globalAlpha = 0.28 * a; c.lineWidth = 7; c.beginPath(); c.moveTo(bx - dirx * 16, by - diry * 16); c.lineTo(bx, by); c.stroke();
      c.globalAlpha = a; c.lineWidth = 3; c.beginPath(); c.moveTo(bx - dirx * 16, by - diry * 16); c.lineTo(bx, by); c.stroke();
      c.globalAlpha = 1;
    }
  }
}

export function mount(cv, { reduced = false } = {}) {
  const c = cv.getContext('2d');
  let W = 0, vis = false, raf = 0, t0 = 0;
  const frozen = cv.dataset.time !== undefined ? +cv.dataset.time : null;
  function size() {
    const r = cv.getBoundingClientRect(), dpr = Math.min(devicePixelRatio || 1, 2);
    const s = r.height / H;
    W = r.width / s;
    cv.width = Math.round(r.width * dpr); cv.height = Math.round(r.height * dpr);
    c.setTransform(cv.width / W, 0, 0, cv.height / H, 0, 0);
    paint(performance.now());
  }
  const paint = (now) => (reduced && frozen === null ? draw(c, W, 0, true) : draw(c, W, frozen ?? (now - t0) / 1000, false));
  function loop(now) { if (!vis) return; paint(now); raf = requestAnimationFrame(loop); }
  new ResizeObserver(size).observe(cv);
  new IntersectionObserver(([e]) => {
    vis = e.isIntersecting; cancelAnimationFrame(raf);
    if (vis && !reduced && frozen === null) { t0 = t0 || performance.now(); raf = requestAnimationFrame(loop); }
  }, { threshold: 0.05 }).observe(cv);
  size();
}
