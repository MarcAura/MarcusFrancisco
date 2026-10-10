/* =============================================
   calendar.html: weekly schedule, class list and term timeline.
   Data: window.CALENDAR_TERMS (calendar-data.js).
   The page address remembers the view: #term=fall-2026&week=2026-10-05&view=week
   ============================================= */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    const TERMS = Array.isArray(window.CALENDAR_TERMS) ? window.CALENDAR_TERMS : [];
    const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const DAY_NAMES = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const BAR_COLOURS = ['#8fd19e', '#a8c4f0', '#f09a8a', '#f7c58a', '#e6a3a3', '#c3c3f2', '#f5a77f', '#b5e3a1'];
    const OPTS_KEY = 'calendar-display-options';
    const VIEW_TITLES = { week: 'Weekly Schedule', list: 'View My Classes', timeline: 'Term Timeline' };

    const $ = (id) => document.getElementById(id);
    const el = (tag, cls, text) => {
        const n = document.createElement(tag);
        if (cls) n.className = cls;
        if (text !== undefined) n.textContent = text;
        return n;
    };

    // ---------- Dates (never Date.parse: iOS Safari reads "2026-08-24" as UTC) ----------
    const pad = (n) => String(n).padStart(2, '0');
    const parseDate = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const iso = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
    const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
    const mondayOf = (d) => addDays(d, -((d.getDay() + 6) % 7));
    const today = () => { const n = new Date(); return new Date(n.getFullYear(), n.getMonth(), n.getDate()); };
    const slash = (d) => (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
    const shortDate = (d) => MONTHS[d.getMonth()] + ' ' + d.getDate();
    const toMin = (t) => { const [h, m] = t.split(':').map(Number); return h * 60 + m; };
    const clock = (min) => {
        const h = Math.floor(min / 60), m = min % 60;
        return ((h + 11) % 12 + 1) + ':' + pad(m) + (h < 12 ? 'AM' : 'PM');
    };
    const hourLabel = (h) => ((h + 11) % 12 + 1) + (h < 12 ? ' AM' : ' PM');
    // Whole days between two dates; rounding absorbs the 23/25-hour days at daylight-saving changes
    const daysBetween = (a, b) => Math.round((b - a) / 864e5);
    const inRange = (d, from, to) => (!from || d >= parseDate(from)) && (!to || d <= parseDate(to));

    // ---------- State ----------
    const state = { term: null, week: null, view: 'week', finals: false, query: '' };
    const opts = { weekend: false, title: true, room: true, start: 8, end: 22 };
    try {
        Object.assign(opts, JSON.parse(localStorage.getItem(OPTS_KEY) || '{}'));
    } catch (e) { /* private browsing or blocked storage: defaults are fine */ }
    const saveOpts = () => { try { localStorage.setItem(OPTS_KEY, JSON.stringify(opts)); } catch (e) { /* ignore */ } };

    const termById = (id) => TERMS.find((t) => t.id === id);
    const termFor = (d) => TERMS.find((t) => d >= parseDate(t.start) && d <= parseDate(t.end));
    const scheduled = (c) => Array.isArray(c.days) && c.days.length && c.start && c.end;

    function defaultWeek(term) {
        const t = today();
        if (t >= parseDate(term.start) && t <= parseDate(term.end)) return mondayOf(t);
        return mondayOf(parseDate(term.start));
    }

    function readHash() {
        const p = new URLSearchParams(location.hash.slice(1));
        const t = termById(p.get('term')) || termFor(today()) || TERMS[TERMS.length - 1];
        state.term = t;
        const w = p.get('week');
        state.week = w && /^\d{4}-\d{2}-\d{2}$/.test(w) ? mondayOf(parseDate(w)) : (t ? defaultWeek(t) : mondayOf(today()));
        state.view = VIEW_TITLES[p.get('view')] ? p.get('view') : 'week';
    }

    function writeHash() {
        if (!state.term) return;
        const h = '#term=' + state.term.id + '&week=' + iso(state.week) + '&view=' + state.view;
        if (location.hash !== h) history.replaceState(null, '', h);
    }

    // ---------- Weekly Schedule ----------
    function classesOn(day) {
        const term = state.term;
        if (!term) return [];
        const key = DAYS[(day.getDay() + 6) % 7];
        if (!inRange(day, term.start, term.end)) return [];
        if ((term.breaks || []).some((b) => inRange(day, b.start, b.end))) return [];
        const out = term.classes
            .filter((c) => scheduled(c) && c.days.includes(key) && inRange(day, c.from, c.to))
            .map((c) => ({ c, start: toMin(c.start), end: toMin(c.end), exam: false }));
        if (state.finals) {
            (term.exams || []).filter((x) => x.date === iso(day)).forEach((x) => {
                out.push({ c: x, start: toMin(x.start), end: toMin(x.end), exam: true });
            });
        }
        return out;
    }

    // Side-by-side lanes for classes that overlap in time
    function layout(items) {
        items.sort((a, b) => a.start - b.start || b.end - a.end);
        let cluster = [], clusterEnd = -1;
        const flush = () => {
            const lanes = [];
            cluster.forEach((it) => {
                let i = lanes.findIndex((end) => end <= it.start);
                if (i === -1) { i = lanes.length; lanes.push(0); }
                lanes[i] = it.end; it.lane = i;
            });
            cluster.forEach((it) => { it.lanes = lanes.length; });
            cluster = [];
        };
        items.forEach((it) => {
            if (cluster.length && it.start >= clusterEnd) flush();
            cluster.push(it); clusterEnd = Math.max(clusterEnd, it.end);
        });
        flush();
        return items;
    }

    function eventButton(it) {
        const c = it.c;
        const b = el('button', 'cal-event' + (it.exam ? ' is-exam' : ''));
        b.type = 'button';
        const lines = [
            c.code + ' - ' + c.section,
            opts.title && !it.exam ? c.title : null,
            it.exam ? 'Final Exam' : c.component,
            clock(it.start) + ' - ' + clock(it.end),
            opts.room ? c.room : null
        ].filter(Boolean);
        lines.forEach((l) => b.appendChild(el('span', '', l)));
        b.setAttribute('aria-label', lines.join(', '));
        b.addEventListener('click', () => showDetails(c, it));
        b.dataset.search = [c.code, c.section, c.title, c.topic, c.room, c.component].join(' ').toLowerCase();
        return b;
    }

    function renderWeek() {
        const grid = $('cal-grid');
        const nDays = opts.weekend ? 7 : 5;
        const startH = Math.min(opts.start, opts.end - 1), endH = Math.max(opts.end, startH + 1);
        const span = (endH - startH) * 60 + 30;   // a half-hour tail so the last hour has a label row, like the HUB
        const hourPx = parseFloat(getComputedStyle(grid).getPropertyValue('--cal-hour')) || 52;
        const week = state.week;
        const t = today();

        $('cal-week-label').textContent = 'Week of ' + slash(week) + ' - ' + slash(addDays(week, 6));
        grid.style.setProperty('--cal-days', nDays);
        grid.style.setProperty('--cal-hours', endH - startH + 0.5);
        grid.replaceChildren();

        grid.appendChild(el('div', 'cal-corner'));
        for (let i = 0; i < nDays; i++) {
            const d = addDays(week, i);
            const h = el('div', 'cal-dayhead' + (iso(d) === iso(t) ? ' is-today' : ''), DAY_NAMES[i]);
            h.appendChild(el('strong', '', shortDate(d)));
            grid.appendChild(h);
        }

        const times = el('div', 'cal-times');
        times.setAttribute('aria-hidden', 'true');
        for (let h = startH; h <= endH; h++) {
            const lab = el('span', 'cal-time', hourLabel(h));
            lab.style.top = 'calc(' + (h - startH) + ' * var(--cal-hour))';
            times.appendChild(lab);
        }
        grid.appendChild(times);

        let hidden = 0, shown = 0;
        for (let i = 0; i < nDays; i++) {
            const d = addDays(week, i);
            const col = el('div', 'cal-day');
            col.setAttribute('role', 'group');
            col.setAttribute('aria-label', DAY_NAMES[i] + ' ' + shortDate(d));
            const brk = state.term && (state.term.breaks || []).find((b) => inRange(d, b.start, b.end));
            if (brk) { col.classList.add('is-break'); col.appendChild(el('span', 'cal-break-label', brk.name)); }
            const items = layout(classesOn(d));
            items.forEach((it) => {
                const s = Math.max(it.start, startH * 60);
                if (Math.min(it.end, endH * 60) <= s) { hidden++; return; }
                const b = eventButton(it);
                // Short classes grow to fit their text (the HUB's table rows do the same), but never
                // into the next class in the same lane or past the bottom of the grid.
                const needMin = (b.childElementCount * 12.5 + 6) / hourPx * 60;
                const next = Math.min(...items.filter((o) => o !== it && o.lane === it.lane && o.start >= it.end).map((o) => o.start));
                const e = Math.min(Math.max(it.end, s + needMin), next, startH * 60 + span);
                b.style.top = (s - startH * 60) / span * 100 + '%';
                b.style.height = (e - s) / span * 100 + '%';
                b.style.left = it.lane / it.lanes * 100 + '%';
                b.style.width = 100 / it.lanes + '%';
                col.appendChild(b);
                shown++;
            });
            grid.appendChild(col);
        }

        // Notices: outside the term, finals with no data, classes outside the time range
        const notes = [];
        const term = state.term;
        if (term && (addDays(week, 6) < parseDate(term.start) || week > parseDate(term.end))) {
            notes.push('This week is outside ' + term.name + ' (' + slash(parseDate(term.start)) + ' - ' + slash(parseDate(term.end)) + ').');
        }
        if (state.finals && term && !(term.exams || []).length) notes.push('No final exams are listed for ' + term.name + ' yet.');
        if (hidden) notes.push(hidden + ' class meeting(s) fall outside the hours shown. Change the start or end time in Display Options.');
        if (!opts.weekend && term && hasWeekend(term)) notes.push('This term has weekend classes. Turn on Saturday and Sunday in Display Options.');
        const notice = $('cal-week-notice');
        notice.textContent = notes.join(' ');
        notice.hidden = !notes.length;

        // Online / no-set-time classes active this week
        const box = $('cal-unscheduled');
        box.replaceChildren();
        const unsched = term ? term.classes.filter((c) => !scheduled(c) &&
            (!c.from || addDays(week, 6) >= parseDate(c.from)) && (!c.to || week <= parseDate(c.to))) : [];
        if (unsched.length && !notes.some((n) => n.startsWith('This week is outside'))) {
            box.appendChild(el('h3', '', 'Also this week (no set meeting time)'));
            const ul = el('ul');
            unsched.forEach((c) => {
                const li = el('li', '', c.code + ' - ' + c.section + (c.title ? ' · ' + c.title : '') + ' · ' + (c.mode || 'Online'));
                ul.appendChild(li);
            });
            box.appendChild(ul);
        }
        box.hidden = !box.childElementCount;
        applySearch();
        return shown;
    }

    function hasWeekend(term) {
        return term.classes.some((c) => scheduled(c) && c.days.some((d) => d === 'Sat' || d === 'Sun'));
    }

    // ---------- View My Classes ----------
    function meetingText(c) {
        if (!scheduled(c)) return 'No set meeting time';
        return c.days.map((d) => d === 'Thu' ? 'Th' : d === 'Sat' ? 'Sa' : d === 'Sun' ? 'Su' : d[0]).join('') +
            ' ' + clock(toMin(c.start)) + ' - ' + clock(toMin(c.end));
    }

    function renderList() {
        const wrap = $('cal-list');
        wrap.replaceChildren();
        const term = state.term;
        if (!term) return;
        const table = el('table', 'cal-table');
        const cols = ['Class', 'Component', 'Days & Times', 'Room', 'Meeting Dates', 'Units', 'Mode'];
        const thead = el('thead'), hr = el('tr');
        cols.forEach((c) => { const th = el('th', '', c); th.scope = 'col'; hr.appendChild(th); });
        thead.appendChild(hr); table.appendChild(thead);
        const tbody = el('tbody');
        let units = 0;
        term.classes.forEach((c) => {
            const tr = el('tr');
            const cells = [
                [c.code + ' - ' + c.section, c.topic || c.title],
                [c.component || ''],
                [meetingText(c)],
                [c.room || (c.campus === 'Remote' ? 'Online' : ''), c.room ? c.campus : ''],
                [slash(parseDate(c.from || term.start)) + ' - ' + slash(parseDate(c.to || term.end))],
                [c.units !== undefined ? c.units.toFixed(2) : ''],
                [c.mode || '']
            ];
            cells.forEach(([main, sub], i) => {
                const td = el('td', '', main);
                td.dataset.label = cols[i];
                if (sub) td.appendChild(el('small', '', sub));
                tr.appendChild(td);
            });
            tr.dataset.search = [c.code, c.section, c.title, c.topic, c.room].join(' ').toLowerCase();
            tbody.appendChild(tr);
            units += c.units || 0;
        });
        table.appendChild(tbody);
        const tfoot = el('tfoot'), fr = el('tr'), fd = el('td', '', 'Total units: ' + units.toFixed(1));
        fd.colSpan = cols.length; fd.dataset.label = '';
        fr.appendChild(fd); tfoot.appendChild(fr); table.appendChild(tfoot);
        wrap.appendChild(table);
        applySearch();
    }

    // ---------- Term Timeline ----------
    function renderTimeline() {
        const wrap = $('cal-timeline');
        wrap.replaceChildren();
        const term = state.term;
        if (!term) return;
        const first = mondayOf(parseDate(term.start));
        const last = parseDate(term.end);
        const weeks = Math.ceil((daysBetween(first, last) + 1) / 7);
        const totalDays = weeks * 7;
        const grid = el('div', 'cal-tl');
        grid.style.setProperty('--cal-weeks', weeks);

        grid.appendChild(el('div', 'cal-tl-corner', 'Week'));
        for (let w = 0; w < weeks; w++) {
            const wk = addDays(first, w * 7);
            const b = el('button', 'cal-tl-head' + (iso(wk) === iso(state.week) ? ' is-selected' : ''), String(w + 1));
            b.type = 'button';
            b.setAttribute('aria-label', 'Week ' + (w + 1) + ': ' + slash(wk) + ' - ' + slash(addDays(wk, 6)));
            b.addEventListener('click', () => { state.week = wk; setView('week'); });
            grid.appendChild(b);
        }
        term.classes.forEach((c, i) => {
            grid.appendChild(el('div', 'cal-tl-name', c.code));
            const track = el('div', 'cal-tl-track');
            const from = parseDate(c.from || term.start), to = parseDate(c.to || term.end);
            const bar = el('div', 'cal-tl-bar');
            const colour = BAR_COLOURS[i % BAR_COLOURS.length];
            bar.style.setProperty('--bar', colour);
            bar.style.setProperty('--bar-light', colour + '66');
            bar.style.left = Math.max(0, daysBetween(first, from)) / totalDays * 100 + '%';
            bar.style.width = (daysBetween(from, to) + 1) / totalDays * 100 + '%';
            bar.title = c.code + ': ' + slash(from) + ' - ' + slash(to);
            track.appendChild(bar);
            grid.appendChild(track);
        });
        wrap.appendChild(grid);
    }

    // ---------- Details dialog ----------
    function showDetails(c, it) {
        const dlg = $('cal-dialog');
        $('cal-dialog-title').textContent = c.code + ' - ' + c.section + (it.exam ? ' · Final Exam' : '');
        const body = $('cal-dialog-body');
        body.replaceChildren();
        const rows = [
            ['Title', c.title], ['Topic', c.topic], ['Component', it.exam ? 'Final Exam' : c.component],
            ['When', it.exam ? c.date + ', ' + clock(it.start) + ' - ' + clock(it.end) : meetingText(c)],
            ['Room', c.room], ['Campus', c.campus], ['Mode', c.mode],
            ['Units', c.units !== undefined ? String(c.units) : ''],
            ['Dates', !it.exam && state.term ? slash(parseDate(c.from || state.term.start)) + ' - ' + slash(parseDate(c.to || state.term.end)) : '']
        ];
        rows.filter((r) => r[1]).forEach(([k, v]) => { body.appendChild(el('dt', '', k)); body.appendChild(el('dd', '', v)); });
        if (typeof dlg.showModal === 'function') dlg.showModal();
        else dlg.setAttribute('open', '');
    }
    $('cal-dialog').addEventListener('click', (e) => {
        if (e.target === e.currentTarget && typeof e.currentTarget.close === 'function') e.currentTarget.close();
    });

    // ---------- Search (top bar) ----------
    function applySearch() {
        const q = state.query;
        document.querySelectorAll('.cal-event, .cal-table tbody tr').forEach((n) => {
            const hit = q && n.dataset.search.includes(q);
            n.classList.toggle('is-dimmed', Boolean(q) && !hit && n.classList.contains('cal-event'));
            n.classList.toggle('is-match', Boolean(hit) && n.classList.contains('cal-event'));
            if (n.tagName === 'TR') n.hidden = Boolean(q) && !hit;
        });
    }
    $('cal-search').addEventListener('input', (e) => { state.query = e.target.value.trim().toLowerCase(); applySearch(); });

    // ---------- Views ----------
    function render() {
        Object.keys(VIEW_TITLES).forEach((v) => { $('view-' + v).hidden = v !== state.view; });
        document.querySelectorAll('.cal-nav-item').forEach((b) => {
            if (b.dataset.view === state.view) b.setAttribute('aria-current', 'page');
            else b.removeAttribute('aria-current');
        });
        $('cal-title').textContent = VIEW_TITLES[state.view];
        document.title = VIEW_TITLES[state.view] + ' | Marcus Francisco';
        if (state.term) $('cal-term').value = state.term.id;
        if (state.view === 'week') renderWeek();
        if (state.view === 'list') renderList();
        if (state.view === 'timeline') renderTimeline();
        writeHash();
    }

    function setView(v) { state.view = v; render(); }

    // ---------- Controls ----------
    TERMS.forEach((t) => { const o = el('option', '', t.name); o.value = t.id; $('cal-term').appendChild(o); });
    $('cal-term').addEventListener('change', (e) => {
        state.term = termById(e.target.value);
        state.week = defaultWeek(state.term);
        render();
    });

    $('cal-prev').addEventListener('click', () => { state.week = addDays(state.week, -7); render(); });
    $('cal-next').addEventListener('click', () => { state.week = addDays(state.week, 7); render(); });
    $('cal-today').addEventListener('click', () => {
        state.week = mondayOf(today());
        state.term = termFor(today()) || state.term;
        render();
    });
    $('cal-finals').addEventListener('click', (e) => {
        state.finals = !state.finals;
        e.currentTarget.setAttribute('aria-pressed', String(state.finals));
        e.currentTarget.textContent = state.finals ? 'Hide Final Exams' : 'Show Final Exams';
        render();
    });
    document.querySelectorAll('.cal-nav-item').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));

    // Arrow keys step weeks (not while typing or choosing)
    document.addEventListener('keydown', (e) => {
        if (state.view !== 'week' || e.altKey || e.ctrlKey || e.metaKey) return;
        if (e.target.closest('input, select, textarea, dialog')) return;
        if (e.key === 'ArrowLeft') $('cal-prev').click();
        if (e.key === 'ArrowRight') $('cal-next').click();
    });

    // Display Options
    for (let h = 5; h <= 12; h++) { const o = el('option', '', hourLabel(h)); o.value = h; $('opt-start').appendChild(o); }
    for (let h = 15; h <= 24; h++) { const o = el('option', '', h === 24 ? '12 AM' : hourLabel(h)); o.value = h; $('opt-end').appendChild(o); }
    $('opt-weekend').checked = opts.weekend;
    $('opt-title').checked = opts.title;
    $('opt-room').checked = opts.room;
    $('opt-start').value = opts.start;
    $('opt-end').value = opts.end;
    [['opt-weekend', 'weekend'], ['opt-title', 'title'], ['opt-room', 'room']].forEach(([id, k]) => {
        $(id).addEventListener('change', (e) => { opts[k] = e.target.checked; saveOpts(); render(); });
    });
    [['opt-start', 'start'], ['opt-end', 'end']].forEach(([id, k]) => {
        $(id).addEventListener('change', (e) => { opts[k] = Number(e.target.value); saveOpts(); render(); });
    });

    // The ⋮ button opens Display Options and brings it into view
    const options = $('cal-options');
    $('cal-menu-btn').addEventListener('click', () => {
        options.open = !options.open;
        if (options.open) options.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
    options.addEventListener('toggle', () => $('cal-menu-btn').setAttribute('aria-expanded', String(options.open)));

    window.addEventListener('hashchange', () => { readHash(); render(); });

    if (!TERMS.length) {
        $('cal-week-notice').textContent = 'No terms have been added yet.';
        $('cal-week-notice').hidden = false;
        return;
    }
    readHash();
    render();
});
