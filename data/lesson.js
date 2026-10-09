/* ═══════════════════════════════════════════════════════
   LESSON 1.1 — STARTING AND STOPPING
   Grade 4 Science · Quarter 1 · Unit 1 "Motion: Car Crashes"
   NGSS 4-PS3-1 · 4-PS3-3

   Every objective, I-can statement, driving question, vocabulary
   word and misconception below is copied from the district's
   Q1 Science Unit Plan (K-6 Science Curriculum, SY 2025-2026).
   Nothing here is invented.
═══════════════════════════════════════════════════════ */

window.LESSON = {
  unit:   'Unit 1 · Motion: Car Crashes',
  title:  'Starting and Stopping',
  code:   'Lesson 1.1',
  days:   '8 science sessions',
  ngss:   ['4-PS3-1', '4-PS3-3'],

  driving: 'What causes some objects to stop and other objects to keep moving?',

  /* The four I-can statements in student words. The district's own wording
     measured FK 8.0 — four grades above the readers it is written for — so it
     is kept below as `icanDistrict` for planning and the kid version is what
     goes on the screen. Same four objectives, same order. */
  icanKid: [
    'tell what makes a thing start moving and what makes it stop.',
    'use my data to say why one surface let the cart go farther.',
    'show that a bigger push sends the cart farther.',
    'use numbers from my table to back up what I say.'
  ],

  icanDistrict: [
    'explain and model what causes objects to change motion.',
    'analyze data to explain different causes of changes in an object&rsquo;s motion.',
    'cite evidence to show how speed is related to energy for an object.',
    'model the cause-and-effect relationship between the force acting on an object and the object&rsquo;s motion.'
  ],

  /* Week 1 vocabulary from the Unit Plan, with its Spanish cognates. */
  vocab: [
    { word: 'force',    es: 'fuerza',     def: 'a push or a pull on an object' },
    { word: 'friction', es: 'resistencia',def: 'a force that pushes back on a moving object and slows it down' },
    { word: 'motion',   es: '&mdash;',    def: 'when an object changes its position' },
    { word: 'energy',   es: 'energ&iacute;a',def: 'what an object needs in order to move or do work' },
    { word: 'gravity',  es: 'gravedad',   def: 'the force that pulls objects down toward Earth' }
  ]
};

