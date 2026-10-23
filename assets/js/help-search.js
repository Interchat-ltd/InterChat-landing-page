/*=============== HELP CENTRE SEARCH ===============*/
/* Works on the hub (/help/) and on every article/category page, wherever a
   .help-search block is present. Falls back to nothing if JavaScript is off:
   the category grid and every link on these pages already works without it. */
(function () {
    'use strict';

    var MAX_RESULTS = 8;
    var indexPromise = null;

    function normalise(str) {
        return (str || '')
            .toLowerCase()
            .normalize('NFD')
            .replace(/[̀-ͯ]/g, ''); // strip accents
    }

    function tokenise(str) {
        return normalise(str).split(/[^a-z0-9]+/).filter(Boolean);
    }

    function loadIndex() {
        if (!indexPromise) {
            indexPromise = fetch('/help/search-index.json')
                .then(function (res) { return res.ok ? res.json() : []; })
                .catch(function () { return []; });
        }
        return indexPromise;
    }

    // A query token matches a document token if the document token starts
    // with it (simple, forgiving "typo tolerance": short/partial queries and
    // the start of a misspelled-at-the-end word still match).
    function scoreEntry(queryTokens, entry) {
        var titleTokens = tokenise(entry.title);
        var keywordTokens = tokenise((entry.keywords || []).join(' '));
        var textTokens = tokenise(entry.text);

        var score = 0;
        for (var i = 0; i < queryTokens.length; i++) {
            var qt = queryTokens[i];
            var hit = false;
            if (titleTokens.some(function (t) { return t.indexOf(qt) === 0; })) { score += 5; hit = true; }
            if (keywordTokens.some(function (t) { return t.indexOf(qt) === 0; })) { score += 3; hit = true; }
            if (textTokens.some(function (t) { return t.indexOf(qt) === 0; })) { score += 1; hit = true; }
            if (!hit) { return 0; } // every query word must match something
        }
        return score;
    }

    function search(entries, query) {
        var queryTokens = tokenise(query);
        if (!queryTokens.length) { return []; }
        return entries
            .map(function (entry) { return { entry: entry, score: scoreEntry(queryTokens, entry) }; })
            .filter(function (r) { return r.score > 0; })
            .sort(function (a, b) { return b.score - a.score; })
            .slice(0, MAX_RESULTS)
            .map(function (r) { return r.entry; });
    }

    function highlight(text, query) {
        var queryTokens = tokenise(query).filter(Boolean);
        if (!queryTokens.length) { return escapeHtml(text); }
        var escaped = escapeHtml(text);
        queryTokens.forEach(function (t) {
            var re = new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'ig');
            escaped = escaped.replace(re, '<mark>$1</mark>');
        });
        return escaped;
    }

    function escapeHtml(str) {
        var div = document.createElement('div');
        div.textContent = str || '';
        return div.innerHTML;
    }

    function setupSearchBox(root) {
        var input = root.querySelector('.help-search__input');
        var results = root.querySelector('.help-search__results');
        var status = root.querySelector('.help-search__status');
        if (!input || !results) { return; }

        var activeIndex = -1;
        var currentEntries = [];

        function render(query, entries) {
            currentEntries = entries;
            activeIndex = -1;

            if (!query.trim()) {
                results.innerHTML = '';
                if (status) { status.textContent = ''; }
                return;
            }

            if (!entries.length) {
                results.innerHTML =
                    '<div class="help-search__empty">' +
                    '<p>No answers for &ldquo;' + escapeHtml(query) + '&rdquo; yet.</p>' +
                    '<div class="help-search__empty-links">' +
                    '<a href="/help/#popular-questions">Popular questions</a>' +
                    '<a href="/contact.html">Contact support</a>' +
                    '</div></div>';
                if (status) { status.textContent = 'No results for ' + query; }
                return;
            }

            results.innerHTML = entries.map(function (entry, i) {
                return (
                    '<a class="help-search__result" href="' + entry.url + '" id="help-search-result-' + i + '" role="option">' +
                    '<span class="help-search__result-title">' + highlight(entry.title, query) + '</span>' +
                    '<span class="help-search__result-summary">' + escapeHtml(entry.summary) + '</span>' +
                    '<span class="help-search__result-category">' + escapeHtml(entry.category) + '</span>' +
                    '</a>'
                );
            }).join('');

            if (status) {
                status.textContent = entries.length + (entries.length === 1 ? ' result' : ' results');
            }
        }

        function setActive(index) {
            var links = results.querySelectorAll('.help-search__result');
            links.forEach(function (link) { link.classList.remove('is-active'); });
            if (index >= 0 && index < links.length) {
                links[index].classList.add('is-active');
                links[index].scrollIntoView({ block: 'nearest' });
                input.setAttribute('aria-activedescendant', links[index].id);
            } else {
                input.removeAttribute('aria-activedescendant');
            }
            activeIndex = index;
        }

        input.addEventListener('input', function () {
            var query = input.value;
            loadIndex().then(function (entries) {
                render(query, search(entries, query));
            });
        });

        input.addEventListener('keydown', function (e) {
            var links = results.querySelectorAll('.help-search__result');
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (links.length) { setActive((activeIndex + 1) % links.length); }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (links.length) { setActive((activeIndex - 1 + links.length) % links.length); }
            } else if (e.key === 'Enter') {
                if (activeIndex >= 0 && links[activeIndex]) {
                    e.preventDefault();
                    window.location.href = links[activeIndex].getAttribute('href');
                } else if (currentEntries.length === 1) {
                    window.location.href = currentEntries[0].url;
                }
            } else if (e.key === 'Escape') {
                input.value = '';
                results.innerHTML = '';
                if (status) { status.textContent = ''; }
            }
        });

        // Close results when focus leaves the search box entirely
        root.addEventListener('focusout', function () {
            window.setTimeout(function () {
                if (!root.contains(document.activeElement)) {
                    results.innerHTML = '';
                }
            }, 0);
        });
    }

    document.querySelectorAll('.help-search').forEach(setupSearchBox);

    /*=============== "WAS THIS HELPFUL?" (client-side only, no backend) ===============*/
    var feedback = document.querySelector('.help-feedback');
    if (feedback) {
        var buttons = feedback.querySelectorAll('.help-feedback__button');
        var thanks = feedback.querySelector('.help-feedback__thanks');
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.hidden = true; });
                var q = feedback.querySelector('.help-feedback__question');
                if (q) { q.hidden = true; }
                if (thanks) { thanks.hidden = false; thanks.focus(); }
            });
        });
    }
})();
