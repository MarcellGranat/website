// Writing page: full post grid with topic filters (same cards as the homepage).
import { POSTS } from './data/posts.js';
import './post.js';

const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = (d) => new Date(d).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' });

const grid = $('#post-grid');
grid.innerHTML = POSTS.map((p, i) => `
  <a class="post reveal in" style="--d:${i % 3}" href="posts/${p.id}/index.html" data-tags="${esc(p.tags.join('|'))}">
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
    card.classList.toggle('hide', !(btn.dataset.t === 'All' || card.dataset.tags.split('|').includes(btn.dataset.t)));
  });
});