/* ══════════════════════════════════════════════════════
   THE LAB MODEL
   distance = v0^2 / (2 * mu * g)   — the cart is given one push,
   then friction is the only force left acting on it.
   Reported in centimeters so every number is a whole number a
   fourth grader can compare without decimals.
══════════════════════════════════════════════════════ */
window.LAB = {
  G: 9.8,
  trackCm: 900,

  surfaces: {
    ice:    { name: 'Ice',    mu: 0.05, color: '#8FD3E8', emoji: '&#129482;', note: 'very smooth' },
    wood:   { name: 'Wood',   mu: 0.12, color: '#C98B4B', emoji: '&#129717;', note: 'a little rough' },
    carpet: { name: 'Carpet', mu: 0.25, color: '#9B7FB8', emoji: '&#129532;', note: 'rough' },
    sand:   { name: 'Sand',   mu: 0.45, color: '#E0C27C', emoji: '&#127958;', note: 'very rough' }
  },

  pushes: {
    small:  { name: 'Small push',  v0: 1.6, arrows: '&rarr;' },
    medium: { name: 'Medium push', v0: 2.2, arrows: '&rarr;&rarr;' },
    big:    { name: 'Big push',    v0: 2.8, arrows: '&rarr;&rarr;&rarr;' }
  },

  /* Investigation A — same push every time, four different surfaces.
     Objective: "Construct explanations of how the forces acting on
     objects cause them to change their motion." (friction) */
  invA: {
    id: 'A',
    label: 'Investigation A',
    heading: 'Same push, different surfaces',
    question: 'If the push stays exactly the same, does the surface change how far the cart rolls?',
    sameLabel: 'Push stays the same:',
    sameValue: 'Medium push',
    changeLabel: 'What we change:',
    changeValue: 'the surface',
    predictQ: 'Before you test &mdash; which surface do you think will let the cart roll the FARTHEST?',
    predictOpts: ['Ice', 'Wood', 'Carpet', 'Sand'],
    /* Said out loud on the screen before they start. Nothing here is a hint
       about the answer — it is only what their hands have to do. */
    doCount: '8 pushes',
    doWhy:   'That is 4 surfaces. You push 2 times on each one.',
    doSteps: [
      'The site sets up each push for you. Read the setup line.',
      'Press <b>Push the cart</b>.',
      'Watch where the cart stops.',
      'Press <b>Write it in my table</b>.',
      'Do that 8 times. Then your table is full.'
    ],
    runs: [
      { surface: 'ice',    push: 'medium', trial: 1 },
      { surface: 'ice',    push: 'medium', trial: 2 },
      { surface: 'wood',   push: 'medium', trial: 1 },
      { surface: 'wood',   push: 'medium', trial: 2 },
      { surface: 'carpet', push: 'medium', trial: 1 },
      { surface: 'carpet', push: 'medium', trial: 2 },
      { surface: 'sand',   push: 'medium', trial: 1 },
      { surface: 'sand',   push: 'medium', trial: 2 }
    ]
  },

  /* Ramp heights for Investigation C. A car released from rest at height h
     reaches the flat with v² = 2gh, then friction stops it:
         d = v² / (2µg) = h / µ
     so the distance on the flat is just the ramp height divided by the
     surface's friction. Heights are book-stack heights, as the district's
     own Rolling Cars picture shows (a board propped on a pile of books). */
  ramps: {
    low:  { name: '1 book',  cm: 10, blocks: 1 },
    mid:  { name: '2 books', cm: 20, blocks: 2 },
    high: { name: '3 books', cm: 30, blocks: 3 }
  },

  /* Vehicles for Investigation D. Same push means the same WORK done on the
     object, so both leave with the same energy; friction then takes that
     energy away faster from the heavier one:
         d = W / (µ m g)   — twice the mass, half the distance.
     Mass is relative to the car, which is 1. */
  vehicles: {
    car:   { name: 'Car',   mass: 1,   emoji: '\u{1F697}' },
    truck: { name: 'Truck', mass: 2.5, emoji: '\u{1F69B}' }
  },

  /* Investigation B — same surface every time, three different pushes.
     Objective: "Analyze and interpret data to describe how different
     amounts of force cause an object to move different distances." */
  invB: {
    id: 'B',
    label: 'Investigation B',
    heading: 'Same surface, different pushes',
    question: 'If the surface stays exactly the same, does the size of the push change how far the cart rolls?',
    sameLabel: 'Surface stays the same:',
    sameValue: 'Wood',
    changeLabel: 'What we change:',
    changeValue: 'how hard we push',
    doCount: '3 pushes',
    doWhy:   'One small push, one medium push, one big push. Just one each.',
    doSteps: [
      'The site sets up each push for you. Read the setup line.',
      'Press <b>Push the cart</b>.',
      'Watch where the cart stops.',
      'Press <b>Write it in my table</b>.',
      'Do that 3 times. Then your table is full.'
    ],
    predictQ: 'Before you test &mdash; what will happen to the distance when the push gets BIGGER?',
    predictOpts: ['The cart will roll farther', 'The cart will roll a shorter way', 'The distance will stay the same', 'The cart will not move at all'],
    /* One trial each. Investigation A already teaches averaging across two
       trials; repeating it here cost six minutes we do not have. */
    runs: [
      { surface: 'wood', push: 'small',  trial: 1 },
      { surface: 'wood', push: 'medium', trial: 1 },
      { surface: 'wood', push: 'big',    trial: 1 }
    ]
  },

  /* Investigation C — same car, same surface, three ramp heights.
     This is the district's "angle of the ramp" question, which their
     Intellectual Prep names as the most rigorous SBAC question for the unit. */
  invC: {
    id: 'C',
    label: 'Investigation C',
    heading: 'Same car, different ramp heights',
    question: 'If the car always starts from rest, does a taller ramp send it farther?',
    sameLabel: 'Car and surface stay the same:',
    sameValue: 'The same car, on wood',
    changeLabel: 'What we change:',
    changeValue: 'how tall the ramp is',
    runVerb: '&#9660; Let the car go',
    runNoun: 'Run',
    doCount: '3 runs',
    doWhy:   'One run from each ramp. 1 book, 2 books, 3 books.',
    /* The "you do not push" line is first and said twice, because in A and B
       they pushed every time and the habit carries over. */
    doSteps: [
      '<b>You do not push the car this time.</b> You let it go at the top.',
      'The site sets up each ramp for you. Read the setup line.',
      'Press <b>Let the car go</b>.',
      'Watch where the car stops.',
      'Press <b>Write it in my table</b>.',
      'Do that 3 times. Remember: no pushing.'
    ],
    predictQ: 'Before you test &mdash; what happens when the ramp gets TALLER?',
    predictOpts: ['The car rolls farther', 'The car rolls a shorter way', 'The distance stays the same', 'The car rolls backwards'],
    runs: [
      { surface: 'wood', ramp: 'low',  trial: 1 },
      { surface: 'wood', ramp: 'mid',  trial: 1 },
      { surface: 'wood', ramp: 'high', trial: 1 }
    ]
  },

  /* Investigation D — same push, same surface, two different masses.
     This is the district's own Day 5 comparison: car vs. truck. */
  invD: {
    id: 'D',
    label: 'Investigation D',
    heading: 'Same push, car against truck',
    question: 'If the push is exactly the same, does a heavier vehicle travel as far?',
    sameLabel: 'Push and surface stay the same:',
    sameValue: 'Medium push, on wood',
    changeLabel: 'What we change:',
    changeValue: 'how heavy the vehicle is',
    doCount: '2 pushes',
    doWhy:   'One push for the car. One push for the truck. The pushes are the same size.',
    doSteps: [
      'The site sets up each push for you. Read the setup line.',
      'Press <b>Push the cart</b>.',
      'Watch where it stops.',
      'Press <b>Write it in my table</b>.',
      'Do that 2 times. Then your table is full.'
    ],
    predictQ: 'Before you test &mdash; which one goes FARTHER with the very same push?',
    predictOpts: ['The car', 'The truck', 'They go exactly the same distance', 'Neither one moves'],
    runs: [
      { surface: 'wood', push: 'medium', vehicle: 'car',   trial: 1 },
      { surface: 'wood', push: 'medium', vehicle: 'truck', trial: 1 }
    ]
  }
};
