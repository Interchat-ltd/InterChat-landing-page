# InterChat website (interchathq.com)

Plain HTML, CSS and JavaScript, published with GitHub Pages. This file isn't published (see `_config.yml`).

## Pages

| Page | File | Notes |
| --- | --- | --- |
| Home, Features, Contact | `index.html`, `features.html`, `contact.html` | Hand-written |
| About | `about.html` | Hand-written. Photos in `assets/img/about/`, credited in `assets/img/about/CREDITS.md` — see "The About page" below |
| Privacy Policy | `privacy.html` | Generated from `legal-src/privacy.md` |
| Terms of Service | `terms.html` | Generated from `legal-src/terms.md` |
| Community Guidelines | `guidelines.html` | Generated from `legal-src/community-guidelines.md` |
| Child Safety Standards | `child-safety.html` | Generated; required by Google Play for social apps |
| Help Centre | `help.html` (home) + `help/` (one folder per category and article) | Generated from `legal-src/help/**`; see "The Help Centre" below. `help/index.html` is now just a redirect to `/help.html` |
| Cookie Policy | `cookies.html` | Generated |
| Copyright Policy | `copyright.html` | Generated |
| Delete account | `delete__user.html` | Hand-written form (`assets/js/delete-user.js`); the information under the form is generated from `legal-src/delete-account.md` |
| Shared app links | `404.html` + `assets/js/links.js` | `/join/<code>`, `/profile/<username>`, `/prayer-room/<id>`… (see below) |
| App link verification | `.well-known/assetlinks.json`, `.well-known/apple-app-site-association` | Fill in the app's ids (see below) |

## Editing the legal and help pages

1. Edit the Markdown in `legal-src/`.
2. Run `pip install markdown` once, then `python3 legal-src/build.py` from the repo root.
3. Commit the Markdown and the `.html` files the script wrote.

The script also keeps the footer links the same on every page. Don't edit the generated `.html` files by hand: the next build overwrites them.

## The Help Centre

The Help Centre is a searchable set of short articles, grouped into categories. Its home page is `/help.html`, back at the repo root like every other top-level page (`index.html`, `features.html`, `about.html`); categories and articles still live under real folders at `/help/<category>/` and `/help/<category>/<article>/`, since those need the clean-URL trick (see below) but the single hub page doesn't. It's built from `legal-src/help/<category>/*.md` by `build_help_centre()` in `legal-src/build.py` (run as part of the normal `python3 legal-src/build.py`).

**Why it isn't built the way an issue or ticket for this might describe:** this site is plain GitHub Pages (see the top of this file), not Cloudflare Pages — there's no `functions/` directory, no `_redirects` file and no KV store here, and none should be added, since GitHub Pages can't run any of them. Clean URLs for categories and articles come from real folders instead (`/help/account/index.html` is served at `/help/account/` automatically), and `/help/index.html` is a small HTML page that redirects to `/help.html` (GitHub Pages has no server-side redirect, so this is the same pattern `404.html` already uses for links the server can't route, and the same pattern `/help.html` itself used to use in the other direction before the hub moved back to the root). If InterChat's hosting ever actually moves to Cloudflare Pages, this section (and the "Was this helpful?" widget below) could use the real thing instead.

### Adding or editing an article

1. Find the category folder under `legal-src/help/` (see the list below), or create one.
2. Create `<slug>.md` with front matter, then the article in Markdown:

   ```markdown
   ---
   title: Forgot my password
   summary: Reset it from the sign-in screen with a code we email you.
   keywords: forgot password, reset password, can't sign in
   order: 2
   popular: 4
   ---

   Article text here. **Bold**, links, and numbered steps all work normally.
   ```

   - `title`, `summary` and `order` are required. `order` controls where the article sits within its category (and its position in the Previous/Next pager).
   - `keywords` is a comma-separated list, used by search alongside the title and body text.
   - `popular` is optional — only set it on the small number of articles (currently 8) that should appear in "Popular questions" on the hub. It's a number controlling their order there; leave it out otherwise.
   - If a title needs a colon in it, wrap the whole value in double quotes: `title: "For hosts: managing a Prayer Room"`.
