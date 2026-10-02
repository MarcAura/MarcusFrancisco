// =============================================
// Music page — Repertoire filters (progressive enhancement)
// The catalog is plain HTML grouped by ensemble; without JS everything shows.
// With JS, the type buttons (rendered hidden by build_repertoire.py) are revealed
// and filter the ensemble groups by data-type.
// =============================================
document.addEventListener('DOMContentLoaded', function () {
    const bar = document.querySelector('.repertoire-filters');
    if (!bar) return;
    const buttons = bar.querySelectorAll('.repertoire-filter');
    const groups = document.querySelectorAll('.repertoire-group');

    bar.hidden = false;
    buttons.forEach(function (button) {
        button.addEventListener('click', function () {
            const filter = button.dataset.filter;
            buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b === button)); });
            groups.forEach(function (g) { g.hidden = filter !== 'all' && g.dataset.type !== filter; });
        });
    });
});
