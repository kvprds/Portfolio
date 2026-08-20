# Portfolio site — plan

Stage 1 deliverable. No implementation until you approve this.

Everything below is traced to one of three sources:

- **CV** — `TomerBergerResume.pdf` (the file you uploaded).
- **Auditor repo** — `github.com/kvprds/bid-request-auditor`, cloned and read.
- **Surfboard repo** — `github.com/kvprds/SurfBoard-Measurement`, cloned and read.

I ran the auditor's test suite (20/20 pass) and its CLI against a sample to
confirm the behaviour described below is real, not just claimed in a README.

---

## Decisions — resolved, and what shipped

These were the places where the sources disagreed. All settled with Tomer
before implementation; recorded here so the reasoning survives.

### 1. "26 checks" vs. the code — resolved: the site says 21

Tomer's CV, the auditor's `README.md`, `CLAUDE.md` and `NOTES.md` all said
**26 checks**. The code registers **21**:

```
$ node -e "import('./src/audit.ts').then(m=>console.log(m.CHECKS.length))"
21
```

By category, matching the README's own layout section: spec 10, enums 2,
contradictions 6, privacy 3 = **21 check functions**, emitting **22
distinct finding IDs** — those 21 plus `invalid-json`, which `audit()`
returns for unparseable input rather than throwing.

`NOTES.md` says the project "capped at 26 checks" and separately that
checks were cut during the plan review. 26 was the planned number; the
review cut it to 21 and the prose was never updated.

**Shipped:** the site says 21. The auditor repo's README, CLAUDE.md and
NOTES.md were corrected in the same pass. Tomer is updating the CV
himself.

### 2. Is the auditor deployed? — resolved: yes, but access-restricted

`bid-request-auditor.vercel.app` is live. It could not be reached from the
build environment for two separate reasons: this sandbox's egress proxy
blocks the domain, and the deployment sits behind Vercel's Deployment
Protection, which admits only authorised accounts.

**Shipped:** the live demo is linked. The link only does its job for a
public visitor once Deployment Protection is turned off — see the note in
the handover.

### 3. Surfboard has no live demo — resolved: labelled "In build"

Its README documents local use only: `python web.py`, `localhost:5000`,
and you supply your own Gemini key, OAuth client secret and Gmail app
password.

**Shipped:** repo link only, with an "In build" status line — not deployed
yet, runs locally against your own credentials.

### 4. The CV file — resolved

The plan was written against the resume attached to the conversation. The
repo folder never contained a `TomerBergerResume-Main.pdf`.

### 5. What to leave off the CV — resolved

- **Phone number** — off. Contact is mailto + LinkedIn + GitHub, and a
  public page is the one place a phone number attracts spam.
- **`tomerberger.framer.website`** — off, deliberately and everywhere.
  This site replaces it.
- **Per-year GPA** — **kept, at Tomer's request.** Cumulative 89.72 alone
  undersells the recent trend, so the About section reads "GPA 89.72
  cumulative — 98 this year, 95 the year before", matching the CV line.

---

## Page sections, in order

Single page, six sections, in the order you specified.

| # | Section | `id` | Purpose |
|---|---------|------|---------|
| 1 | Hero | `#top` | Name, one-line positioning, three links |
| 2 | About | `#about` | Who you are, degree situation, tutoring |
| 3 | Projects | `#projects` | Auditor first, surfboard second |
| 4 | Security & systems | `#security` | Offensive security, RE, CTF, systems base |
| 5 | Skills | `#skills` | Grouped exactly as the CV groups them |
| 6 | Contact | `#contact` | mailto, LinkedIn, GitHub |

A skip link precedes the header; a sticky nav links to sections 2–6.

---

## Exact copy

Everything here is final text, not a description of text. Where a claim
maps to a CV line or a repo file, I've noted it in `[brackets]` — those
brackets are annotations for you and will not appear on the site.

### 1. Hero

> # Tomer Berger
>
> **Backend, AI systems and security.**
>
> Final-year B.Sc. Computer Science & Mathematics student. I build backend
> systems end to end — problem definition, architecture, data model, tests
> and deployment — on a low-level foundation in operating systems, memory
> management, networks and assembly.
>
> Available for a student position. Netanya, Israel.
>
> `[Email]` `[GitHub]` `[LinkedIn]`

`[CV: title line, summary paragraph, "available for a student position", location line]`

### 2. About

