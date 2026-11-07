// Shared behaviour for article pages: progress bar, nav shadow, reveal on scroll, code copy.
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
