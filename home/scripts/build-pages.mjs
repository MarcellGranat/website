// Wraps Quarto-rendered post bodies in the hand-written site template.
// Quarto still executes/renders the content (R, figures, math); this only replaces presentation.
//
// Usage (from repo root):
//   node home/scripts/build-pages.mjs <quarto-rendered-site-dir> [target-site-dir=_site]
// Writes <target>/posts/<id>/index.html, <target>/blog.html and <target>/about.html.
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const [renderedDir, targetDir = '_site'] = process.argv.slice(2);
if (!renderedDir) { console.error('usage: build-pages.mjs <rendered-site-dir> [target-site-dir]'); process.exit(1); }

const { POSTS } = await import(pathToFileURL(join(here, '..', 'data', 'posts.js')).href);
const esc = (s) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const fmt = (d) => new Date(d).toLocaleDateString('en', { year: 'numeric', month: 'long', day: 'numeric' });
const FONTS = 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap';

const nav = (root) => `
  <div class="progress" id="progress"></div>
  <header class="nav scrolled" id="nav">
    <a class="brand" href="${root}index.html"><img src="${root}logo.png" alt="" width="28" height="28" /> Marcell Granát</a>
    <nav>
      <a href="${root}index.html#about">About</a>
      <a href="${root}index.html#focus">Focus</a>
      <a href="${root}blog.html">Writing</a>
      <a href="${root}index.html#path">Path</a>
      <a href="${root}index.html#contact" class="pill">Contact</a>
    </nav>
  </header>`;

const footer = (root) => `
  <footer class="footer"><span>© <span id="year"></span> Marcell Granát</span><a href="${root}blog.html">All posts</a></footer>`;

const page = ({ root, title, description, head = '', body, script = 'post.js' }) => `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#f6f5f1" />
  <meta name="description" content="${esc(description)}" />
  <link rel="icon" href="${root}logo.png" />
  <link href="${FONTS}" rel="stylesheet" />
  <link rel="stylesheet" href="${root}home/styles.css" />
  <link rel="stylesheet" href="${root}home/post.css" />
${head}
  <title>${esc(title)} | Marcell Granát</title>
</head>
<body>${nav(root)}
${body}
${footer(root)}
  <script type="module" src="${root}home/${script}"></script>
</body>
</html>
`;

function carryOverHead(html, root) {
  const head = html.match(/<head>([\s\S]*?)<\/head>/)?.[1] ?? '';
  const out = [];
  const syntax = head.match(/href="[^"]*(quarto-html\/quarto-syntax-highlighting-[^"]+\.css)"/);
  if (syntax) out.push(`  <link rel="stylesheet" href="${root}site_libs_v2/${syntax[1]}" />`);
  for (const m of head.matchAll(/<(script|link)\b[^>]*(?:src|href)="([^"]+)"[^>]*>(?:\s*<\/script>)?/g)) {
    const url = m[2];
    if (/site_libs|fonts\.googleapis|logo\.png|bootstrap/.test(url)) continue;
    if (/mathjax|katex|index_files|_files\//i.test(url)) out.push('  ' + m[0]);
  }
  return out.join('\n');
}

function buildPost(post, idx) {
  const src = join(renderedDir, 'posts', post.id, 'index.html');
  if (!existsSync(src)) { console.warn(`skip ${post.id}: ${src} not found`); return; }
  const html = readFileSync(src, 'utf8');
  let main = html.match(/<main\b[^>]*id="quarto-document-content"[^>]*>([\s\S]*?)<\/main>/)?.[1];
  if (!main) { console.warn(`skip ${post.id}: no main content`); return; }
  main = main.replace(/<button[^>]*code-copy-button[\s\S]*?<\/button>/g, '').trim();
  const text = main.replace(/<(script|style)[\s\S]*?<\/\1>/g, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const minutes = Math.max(1, Math.round(text.split(' ').length / 220));
  const newer = POSTS[idx - 1], older = POSTS[idx + 1];
  const link = (p, label) => p ? `<a href="../${p.id}/index.html"><small>${label}</small><span>${esc(p.title)}</span></a>` : '<span></span>';
  const body = `
  <main>
    <header class="article-head">
      <div class="article-head-inner">
        <a class="back" href="../../blog.html">← All posts</a>
        <h1>${esc(post.title)}</h1>
        <p class="meta"><time datetime="${post.date}">${fmt(post.date)}</time> · ${minutes} min read</p>
        <div class="tags">${post.tags.map((t) => `<span>${esc(t)}</span>`).join('')}</div>
      </div>
    </header>
    <article class="prose">
${main}
    </article>
    <nav class="pager" aria-label="More posts">${link(newer, 'Newer')}${link(older, 'Older')}</nav>
  </main>`;
  writeFileSync(join(targetDir, 'posts', post.id, 'index.html'), page({
    root: '../../', title: post.title, description: text.slice(0, 160), head: carryOverHead(html, '../../'), body,
  }));
}

POSTS.forEach((p, i) => buildPost(p, i));

writeFileSync(join(targetDir, 'blog.html'), page({
  root: '', title: 'Writing', description: 'Research notes, packages and projects by Marcell Granát.', script: 'listing.js',
  body: `
  <main>
    <header class="article-head"><div class="article-head-inner">
      <a class="back" href="index.html">← Home</a>
      <h1>Writing</h1>
      <p class="meta">Research notes, packages and projects</p>
    </div></header>
    <section class="listing">
      <div class="filters" id="filters" role="group" aria-label="Filter posts by topic"></div>
      <div class="post-grid" id="post-grid"></div>
    </section>
  </main>`,
}));

writeFileSync(join(targetDir, 'about.html'), `<!doctype html>
<html lang="en"><head><meta charset="UTF-8" /><meta http-equiv="refresh" content="0; url=index.html#about" />
<link rel="canonical" href="index.html#about" /><title>About | Marcell Granát</title></head>
<body><p><a href="index.html#about">Continue to the about section</a></p></body></html>
`);
console.log(`Built ${POSTS.length} posts, blog.html and about.html into ${targetDir}`);