> ## About
>
> I'm completing a B.Sc. in Computer Science & Mathematics at Netanya
> Academic College through an academic excellence program that ran
> alongside high school — I finished my matriculation in 2026 and the
> degree finishes in 2027. I completed the Computer Science matriculation
> in 9th grade through the same program.
>
> Cumulative GPA 89.72. Coursework: Secure Programming, Operating Systems,
> Computer Networks, Assembly, Algorithms, Data Structures, Software
> Engineering, Object-Oriented Programming.
>
> I've shipped two products that put ML and LLM capabilities into real
> workflows. What I care about in both is that the output is traceable:
> a validator that answers differently on the same input twice isn't a
> reference, and a sizing recommendation nobody can review isn't advice.
>
> Since January 2025 I've tutored high school and college students in
> computer science and mathematics — currently 10 active students, whose
> curriculum and progress I manage, reading and correcting their code
> across a wide range of levels. All of them have passed their courses.

`[CV: education block, summary, experience block. "All of them have passed their courses" is the CV's "a track record of all of them passing their courses" — kept because it's your claim, not my embellishment.]`

### 3. Projects

> ## Projects

#### Project 1 — Bid Request Auditor

> ### Bid Request Auditor
>
> #### OpenRTB 2.6 validator
>
> A validator for OpenRTB 2.6 bid requests. Paste a request, drop a
> `.json` file on the page, or load one of five samples, and it reports
> spec violations, invalid AdCOM 1.0 enum values, internal contradictions,
> and privacy signals contradicted by the identifiers the request actually
> carries — a COPPA or DNT flag asserted while device IDs, user IDs and
> ten-metre geo are still being sent. Every finding cites the spec section
> it came from and is graded by severity. The same rules run three ways:
> a CLI that exits non-zero on errors so it drops into CI, a browser page,
> and a Claude Code skill.
>
> **Stack** — TypeScript, run directly on Node using native type
> stripping: no compiler, no bundler, no `package.json`, zero runtime
> dependencies. The page is plain HTML, CSS and vanilla JavaScript; its
> one script is generated from `src/` by a small Node script using
> `node:module`'s `stripTypeScriptTypes`, so the browser runs the real
> rules rather than a copy of them. Tests are `node --test`.
>
> **Decisions**
>
> - **Deterministic rules, no LLM at runtime.** Results are reproducible,
>   need no network and cost nothing per run. I used AI heavily to build
>   it and not at all to run it — "the spec says X" has to trace to a line
>   of code and a section number, not to a model's judgment.
> - **ERROR only where a spec table literally says "required."**
>   "Recommended" caps at WARNING. Unknown fields and unrecognised enum
>   values cap at INFO, because §2.6 requires implementers to tolerate
>   them. The three privacy contradictions are the one deliberate
>   exception, promoted to ERROR.
> - **One engine, two front doors.** The CLI and the page import the same
>   modules, so no rule is duplicated, and a test fails if the generated
>   browser bundle drifts from the source.
> - **No backend.** The audit runs entirely in the browser, so a bid
>   request pasted into the page never leaves the analyst's machine.
> - **Cut a check the spec supports.** §3.2.19 says city should use
>   UN/LOCODE, but effectively nobody sends it that way. Flagging
>   "Tel Aviv" would have been inventing a problem, so it's out.
>
> `[Repo]` `[Live demo — pending your answer to Q2]`

`[Stack verified: no package.json, no tsconfig.json; every import in src/ is either relative or a node: builtin; web/index.html loads only its own auditor.js, no CDN. 20/20 tests pass on Node v22.22.2. The "26 checks" sentence is deliberately absent pending Q1 — with answer (a) I'll add: "21 checks, each citing the spec section it came from."]`

#### Project 2 — AI Surfboard-Sizing Web App

