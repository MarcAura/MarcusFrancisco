/* =============================================
   Class calendar data, read by calendar.js (calendar.html).

   One object per term. To add a historical term, copy a block and edit it.
   Dates are "YYYY-MM-DD" (local dates; calendar.js never lets the browser parse them,
   because iOS Safari reads bare ISO dates as UTC and lands a day early in Buffalo).
   Times are 24-hour "HH:MM".

   Term fields:
     id       short, unique, used in the page address (#term=fall-2026)
     name     shown in the Term menu
     start    first day of classes   end   last day of the term (inclusive)
     classes  meetings to draw; a class with no days/start/end is listed as
              "no set meeting time" (online asynchronous)
     exams    final exams: { code, section, date, start, end, room }  (optional)
     breaks   days with no classes: { name, start, end }  (optional)
   Class fields:
     code, section, title (as the HUB prints it), topic (optional longer name),
     component (Lecture / Tutorial / Seminar…), days (Mon Tue Wed Thu Fri Sat Sun),
     start, end, room, campus, mode, units,
     from / to (optional: when a class runs for only part of the term)
   ============================================= */
window.CALENDAR_TERMS = [
    {
        id: 'spring-2025',
        name: 'Spring 2025',
        // Meetings copied from Marcus's HUB "Weekly Schedule" (week of 3/3/2025).
        // Term dates are UB's usual Spring pattern; replace with the official calendar when Marcus sends it.
        start: '2025-01-27',
        end: '2025-05-17',
        classes: [
            {
                code: 'EE 550LEC', section: 'IS', title: 'Special Topics',
                topic: 'Photovoltaic Technology and Applications', component: 'Lecture',
                days: ['Tue', 'Thu'], start: '11:00', end: '12:20', room: 'Clemens Hall 06',
                campus: 'North Campus', mode: 'In person', units: 3
            },
            {
                code: 'EE 559LEC', section: 'LH', title: 'Special Topics',
                topic: 'Control and Applications of Power Electronics', component: 'Lecture',
                days: ['Tue', 'Thu'], start: '12:30', end: '13:50', room: 'Bell Hall 337',
                campus: 'North Campus', mode: 'In person', units: 3
            },
            {
                code: 'EE 616TUT', section: '000', title: 'Tech, Synth, and Comm',
                component: 'Tutorial',
                days: ['Fri'], start: '10:00', end: '10:50', room: 'Baldy Hall 106',
                campus: 'North Campus', mode: 'In person'
            }
        ],
        exams: [],
        breaks: []
    },
    {
        id: 'fall-2026',
        name: 'Fall 2026',
        // From Marcus's HUB Schedule Builder (schedule 1 of 2, 21.5 units).
        // Week 1 = Aug 24, 2026. Part-of-term dates are read off the builder's week chart
        // (weeks 1-8, 8-16, 1-15, 1-16); confirm against the official schedule once registered.
        start: '2026-08-24',
        end: '2026-12-13',
        classes: [
            {
                code: 'MGA 604LEC', section: 'MAO1', component: 'Lecture',
                campus: 'Remote', mode: 'Remote: not real time (async)', units: 3,
                from: '2026-08-24', to: '2026-10-18'
            },
            {
                code: 'MGB 601LEC', section: 'MBO1', component: 'Lecture',
                campus: 'Remote', mode: 'Remote: not real time (async)', units: 3,
                from: '2026-10-12', to: '2026-12-13'
            },
            {
                code: 'MGF 405LEC', section: 'F2F', component: 'Lecture',
                days: ['Mon', 'Wed'], start: '14:00', end: '15:20', room: 'Jacobs 122',
                campus: 'North Campus', mode: 'In person', units: 3,
                from: '2026-08-24', to: '2026-12-13'
            },
            {
                code: 'MGG 524LEC', section: 'F1G', component: 'Lecture',
                days: ['Fri'], start: '14:30', end: '15:50', room: 'Alfier 104',
                campus: 'North Campus', mode: 'In person', units: 1.5,
                from: '2026-08-24', to: '2026-12-06'
            },
            {
                code: 'MGG 635LEC', section: 'F2G', component: 'Lecture',
                days: ['Tue', 'Thu'], start: '14:30', end: '16:30', room: 'Alfier 103',
                campus: 'North Campus', mode: 'In person', units: 2,
                from: '2026-08-24', to: '2026-10-18'
            },
            {
                code: 'MGG 700SEM', section: 'F1G', component: 'Seminar',
                days: ['Wed'], start: '09:30', end: '12:00', room: 'Jacobs 201',
                campus: 'North Campus', mode: 'In person', units: 3,
                from: '2026-08-24', to: '2026-12-06'
            },
            {
                code: 'MGS 617LEC', section: 'F1S', component: 'Lecture',
                days: ['Fri'], start: '09:00', end: '11:40', room: 'Jacobs 110',
                campus: 'North Campus', mode: 'In person', units: 3,
                from: '2026-08-24', to: '2026-12-06'
            },
            {
                code: 'MGS 627LEC', section: 'F1S', component: 'Lecture',
                days: ['Wed'], start: '18:30', end: '21:10', room: 'Jacobs 112',
                campus: 'North Campus', mode: 'In person', units: 3,
                from: '2026-08-24', to: '2026-12-06'
            }
        ],
        exams: [],
        breaks: []
    }
];
