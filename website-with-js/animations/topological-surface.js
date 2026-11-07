// 3D Topological Undulating Surface Mesh Animation
// Replicates the daalab.com "Ancillary Pricing" visualization: a 3D perspective
// wireframe elevation mesh with undulating sinusoidal ribbons in dual cyan & amber palettes,
// coordinate bounding axes, and highlighted dynamic extrema nodes.

export function mount(canvas, options = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { unmount: () => {} };

  let width = 0;
  let height = 0;
  let dpr = 1;
  let running = true;
  let frameId = 0;
  let tick = 0;

  // Visual parameters
  const rows = 28;         // Depth slices
  const cols = 48;         // Width resolution
  const gridWidth = 460;
  const gridDepth = 320;

  // Perspective camera angles
  const rotX = 0.52;       // Pitch down
  const rotY = -0.58;      // Yaw angle
  const cosX = Math.cos(rotX);
  const sinX = Math.sin(rotX);
  const cosY = Math.cos(rotY);
  const sinY = Math.sin(rotY);

  function project3D(x, y, z, cx, cy) {
    // Rotate Y
    const x1 = x * cosY - z * sinY;
    const z1 = x * sinY + z * cosY;

    // Rotate X
    const y2 = y * cosX - z1 * sinX;
    const z2 = y * sinX + z1 * cosX;

    // Perspective projection
    const fov = 600;
    const distance = 580 + z2;
    const scale = fov / Math.max(10, distance);

    return [
      cx + x1 * scale,
      cy + y2 * scale,
      scale
    ];
  }

  // Wave elevation functions
  function getUpperWave(u, v, time) {
    const w1 = Math.sin(u * 5.2 - time * 0.035) * Math.cos(v * 3.4 + time * 0.02);
    const w2 = Math.sin(u * 9.1 + v * 4.8 + time * 0.045) * 0.45;
    const w3 = Math.cos(u * 2.8 - time * 0.02) * 0.6;
    const envelope = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
    return (w1 + w2 + w3) * envelope * 46;
  }

  function getLowerWave(u, v, time) {
    const w1 = Math.sin(u * 4.1 + time * 0.03) * Math.cos(v * 2.9 - time * 0.025);
    const w2 = Math.cos(u * 7.5 - v * 5.2 - time * 0.04) * 0.4;
    const envelope = Math.sin(u * Math.PI) * Math.sin(v * Math.PI);
    return (w1 + w2) * envelope * 38;
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function render() {
    if (!running) return;
    tick++;

    ctx.clearRect(0, 0, width, height);

    const cx = width * 0.52;
    const cy = height * 0.56;

    // Draw 3D coordinate bounding axes
    const origin = project3D(-gridWidth / 2, 60, -gridDepth / 2, cx, cy);
    const xAxis = project3D(gridWidth / 2, 60, -gridDepth / 2, cx, cy);
    const yAxis = project3D(-gridWidth / 2, -100, -gridDepth / 2, cx, cy);
    const zAxis = project3D(-gridWidth / 2, 60, gridDepth / 2, cx, cy);

    ctx.strokeStyle = 'rgba(72, 90, 96, 0.4)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(xAxis[0], xAxis[1]);
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(yAxis[0], yAxis[1]);
    ctx.moveTo(origin[0], origin[1]);
    ctx.lineTo(zAxis[0], zAxis[1]);
    ctx.stroke();

    // Axis tick markers
    ctx.strokeStyle = 'rgba(72, 90, 96, 0.25)';
    for (let i = 0; i <= 4; i++) {
      const frac = i / 4;
      const tickPos = project3D(-gridWidth / 2, 60 - frac * 150, -gridDepth / 2, cx, cy);
      ctx.beginPath();
      ctx.moveTo(tickPos[0] - 4, tickPos[1]);
      ctx.lineTo(tickPos[0] + 4, tickPos[1]);
      ctx.stroke();
    }

    // Render Lower Golden/Amber Mesh
    for (let r = 0; r < rows; r += 2) {
      const v = r / (rows - 1);
      const z = (v - 0.5) * gridDepth;
      const alpha = 0.15 + (1 - v) * 0.55;

      ctx.strokeStyle = `rgba(255, 209, 102, ${alpha * 0.75})`;
      ctx.lineWidth = 0.9;
      ctx.beginPath();

      for (let c = 0; c < cols; c++) {
        const u = c / (cols - 1);
        const x = (u - 0.5) * gridWidth;
        const elevation = getLowerWave(u, v, tick) + 38; // offset lower
        const [sx, sy] = project3D(x, elevation, z, cx, cy);

        if (c === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    // Render Upper Cyan Mesh Ribbons
    const peakPoints = [];

    for (let r = 0; r < rows; r++) {
      const v = r / (rows - 1);
      const z = (v - 0.5) * gridDepth;
      const alpha = 0.2 + (1 - v) * 0.75;

      ctx.strokeStyle = `rgba(79, 209, 197, ${alpha})`;
      ctx.lineWidth = 1.0;
      ctx.beginPath();

      for (let c = 0; c < cols; c++) {
        const u = c / (cols - 1);
        const x = (u - 0.5) * gridWidth;
        const elevation = getUpperWave(u, v, tick) - 30; // offset upper
        const [sx, sy, scale] = project3D(x, elevation, z, cx, cy);

        if (c === 0) ctx.moveTo(sx, sy);
        else ctx.lineTo(sx, sy);

        // Highlight extrema peaks on selected slices
        if (r % 6 === 2 && (c === 12 || c === 34)) {
          peakPoints.push({ sx, sy, elevation, scale });
        }
      }
      ctx.stroke();
    }

    // Highlighted floating peak indicator points
    peakPoints.forEach(pt => {
      // Glow dot
      ctx.fillStyle = '#b2f6ff';
      ctx.beginPath();
      ctx.arc(pt.sx, pt.sy, 2.8, 0, Math.PI * 2);
      ctx.fill();

      // Drop projection line to floor
      ctx.strokeStyle = 'rgba(79, 209, 197, 0.25)';
      ctx.setLineDash([2, 3]);
      ctx.beginPath();
      ctx.moveTo(pt.sx, pt.sy);
      ctx.lineTo(pt.sx, pt.sy + 42);
      ctx.stroke();
      ctx.setLineDash([]);
    });

    frameId = requestAnimationFrame(render);
  }

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(canvas);
  resize();
  render();

  return {
    unmount() {
      running = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
    },
    pause() {
      running = false;
      cancelAnimationFrame(frameId);
    },
    resume() {
      if (!running) {
        running = true;
        render();
      }
    }
  };
}
