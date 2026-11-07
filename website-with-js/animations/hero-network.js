// Hero World Flight Network Animation
// Replicates the daalab.com hero visual: global flight arcs, pulsing airport hubs,
// traveling comet trails, and interactive HUD crosshairs.

import { CONTINENTS, AIRPORTS, DEFAULT_ROUTES } from './world-data.js';

export function mount(canvas, options = {}) {
  const ctx = canvas.getContext('2d');
  if (!ctx) return { unmount: () => {} };

  const offscreen = document.createElement('canvas');
  const offCtx = offscreen.getContext('2d');

  // Theme colors matching daalab.com
  const colors = {
    bg: options.bg || '#090909',
    grid: options.grid || 'rgba(255, 255, 255, 0.05)',
    gridEquator: options.gridEquator || 'rgba(79, 209, 197, 0.2)',
    continentStroke: options.continentStroke || 'rgba(160, 180, 190, 0.28)',
    continentFill: options.continentFill || 'rgba(255, 255, 255, 0.015)',
    routeLine: options.routeLine || 'rgba(79, 209, 197, 0.14)',
    routeLineLong: options.routeLineLong || 'rgba(79, 209, 197, 0.24)',
    cyan: options.cyan || '#4fd1c5',
    cyanGlow: options.cyanGlow || 'rgba(178, 246, 255, 0.9)',
    amber: options.amber || '#ffd166',
    amberGlow: options.amberGlow || 'rgba(255, 209, 102, 0.85)'
  };

  const DEG2RAD = Math.PI / 180;
  let width = 0;
  let height = 0;
  let dpr = 1;
  let scale = 1;
  let offsetX = 0;
  let offsetY = 0;
  let latMid = 11;
  let latMax = 78;
  let latMin = -56;
  let mouseX = -9999;
  let mouseY = -9999;
  let isHovered = false;

  const airportMap = new Map();
  const airports = AIRPORTS.map(a => {
    const item = { ...a, sx: 0, sy: 0 };
    airportMap.set(a.code, item);
    return item;
  });

  // Spherical to Cartesian 3D unit vector
  function toVector3(lon, lat) {
    const radLon = lon * DEG2RAD;
    const radLat = lat * DEG2RAD;
    const cosLat = Math.cos(radLat);
    return [cosLat * Math.cos(radLon), cosLat * Math.sin(radLon), Math.sin(radLat)];
  }

  // Spherical linear interpolation for great-circle arcs
  function slerp(p1, p2, segments = 40) {
    const v1 = toVector3(p1.lon, p1.lat);
    const v2 = toVector3(p2.lon, p2.lat);
    const dot = Math.max(-1, Math.min(1, v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2]));
    const angle = Math.acos(dot);
    if (angle < 1e-5) return [[p1.lon, p1.lat], [p2.lon, p2.lat]];

    const sinAngle = Math.sin(angle);
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const w1 = Math.sin((1 - t) * angle) / sinAngle;
      const w2 = Math.sin(t * angle) / sinAngle;
      const x = w1 * v1[0] + w2 * v2[0];
      const y = w1 * v1[1] + w2 * v2[1];
      const z = w1 * v1[2] + w2 * v2[2];
      const lat = Math.asin(Math.max(-1, Math.min(1, z))) / DEG2RAD;
      const lon = Math.atan2(y, x) / DEG2RAD;
      pts.push([lon, lat]);
    }
    return pts;
  }

  // Projection: Modified equirectangular centered near prime meridian
  const normLon = lon => (lon - 10 + 540) % 360 - 180;
  const project = (lon, lat) => [offsetX + normLon(lon) * scale, offsetY - (lat - latMid) * scale];

  // Build route objects
  const routes = [];
  DEFAULT_ROUTES.forEach(([fromCode, toCode]) => {
    const a1 = airportMap.get(fromCode);
    const a2 = airportMap.get(toCode);
    if (!a1 || !a2) return;
    const pts = slerp(a1, a2, 48);
    routes.push({
      from: a1,
      to: a2,
      geoPoints: pts,
      screenPoints: [],
      length: Math.hypot(a1.lon - a2.lon, a1.lat - a2.lat)
    });
  });

  // Aircraft comets
  const aircraft = [];
  routes.forEach((route, idx) => {
    aircraft.push({
      route,
      t: (idx * 0.17) % 1,
      speed: 0.0018 + (idx % 5) * 0.0004,
      forward: idx % 2 === 0,
      hold: (idx * 17) % 50
    });
  });

  // Check antimeridian jump
  function isJump(p1, p2) {
    return Math.abs(p1[0] - p2[0]) > width * 0.45;
  }

  // Draw path with antimeridian discontinuity handling
  function drawProjectedPath(targetCtx, pts) {
    targetCtx.beginPath();
    let penDown = false;
    for (let i = 0; i < pts.length; i++) {
      if (i > 0 && isJump(pts[i], pts[i - 1])) {
        penDown = false;
      }
      if (penDown) {
        targetCtx.lineTo(pts[i][0], pts[i][1]);
      } else {
        targetCtx.moveTo(pts[i][0], pts[i][1]);
        penDown = true;
      }
    }
    targetCtx.stroke();
  }

  // Render static layer to offscreen buffer
  function renderStatic() {
    offscreen.width = width * dpr;
    offscreen.height = height * dpr;
    offCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
    offCtx.clearRect(0, 0, width, height);

    const isMobile = width < 720;
    const lineScale = isMobile ? 0.6 : 1;

    // Lat/lon subtle grid
    offCtx.strokeStyle = colors.grid;
    offCtx.lineWidth = 1 * lineScale;

    // Longitude lines
    const lonStep = isMobile ? 30 : 20;
    for (let lon = -180; lon <= 180; lon += lonStep) {
      const x = offsetX + normLon(lon) * scale;
      if (x >= -20 && x <= width + 20) {
        offCtx.beginPath();
        offCtx.moveTo(x, 0);
        offCtx.lineTo(x, height);
        offCtx.stroke();
      }
    }

    // Latitude lines
    const latStep = isMobile ? 20 : 15;
    for (let lat = -60; lat <= 80; lat += latStep) {
      const y = offsetY - (lat - latMid) * scale;
      if (y >= -20 && y <= height + 20) {
        offCtx.beginPath();
        if (lat === 0) {
          offCtx.strokeStyle = colors.gridEquator;
          offCtx.lineWidth = 1.4 * lineScale;
        } else {
          offCtx.strokeStyle = colors.grid;
          offCtx.lineWidth = 1 * lineScale;
        }
        offCtx.moveTo(0, y);
        offCtx.lineTo(width, y);
        offCtx.stroke();
      }
    }

    // Continent landmasses
    offCtx.strokeStyle = colors.continentStroke;
    offCtx.lineWidth = 1.1 * lineScale;
    offCtx.fillStyle = colors.continentFill;

    CONTINENTS.forEach(ring => {
      const screenRing = ring.map(([lon, lat]) => project(lon, lat));
      offCtx.beginPath();
      let penDown = false;
      for (let i = 0; i < screenRing.length; i++) {
        if (i > 0 && isJump(screenRing[i], screenRing[i - 1])) {
          penDown = false;
        }
        if (penDown) {
          offCtx.lineTo(screenRing[i][0], screenRing[i][1]);
        } else {
          offCtx.moveTo(screenRing[i][0], screenRing[i][1]);
          penDown = true;
        }
      }
      offCtx.fill();
      offCtx.stroke();
    });

    // Flight routes
    routes.forEach(route => {
      offCtx.strokeStyle = route.length > 50 ? colors.routeLineLong : colors.routeLine;
      offCtx.lineWidth = (route.length > 50 ? 1 : 0.8) * lineScale;
      drawProjectedPath(offCtx, route.screenPoints);
    });

    // Static airport dots
    airports.forEach(a => {
      offCtx.fillStyle = a.tier === 1 ? colors.amber : 'rgba(255, 209, 102, 0.45)';
      offCtx.beginPath();
      offCtx.arc(a.sx, a.sy, a.tier === 1 ? 2.5 : 1.4, 0, Math.PI * 2);
      offCtx.fill();
    });
  }

  function resize() {
    const rect = canvas.getBoundingClientRect();
    width = Math.max(1, rect.width);
    height = Math.max(1, rect.height);
    dpr = Math.min(window.devicePixelRatio || 1, 2.5);

    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const isMobile = width < 720;
    latMax = isMobile ? 72 : 78;
    latMin = isMobile ? 24 : -56;
    latMid = (latMax + latMin) / 2;
    scale = Math.max(width / 360, (height / (latMax - latMin)) * (isMobile ? 0.8 : 1.05));
    offsetX = width / 2;
    offsetY = isMobile ? (latMax - latMid) * scale : height - (latMid - latMin) * scale;

    // Update screen coordinates
    airports.forEach(a => {
      const [x, y] = project(a.lon, a.lat);
      a.sx = x;
      a.sy = y;
    });

    routes.forEach(route => {
      route.screenPoints = route.geoPoints.map(([lon, lat]) => project(lon, lat));
    });

    renderStatic();
  }

  // Linear interpolation along screen path
  function interpolateRoute(pts, t) {
    if (!pts || pts.length === 0) return null;
    const clamped = Math.max(0, Math.min(1, t)) * (pts.length - 1);
    const idx = Math.floor(clamped);
    const frac = clamped - idx;
    const p1 = pts[idx];
    const p2 = pts[Math.min(pts.length - 1, idx + 1)];
    if (!p1 || !p2 || isJump(p1, p2)) return null;
    return [p1[0] + (p2[0] - p1[0]) * frac, p1[1] + (p2[1] - p1[1]) * frac];
  }

  // Animation Loop
  let frameId = 0;
  let tick = 0;
  let running = true;

  function render() {
    if (!running) return;
    tick++;

    ctx.clearRect(0, 0, width, height);

    // Blit pre-rendered static layer
    ctx.drawImage(offscreen, 0, 0, width, height);

    // 1. Animated comets traveling on routes
    aircraft.forEach(craft => {
      if (craft.hold > 0) {
        craft.hold--;
        return;
      }
      craft.t += craft.speed;
      if (craft.t >= 1) {
        craft.t = 0;
        craft.hold = 30 + (tick % 40);
        craft.forward = !craft.forward;
      }

      const progress = craft.forward ? craft.t : 1 - craft.t;
      const pts = craft.route.screenPoints;

      // Draw 8-particle fading comet tail
      for (let i = 0; i < 8; i++) {
        const tOffset = progress - i * 0.012;
        if (tOffset < 0 || tOffset > 1) continue;
        const pt = interpolateRoute(pts, tOffset);
        if (!pt) continue;

        const alpha = (1 - i / 8) * 0.85;
        const radius = 2.0 * (1 - i / 10);
        ctx.fillStyle = `rgba(178, 246, 255, ${alpha})`;
        ctx.beginPath();
        ctx.arc(pt[0], pt[1], radius, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // 2. Hub radar pulse rings
    airports.forEach((a, i) => {
      if (a.tier !== 1) return;
      const wave = 0.5 + 0.5 * Math.sin(tick / 40 + i * 1.3);
      const ringRadius = 3 + wave * 16;
      const ringAlpha = (1 - wave) * 0.45;

      ctx.strokeStyle = `rgba(255, 209, 102, ${ringAlpha})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(a.sx, a.sy, ringRadius, 0, Math.PI * 2);
      ctx.stroke();

      // Inner glowing core
      ctx.fillStyle = colors.amber;
      ctx.beginPath();
      ctx.arc(a.sx, a.sy, 2.2 + wave * 0.6, 0, Math.PI * 2);
      ctx.fill();
    });

    // 3. Interactive HUD crosshairs on nearest airport
    if (isHovered && mouseX > 0 && mouseY > 0) {
      let nearest = null;
      let minDist = 90;

      airports.forEach(a => {
        const d = Math.hypot(mouseX - a.sx, mouseY - a.sy);
        if (d < minDist) {
          minDist = d;
          nearest = a;
        }
      });

      if (nearest) {
        const { sx, sy, code, lat, lon } = nearest;

        // Target reticle
        ctx.strokeStyle = colors.cyan;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(sx, sy, 11, 0, Math.PI * 2);
        ctx.stroke();

        // Crosshair ticks
        const tickLen = 6;
        ctx.beginPath();
        ctx.moveTo(sx - 16, sy);
        ctx.lineTo(sx - 16 + tickLen, sy);
        ctx.moveTo(sx + 16, sy);
        ctx.lineTo(sx + 16 - tickLen, sy);
        ctx.moveTo(sx, sy - 16);
        ctx.lineTo(sx, sy - 16 + tickLen);
        ctx.moveTo(sx, sy + 16);
        ctx.lineTo(sx, sy + 16 - tickLen);
        ctx.stroke();

        // Info tag badge
        ctx.font = '500 11px Poppins, monospace, sans-serif';
        const label = `${code} [${lat.toFixed(1)}°, ${lon.toFixed(1)}°]`;
        const textWidth = ctx.measureText(label).width;
        const boxX = sx + 18;
        const boxY = sy - 20;

        ctx.fillStyle = 'rgba(9, 9, 9, 0.85)';
        ctx.strokeStyle = colors.cyan;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.rect(boxX, boxY, textWidth + 12, 20);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#b2f6ff';
        ctx.fillText(label, boxX + 6, boxY + 14);
      }
    }

    frameId = requestAnimationFrame(render);
  }

  // Event Listeners
  function onPointerMove(e) {
    const rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    isHovered = true;
  }

  function onPointerLeave() {
    isHovered = false;
    mouseX = -9999;
    mouseY = -9999;
  }

  canvas.addEventListener('pointermove', onPointerMove, { passive: true });
  canvas.addEventListener('pointerleave', onPointerLeave, { passive: true });

  const resizeObserver = new ResizeObserver(() => resize());
  resizeObserver.observe(canvas);
  resize();
  render();

  return {
    unmount() {
      running = false;
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerleave', onPointerLeave);
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
