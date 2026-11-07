// Shared behaviour for article pages: progress bar, nav shadow, reveal on scroll, code copy.
import { POSTS } from './data/posts.js';

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
