"""Build the website's legal and help pages from the Markdown in legal-src/.

Run from the repo root:  python3 legal-src/build.py
Needs:  pip install markdown

Each page reuses the site's header, footer and privacy.css look, so edit the
Markdown, re-run this script, and commit the .html files it writes.
"""
import html
import json
import re
from pathlib import Path

import markdown

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "legal-src"

PAGES = [
    # (markdown file, output html, short title, description, show table of contents)
    ("privacy.md", "privacy.html", "Privacy Policy", "How InterChat collects, uses, shares and protects your information.", True),
    ("terms.md", "terms.html", "Terms of Service", "The agreement between you and InterChat.", True),
    ("community-guidelines.md", "guidelines.html", "Community Guidelines", "How we treat each other on InterChat.", False),
    ("child-safety.md", "child-safety.html", "Child Safety Standards", "InterChat's standards against child sexual abuse and exploitation.", False),
    ("cookies.md", "cookies.html", "Cookie Policy", "How the InterChat website uses cookies.", False),
    ("copyright.md", "copyright.html", "Copyright Policy", "How to report content that infringes your rights.", False),
]

HEADER = """<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{title} | InterChat</title>
        <meta name="description" content="{description}">
        <link rel="canonical" href="https://interchathq.com/{out}">
        <meta property="og:title" content="{title} | InterChat">
        <meta property="og:description" content="{description}">
        <meta property="og:image" content="https://interchathq.com/assets/img/logomain.png">
        <link rel="shortcut icon" href="assets/img/logomain.png" type="image/x-icon">
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <link rel="stylesheet" href="/assets/css/legal.css">
    </head>

    <body>
        <!--=============== HEADER ===============-->
        <header class="header" id="header">
            <nav class="nav container">
                <a href="/index.html" class="nav__logo">
                    <img src="assets/img/Logo+text.png" class="nav__logo-img" alt="InterChat home">
                </a>

                <div class="nav__menu" id="nav-menu">
                    <ul class="nav__list">
                        <li class="nav__item"><a href="/index.html" class="nav__link">Home</a></li>
                        <li class="nav__item"><a href="/features.html" class="nav__link">Features</a></li>
                        <li class="nav__item"><a href="/about.html" class="nav__link">About</a></li>
                        <li class="nav__item"><a href="/contact.html" class="nav__link">Contact</a></li>
                    </ul>
                    <div class="nav__close" id="nav-close" aria-label="Close menu"><i class="bx bx-x"></i></div>
                </div>

                <div class="nav__btn">
                    <div class="nav__toggle" id="nav-toggle" aria-label="Open menu"><i class="bx bx-grid-alt"></i></div>
                    <a class="button nav__button" id="nav__button" href="/index.html">Download</a>
                </div>
            </nav>
        </header>

        <!--=============== MAIN (generated from legal-src/{src}: edit that file, then run legal-src/build.py) ===============-->
        <main class="main">
            <section class="privacy legal section" id="content">
                <div class="privacy__container container">
"""

FOOTER = """                </div>
            </section>
        </main>

{footer}

        <a href="#" class="scrollup" id="scroll-up" aria-label="Back to top"><i class='bx bx-up-arrow-alt'></i></a>
        <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>
        <script src="assets/js/main.js"></script>
    </body>
</html>
"""

