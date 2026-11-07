// Shared behaviour for article pages: progress bar, nav shadow, reveal on scroll, code copy.
import { POSTS } from './posts.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const year = $('#year');
if (year) year.textContent = new Date().getFullYear();

const bar = $('#progress');
let ticking = false;
function onScroll() {
  const max = document.documentElement.scrollHeight - innerHeight;
  if (bar) bar.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

const revealObs = new IntersectionObserver((entries) => entries.forEach((e) => {
  if (e.isIntersecting) { e.target.classList.add('in'); revealObs.unobserve(e.target); }
}), { threshold: 0.08 });

if (!reduced) {
  const io = new IntersectionObserver((entries) => entries.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.08, rootMargin: '0px 0px -5% 0px' });
  $$('.prose > *, .prose section > *, .prose .cell > *').forEach((el) => {
    if (el.matches('section')) return;
    el.classList.add('reveal');
    io.observe(el);
  });
}

$$('.prose pre').forEach((pre) => {
  const btn = Object.assign(document.createElement('button'), { className: 'copy', type: 'button', textContent: 'Copy' });
  btn.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(pre.innerText.replace(/\nCopy$/, '')); btn.textContent = 'Copied'; }
    catch { btn.textContent = 'Press ⌘C'; }
    setTimeout(() => (btn.textContent = 'Copy'), 1500);
  });
  pre.appendChild(btn);
});

// Similar posts: share a tag (most shared first, then newest); fall back to the latest posts.
const relatedBox = $('#related');
if (relatedBox) {
  const id = location.pathname.match(/posts\/([^/]+)\//)?.[1];
  const me = POSTS.find((p) => p.id === id);
  if (me) {
    const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
    const fmtD = (d) => new Date(d).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
    const shared = (p) => p.tags.filter((t) => me.tags.includes(t)).length;
    const others = POSTS.filter((p) => p.id !== me.id);
    let picks = others.filter((p) => shared(p) > 0).sort((a, b) => shared(b) - shared(a) || b.date.localeCompare(a.date)).slice(0, 3);
    if (!picks.length) { picks = others.slice(0, 3); $('#related-kicker').textContent = 'More posts'; }
    relatedBox.innerHTML = picks.map((p, i) => `
      <a class="post reveal" style="--d:${i}" href="../${p.id}/index.html">
        <div class="thumb">${p.image ? `<img src="../${p.id}/${p.image}" alt="" loading="lazy" />` : ''}</div>
        <div class="post-body">
          <time datetime="${p.date}">${fmtD(p.date)}</time>
          <h3>${esc(p.title)}</h3>
          <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
        </div>
      </a>`).join('');
    $('#related-section').hidden = false;
    $$('.post', relatedBox).forEach((el) => (reduced ? el.classList.add('in') : revealObs.observe(el)));
  }
}

// External links open in a new tab.
$$('.prose a[href^="http"]').forEach((a) => {
  if (new URL(a.href).origin !== location.origin) { a.target = '_blank'; a.rel = 'noopener'; }
});

// Code: links to the author's GitHub repos are repeated in the left column with a GitHub icon.
{
  const repos = new Map();
  $$('.prose a[href*="github.com/"]').forEach((a) => {
    const u = new URL(a.href);
    const m = u.pathname.match(/^\/MarcellGranat\/([^/]+)(\/.*)?$/i);
    if (u.hostname.replace(/^www\./, '') !== 'github.com' || !m) return;
    const label = ['MarcellGranat', m[1], ...(m[2] ? [m[2].split('/').filter(Boolean).pop()] : [])].join('/');
    if (!repos.has(a.href)) repos.set(a.href, label.replace(/\/(blob|tree|issues)$/, ''));
  });
  const anchor = $('.post-aside .facts');
  if (repos.size && anchor) {
    const GH = '<svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.5 7.5 0 0 1 4 0c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>';
    const box = document.createElement('div');
    box.className = 'downloads repos';
    box.innerHTML = '<p class="dl-title">Code</p>' + [...repos].map(([href, label]) =>
      `<a class="dl" href="${href}" target="_blank" rel="noopener">${GH}<span>${label}</span></a>`).join('');
    anchor.before(box);
  }
}

// Figure animations (posts that use a canvas instead of a stock image).
{
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const load = (sel, file) => { const cv = $(sel); if (cv) import(file).then((m) => m.mount(cv, { reduced: reducedMotion })); };
  load('.visual .city-canvas', './animations/city.js');
  load('.visual .book-canvas', './animations/book.js');
  load('.visual .signal-canvas', './animations/signal.js');
}
