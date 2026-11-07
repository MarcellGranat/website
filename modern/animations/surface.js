// Undulating 3D wireframe surface (two ribbons: teal over amber) drawn on a 2D canvas.
// Only runs while visible. Light-theme palette.
export function mount(canvas, { reduced = false } = {}) {
  const ctx = canvas.getContext('2d');
  const rows = 28, cols = 48, gridW = 460, gridD = 320;
  const rotX = 0.52, rotY = -0.58;
  const cX = Math.cos(rotX), sX = Math.sin(rotX), cY = Math.cos(rotY), sY = Math.sin(rotY);
  let w = 0, h = 0, dpr = 1, tick = 0, raf = 0, running = false;

  function project(x, y, z, cx, cy) {
    const x1 = x * cY - z * sY, z1 = x * sY + z * cY;
    const y2 = y * cX - z1 * sX, z2 = y * sX + z1 * cX;
    const s = 600 / Math.max(10, 580 + z2);
    return [cx + x1 * s * (w / 640), cy + y2 * s * (w / 640)];
  }
  const env = (u, v) => Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
  const upper = (u, v, t) =>
    (Math.sin(u * 5.2 - t * 0.035) * Math.cos(v * 3.4 + t * 0.02) + Math.sin(u * 9.1 + v * 4.8 + t * 0.045) * 0.45 + Math.cos(u * 2.8 - t * 0.02) * 0.6) * env(u, v) * 46;
  const lower = (u, v, t) =>
    (Math.sin(u * 4.1 + t * 0.03) * Math.cos(v * 2.9 - t * 0.025) + Math.cos(u * 7.5 - v * 5.2 - t * 0.04) * 0.4) * env(u, v) * 38;

  function resize() {
    const r = canvas.getBoundingClientRect();
    w = r.width; h = r.height; dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = w * dpr; canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    draw();
  }

  function draw() {
    ctx.clearRect(0, 0, w, h);
    const cx = w * 0.5, cy = h * 0.55;
    ctx.strokeStyle = 'rgba(20, 24, 28, .18)'; ctx.lineWidth = 1;
    const o = project(-gridW / 2, 60, -gridD / 2, cx, cy);
    for (const p of [project(gridW / 2, 60, -gridD / 2, cx, cy), project(-gridW / 2, -100, -gridD / 2, cx, cy), project(-gridW / 2, 60, gridD / 2, cx, cy)]) {
      ctx.beginPath(); ctx.moveTo(o[0], o[1]); ctx.lineTo(p[0], p[1]); ctx.stroke();
    }
    for (let r = 0; r < rows; r += 2) {
      const v = r / (rows - 1), z = (v - 0.5) * gridD;
      ctx.strokeStyle = `rgba(217, 138, 0, ${(0.12 + (1 - v) * 0.5) * 0.8})`;
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const u = c / (cols - 1), [sx, sy] = project((u - 0.5) * gridW, lower(u, v, tick) + 38, z, cx, cy);
        c ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
      }
      ctx.stroke();
    }
    const peaks = [];
    for (let r = 0; r < rows; r++) {
      const v = r / (rows - 1), z = (v - 0.5) * gridD;
      ctx.strokeStyle = `rgba(15, 143, 134, ${0.2 + (1 - v) * 0.7})`;
      ctx.beginPath();
      for (let c = 0; c < cols; c++) {
        const u = c / (cols - 1), [sx, sy] = project((u - 0.5) * gridW, upper(u, v, tick) - 30, z, cx, cy);
        c ? ctx.lineTo(sx, sy) : ctx.moveTo(sx, sy);
        if (r % 6 === 2 && (c === 12 || c === 34)) peaks.push([sx, sy]);
      }
      ctx.stroke();
    }
    for (const [x, y] of peaks) {
      ctx.fillStyle = '#0f8f86'; ctx.beginPath(); ctx.arc(x, y, 3, 0, 6.28); ctx.fill();
      ctx.strokeStyle = 'rgba(15, 143, 134, .35)'; ctx.setLineDash([2, 3]);
      ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 40); ctx.stroke(); ctx.setLineDash([]);
    }
  }

  function loop() { tick++; draw(); raf = requestAnimationFrame(loop); }
  function start() { if (!running && !reduced) { running = true; raf = requestAnimationFrame(loop); } }
  function stop() { running = false; cancelAnimationFrame(raf); }
  const ro = new ResizeObserver(resize); ro.observe(canvas);
  const io = new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop())); io.observe(canvas);
  resize();
  return { unmount() { stop(); ro.disconnect(); io.disconnect(); } };
}