FOOTER_HTML = """        <!--==================== FOOTER ====================-->
        <section class="footer section" id="footer">
            <div class="footer__container container">
                <div class="footer__top">
                    <div class="footer__brand">
                        <img src="/assets/img/InterChat.png" alt="InterChat" class="footer__logo">
                    </div>

                    <nav class="footer__nav" aria-label="Footer">
                        <a href="/index.html" class="footer__nav-link">Home</a>
                        <a href="/features.html" class="footer__nav-link">Features</a>
                        <a href="/about.html" class="footer__nav-link">About</a>
                        <a href="/help/" class="footer__nav-link">Help</a>
                        <a href="/guidelines.html" class="footer__nav-link">Guidelines</a>
                        <a href="/privacy.html" class="footer__nav-link">Privacy</a>
                        <a href="/terms.html" class="footer__nav-link">Terms</a>
                        <a href="/child-safety.html" class="footer__nav-link">Child safety</a>
                        <a href="/delete__user.html" class="footer__nav-link">Delete account</a>
                    </nav>

                    <div class="footer__social">
                        <p class="footer__social-text">Socials</p>
                        <a href="#" class="footer__social-link" aria-label="Facebook"><i class='bx bxl-facebook'></i></a>
                        <a href="#" class="footer__social-link" aria-label="X (Twitter)"><i class='bx bxl-twitter'></i></a>
                        <a href="#" class="footer__social-link" aria-label="Instagram"><i class='bx bxl-instagram'></i></a>
                    </div>
                </div>

                <div class="line"></div>

                <div class="footer__watermark">
                    <img src="/assets/img/Footer-logo-blur.png" class="footer__watermark-img" alt="">
                </div>

                <div class="footer__bottom">
                    <p class="footer__copy">&copy; 2026 - InterChat. All rights reserved. <a href="/cookies.html" class="footer__nav-link">Cookies</a> · <a href="/copyright.html" class="footer__nav-link">Copyright</a></p>
                    <p class="footer__credit">Designed by Jaytech</p>
                </div>
            </div>
        </section>"""


# The newer, categorised footer (index.html, about.html). Help Centre pages use
# this one; the rest of the site (FOOTER_HTML above) hasn't been switched over
# yet, so this stays a separate constant until that happens - see
# update_footers(), which skips any page already on this design.
HELP_FOOTER_HTML = """        <!--==================== FOOTER ====================-->
        <section class="footer section" id="footer">
            <div class="footer__container container grid">
                <div class="footer__top grid">
                    <div class="footer__brand">
                        <a href="/index.html" class="nav__logo">
                            <img src="/assets/img/Logo+text.png" class="nav__logo-img" alt="InterChat Logo">
                        </a>
                    </div>

                    <div class="footer__social">
                        <p class="footer__social-text">Socials</p>
                        <a href="#" class="footer__social-link" aria-label="Facebook"><i class='bx bxl-facebook'></i></a>
                        <a href="#" class="footer__social-link" aria-label="X (Twitter)"><i class='bx bxl-twitter'></i></a>
                        <a href="#" class="footer__social-link" aria-label="Instagram"><i class='bx bxl-instagram'></i></a>
                    </div>
                </div>

                <div class="line"></div>

                <div class="footer__center grid">
                    <div class="footer__info">
                        <p class="footer__description">
                            Faith feels better together. Download InterChat and join the community today.
                        </p>

                        <div class="store-buttons">
                            <a href="https://apps.apple.com" target="_blank" class="store-button">
                                <img src="/assets/img/Apple.png" alt="Download on the App Store" class="store-button-img">
                            </a>
                            <a href="https://play.google.com/store" target="_blank" class="store-button">
                                <img src="/assets/img/Google.png" alt="Get it on Google Play" class="store-button-img">
                            </a>
                        </div>
                    </div>

                    <nav class="footer__nav" aria-label="Footer">
                        <div class="footer__nav-group">
                            <p class="footer__nav-title">Explore</p>
                            <a href="/index.html" class="footer__nav-link">Home</a>
                            <a href="/features.html" class="footer__nav-link">Features</a>
                            <a href="/about.html" class="footer__nav-link">About</a>
                        </div>
                        <div class="footer__nav-group">
                            <p class="footer__nav-title">Support</p>
                            <a href="/help.html" class="footer__nav-link">Help</a>
                            <a href="/delete__user.html" class="footer__nav-link">Delete account</a>
                        </div>
                        <div class="footer__nav-group">
                            <p class="footer__nav-title">Legal</p>
                            <a href="/guidelines.html" class="footer__nav-link">Guidelines</a>
                            <a href="/privacy.html" class="footer__nav-link">Privacy</a>
                            <a href="/terms.html" class="footer__nav-link">Terms</a>
                            <a href="/child-safety.html" class="footer__nav-link">Child safety</a>
                        </div>
                    </nav>
                </div>

                <div class="footer__watermark">
                    <img src="/assets/img/Footer-logo-blur.png" class="footer__watermark-img" alt="Watermark">
                </div>

                <div class="footer__bottom">
                    <p class="footer__copy">&copy; 2026 - InterChat. All rights reserved. <a href="/cookies.html" class="footer__nav-link">Cookies</a> · <a href="/copyright.html" class="footer__nav-link">Copyright</a></p>
                    <p class="footer__credit">Designed by Jaytech</p>
                </div>
            </div>
        </section>"""


