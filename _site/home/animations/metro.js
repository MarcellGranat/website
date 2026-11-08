// Metro-style route map: four stops on a rising line, a train that keeps riding it,
// and a dashed continuation for stops to come. Rendered as inline SVG.
const NS = 'http://www.w3.org/2000/svg';
export const STOPS = [
  { n: 1, label: 'Set up', x: 90, y: 350 },
  { n: 2, label: 'Write code', x: 250, y: 300 },
  { n: 3, label: 'Analyse', x: 400, y: 250 },
  { n: 4, label: 'Ship', x: 545, y: 150 },
];
const ROUTE = 'M40 350 H200 L300 250 H420 L520 150 H570';
const MORE = 'M570 150 L616 104';
const el = (name, attrs = {}, parent) => {
  const n = document.createElementNS(NS, name);
  for (const [k, v] of Object.entries(attrs)) n.setAttribute(k, v);
  parent?.appendChild(n);
  return n;
};

export function mount(host, { reduced = false, base = '#', labels = true } = {}) {
  const svg = el('svg', { viewBox: '0 0 660 440', class: 'metro', role: 'img', 'aria-label': 'Route map with four stops: set up, write code, analyse, ship' });
  host.appendChild(svg);
  el('path', { d: ROUTE, class: 'metro-track', fill: 'none' }, svg);
  const line = el('path', { d: ROUTE, class: 'metro-line', fill: 'none' }, svg);
  el('path', { d: MORE, class: 'metro-more', fill: 'none' }, svg);
  const len = line.getTotalLength();
  line.style.strokeDasharray = `${len}px`;
  line.style.strokeDashoffset = `${reduced ? 0 : len}px`;

  const stops = STOPS.map((s, i) => {
    const a = el('a', { href: `${base}s${s.n}`, class: 'metro-stop', 'aria-label': `Stop ${s.n}: ${s.label}` }, svg);
    el('circle', { cx: s.x, cy: s.y, r: 17, class: 'metro-dot' }, a);
    const t = el('text', { x: s.x, y: s.y + 5, class: 'metro-n', 'text-anchor': 'middle' }, a);
    t.textContent = s.n;
    if (labels) {
      const up = i === 3, left = i === 1;
      const l = el('text', { x: left ? s.x - 26 : s.x, y: left ? s.y - 14 : s.y + (up ? -30 : 42), class: 'metro-label', 'text-anchor': left ? 'end' : 'middle' }, a);
      l.textContent = s.label;
    }
    if (!reduced) a.style.opacity = 0;
    return a;
  });
  const more = el('text', { x: 616, y: 86, class: 'metro-label soft', 'text-anchor': 'middle' }, svg);
  more.textContent = 'more soon';
  const train = el('g', { class: 'metro-train' }, svg);
  el('circle', { r: 11, class: 'metro-pulse' }, train);
  el('circle', { r: 6, class: 'metro-core' }, train);
  const place = (d) => { const p = line.getPointAtLength(d); train.setAttribute('transform', `translate(${p.x} ${p.y})`); };
  if (reduced) { place(len * 0.62); return; }

  let started = false, t0 = 0, raf = 0, visible = false;
  const stopLens = STOPS.map((s) => {
    let best = 0, bd = 1e9;
    for (let d = 0; d <= len; d += 2) { const p = line.getPointAtLength(d); const k = (p.x - s.x) ** 2 + (p.y - s.y) ** 2; if (k < bd) { bd = k; best = d; } }
    return best;
  });
  const DRAW = 2600, RIDE = 7000;
  function frame(now) {
    if (!visible) return;
    if (!t0) t0 = now;
    const e = now - t0;
    const k = Math.min(1, e / DRAW), ease = 1 - Math.pow(1 - k, 3);
    line.style.strokeDashoffset = `${len * (1 - ease)}px`;
    stops.forEach((a, i) => { a.style.opacity = Math.min(1, Math.max(0, (len * ease - stopLens[i] + 30) / 40)); });
    train.style.opacity = k;
    const r = ((e - DRAW) % RIDE + RIDE) % RIDE / RIDE;
    place(e < DRAW ? len * ease : len * (r < 0.85 ? r / 0.85 : 1));
    raf = requestAnimationFrame(frame);
  }
  new IntersectionObserver(([en]) => {
    visible = en.isIntersecting;
    cancelAnimationFrame(raf);
    if (visible) { if (started) t0 = performance.now() - DRAW - 1; started = true; raf = requestAnimationFrame(frame); }
  }, { threshold: 0.2 }).observe(host);
}