> ### AI Surfboard-Sizing Web App
>
> #### Board dimensions from a video of you surfing
>
> A surfer signs in with Google, uploads a video of themselves in the
> water, and enters height, weight and skill level. Gemini 2.5 Flash
> confirms the clip actually shows surfing, assesses technique, and
> returns a recommended board volume in litres and length in feet and
> inches. To keep recommendations grounded in real expertise, the app
> pulls an experienced coach's previous sizing decisions out of the
> database and feeds them into the prompt as few-shot examples, so the
> model mirrors a human coach's logic rather than sizing from scratch.
> Clips that aren't surfing are rejected and the user's bundle is
> refunded. Built and tested with the guidance of an Olympic surfing
> coach.
>
> **Stack** — Python and Flask, server-rendered, no frontend framework.
> SQLite through Flask-SQLAlchemy, Google OAuth via Authlib, Gemini 2.5
> Flash through `google-genai` for multimodal video analysis, SMTP for
> result notifications. Analysis runs on a background thread so the upload
> request returns straight away.
>
> **Decisions**
>
> - **Swapped the model out when it couldn't do the job.** I prototyped a
>   3D linear regression over height, weight and a computer-vision-derived
>   skill score. It couldn't capture technique, so I moved to a multimodal
>   model prompted with few-shot examples from the coach's past sizing
>   decisions.
> - **Grounded the prompt in real decisions.** The few-shot examples come
>   out of the database at request time, not from a fixed prompt, so the
>   model's output tracks the coach's actual record.
> - **Kept a human in the loop.** An admin dashboard supports manual
>   review, sizing overrides, inventory and user chat, so the model's
>   answer is reviewable rather than final.
> - **Hardened the session layer.** A CSRF token on every form,
>   HttpOnly and SameSite=Lax cookies, `X-Frame-Options: DENY`,
>   `X-Content-Type-Options: nosniff`, and a 500 MB cap on uploads.
>
> It's a learning project rather than a production service: it runs
> locally and needs your own Gemini key, OAuth client secret and mail
> credentials.
>
> `[Repo]`

`[Stack verified from web.py imports and config: flask, flask_sqlalchemy, authlib, google.genai, smtplib/ssl, werkzeug.secure_filename, threading. Model string is literally "gemini-2.5-flash" at web.py:211. Security headers at web.py:85-89, cookie config at :30-32, CSRF at :72-83, MAX_CONTENT_LENGTH at :27. The regression prototype is NOT in the current repo — I describe it as the earlier prototype your CV says it was, and claim nothing about it being shipped.]`

### 4. Security & systems

> ## Security & systems
>
> The low-level side is where I started, and it's still the part I reach
> for first when something behaves strangely.
>
> **Offensive security labs** — from Secure Programming coursework: stack
> buffer overflows and the countermeasures built to stop them;
> environment-variable attacks and Shellshock; Set-UID privileged
> programs, including capability leaking and command injection through
> `system()`; SQL injection and XSS.
>
> **Reverse engineering** — self-taught from an online video series,
> working through all five of its levels, plus CTF challenges. Static and
> dynamic analysis of Linux/x86 binaries.
>
> **Systems base** — Operating Systems (virtual memory, processes, memory
> management), Computer Networks and Assembly. Two further cyber and
> network security courses in the final year of the degree.
>
> This shows up in the work: the auditor's privacy category exists because
> the interesting failure in a bid request isn't a malformed field, it's a
> COPPA flag sitting next to a child's advertising ID.

`[CV: SECURITY PRACTICE block, verbatim in substance. The closing sentence is my framing of the privacy checks, which do exist in src/rules/privacy.ts — coppa-with-user-data checks exactly that.]`

### 5. Skills

> ## Skills
>
> **Languages** — C, Java, Python, C#, TypeScript, C++, Bash, x86
> Assembly, SQL
>
> **Backend & systems** — Flask, Node.js, REST APIs, SQLite, OAuth 2.0,
> Git, Vercel, Linux, OS internals and memory management, computer
> networks
>
> **ML & AI systems** — LLM and multimodal API integration (Gemini),
> few-shot prompting, linear regression, Claude Code (CLAUDE.md project
> instructions, plan-first workflows, custom skills)
>
> **Security** — memory corruption and buffer overflows, Set-UID and
> privilege escalation, injection and web vulnerabilities (SQLi, XSS),
> reverse engineering, CTFs, gdb
>
> **Spoken** — English (proficient), Hebrew (native)

`[CV: SKILLS block, unchanged.]`

### 6. Contact

> ## Contact
>
> I'm looking for a student position in backend, AI systems or security.
> Email is the surest way to reach me.
>
> `[tomer.berger08@gmail.com]` — plain mailto link
> `[LinkedIn — linkedin.com/in/tomerberger]`
> `[GitHub — github.com/kvprds]`
>
> No contact form: this is a static site with no backend, and a form that
> silently drops what you write is worse than no form at all.

Footer: `© 2026 Tomer Berger` plus a line noting the site is static, has no
analytics and sets no cookies — true, and worth saying on a page whose
projects are partly about privacy signals.

---

## Project stacks, derived from the repos

Side by side with what your CV currently claims, so you can see where I
changed something and why.

### Bid Request Auditor

| | |
|---|---|
| **CV currently says** | TypeScript, Node.js, Claude Code, Vercel |
| **Site will say** | TypeScript on Node (native type stripping), zero runtime dependencies, vanilla JS browser page, `node --test` |