def slug(text):
    text = re.sub(r"<[^>]+>", "", text)
    text = html.unescape(text).lower()
    text = re.sub(r"^\d+\.\s*", "", text)
    return re.sub(r"[^a-z0-9]+", "-", text).strip("-")


def style(body):
    """Give Markdown's plain HTML the site's classes."""
    body = re.sub(r"<p>", '<p class="privacy__text">', body)
    body = re.sub(r"<ul>", '<ul class="privacy__list">', body)
    body = re.sub(r"<ol>", '<ol class="legal__olist">', body)
    body = re.sub(r"<blockquote>", '<blockquote class="privacy__contact">', body)
    body = re.sub(r"<table>", '<div class="legal__table"><table>', body)
    body = body.replace("</table>", "</table></div>")
    body = re.sub(r"<h3>", '<h3 class="legal__h3">', body)
    # Plain-text email addresses become mailto links
    body = re.sub(
        r"(?<![\w@:/\"'>])([a-z0-9._-]+@interchathq\.com)",
        r'<a href="mailto:\1">\1</a>',
        body,
    )
    return body


def sections(body):
    """Wrap each h2 and what follows it in a privacy__section block, with ids."""
    toc = []
    parts = re.split(r"(<h2>.*?</h2>)", body)
    out = ['<div class="privacy__content grid">']
    intro = parts[0].strip()
    if intro:
        out.append(f'<div class="privacy__section">{intro}</div>')
    for i in range(1, len(parts), 2):
        heading = re.sub(r"</?h2>", "", parts[i])
        hid = slug(heading)
        toc.append((hid, re.sub(r"<[^>]+>", "", heading)))
        out.append(
            f'<div class="privacy__section" id="{hid}">'
            f'<h2 class="privacy__subtitle">{heading}</h2>{parts[i + 1].strip()}</div>'
        )
    out.append("</div>")
    return "\n".join(out), toc


LIST_ITEM = re.compile(r"^\s*([-*]|\d+\.)\s")


def fix_lists(md_text):
    """Python-Markdown needs a blank line before a list; GitHub doesn't. Add it."""
    out = []
    for line in md_text.split("\n"):
        if out and LIST_ITEM.match(line) and out[-1].strip() and not LIST_ITEM.match(out[-1]) and not out[-1].startswith(("  ", "|", ">")):
            out.append("")
        out.append(line)
    return "\n".join(out)


def render(md_text, with_toc):
    md_text = fix_lists(md_text.strip())
    m = re.match(r"#\s+(.+)\n", md_text)
    h1 = m.group(1).strip() if m else ""
    md_text = md_text[m.end():] if m else md_text
    eff = re.search(r"\*\*Effective date:\*\*\s*(.+)", md_text)
    date = eff.group(1).strip() if eff else ""
    md_text = re.sub(r"\*\*Effective date:\*\*.*\n", "", md_text)
    body = markdown.markdown(md_text, extensions=["tables", "sane_lists"])
    body = re.sub(r"<hr\s*/?>", "", body)
    body, toc = sections(style(body))
    head = '<div class="privacy__header grid">'
    if date:
        head += f'<p class="privacy__date">Last updated {html.escape(date)}</p>'
    head += f'<h1 class="privacy__title">{html.escape(h1)}</h1></div>'
    toc_html = ""
    if with_toc and len(toc) > 4:
        items = "".join(f'<li><a href="#{i}">{html.escape(t)}</a></li>' for i, t in toc)
        toc_html = f'<nav class="legal__toc" aria-label="On this page"><p>On this page</p><ul>{items}</ul></nav>'
    return head + toc_html + body