3. Run `python3 legal-src/build.py`.
4. Commit the Markdown and everything it wrote under `help/`.

A category needs a `_category.md` alongside its articles:

```markdown
---
title: Prayer Rooms
description: Live voice gatherings where your community prays together.
icon: bx-microphone
order: 5
---
```

`icon` is a [Boxicons](https://boxicons.com/) name without the `bx` prefix (the template adds it). `order` controls where the category sits on the hub and in the footer-adjacent navigation; the current categories, in order, are:

1. Getting started
2. Account & sign-in
3. Chats & messages
4. Communities
5. Prayer Rooms
6. Prayer, streaks & Bible
7. Stories
8. Calls
9. Notifications
10. Privacy & safety
11. InterChat Plus
12. Troubleshooting

**Never describe a feature, button label or screen you can't confirm from this repo** (the other files in `legal-src/`, `features.html`, this README) or from the mobile app repo's `docs/WORK_LOG.md` if you have it open. If you're not sure, leave the article out and add it to the TODO list below instead — don't guess at wording.

### How search works

`build_help_centre()` also writes `help/search-index.json` (title, summary, keywords, category and the article's first 300 characters of plain text). `assets/js/help-search.js` fetches it once and matches, client-side, by normalising case and accents and checking whether each typed word is the **start** of a word in the title, keywords or text — so "verif" finds "verification" and "PASSWORD" finds "password", which is what this project means by typo tolerance. It isn't a fuzzy/edit-distance matcher (a genuine misspelling like "passwrd" won't match "password") — that's a reasonable amount of cleverness for a static site; a real fuzzy search would need a library and a build step heavier than this site otherwise has.

The category grid, every article, and all navigation are plain links in the HTML, so the Help Centre works fully with JavaScript off. Only the live search box and the "Was this helpful?" buttons need it.

### "Was this helpful?"

Each article ends with Yes/No buttons (`assets/js/help-search.js`). They're client-side only — clicking one just shows a thank-you message in that visitor's browser. Nothing is sent anywhere or stored: there's no Cloudflare Worker/KV here to store it anonymously the way a ticket for this might ask for, and adding a third-party analytics widget for two buttons isn't worth the privacy trade-off. If this site ever moves to a platform with a backend, wiring these buttons to a small endpoint (slug + yes/no, no IP, no cookies) would be a reasonable follow-up.

### TODO: questions left out for now

These were asked for, but nothing in this repo (or the mobile app's `docs/WORK_LOG.md`, when available) confirms the exact feature, button label or screen text, so they're left out rather than guessed. Add them once they can be confirmed:

- **Account:** changing your email, phone number or username (the settings screen and path aren't confirmed anywhere in this repo).
- **Chats:** editing a sent message; archiving a chat.
- **Communities:** QR codes for invite links (only profile-sharing QR codes are confirmed, in this README); leaving a community.
- **Prayer Rooms:** "Invite to pray" and "Amen" as specific controls (only "Raise your hand ✋" is confirmed, in `community-guidelines.md`); a named "focus mode", turn timer or quiet time (only that hosts can mute, manage turns, remove someone and end the room is confirmed); minimising a room.
- **Prayer, streaks & Bible:** highlights and notes while reading; audio playback speed and a sleep timer.
- **Calls:** adding people to an existing call; noise reduction.
- **Troubleshooting:** the exact wording of a maintenance screen ("We'll be right back") or a forced-update screen ("Time to update InterChat"); a dedicated data-saver setting (the "Using less data" article only covers what's confirmed: calls/Prayer Rooms and media use data, and Wi-Fi helps).

## The About page

`/about.html` is hand-written, not generated — edit it directly, same as `index.html` or `features.html`. It used to live at `about/index.html` (served at the clean URL `/about`, the same trick the Help Centre uses), but was moved to a flat `about.html` at the repo root to match every other top-level page's `.html` link style. Its own stylesheet is `assets/css/about.css`, which imports `styles.css`, and it shares the homepage's font-size scale: section-level headings (`about-why__title`, `about-values__title`, `about-features__title`, `about-safety__title`, `about-churches__title`, `about-cta__title`) use `--h2-font-size`, same tier as `.about__title`/`.feature__section-title`/`.banner__title` on the homepage; card- and row-level headings (`.about-feature-row__title`) use `--h3-font-size`, same tier as `.feature__title`.

### Photos

Photos live in `assets/img/about/`, downloaded from Pexels (never hot-linked — nothing on this page loads an image from pexels.com or unsplash.com at runtime). Every photo file has an entry in `assets/img/about/CREDITS.md`: file name, photographer, source page URL, site and licence. The page links to that file from a "Photos: Pexels" `<details>` element at the bottom, which also lists each photographer inline.

No `PEXELS_API_KEY`/`UNSPLASH_ACCESS_KEY` were set when these were sourced, so the candidates were found by searching Pexels directly (via its web search, not the API) and downloading each photo's full-resolution file from its public `images.pexels.com` CDN URL (the same URL Pexels' own "Free Download" button uses) — not by scraping or hot-linking. The five photos used (David Iloba, Tosin Olowoleni, Ninthgrid and Megwara Favour ×2) were shown to and approved before being committed.

**Before adding or replacing a photo**, get sign-off on the specific photo (file name and source link) first — don't commit a new photo without it being shown and approved, the same way these were.

To fetch photos programmatically next time: set `PEXELS_API_KEY` (Pexels' free API) and/or `UNSPLASH_ACCESS_KEY` (Unsplash's API) as environment variables. If you use the Unsplash API, call the photo's `download_location` endpoint when you download it, as Unsplash's API guidelines require. Process every photo before committing it: crop to the layout's shape, export AVIF + WebP + a JPEG fallback at 480/960/1600px wide, strip metadata, and keep each file under 200KB at 960px.

### App screenshots

The "What you can do on InterChat" rows use real app screenshots from `assets/img/feature_img/` (the same images `features.html` already uses), copied into `assets/img/about/screen-*` and re-exported as WebP + optimised PNG. This section reuses the homepage's own Feature section markup and CSS as-is (`.feature`, `.feature__card`, `.feature__data`, `.feature__title`, `.feature__image-container`, `.feature__image`, `.feature__img`, `.cta__action`) rather than a page-specific component, so it looks and behaves exactly like `index.html`'s Feature section — same card colours (including the dark 2nd card, which is why its row title is an `<h2>` like the homepage's, not an `<h3>` — the dark-card text-colour override in `styles.css` targets `h2`), same "Learn more" link style, and the same ScrollReveal animation (`main.js` already targets `.feature__data`/`.feature__image-container` globally, so it picks these up with no extra JS). `about.css` only adds one override, fitting the homepage's fixed 1200px desktop card into this page's narrower 1120px column.

**Screens needed** (real screenshots that don't exist yet; the rows below use the closest existing screen meanwhile):
- A live Prayer Room screen (raising a hand, taking a turn, host controls) — currently uses the guided-prayer reflection screen (`F3.png`), which is prayer-related but not the live voice room itself.
- A Bible reader screen (reading, listening, highlighting) — currently uses the Updates tab screen (`F6.png`), which only shows the "Bible" tab in the bottom navigation, not the reader itself.
- A daily goals / streak screen (a streak counter or progress view) — currently uses the home chat screen's devotion-reminder cards (`F1.png`), which are a related daily prompt but not a streak UI.

### `about.interchathq.com`

Like `help.interchathq.com`, this needs its own DNS record (for example a `CNAME` to `interchat-ltd.github.io`, same as `www`) before it will resolve — that's a change outside this repo, at whoever manages the domain's DNS (see "Publishing on GitHub Pages" below), not something a file here can do.

## Before publishing: checklist

1. **Email addresses.** The pages use `support@interchathq.com`, `privacy@interchathq.com` and `safety@interchathq.com`. Ask whoever manages the domain's email to create them (or aliases forwarding to the team inbox). Don't change the domain's MX records yourself: the backend's email uses them.
2. **Delete account API.** `assets/js/delete-user.js` now points at the production API (`https://api.interchathq.com`). The API must allow requests from `https://interchathq.com` (CORS). Test the whole flow with a test account.
3. **Ages.** The old pages said 18+. The app and the new pages say 13+ (with a parent's permission where local law requires). Keep them the same everywhere, including the store listings.
4. **Encryption.** The old privacy policy said messages are end-to-end encrypted. They aren't (the server reads messages for notification previews, search and reports), so the new policy says so. Remove "end-to-end" from the store listing and marketing too.
5. **Legal review.** Have a lawyer read the pages before launch.
6. **App links to these pages.** In the admin console's app config, set Terms, Privacy and Guidelines to `https://interchathq.com/terms.html`, `/privacy.html` and `/guidelines.html`, and the support email to `support@interchathq.com` (the app still has `interchat.app` links in places).
7. **Remove personal details from this public repo.** `INTEGRATION_SUMMARY.md` lists a personal email address as a test account. It's no longer published on the site (`_config.yml`), but it's still visible on GitHub; remove it and use a test address instead.

## Publishing on GitHub Pages

1. Repo **Settings → Pages**: Source "Deploy from a branch", branch `main`, folder `/ (root)`.
2. **Custom domain:** `interchathq.com`, then tick **Enforce HTTPS** once the certificate is ready. (GitHub adds a `CNAME` file to the repo.)
3. **DNS at Namecheap** (only these records; leave the backend's records alone):
   - `A` records for `@`: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - `CNAME` for `www`: `interchat-ltd.github.io`
4. Check after publishing:
   - https://interchathq.com/privacy.html opens.
   - https://interchathq.com/help.html opens, and https://interchathq.com/help/ redirects to it.
   - https://interchathq.com/about.html opens.
   - https://interchathq.com/join/test123 shows the invite page (not GitHub's 404).
   - https://interchathq.com/.well-known/assetlinks.json shows the JSON (needs `_config.yml`, which publishes the `.well-known` folder).

**Custom domains that need their own DNS record** beyond the root `interchathq.com` and `www` above — each is a `CNAME` to `interchat-ltd.github.io`, same as `www`, and GitHub Pages won't serve a second custom domain for the same repo without one. These are DNS changes outside this repo, so check with whoever manages the domain at Namecheap rather than expecting a file here to handle it:
- `help.interchathq.com` → the Help Centre (`/help.html`)
- `about.interchathq.com` → the About page (`/about.html`)

## Shared app links (community invites and profiles)

The app shares these links:

| Link | Shared from | Opens |
| --- | --- | --- |
| `https://interchathq.com/join/<code>` | Community info → Invite (the code comes from `GET /group/{id}/invite-link`) | The community's join screen |
| `https://interchathq.com/profile/<username>` | Profile → Share profile (and the QR code) | That person's profile |
| `https://interchathq.com/prayer-room/<groupId>?room=<id>` | Add to calendar | The Prayer Room lobby |
| `https://interchathq.com/group/<id>`, `/chat/<id>`, `/story/<id>` | Notifications and links | The community, chat or story |

**How a tap works:**
1. **App installed and the domain verified:** the phone opens the app directly. The website isn't involved.
2. **App installed but not verified yet, or opened from a browser:** the page shows **Open in InterChat**. On Android it opens the app (or Google Play if it isn't installed). On iPhone it uses `interchat://…`.
3. **App not installed:** the page explains what the link is ("You're invited to join a community", "@ada is on InterChat"), shows the store buttons, and for invites shows the code to paste into **Communities → Join with a link** after installing.
4. **Anything else that doesn't exist:** a normal "We couldn't find that page".

GitHub Pages has no page per link, so it serves `404.html`, and `assets/js/links.js` reads the address. Only safe characters are accepted (invite codes: letters, numbers, `-` and `_`; usernames: 3–30 letters, numbers or `_`; ids: 24 hex characters), and the page never inserts the address as HTML.

**Limits of a static site:**
- The page can't show the community's name or photo, because the invite preview needs the app's sign-in. If the backend adds a public preview route (name, photo, member count for a code), `links.js` can show it.
- Link previews in WhatsApp and other apps show the general "You're invited to InterChat" card, because the server answers these addresses with status 404. For previews with the community's name, the links need a small server (for example a Cloudflare Worker) that returns the right title and image.

### Fill in the app's ids

**In `assets/js/links.js`** (top of the file):
- `ANDROID_PACKAGE`: `expo.android.package` from the app's `app.json`.
- `APP_STORE_URL`: the App Store link once the iPhone app is live (until then the button says "Coming soon").

**In `.well-known/assetlinks.json`** (Android App Links):
- `package_name`: the same Android package.
- `sha256_cert_fingerprints`: both fingerprints from **Google Play Console → Test and release → App integrity → App signing**: the *app signing key* (Play installs) and the *upload key*. For APKs built and shared directly, add that keystore's SHA-256 too (`keytool -list -v -keystore <file>`, or `eas credentials` for EAS builds).

**In `.well-known/apple-app-site-association`** (iPhone Universal Links, when the iPhone app is ready):
- `appIDs`: `<Apple Team ID>.<iOS bundle id>`.
- Apple reads this file through its own CDN; check it with `https://app-site-association.cdn-apple.com/a/v1/interchathq.com` after publishing.

**Check Android verification** with a phone plugged in:
```
adb shell pm verify-app-links --re-verify <package>
adb shell pm get-app-links <package>
```
`interchathq.com` should say `verified`. If the app also lists `www.interchathq.com`, it won't verify (GitHub redirects www to the main domain), which is fine on Android 12+, where each domain is checked separately. Google's checker: `https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://interchathq.com&relation=delegate_permission/common.handle_all_urls`

### App side (prompt for Claude Code in the mobile repo)

```
Make InterChat's shared links open the app reliably. The website (interchathq.com) now serves
/.well-known/assetlinks.json and apple-app-site-association, and a fallback page for
/join/<code>, /profile/<username>, /prayer-room/<groupId>?room=<id>, /group/<id>, /chat/<id>, /story/<id>.

1. Android (app.json): one intent filter with autoVerify: true for scheme https, host interchathq.com,
   pathPrefix /join, /profile, /prayer-room, /group, /chat, /story. Keep www.interchathq.com in a
   separate filter without autoVerify (GitHub redirects www, so it can't verify).
2. iOS (app.json): ios.associatedDomains ["applinks:interchathq.com"].
3. Custom scheme: make sure deepLinks.ts also handles interchat://join/<code>,
   interchat://prayer-room/<groupId>?room=<id> and interchat://profile/<username or id>, the same way
   as the https links (the website's "Open in InterChat" button on iPhone uses them). Android's button
   uses intent://interchathq.com/<path>#Intent;scheme=https;package=<package>;... which reaches the
   https intent filter.
4. Invites: share text "Join <community name> on InterChat 🙏 https://interchathq.com/join/<code>"
   (keep the code in the text for "Join with a link"). After a cold start from a /join link, if the
   person isn't signed in, keep the code through sign-up and open the join screen afterwards.
5. Profiles: Share profile uses https://interchathq.com/profile/<username> (already, §13p); a link
   with an id (24 hex) must also work.
6. Tell me the Android package name, and print the SHA-256 fingerprints of the release and upload
   keys (eas credentials or keytool), so I can fill in .well-known/assetlinks.json on the website.
7. Test: adb shell am start -a android.intent.action.VIEW -d "https://interchathq.com/join/TESTCODE"
   (and /profile/<username>) with the app closed, in the background and signed out. Add a WORK_LOG
   section.
```

### Help Centre link (prompt for Claude Code in the mobile repo)

```
The website now has a real Help Centre at https://interchathq.com/help.html (a hub, 12 categories,
about 50 articles, with search) replacing the single old help.html page.

1. Settings → Help & support: open https://interchathq.com/help.html instead of (or in addition to)
   wherever it currently points.
2. The in-app "Contact support" helper text/screen: update any copy that references the old
   help page or an email-only flow to mention the Help Centre at https://interchathq.com/help.html.
3. Open these links in the in-app browser (not the system browser), the same way the app already
   opens other external links, so the person doesn't leave the app.
4. Check docs/WORK_LOG.md for anything this website repo should know about screens or features
   it referenced without being sure they exist (see the TODO list in this repo's README.md,
   under "The Help Centre") — if WORK_LOG.md confirms any of them, tell me so I can write those
   articles instead of leaving them out.
```