Evidence:

- **No `package.json`, no `tsconfig.json`.** Not "no dependencies listed" —
  the files don't exist. Nothing to `npm install`.
- **Every import** in `src/` is a relative `./*.ts` path or a `node:`
  builtin (`node:fs`, `node:process`, `node:module`, `node:test`).
- **`web/index.html` loads exactly one script**, its own `auditor.js`.
  No CDN, no framework, no external stylesheet, no web font.
- **`web/auditor.js` is generated**, not written — `tools/build-web.mjs`
  runs `stripTypeScriptTypes` from `node:module` over `src/`.
  `tests/web-bundle.test.ts` fails if it goes stale or picks up a
  Node-only import.
- **Ran it.** `node --experimental-strip-types --test tests/*.ts` →
  20 pass, 0 fail. CLI on `samples/05-native-privacy.json` → 8 findings
  (3 ERROR, 3 WARNING, 2 INFO), matching `PLAN.md` exactly.

On "Vercel" and "no build step": the CLI has genuinely no build step. The
web page does have a generation step (`node tools/build-web.mjs`), and the
deploy is a static upload. The copy above says this precisely rather than
flattening it to "no build step". Whether Vercel appears at all depends on
your answer to Q2 — it stays in the Skills list either way, since you've
used it.

### AI Surfboard-Sizing Web App

| | |
|---|---|
| **CV currently says** | Python, Flask, SQLite, Google OAuth, Gemini 2.5 Flash (multimodal) |
| **Site will say** | The same, plus the ORM, the auth library, the SDK and the mail path, all named from the imports |

Evidence — `SurfBoard-Measurement/web.py` (1,202 lines):

| Claim | Where |
|---|---|
| Flask, server-rendered | `from flask import Flask, render_template_string, …` — templates are inline strings, so there is no frontend framework and no template directory |
| SQLite via Flask-SQLAlchemy | `from flask_sqlalchemy import SQLAlchemy`; models `Surfer`, `SurfVideo`, `Inventory`, `ZoomMessage` |
| Google OAuth | `from authlib.integrations.flask_client import OAuth` |
| Gemini 2.5 Flash, multimodal | `from google import genai`; `model="gemini-2.5-flash"` with `contents=[video_file, prompt]` |
| Email notifications | `smtplib` + `ssl` + `email.message.EmailMessage` |
| Background analysis | `threading.Thread(...)` at the upload route |
| Few-shot from the DB | prompt built from `Surfer.query.filter(...is_pro == True).order_by(timestamp.desc()).limit(5)` |
| CSRF, headers, cookies | `csrf_protect()`; `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`; `SESSION_COOKIE_HTTPONLY`, `SAMESITE='Lax'` |

Two things I found and am **not** putting on the site:

1. **`seed_db.py` is stale.** It does `from web import … analyze_video_bytes, train_ai` — neither function exists in the current `web.py`. It also imports `yt_dlp` and `mediapipe`, which nothing else uses. It looks like leftovers from the regression-era pipeline. So `mediapipe` and `yt-dlp` are **not** listed as part of the app's stack, and the regression is described only as the earlier prototype your CV says it was.
2. **`surfdate.csv` is not a CSV** — the bytes are a ZIP starting with `[Content_Types].xml`, i.e. an `.xlsx` saved under the wrong extension. Harmless, irrelevant to the site, mentioning it only because you'd want to know. Similarly `jsonl.py` reads `surf_data.csv`, which isn't in the repo.

Neither affects the copy. Flagging them because "the repo says X but the code does Y" is the thing you asked me to catch.

---

## File layout

```
Portfolio/
├── index.html          Every section. Semantic landmarks, one <h1>.
├── style.css           Design tokens, layout, responsive rules. No imports.
├── main.js             ~40 lines: mobile nav toggle, nav scroll-spy.
├── favicon.svg         "TB" monogram, inline paths, no external refs.
├── favicon.ico         32×32 fallback for older browsers.
├── og-image.png        1200×630 card for Open Graph / Twitter.
├── PLAN.md             This file, kept in the repo as the record.
├── README.md           What it is, how to run locally, Cloudflare deploy.
└── .gitignore          OS cruft, editor dirs, .env, node_modules.
```

No `package.json`, no build step, no dependencies — `index.html` opens by
double-clicking, and Cloudflare Pages publishes the directory as-is.