def build_page(src, out, title, description, with_toc):
    text = (SRC / src).read_text(encoding="utf-8")
    page = HEADER.format(title=title, description=description, out=out, src=src)
    page += render(text, with_toc) + "\n"
    page += FOOTER.format(footer=FOOTER_HTML)
    (ROOT / out).write_text(page, encoding="utf-8")
    print("wrote", out)


def build_delete_info():
    """Fill the info block under the form on delete__user.html."""
    text = (SRC / "delete-account.md").read_text(encoding="utf-8")
    text = fix_lists(re.sub(r"^#.*\n", "", text.strip()))
    block, _ = sections(style(markdown.markdown(text, extensions=["tables", "sane_lists"])))
    page_path = ROOT / "delete__user.html"
    page = page_path.read_text(encoding="utf-8")
    start, end = "<!-- DELETE-INFO-BOTTOM:START -->", "<!-- DELETE-INFO-BOTTOM:END -->"
    if start not in page:
        raise SystemExit(f"delete__user.html is missing the {start} marker")
    page = re.sub(re.escape(start) + r".*?" + re.escape(end),
                  lambda _: f'{start}\n<div class="legal delete-info">{block}</div>\n{end}', page, flags=re.S)
    page_path.write_text(page, encoding="utf-8")
    print("updated delete__user.html")


#
# =============== HELP CENTRE ===============
# Builds /help/ (the hub), /help/<category>/ and /help/<category>/<slug>/ from
# the Markdown in legal-src/help/<category>/. Edit the Markdown, then run this
# script. See README.md for the front matter format and how to add an article.
#
HELP_SRC = SRC / "help"
HELP_ROOT = ROOT / "help"
SITE_URL = "https://interchathq.com"
HELP_UPDATED = "15 October 2026"  # shown as "Last updated" on every article

CONTACT_CARD_HTML = """<div class="help-contact-card">
    <h2 class="help-contact-card__title">Still need help?</h2>
    <p class="help-contact-card__text">Our team replies within 2 working days.</p>
    <div class="help-contact-card__options">
        <span>App, account or Plus: <a href="mailto:support@interchathq.com">support@interchathq.com</a></span>
        <span>Urgent safety concern: <a href="mailto:safety@interchathq.com">safety@interchathq.com</a></span>
    </div>
    <a class="button" href="/contact.html">Contact support</a>
</div>"""


def parse_front_matter(text):
    """A small, forgiving front-matter parser: --- key: value --- pairs, then the body."""
    m = re.match(r"^---\s*\n(.*?\n)---\s*\n?(.*)$", text.strip() + "\n", re.S)
    if not m:
        raise SystemExit("Missing --- front matter")
    meta = {}
    for line in m.group(1).split("\n"):
        line = line.strip()
        if not line or ":" not in line:
            continue
        key, _, value = line.partition(":")
        key, value = key.strip(), value.strip()
        if len(value) >= 2 and value[0] == value[-1] == '"':
            value = value[1:-1]
        meta[key] = value
    return meta, m.group(2).strip()


def load_help_content():
    """Read every category and article from legal-src/help/."""
    categories = []
    for cat_dir in sorted(p for p in HELP_SRC.iterdir() if p.is_dir()):
        cat_file = cat_dir / "_category.md"
        if not cat_file.exists():
            continue
        cmeta, _ = parse_front_matter(cat_file.read_text(encoding="utf-8"))
        articles = []
        for art_file in sorted(cat_dir.glob("*.md")):
            if art_file.name == "_category.md":
                continue
            ameta, abody = parse_front_matter(art_file.read_text(encoding="utf-8"))
            for required in ("title", "summary", "order"):
                if required not in ameta:
                    raise SystemExit(f"{art_file}: missing '{required}' in front matter")
            articles.append({
                "slug": art_file.stem,
                "title": ameta["title"],
                "summary": ameta["summary"],
                "keywords": [k.strip() for k in ameta.get("keywords", "").split(",") if k.strip()],
                "order": int(ameta["order"]),
                "popular": int(ameta["popular"]) if ameta.get("popular") else None,
                "body_md": abody,
            })
        articles.sort(key=lambda a: a["order"])
        categories.append({
            "slug": cat_dir.name,
            "title": cmeta["title"],
            "description": cmeta["description"],
            "icon": cmeta["icon"],
            "order": int(cmeta.get("order", 0)),
            "articles": articles,
        })
    categories.sort(key=lambda c: c["order"])
    return categories


