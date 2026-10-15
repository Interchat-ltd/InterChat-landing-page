"""Build the website's legal and help pages from the Markdown in legal-src/.

Run from the repo root:  python3 legal-src/build.py
Needs:  pip install markdown

Each page reuses the site's header, footer and privacy.css look, so edit the
Markdown, re-run this script, and commit the .html files it writes.
"""
import html
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
    ("support.md", "help.html", "Help & Support", "Answers to common questions and how to contact InterChat.", False),
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
                        <img src="assets/img/InterChat.png" alt="InterChat" class="footer__logo">
                    </div>

                    <nav class="footer__nav" aria-label="Footer">
                        <a href="/index.html" class="footer__nav-link">Home</a>
                        <a href="/features.html" class="footer__nav-link">Features</a>
                        <a href="/index.html#about" class="footer__nav-link">About</a>
                        <a href="/help.html" class="footer__nav-link">Help</a>
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
                    <img src="assets/img/Footer-logo-blur.png" class="footer__watermark-img" alt="">
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


FOOTER_NAV = FOOTER_HTML[FOOTER_HTML.index("<nav class=\"footer__nav\""):FOOTER_HTML.index("</nav>") + len("</nav>")]


def update_footers():
    """Use the same footer links on every page of the site (only the link list changes)."""
    for f in ROOT.glob("*.html"):
        page = f.read_text(encoding="utf-8")
        new = re.sub(r"<nav class=\"footer__nav\".*?</nav>", lambda _: FOOTER_NAV, page, count=1, flags=re.S)
        if new != page:
            f.write_text(new, encoding="utf-8")
            print("footer links:", f.name)


if __name__ == "__main__":
    for p in PAGES:
        build_page(*p)
    build_delete_info()
    update_footers()
