(function () {
  var paths = {
    spark: ['M12 3l1.5 5.2L19 10l-5.5 1.8L12 17l-1.5-5.2L5 10l5.5-1.8L12 3z'],
    home: ['M3 11.5L12 4l9 7.5', 'M5.5 10v10h13V10', 'M9.5 20v-5.5h5V20'],
    video: ['M4 6.5h11a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2z', 'M17 10l5-3v10l-5-3'],
    pen: ['M4 20h4L19 9l-4-4L4 16v4z', 'M13.5 6.5l4 4', 'M3 21h18'],
    kanban: ['M4 4h5v13H4z', 'M10 4h5v9h-5z', 'M16 4h4v16h-4z'],
    file: ['M6 3h8l4 4v14H6z', 'M14 3v5h5', 'M9 13h6', 'M9 17h6'],
    network: ['M12 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', 'M5 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', 'M19 16a2 2 0 1 0 0 4 2 2 0 0 0 0-4z', 'M10.7 7.5L6.3 15', 'M13.3 7.5l4.4 7.5', 'M7 18h10'],
    workflow: ['M6 4h6v5H6z', 'M12 6.5h4a3 3 0 0 1 3 3v0', 'M19 13.5h-6v6h6z', 'M6 7v10a2 2 0 0 0 2 2h3'],
    search: ['M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16z', 'M21 21l-4.35-4.35'],
    bell: ['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9', 'M10 21h4'],
    panel: ['M4 5h16v14H4z', 'M15 5v14'],
    menu: ['M3 7h18', 'M3 12h18', 'M3 17h18'],
    chevronDown: ['M7 9l5 5 5-5'],
    plus: ['M12 5v14', 'M5 12h14'],
    arrowRight: ['M5 12h14', 'M14 7l5 5-5 5'],
    send: ['M3 11l18-8-8 18-2-8-8-2z', 'M11 13l4-4'],
    calendar: ['M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z', 'M3 9h18', 'M8 2v4', 'M16 2v4'],
    clock: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 7v5l3 2'],
    check: ['M5 12.5l4.5 4.5L19 7'],
    target: ['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z'],
    folder: ['M3 6h7l2 2h9v11H3z', 'M3 6v13'],
    users: ['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M2 21a7 7 0 0 1 14 0', 'M17 4a4 4 0 0 1 0 8', 'M17 14a6 6 0 0 1 5 6'],
    message: ['M4 5h16v12H8l-4 4V5z', 'M8 9h8', 'M8 13h5'],
    wand: ['M5 19L18 6', 'M15 3l1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3z', 'M4 4l1 2 2 1-2 1-1 2-1-2-2-1 2-1 1-2z'],
    upload: ['M12 16V4', 'M7 9l5-5 5 5', 'M4 20h16'],
    shield: ['M12 3l8 3v5c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-3z', 'M9 12l2 2 4-5'],
    alert: ['M12 3l10 18H2L12 3z', 'M12 9v5', 'M12 18h.01'],
    trending: ['M3 17l6-6 4 4 7-8', 'M15 7h5v5'],
    automation: ['M12 3v3', 'M12 18v3', 'M3 12h3', 'M18 12h3', 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z'],
    link: ['M10 13a5 5 0 0 0 7.1 0l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1', 'M14 11a5 5 0 0 0-7.1 0l-2 2A5 5 0 0 0 12 20l1.1-1.1'],
    book: ['M4 4h6a3 3 0 0 1 3 3v13a3 3 0 0 0-3-3H4z', 'M20 4h-6a3 3 0 0 0-3 3v13a3 3 0 0 1 3-3h6z'],
    x: ['M6 6l12 12', 'M18 6L6 18'],
    filter: ['M4 5h16', 'M7 12h10', 'M10 19h4'],
    play: ['M7 4l12 8-12 8z'],
    mic: ['M12 15a4 4 0 0 0 4-4V7a4 4 0 1 0-8 0v4a4 4 0 0 0 4 4z', 'M5 11a7 7 0 0 0 14 0', 'M12 18v3', 'M8 21h8'],
    list: ['M9 6h11', 'M9 12h11', 'M9 18h11', 'M4 6h.01', 'M4 12h.01', 'M4 18h.01'],
    briefcase: ['M4 7h16v12H4z', 'M9 7V4h6v3', 'M4 11h16'],
    more: ['M5 12h.01', 'M12 12h.01', 'M19 12h.01']
  };

  Vue.component('app-icon', {
    props: {
      name: { type: String, default: 'spark' },
      size: { type: [Number, String], default: 18 },
      label: { type: String, default: '' }
    },
    template: `<svg :width="size" :height="size" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" :role="label ? 'img' : null" :aria-label="label || null" :aria-hidden="label ? null : 'true'" focusable="false"><title v-if="label">{{ label }}</title><path v-for="(d, i) in paths" :key="i" :d="d"></path></svg>`,
    computed: { paths: function () { return paths[this.name] || paths.spark; } }
  });
})();