def help_url(cat_slug, art_slug=None):
    return f"/help/{cat_slug}/" if art_slug is None else f"/help/{cat_slug}/{art_slug}/"


def render_help_body(md_text):
    body = markdown.markdown(md_text, extensions=["tables", "sane_lists"])
    return style(body)


def plain_text(body_html, limit=300):
    text = html.unescape(re.sub(r"<[^>]+>", " ", body_html))
    text = re.sub(r"\s+", " ", text).strip()
    return text[:limit]


def breadcrumb_html(items):
    """items: list of (label, href). The last item has href=None (current page)."""
    parts = []
    for i, (label, href) in enumerate(items):
        if i:
            parts.append('<span aria-hidden="true"> &rsaquo; </span>')
        if href:
            parts.append(f'<a href="{href}">{html.escape(label)}</a>')
        else:
            parts.append(f'<span aria-current="page">{html.escape(label)}</span>')
    return f'<nav class="help-breadcrumbs" aria-label="Breadcrumb">{"".join(parts)}</nav>'


def help_head(title, description, path, extra_head=""):
    return f"""<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>{html.escape(title)}</title>
        <meta name="description" content="{html.escape(description)}">
        <link rel="canonical" href="{SITE_URL}{path}">
        <meta property="og:title" content="{html.escape(title)}">
        <meta property="og:description" content="{html.escape(description)}">
        <meta property="og:type" content="website">
        <meta property="og:url" content="{SITE_URL}{path}">
        <meta property="og:image" content="{SITE_URL}/assets/img/logomain.png">
        <link rel="shortcut icon" href="/assets/img/logomain.png" type="image/x-icon">
        <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
        <link rel="stylesheet" href="/assets/css/help.css">
{extra_head}    </head>

    <body>
        <!--=============== HEADER (generated: edit legal-src/build.py's help_head, then re-run it) ===============-->
        <header class="header" id="header">
            <nav class="nav container">
                <a href="/index.html" class="nav__logo">
                    <img src="/assets/img/Logo+text.png" class="nav__logo-img" alt="InterChat home">
                </a>

                <div class="nav__menu" id="nav-menu">
                    <ul class="nav__list">
                        <li class="nav__item"><a href="/index.html" class="nav__link">Home</a></li>
                        <li class="nav__item"><a href="/features.html" class="nav__link">Features</a></li>
                        <li class="nav__item"><a href="/about.html" class="nav__link">About</a></li>
                        <li class="nav__item"><a href="/contact.html" class="nav__link">Contact</a></li>
                    </ul>
                    <div class="nav__close" id="nav-close" aria-label="Close menu"><i class="bx bx-x"></i></div>
                </div>

                <div class="nav__btn">
                    <div class="nav__toggle" id="nav-toggle" aria-label="Open menu"><i class="bx bx-grid-alt"></i></div>
                    <a class="button nav__button" id="nav__button" href="/index.html">Download</a>
                </div>
            </nav>
        </header>

        <main class="main">
"""


def help_foot():
    return f"""        </main>

{HELP_FOOTER_HTML}

        <!--=============== LOADING SPINNER ===============-->
        <div id="loading-spinner" class="loading-spinner">
            <div class="spinner"></div>
        </div>

        <a href="#" class="scrollup" id="scroll-up" aria-label="Back to top"><i class='bx bx-up-arrow-alt'></i></a>

        <!--=============== SCROLLREVEAL ===============-->
        <script src="https://unpkg.com/scrollreveal@4.0.0/dist/scrollreveal.min.js"></script>

        <!--=============== SWIPER JS ===============-->
        <script src="https://cdn.jsdelivr.net/npm/swiper@12/swiper-bundle.min.js"></script>

        <!--=============== MAIN JS ===============-->
        <script src="/assets/js/main.js"></script>
        <script src="/assets/js/help-search.js"></script>
    </body>
</html>
"""