**On `main.js`:** the site works fully with JavaScript disabled. The nav
scrolls via plain anchor links; `main.js` only adds the small-screen menu
toggle and the "you are here" nav highlight. If you'd rather have zero JS,
say so — I'll drop the toggle and let the nav wrap on mobile.

**On `og-image.png`:** a real 1200×630 PNG, generated at build time from
your name and positioning line. I have Pillow available and have confirmed
it works here, so this will be an actual file, not a placeholder path.

---

## `<head>` metadata

```html
<title>Tomer Berger — Backend, AI Systems & Security</title>
<meta name="description" content="Final-year Computer Science &amp;
  Mathematics student building backend systems, AI integrations and
  security tooling. OpenRTB validator, multimodal sizing app, offensive
  security coursework.">
```

Plus: `og:type`, `og:title`, `og:description`, `og:image` (absolute URL),
`og:image:alt`, `og:url`, `og:site_name`; `twitter:card=summary_large_image`
with matching title, description and image; `theme-color`; canonical link;
`favicon.svg` + `favicon.ico`.

The `og:url` and `og:image` need an absolute URL, which means I need your
final domain. I'll write them against `https://tomerberger.pages.dev` and
flag the exact two lines to change if you attach a custom domain — that's
in the README too.

---

## Accessibility and responsiveness

Your requirements, and how each is met:

- **Semantic HTML** — `<header>`, `<nav>`, `<main>`, six `<section>`
  elements each labelled by its own heading, `<article>` per project,
  `<footer>`. No `<div>` doing a landmark's job.
- **Heading hierarchy** — one `<h1>` (your name). Each section opens with
  an `<h2>`. Project titles are `<h3>`, their subtitles `<h4>`. No level
  skipped.
- **Alt text on every image** — the design uses no photographs or
  screenshots, so the only images are the favicon and the OG card, neither
  of which appears in the document body. If you want project screenshots,
  tell me and I'll add them with real alt text describing what's shown.
- **Keyboard** — every link and button is a real `<a>` or `<button>`. A
  visible `:focus-visible` ring, 2px, in the accent colour. A "Skip to
  content" link as the first focusable element.
- **WCAG AA contrast** — I'll compute every foreground/background pair
  with a script before shipping and put the ratios in a comment at the top
  of `style.css`. Target: ≥4.5:1 for body text, ≥3:1 for large text and
  UI borders. Nothing ships unverified.
- **360px** — fluid single column, `clamp()` type, no fixed widths. The
  long strings that break narrow layouts (`tomer.berger08@gmail.com`,
  `stripTypeScriptTypes`, `X-Content-Type-Options`) get explicit wrapping.
  I'll check 360, 390, 768, 1024 and 1440.
- **Reduced motion** — the only motion is `scroll-behavior: smooth` and
  short colour transitions, both disabled under
  `prefers-reduced-motion: reduce`.

## Design

Dark, restrained, no animation libraries.

- **Palette** — near-black background `#0d1117`, raised surface `#161b22`,
  border `#30363d`, primary text `#e6edf3`, muted text `#8b949e`, one
  accent (`#79c0ff`) for links, focus rings and section markers. One
  accent, used consistently — no gradients, no glow.
- **Type** — system font stack (`-apple-system, Segoe UI, Roboto, …`) and
  a monospace stack for code, file paths and check names. No web fonts:
  nothing to download, nothing external to request, and it matches the
  "zero dependencies" story the auditor is telling.
- **Layout** — one column, `max-width: 68ch` for prose. Projects are
  bordered cards. Skills are definition lists, not pill clouds.
- **Motion** — colour transitions on hover/focus only. No scroll
  animation, no fade-in, no libraries.

---

## Build verification

Run in headless Chromium against the finished files, not assumed:

- **Contrast** — every rendered text node measured against its real
  computed background: **zero WCAG AA failures**. Ratios documented at the
  top of `style.css`.
- **Keyboard** — 17 interactive elements, all Tab-reachable, all with a
  visible focus ring; "Skip to content" is the first stop; Escape closes
  the mobile menu and returns focus to the toggle.
- **Responsive** — no horizontal overflow at 360, 390, 768, 1024, 1440px.
- **Structure** — one `<h1>`, no skipped heading levels, all
  `aria-labelledby` / `aria-controls` targets resolving, no duplicate ids,
  no unclosed tags.
- **No JavaScript** — nav visible and fully usable; the toggle hides
  itself.
- **`file://`** — asset paths are relative, so double-clicking
  `index.html` loads styles, script and favicon with no failed requests.
- **Console** — no errors, no failed requests at any width.
