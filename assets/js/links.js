/*=============== INTERCHAT SHARED LINKS (used by 404.html) ===============*/
// Handles links the app shares:
//   https://interchathq.com/join/<code>                  community invite
//   https://interchathq.com/profile/<username or id>     someone's profile
//   https://interchathq.com/prayer-room/<groupId>?room=  a scheduled Prayer Room
//   https://interchathq.com/group/<id>, /chat/<id>, /story/<id>
//
// If InterChat is installed and the domain is verified (see .well-known/),
// the phone opens these straight in the app. This page is the fallback:
// it offers "Open in InterChat" and the store buttons.

(function () {
    'use strict';

    // ========== Settings: fill these in ==========
    const CONFIG = {
        // Android package name from app.json (expo.android.package)
        ANDROID_PACKAGE: 'com.interchathq.mobile',
        // Leave '' until the iPhone app is live; the App Store button then says "Coming soon".
        APP_STORE_URL: '',
        // The app's own URL scheme (app.json expo.scheme)
        APP_SCHEME: 'interchat',
    };

    const PLAY_URL = 'https://play.google.com/store/apps/details?id=' + encodeURIComponent(CONFIG.ANDROID_PACKAGE);

    // ========== What kind of link is this? ==========
    const ID = /^[a-f0-9]{24}$/i;              // server ids are 24 hex characters
    const KINDS = {
        join: {
            valid: (v) => /^[A-Za-z0-9_-]{4,64}$/.test(v),
            icon: '🤝',
            eyebrow: 'Community invite',
            title: "You're invited to join a community",
            text: 'Open InterChat to see the community, its members and its guidelines, then tap Join.',
            pageTitle: 'Join a community on InterChat',
        },
        profile: {
            valid: (v) => /^[A-Za-z0-9_]{3,30}$/.test(v) || ID.test(v),
            icon: '👋',
            eyebrow: 'Profile',
            title: (v) => (ID.test(v) ? 'See this profile on InterChat' : '@' + v + ' is on InterChat'),
            text: 'Open InterChat to see their profile and connect.',
            pageTitle: (v) => (ID.test(v) ? 'A profile on InterChat' : '@' + v + ' on InterChat'),
        },
        'prayer-room': {
            valid: (v) => ID.test(v),
            icon: '🙏',
            eyebrow: 'Prayer Room',
            title: "You're invited to a Prayer Room",
            text: 'Open InterChat to see when it starts, set a reminder, or join if it has begun.',
            pageTitle: 'A Prayer Room on InterChat',
        },
        group: {
            valid: (v) => ID.test(v),
            icon: '🤝',
            eyebrow: 'Community',
            title: 'See this community on InterChat',
            text: 'Open InterChat to see the community.',
            pageTitle: 'A community on InterChat',
        },
        chat: {
            valid: (v) => ID.test(v),
            icon: '💬',
            eyebrow: 'Chat',
            title: 'Open this chat in InterChat',
            text: 'This link opens a conversation in the InterChat app.',
            pageTitle: 'InterChat',
        },
        story: {
            valid: (v) => ID.test(v),
            icon: '✨',
            eyebrow: 'Story',
            title: 'See this story on InterChat',
            text: 'Stories are shared for 24 hours. Open InterChat to see it.',
            pageTitle: 'A story on InterChat',
        },
    };

    const $ = (id) => document.getElementById(id);
    const value = (x, v) => (typeof x === 'function' ? x(v) : x);

    const ua = navigator.userAgent || '';
    const isAndroid = /Android/i.test(ua);
    const isIOS = /iPhone|iPad|iPod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isPhone = isAndroid || isIOS;

    const match = window.location.pathname.match(/^\/(join|profile|prayer-room|group|chat|story)\/([^/]+)\/?$/);
    let kind = null;
    let param = '';
    if (match) {
        try { param = decodeURIComponent(match[2]); } catch (e) { param = ''; }
        if (KINDS[match[1]] && KINDS[match[1]].valid(param)) kind = match[1];
    }

    // ========== Store buttons ==========
    $('play-link').href = PLAY_URL;
    if (CONFIG.APP_STORE_URL) {
        $('ios-link').href = CONFIG.APP_STORE_URL;
    } else {
        const ios = $('ios-link');
        ios.removeAttribute('href');
        ios.setAttribute('aria-disabled', 'true');
        ios.classList.add('link__store--soon');
        ios.title = 'Coming soon to iPhone';
        ios.insertAdjacentHTML('beforeend', '<span class="link__soon">Coming soon</span>');
    }
    if (isAndroid) $('ios-link').hidden = true;
    if (isIOS && CONFIG.APP_STORE_URL) $('play-link').hidden = true;

    // ========== Not an app link: normal 404 ==========
    if (!kind) {
        document.title = 'Page not found | InterChat';
        $('icon').textContent = '🔎';
        $('eyebrow').textContent = '404';
        $('title').textContent = "We couldn't find that page";
        $('text').textContent = match
            ? 'This InterChat link looks incomplete or has expired. Ask the person who shared it to send it again.'
            : 'The page may have moved. Try the home page or Help.';
        const open = $('open-btn');
        open.textContent = 'Go to the home page';
        open.href = '/index.html';
        $('stores-title').textContent = 'Get InterChat';
        return;
    }

    // ========== App link ==========
    const k = KINDS[kind];
    const search = window.location.search || '';
    const appPath = kind + '/' + encodeURIComponent(param) + search;   // e.g. join/AbC123
    const httpsUrl = 'https://interchathq.com/' + appPath;

    document.title = value(k.pageTitle, param);
    $('icon').textContent = k.icon;
    $('eyebrow').textContent = k.eyebrow;
    $('title').textContent = value(k.title, param);            // textContent: never inject HTML from the address
    $('text').textContent = k.text;

    if (kind === 'join') {
        $('code-value').textContent = param;
        $('code-box').hidden = false;
        $('copy-btn').addEventListener('click', function () {
            const done = () => {
                this.textContent = 'Copied';
                setTimeout(() => { this.textContent = 'Copy'; }, 2000);
            };
            if (navigator.clipboard) navigator.clipboard.writeText(param).then(done, () => {});
        });
    }

    // "Open in InterChat"
    const open = $('open-btn');
    if (isAndroid) {
        // Chrome opens the installed app, or the Play Store page if it isn't installed.
        open.href = 'intent://interchathq.com/' + appPath +
            '#Intent;scheme=https;package=' + CONFIG.ANDROID_PACKAGE +
            ';S.browser_fallback_url=' + encodeURIComponent(PLAY_URL) + ';end';
    } else if (isIOS) {
        open.href = CONFIG.APP_SCHEME + '://' + appPath;
    } else {
        // Computer: the app is on phones only.
        open.hidden = true;
        $('text').textContent = k.text + ' Open this link on your phone, or install InterChat first.';
    }

    // Help for people installing the app now
    let hint = 'After installing, come back and tap Open in InterChat.';
    if (kind === 'join') {
        hint = 'After installing, come back and tap Open in InterChat, or in the app go to Communities → Join with a link and paste the invite code.';
    }
    if (!isPhone) hint = 'InterChat is a phone app for Android' + (CONFIG.APP_STORE_URL ? ' and iPhone.' : '. iPhone is coming soon.');
    $('hint').textContent = hint;

    // Let the person copy the full link on a computer
    if (!isPhone) {
        const actions = $('actions');
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'link__button';
        btn.textContent = 'Copy link';
        btn.addEventListener('click', () => {
            if (navigator.clipboard) navigator.clipboard.writeText(httpsUrl).then(() => { btn.textContent = 'Link copied'; }, () => {});
        });
        actions.appendChild(btn);
    }
})();
