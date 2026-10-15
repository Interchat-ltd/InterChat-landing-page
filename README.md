# InterChat website (interchathq.com)

Plain HTML, CSS and JavaScript, published with GitHub Pages. This file isn't published (see `_config.yml`).

## Pages

| Page | File | Notes |
| --- | --- | --- |
| Home, Features, Contact | `index.html`, `features.html`, `contact.html` | Hand-written |
| Privacy Policy | `privacy.html` | Generated from `legal-src/privacy.md` |
| Terms of Service | `terms.html` | Generated from `legal-src/terms.md` |
| Community Guidelines | `guidelines.html` | Generated from `legal-src/community-guidelines.md` |
| Child Safety Standards | `child-safety.html` | Generated; required by Google Play for social apps |
| Help & Support | `help.html` | Generated from `legal-src/support.md` |
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
   - https://interchathq.com/join/test123 shows the invite page (not GitHub's 404).
   - https://interchathq.com/.well-known/assetlinks.json shows the JSON (needs `_config.yml`, which publishes the `.well-known` folder).

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
