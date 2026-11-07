// Hero animation: a drifting network of nodes whose links brighten near the pointer,
// with small signals travelling along edges. Light-theme palette.
export function mount(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  const TEAL = '15, 143, 134';
  const AMBER = '217, 138, 0';
  let w = 0, h = 0, dpr = 1, nodes = [], signals = [], raf = 0, running = false;
  const pointer = { x: -9999, y: -9999 };
  const LINK = 140;

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(Math.min(110, Math.max(36, (w * h) / 14000)));
    nodes = Array.from({ length: count }, (_, i) => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
      r: i % 9 === 0 ? 3.2 : 1.8, hub: i % 9 === 0, phase: Math.random() * 6.28,
    }));
    if (reduced) draw(0);
  }

  function spawnSignal() {
    const a = nodes[(Math.random() * nodes.length) | 0];
    const near = nodes.filter((b) => b !== a && Math.hypot(a.x - b.x, a.y - b.y) < LINK);
    if (near.length) signals.push({ a, b: near[(Math.random() * near.length) | 0], t: 0 });
  }

  function draw(t) {
    ctx.clearRect(0, 0, w, h);
    for (const n of nodes) {
      if (!reduced) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
        const dx = n.x - pointer.x, dy = n.y - pointer.y, d = Math.hypot(dx, dy);
        if (d < 120 && d > 0) { n.x += (dx / d) * 0.8; n.y += (dy / d) * 0.8; }
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let j = i + 1; j < nodes.length; j++) {
        const b = nodes[j], d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d > LINK) continue;
        const mid = Math.hypot((a.x + b.x) / 2 - pointer.x, (a.y + b.y) / 2 - pointer.y);
        const boost = mid < 160 ? (1 - mid / 160) * 0.5 : 0;
        ctx.strokeStyle = `rgba(${TEAL}, ${(1 - d / LINK) * 0.22 + boost})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
      }
    }
    for (const n of nodes) {
      const pulse = n.hub ? 0.5 + 0.5 * Math.sin(t / 700 + n.phase) : 0;
      if (n.hub) {
        ctx.strokeStyle = `rgba(${AMBER}, ${0.35 * (1 - pulse)})`;
        ctx.beginPath(); ctx.arc(n.x, n.y, 4 + pulse * 14, 0, 6.28); ctx.stroke();
      }
      ctx.fillStyle = n.hub ? `rgb(${AMBER})` : `rgba(${TEAL}, .55)`;
      ctx.beginPath(); ctx.arc(n.x, n.y, n.r, 0, 6.28); ctx.fill();
    }
    if (!reduced) {
      if (signals.length < 8 && Math.random() < 0.06) spawnSignal();
      signals = signals.filter((s) => (s.t += 0.025) < 1);
      for (const s of signals) {
        const x = s.a.x + (s.b.x - s.a.x) * s.t, y = s.a.y + (s.b.y - s.a.y) * s.t;
        ctx.fillStyle = `rgba(${AMBER}, .9)`;
        ctx.beginPath(); ctx.arc(x, y, 2.6, 0, 6.28); ctx.fill();
      }
    }
  }

  function loop(t) { draw(t); raf = requestAnimationFrame(loop); }
  function start() { if (!running && !reduced) { running = true; raf = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  const onMove = (e) => { const r = canvas.getBoundingClientRect(); pointer.x = e.clientX - r.left; pointer.y = e.clientY - r.top; };
  const onLeave = () => { pointer.x = pointer.y = -9999; };
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerleave', onLeave);
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())); io.observe(canvas);
  resize();
  return { unmount() { stop(); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); } };
}