def search_box_html(compact=False):
    extra_class = " help-search--compact" if compact else ""
    label = "Search Help" if compact else "Search for an answer"
    return f"""<div class="help-search{extra_class}">
    <label class="help-search__label" for="help-search-input">{label}</label>
    <div class="help-search__box">
        <i class='bx bx-search help-search__icon' aria-hidden="true"></i>
        <input type="search" id="help-search-input" class="help-search__input" placeholder="e.g. forgot password, delete account, Prayer Room" autocomplete="off">
    </div>
    <div class="help-search__results" role="listbox"></div>
    <p class="help-search__status" role="status" aria-live="polite"></p>
</div>"""


def build_help_hub(categories):
    popular = sorted(
        (a for cat in categories for a in cat["articles"] if a["popular"]),
        key=lambda a: a["popular"],
    )[:8]

    category_cards = "\n".join(f"""            <a class="help-category-card" href="{help_url(cat['slug'])}">
                <div class="help-category-card__icon"><i class='bx {cat['icon']}'></i></div>
                <h3 class="help-category-card__title">{html.escape(cat['title'])}</h3>
                <p class="help-category-card__description">{html.escape(cat['description'])}</p>
                <span class="help-category-card__count">{len(cat['articles'])} article{'s' if len(cat['articles']) != 1 else ''}</span>
            </a>""" for cat in categories)

    popular_cards = "\n".join(f"""            <a class="help-popular-card" href="{help_url(cat_slug_for(a, categories), a['slug'])}">
                <span class="help-popular-card__title"><i class='bx bx-chevron-right'></i> {html.escape(a['title'])}</span>
                <span class="help-popular-card__summary">{html.escape(a['summary'])}</span>
            </a>""" for a in popular)

    body = f"""            <section class="help section" id="content">
                <div class="privacy__container container">
                    <div class="help-hero">
                        <h1 class="help-hero__title">How can we help?</h1>
                        <p class="help-hero__subtitle">Search for an answer, or browse by topic below.</p>
                        {search_box_html()}
                    </div>

                    <div class="help-category-grid">
{category_cards}
                    </div>

                    <h2 class="help-section-title" id="popular-questions">Popular questions</h2>
                    <div class="help-popular-grid">
{popular_cards}
                    </div>

                    {CONTACT_CARD_HTML}
                </div>
            </section>
"""
    title = "Help Centre | InterChat"
    description = "Search InterChat's Help Centre or browse answers by topic: getting started, your account, chats, communities, Prayer Rooms and more."
    page = help_head(title, description, "/help.html") + body + help_foot()
    (ROOT / "help.html").write_text(page, encoding="utf-8")
    print("wrote help.html (Help Centre home)")


def cat_slug_for(article, categories):
    for cat in categories:
        if article in cat["articles"]:
            return cat["slug"]
    return ""


def build_help_category(cat):
    crumbs = breadcrumb_html([("Help", "/help.html"), (cat["title"], None)])
    items = "\n".join(f"""                        <li class="help-article-item">
                            <a href="{help_url(cat['slug'], a['slug'])}">
                                <span class="help-article-item__title">{html.escape(a['title'])}</span>
                                <span class="help-article-item__summary">{html.escape(a['summary'])}</span>
                            </a>
                        </li>""" for a in cat["articles"])

    faq_entities = ",\n".join(f"""        {{
            "@type": "Question",
            "name": {json.dumps(a['title'])},
            "acceptedAnswer": {{"@type": "Answer", "text": {json.dumps(a['summary'])}}}
        }}""" for a in cat["articles"])
    json_ld = f"""        <script type="application/ld+json">
{{
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
{faq_entities}
    ]
}}
        </script>
"""

    body = f"""            <section class="help section" id="content">
                <div class="privacy__container container">
                    {crumbs}
                    {search_box_html(compact=True)}
                    <h1 class="privacy__title">{html.escape(cat['title'])}</h1>
                    <p class="privacy__text">{html.escape(cat['description'])}</p>

                    <ul class="help-article-list">
{items}
                    </ul>

                    {CONTACT_CARD_HTML}
                </div>
            </section>
"""
    title = f"{cat['title']} | InterChat Help"
    page = help_head(title, cat["description"], help_url(cat["slug"]), extra_head=json_ld) + body + help_foot()
    out_dir = HELP_ROOT / cat["slug"]
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(page, encoding="utf-8")
    print("wrote", f"help/{cat['slug']}/index.html")


