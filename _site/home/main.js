import { POSTS } from './posts.js';
import { mount as mountNetwork } from './animations/network.js';
import { mount as mountSurface } from './animations/surface.js';
import { mount as mountCity } from './animations/city.js';
import { mount as mountBook } from './animations/book.js';
import { mount as mountSignal } from './animations/signal.js';
import { mount as mountTrain } from './animations/train.js';
import { mount as mountYoda } from './animations/yoda.js';

const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

$('#year').textContent = new Date().getFullYear();

// ---- Posts: cards + topic filter (links go to the existing Quarto posts) ----
const grid = $('#post-grid');
const fmt = (d) => new Date(d).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
grid.innerHTML = POSTS.map((p, i) => `
  <a class="post reveal" style="--d:${i % 3}" href="posts/${p.id}/index.html" data-tags="${esc(p.tags.join('|'))}">
    <div class="thumb">${p.image ? `<img src="posts/${p.id}/${p.image}" alt="" loading="lazy" />` : ''}</div>
    <div class="post-body">
      <time datetime="${p.date}">${fmt(p.date)}</time>
      <h3>${esc(p.title)}</h3>
      <div class="tags">${p.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
    </div>
  </a>`).join('');

const counts = new Map();
POSTS.forEach((p) => p.tags.forEach((t) => counts.set(t, (counts.get(t) || 0) + 1)));
const topics = ['All', ...[...counts].sort((a, b) => b[1] - a[1]).map(([t]) => t)];
const filters = $('#filters');
filters.innerHTML = topics.map((t, i) => `<button class="chip" aria-pressed="${i === 0}" data-t="${esc(t)}">${esc(t)}</button>`).join('');
filters.addEventListener('click', (e) => {
  const btn = e.target.closest('.chip');
  if (!btn) return;
  $$('.chip', filters).forEach((c) => c.setAttribute('aria-pressed', String(c === btn)));
  $$('.post', grid).forEach((card) => {
    const show = btn.dataset.t === 'All' || card.dataset.tags.split('|').includes(btn.dataset.t);
    card.classList.toggle('hide', !show);
    if (show) card.classList.add('in');
  });
});

// ---- Show more / fewer: 6 newest posts first, filters only when unfolded ----
const VISIBLE = 6;
const moreBtn = $('#more-posts');
const cards = $$('.post', grid);
function setExpanded(open) {
  cards.forEach((card, i) => {
    const extra = i >= VISIBLE;
    card.classList.toggle('collapsed', extra && !open);
    if (extra && open) card.classList.add('in');
  });
  filters.hidden = !open;
  moreBtn.setAttribute('aria-expanded', String(open));
  moreBtn.textContent = open ? 'Show less' : 'Show more';
  if (!open) { // fold back: reset the topic filter
    $$('.chip', filters).forEach((c) => c.setAttribute('aria-pressed', String(c.dataset.t === 'All')));
    cards.forEach((card) => card.classList.remove('hide'));
  }
}
if (cards.length <= VISIBLE) { moreBtn.parentElement.hidden = true; filters.hidden = false; }
else {
  setExpanded(false);
  moreBtn.addEventListener('click', () => {
    const open = moreBtn.getAttribute('aria-expanded') !== 'true';
    setExpanded(open);
    if (!open) $('#blog').scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
  });
}

// ---- Scroll reveal ----
const revealIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); revealIO.unobserve(e.target); } });
}, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
$$('.reveal').forEach((el) => revealIO.observe(el));

// ---- Count-up numbers ----
const countIO = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    countIO.unobserve(e.target);
    const to = +e.target.dataset.count, start = performance.now(), dur = 1200;
    const step = (now) => {
      const k = Math.min(1, (now - start) / dur);
      e.target.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    };
    reduced ? (e.target.textContent = to) : requestAnimationFrame(step);
  });
}, { threshold: 0.6 });
$$('[data-count]').forEach((el) => countIO.observe(el));

// ---- Scroll-linked: progress bar, nav state, timeline line, hero parallax ----
const bar = $('#progress'), nav = $('#nav'), timeline = $('#timeline'), heroInner = $('.hero-inner');
let ticking = false;
function onScroll() {
  const y = scrollY, max = document.documentElement.scrollHeight - innerHeight;
  bar.style.transform = `scaleX(${max > 0 ? y / max : 0})`;
  nav.classList.toggle('scrolled', y > 24);
  const g = ($('.about-grid') || timeline).getBoundingClientRect();
  timeline.style.setProperty('--tl', Math.min(1, Math.max(0, (innerHeight * 0.75 - g.top) / (g.height * 0.85))));
  if (!reduced && y < innerHeight) heroInner.style.transform = `translateY(${y * 0.18}px)`;
  ticking = false;
}
addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
onScroll();

// ---- Canvas animations ----
mountNetwork($('#hero-canvas'), { reduced });
$$('.city-canvas').forEach((cv) => mountCity(cv, { reduced }));
$$('.signal-canvas').forEach((cv) => mountSignal(cv, { reduced }));
$$('.book-canvas').forEach((cv) => mountBook(cv, { reduced }));
$$('.surface-canvas').forEach((cv) => mountSurface(cv, { reduced, phase: +cv.dataset.phase || 0 }));
$$('.train-canvas').forEach((cv) => mountTrain(cv, { reduced }));

// Yoda strolls along the bottom of the screen while the data-science stack block is in view
mountYoda({ reduced, watch: '#stack' });
