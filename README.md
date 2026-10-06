# Younes Tatari: Academic Portfolio (classic)

A plain HTML/CSS/JavaScript copy of the original Streamlit app. It has the same sidebar, banner, tabs, pages and styling, with no Python and no server.

| Streamlit file | Now lives in |
|---|---|
| `app.py` (sidebar, CSS, navigation) | `index.html`, `style.css`, bottom of `app.js` |
| `home.py`, `Research.py`, `experience_education.py`, `cv.py`, `publications.py`, `genealogy.py`, `news.py` | one `render…()` function each in `app.js` |

To edit content, change the lists in `app.js`: `projects`, `publications`, `conferences`, `newsItems`, `skillGroups` and `affiliations`. They mirror the Python lists. Images go in `assets/`.

Each tab has its own link, e.g. `…/#research` or `…/#news`.

**Run locally:** `python -m http.server 8000` in this folder, then open <http://localhost:8000>.

**Publish:** push the contents of this folder to a GitHub repo and enable **Settings → Pages** (branch `main`, folder `/root`).
