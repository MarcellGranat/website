import { POSTS } from './posts.js';
import { mount } from './animations/metro.js';
import { mount as mountYoda } from './animations/yoda.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = (d) => new Date(d).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
$('#year').textContent = new Date().getFullYear();

// Attach posts to a stop: put post ids in the stop's data-posts attribute ("id1 id2").
for (const box of $$('.stop-posts')) {
  const ids = box.dataset.posts.split(/\s+/).filter(Boolean);
  const posts = ids.map((id) => POSTS.find((p) => p.id === id)).filter(Boolean).sort((a, b) => b.date.localeCompare(a.date)); // newest first
  box.innerHTML = posts.length
    ? posts.map((p) => `
      <a class="post" href="../posts/${p.id}/index.html">
        <div class="thumb">${p.image ? `<img src="../posts/${p.id}/${p.image}" alt="" loading="lazy" />` : ''}</div>
        <div class="post-body"><time datetime="${p.date}">${fmt(p.date)}</time><h3>${esc(p.title)}</h3></div>
      </a>`).join('')
    : '<div class="stop-empty">Posts for this stop are coming. They will show up here once written.</div>';
}

mount($('#metro-hero'), { reduced, base: '#' });
mountYoda({ reduced });

// reveal, route progress line, progress bar
const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });
$$('.reveal').forEach((n) => io.observe(n));
const bar = $('#progress'), route = $('#route');
let ticking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  const r = route.getBoundingClientRect();
  route.style.setProperty('--rt', Math.min(1, Math.max(0, (innerHeight * 0.6 - r.top) / (r.height * 0.9))));
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();