def build_help_article(cat, categories, index):
    articles = cat["articles"]
    article = articles[index]
    prev_article = articles[index - 1] if index > 0 else None
    next_article = articles[index + 1] if index < len(articles) - 1 else None

    related = [a for a in articles if a is not article][:3]

    crumbs = breadcrumb_html([("Help", "/help.html"), (cat["title"], help_url(cat["slug"])), (article["title"], None)])
    body_html = render_help_body(article["body_md"])

    related_html = ""
    if related:
        related_items = "\n".join(
            f'<li><a href="{help_url(cat["slug"], a["slug"])}">{html.escape(a["title"])}</a></li>'
            for a in related
        )
        related_html = f"""<div class="help-related">
                        <h2 class="help-section-title">Related articles</h2>
                        <ul class="help-related__list">
{related_items}
                        </ul>
                    </div>"""

    pager_html = '<nav class="help-pager" aria-label="Category articles">'
    if prev_article:
        pager_html += f"""<a class="help-pager__link help-pager__link--prev" href="{help_url(cat['slug'], prev_article['slug'])}">
            <span class="help-pager__label">&larr; Previous</span>
            <span class="help-pager__title">{html.escape(prev_article['title'])}</span>
        </a>"""
    if next_article:
        pager_html += f"""<a class="help-pager__link help-pager__link--next" href="{help_url(cat['slug'], next_article['slug'])}">
            <span class="help-pager__label">Next &rarr;</span>
            <span class="help-pager__title">{html.escape(next_article['title'])}</span>
        </a>"""
    pager_html += "</nav>"

    json_ld = f"""        <script type="application/ld+json">
{{
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": {json.dumps(article['title'])},
    "description": {json.dumps(article['summary'])},
    "author": {{"@type": "Organization", "name": "InterChat"}},
    "publisher": {{"@type": "Organization", "name": "InterChat"}},
    "dateModified": "2026-10-15"
}}
        </script>
"""

    body = f"""            <section class="help help-article section" id="content">
                <div class="privacy__container container">
                    {crumbs}
                    <div class="privacy__header">
                        <p class="privacy__date">Last updated {HELP_UPDATED}</p>
                        <h1 class="privacy__title">{html.escape(article['title'])}</h1>
                    </div>

                    <div class="help-article-body">
                    {body_html}
                    </div>

                    <div class="help-feedback">
                        <p class="help-feedback__question">Was this article helpful?</p>
                        <div class="help-feedback__buttons">
                            <button type="button" class="help-feedback__button">Yes</button>
                            <button type="button" class="help-feedback__button">No</button>
                        </div>
                        <p class="help-feedback__thanks" tabindex="-1" hidden>Thanks for letting us know.</p>
                    </div>

                    {CONTACT_CARD_HTML}

                    {related_html}

                    {pager_html}
                </div>
            </section>
"""
    title = f"{article['title']} | InterChat Help"
    page = help_head(title, article["summary"], help_url(cat["slug"], article["slug"]), extra_head=json_ld) + body + help_foot()
    out_dir = HELP_ROOT / cat["slug"] / article["slug"]
    out_dir.mkdir(parents=True, exist_ok=True)
    (out_dir / "index.html").write_text(page, encoding="utf-8")
    print("wrote", f"help/{cat['slug']}/{article['slug']}/index.html")


