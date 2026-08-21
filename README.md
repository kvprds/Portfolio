# Portfolio — tomerberger

🔗 **Live site:** <https://tomerberger-portfolio.pages.dev>

Personal portfolio site. One page, static, no framework and no build step.

```
index.html      every section
style.css       fluid type + space scales, layout, responsive rules
main.js         ~150 lines: nav toggle, scroll progress, scroll reveal,
                nav scroll-spy. No libraries.
favicon.svg     "TB" monogram
favicon.ico     32px fallback for older browsers
og-image.png    1200x630 social card
PLAN.md         the plan this site was built from
```

There is no `package.json`, no bundler and no dependencies. Every byte the
page loads is in this repository.

## Run it locally

Double-click `index.html`. Every asset path is relative, so the page
loads fully from disk — styles, script, favicon and all.

If you would rather serve it over HTTP (closer to how Cloudflare will
actually serve it):

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Any static server does the same job.

## Deploying to Cloudflare Pages

Push to `main`, and Cloudflare rebuilds and republishes on its own. The
setup below is a one-time thing.

Cloudflare renames dashboard sections every so often, so match on the
words rather than the exact position — the flow itself has been stable.

### First-time setup

1. Go to **dash.cloudflare.com** and sign in.
2. In the left sidebar, open **Compute (Workers & Pages)**. Depending on
   the account this reads **Workers & Pages** or just **Compute**.
3. Click **Create**, then choose the **Pages** tab. (The page opens on
   **Workers** by default — you want Pages. If you only see an
   *"Import a repository"* button, that is the same thing.)
4. Click **Connect to Git**.
5. Authorise Cloudflare for GitHub if it asks. Grant it access either to
   all repositories or to just this one — either works.
6. Pick **kvprds/Portfolio** from the list, then **Begin setup**.
7. On the build-configuration screen:

   | Field | Value |
   |---|---|
   | Project name | `tomerberger-portfolio` (this becomes `tomerberger-portfolio.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | **leave completely empty** |
   | Build output directory | `/` |

   The empty build command is the part worth getting right. Pick a
   framework preset and Cloudflare will try to run a build that does not
   exist here, and the deploy fails.

8. Click **Save and Deploy**.

First build takes about a minute — it is only copying files. When it
finishes you get **`tomerberger-portfolio.pages.dev`**, which is where the
site lives today.

### Every deploy after that

```bash
git add -A
git commit -m "Update copy"
git push
```

Pushing to `main` triggers a deploy. Any other branch gets a preview URL
instead, which is a good way to look at a change before it goes live.

### Attaching a custom domain

1. Open the project, then the **Custom domains** tab.
2. **Set up a domain**, enter it, **Continue**.
3. If the domain's nameservers are already on Cloudflare, the DNS record
   is created for you. If not, Cloudflare shows a `CNAME` to add wherever
   your DNS lives.
4. Wait for the certificate to issue — a few minutes, occasionally longer.

**Then update three lines in `index.html`.** Open Graph needs absolute
URLs, so they cannot be inferred from wherever the page happens to be
served:

```html
<link rel="canonical"    href="https://YOUR-DOMAIN/">
<meta property="og:url"   content="https://YOUR-DOMAIN/">
<meta property="og:image" content="https://YOUR-DOMAIN/og-image.png">
```

`twitter:image` just below them takes the same URL. Nothing else in the
file depends on the domain. Until you change these, link previews keep
pointing at `tomerberger-portfolio.pages.dev` — which still works, it is
just the wrong address to show people.

### If a deploy fails

- **"Build failed" straight away** — a framework preset almost certainly
  got selected. Go to **Settings → Build**, clear the build command, set
  the preset to **None**.
- **Page loads unstyled** — build output directory is wrong. It should be
  `/`, not `public` or `dist`.
- **New commit didn't deploy** — check you pushed to `main`, not another
  branch. **Deployments** in the dashboard shows which branch each build
  came from.

## When you're no longer looking for a role

The site is written to stay correct after you're hired. The only
"available for work" copy is two short blocks, both wrapped in obvious
HTML comments in `index.html`:

- one in the hero, the small `Currently open to a student position.` pill
- one at the top of `#contact`

Delete those two `<p class="seeking">` paragraphs and everything still
reads correctly — nothing else references them, and no layout depends on
them. Everything else on the page is about what you built and how you
decided, which does not expire.

## Type and layout are fluid

There is no single fixed font size on the page. Every size and every
block of spacing interpolates with the viewport between 360px and
1280px via a `clamp()` scale (`--step--2` … `--step-5`,
`--space-2xs` … `--space-2xl` at the top of `style.css`). Measured:

| Viewport | 360px | 768px | 1280px+ |
|---|---|---|---|
| `h1` | 40.2px | 48.5px | 57.3px |
| Tagline | 23.2px | 25.6px | 28.1px |
| Lede | 19.2px | 20.7px | 22.5px |
| Body | 16.0px | 16.9px | 18.0px |
| Section padding | 64px | 92px | 128px |

Media queries are used only for things that genuinely have to *reflow* —
the nav collapsing, the sections going from two columns to one — not for
resizing text.

Above 62rem, sections become two columns with the heading sticky in the
left margin; below that they stack.

## Accessibility and browser checks

Verified in headless Chromium, not assumed:

- **Contrast** — every rendered text node measured against its real
  computed background. Zero WCAG AA failures. Ratios are documented at
  the top of `style.css`.
- **Keyboard** — 19 interactive elements, all reachable by Tab, all with
  a visible focus ring. "Skip to content" is the first stop; Escape
  closes the mobile menu and returns focus to the toggle.
- **Responsive** — no horizontal overflow at 360, 390, 414, 768, 1024,
  1440 or 1920px.
- **Structure** — one `<h1>`, no skipped heading levels, every
  `aria-labelledby` and `aria-controls` resolving, no duplicate ids.
- **Without JavaScript** — the nav stays visible, nothing is hidden, and
  every link works.
- **Reduced motion** — under `prefers-reduced-motion: reduce` the scroll
  reveal is disabled outright and content renders visible on load.
- **Scroll reveal cannot strand content** — sections fade in on scroll,
  but anything still hidden after 3 seconds is shown unconditionally, and
  deep links (`/#skills`) reveal everything immediately. Content is never
  the thing that loses.
- **Scroll progress bar** — tracks scroll position exactly (verified at
  0%, 25%, 50%, 100%).

## Editing

The copy lives directly in `index.html` — search for the section heading
you want and edit the text. `PLAN.md` records where each claim came from
(CV line or repository file), which is worth keeping accurate if you
change a project description.

Colours are CSS custom properties at the top of `style.css`. If you change
one, re-check contrast; the ratios in that comment block are only true for
the values currently there.
