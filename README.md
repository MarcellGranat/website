# marcellgranat.com

Plain static website - no build step, no Quarto. **`_site/` is the site** (this is the folder that gets published).

- `_site/index.html`, `_site/blog.html`, `_site/about.html` and `_site/home/` : homepage, Writing page, shared CSS/JS.
- `_site/posts/<id>/index.html` : one hand-written page per post (copy an existing one to start a new post).
- `_site/home/posts.js` : the post list used by the homepage and the Writing page. Add an entry for each new post.
- `_site/bigdata/` and the other folders in `_site/` are separate sections of the site and are untouched.
- `archive-quarto/` : the old Quarto sources (qmd files, freeze cache, theme). Kept for reference only.

Preview locally: `cd _site && python3 -m http.server 8000` then open http://localhost:8000/