def write_help_search_index(categories):
    entries = []
    for cat in categories:
        for a in cat["articles"]:
            body_html = render_help_body(a["body_md"])
            entries.append({
                "title": a["title"],
                "summary": a["summary"],
                "keywords": a["keywords"],
                "category": cat["title"],
                "url": help_url(cat["slug"], a["slug"]),
                "text": plain_text(body_html, 300),
            })
    out = HELP_ROOT / "search-index.json"
    out.write_text(json.dumps(entries, ensure_ascii=False, indent=0), encoding="utf-8")
    print("wrote help/search-index.json", f"({len(entries)} articles)")


def write_help_redirect():
    """The Help Centre home now lives at /help.html (back at the project root,
    like every other top-level page). /help/ used to be the real hub; this
    keeps it as a small redirect stub so old links (including the one already
    in the mobile app's Settings -> Help & support) still land somewhere.
    GitHub Pages can't do a server-side redirect (no _redirects support), so
    this is a meta-refresh page rather than a true 3xx."""
    page = f"""<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="refresh" content="0; url=/help.html">
        <link rel="canonical" href="{SITE_URL}/help.html">
        <title>Help Centre | InterChat</title>
        <meta name="robots" content="noindex">
    </head>
    <body>
        <p>This page has moved. <a href="/help.html">Continue to the Help Centre</a>.</p>
    </body>
</html>
"""
    HELP_ROOT.mkdir(parents=True, exist_ok=True)
    (HELP_ROOT / "index.html").write_text(page, encoding="utf-8")
    print("wrote help/index.html (redirect to /help.html)")


SITEMAP_PAGES = [
    "/", "/index.html", "/features.html", "/contact.html", "/privacy.html",
    "/terms.html", "/guidelines.html", "/child-safety.html", "/cookies.html",
    "/copyright.html", "/delete__user.html",
]


def write_sitemap(categories):
    urls = [(p, None) for p in SITEMAP_PAGES]
    urls.append(("/about.html", "2026-10-21"))
    urls.append(("/help.html", "2026-10-23"))
    for cat in categories:
        urls.append((help_url(cat["slug"]), "2026-10-15"))
        for a in cat["articles"]:
            urls.append((help_url(cat["slug"], a["slug"]), "2026-10-15"))

    entries = []
    for path, lastmod in urls:
        entry = f"  <url>\n    <loc>{SITE_URL}{path}</loc>\n"
        if lastmod:
            entry += f"    <lastmod>{lastmod}</lastmod>\n"
        entry += "  </url>"
        entries.append(entry)

    xml = ('<?xml version="1.0" encoding="UTF-8"?>\n'
           '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
           + "\n".join(entries) + "\n</urlset>\n")
    (ROOT / "sitemap.xml").write_text(xml, encoding="utf-8")
    print("wrote sitemap.xml", f"({len(urls)} urls)")


def build_help_centre():
    categories = load_help_content()
    build_help_hub(categories)
    for cat in categories:
        build_help_category(cat)
        for i in range(len(cat["articles"])):
            build_help_article(cat, categories, i)
    write_help_search_index(categories)
    write_help_redirect()
    write_sitemap(categories)
    return categories


FOOTER_NAV = FOOTER_HTML[FOOTER_HTML.index("<nav class=\"footer__nav\""):FOOTER_HTML.index("</nav>") + len("</nav>")]


def update_footers():
    """Use the same footer links on every page of the site (only the link list changes).
    Skips any page already on the newer categorised footer (footer__nav-group) - those
    have been upgraded ahead of the rest of the site and shouldn't be downgraded back to
    FOOTER_NAV's flat list here."""
    for f in ROOT.glob("*.html"):
        page = f.read_text(encoding="utf-8")
        if "footer__nav-group" in page:
            continue
        new = re.sub(r"<nav class=\"footer__nav\".*?</nav>", lambda _: FOOTER_NAV, page, count=1, flags=re.S)
        if new != page:
            f.write_text(new, encoding="utf-8")
            print("footer links:", f.name)


if __name__ == "__main__":
    for p in PAGES:
        build_page(*p)
    build_delete_info()
    build_help_centre()
    update_footers()
