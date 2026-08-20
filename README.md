# Portfolio — tomerberger

Personal portfolio site. One page, static, no framework and no build step.

```
index.html      every section
style.css       design tokens, layout, responsive rules
main.js         ~90 lines: small-screen nav toggle + nav scroll-spy
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
   | Project name | `tomerberger` (this becomes `tomerberger.pages.dev`) |
   | Production branch | `main` |
   | Framework preset | **None** |
   | Build command | **leave completely empty** |
   | Build output directory | `/` |

   The empty build command is the part worth getting right. Pick a
   framework preset and Cloudflare will try to run a build that does not
   exist here, and the deploy fails.

8. Click **Save and Deploy**.

First build takes about a minute — it is only copying files. When it
finishes you get **`tomerberger.pages.dev`**.

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
pointing at `tomerberger.pages.dev` — which still works, it is just the
wrong address to show people.

### If a deploy fails

- **"Build failed" straight away** — a framework preset almost certainly
  got selected. Go to **Settings → Build**, clear the build command, set
  the preset to **None**.
- **Page loads unstyled** — build output directory is wrong. It should be
  `/`, not `public` or `dist`.
- **New commit didn't deploy** — check you pushed to `main`, not another
  branch. **Deployments** in the dashboard shows which branch each build
  came from.

## Accessibility and browser checks

Verified in headless Chromium before the first commit, not assumed:

- **Contrast** — every rendered text node measured against its real
  computed background. Zero WCAG AA failures. Ratios are documented at
  the top of `style.css`.
- **Keyboard** — 17 interactive elements, all reachable by Tab, all with
  a visible focus ring. "Skip to content" is the first stop.
- **Responsive** — no horizontal overflow at 360, 390, 768, 1024 or
  1440px.
- **Structure** — one `<h1>`, no skipped heading levels, every
  `aria-labelledby` and `aria-controls` resolving, no duplicate ids.
- **Without JavaScript** — the nav stays visible and every link works.
  `main.js` only adds the mobile toggle and the scroll-spy highlight.
- **Reduced motion** — smooth scrolling and colour transitions are
  disabled under `prefers-reduced-motion: reduce`.

## Editing

The copy lives directly in `index.html` — search for the section heading
you want and edit the text. `PLAN.md` records where each claim came from
(CV line or repository file), which is worth keeping accurate if you
change a project description.

Colours are CSS custom properties at the top of `style.css`. If you change
one, re-check contrast; the ratios in that comment block are only true for
the values currently there.
