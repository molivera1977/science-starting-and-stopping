/* ═══════════════════════════════════════════════════════
   LESSON 1.1 — STARTING AND STOPPING
   Grade 4 Science · Quarter 1 · Unit 1 "Motion: Car Crashes"
   NGSS 4-PS3-1 · 4-PS3-3

   Every objective, I-can statement, driving question, vocabulary
   word and misconception below is copied from the district's
   Q1 Science Unit Plan (K-6 Science Curriculum, SY 2025-2026).
   Nothing here is invented.
═══════════════════════════════════════════════════════ */

/* The words the METHOD uses. Every one of these was used on screen without
   ever being explained — "trial" 19 times, "evidence" 19, "predict" 17.
   A word the task is built on cannot be assumed; these are shown at the
   point of use. Marcos 10/9: "explain everything and take nothing for
   granted. These are kids who will easily lose focus at 2:30pm." */
/* ══════════════════════════════════════════════════════
   WHAT MR. O JUST SHOWED YOU

   The bridge from the teacher-led minutes into the lab. Marcos 10/9:
   "in the beginning they should be reminded about what they learned in
   the teacher led session prior to the experiments."

   Every line here matches a step in the lesson plan's teach sequence, and
   names the DEMO as well as the idea — a student who has forgotten "force
   is a push or a pull" often still remembers Mr. O shoving a chair. The
   demo is the handle on the idea.
═══════════════════════════════════════════════════════ */
window.RECAP = {
  day1: {
    lead: 'Mr. O just showed you three things. Here are the three things again, so ' +
          'you can look back while you work.',
    items: [
      { t: 'A <dfn>force</dfn> is a push or a pull.',
        d: 'Remember the chair &mdash; pushing the chair and pulling the chair are both forces.' },
      { t: '<dfn>Friction</dfn> pushes back on anything that moves.',
        d: 'Remember rubbing your hands together and feeling your hands get warm. That rubbing is friction.' },
      { t: 'A rougher surface has more friction, so a rougher surface stops things sooner.',
        d: 'A <dfn>surface</dfn> is the top of a thing, like the top of your desk. Remember sliding your hand on the desk, then on your sleeve. Your sleeve was harder to slide on.' }
    ],
    now: 'Next, you get to <b>test these ideas yourself</b>.'
  },
  day2: {
    lead: 'Mr. O just showed you two new tests and one new word. Here are all three again.',
    items: [
      { t: 'The <b>ramp</b> test &mdash; you change how tall the ramp is.',
        d: 'A <dfn>ramp</dfn> is a slope, like a slide at the park. You do NOT push the car. You let the car go at the top and gravity pulls the car down the ramp.' },
      { t: 'The <b>truck</b> test &mdash; you change what you push: a car, then a truck.',
        d: 'The truck is heavier than the car. The car and the truck get the very same push.' },
      /* 'mass' is the correct answer to the truck question and was taught
         nowhere. Marcos 10/10: "was mass really discussed?" It was not. */
      { t: 'The new word is <dfn>mass</dfn>. Mass is how much stuff a thing is made of.',
        d: 'Think of an empty backpack and a full backpack. The full backpack has more mass. The truck has more mass than the car.' }
    ],
    now: 'Every test still changes <b>one thing only</b>. That is what makes the test fair.'
  }
};

/* The equipment. None of these are science terms, which is exactly why they
   slipped through — "cart" appears in 57 places across the lesson and was
   never explained. A child who does not know what a cart is cannot follow a
   single instruction on the screen. */
window.THING_WORDS = {
  /* Found by counting every word students see against what anything defines.
     "investigation" was used 13 times and never once explained — it is the
     word the whole lesson is organised around. "data table" 25 times,
     "distance" 10, "setup" 6. Marcos 10/9: "These Science lessons must be
     SUPER explicit and perhaps over explain." */
  test:   { def: 'a way to try something and see what happens. In each test you change one thing and keep everything else the same',
            ex: 'Test 1 is the surface test. You change what the cart rolls on, ' +
                'and you keep the push exactly the same. That is one test. ' +
                'This lesson has four tests.' },
  'data table':
          { def: 'the boxes where you write down how far the cart traveled',
            ex: 'Like a chart with rows and columns. Every time the cart stops, you write ' +
                'the distance the cart traveled in a box. By the end the table is full, and the distances in the table ' +
                'are what you use to answer the questions.' },
  distance:
          { def: 'how far something traveled',
            ex: 'From where the cart started to where the cart stopped. You measure distance in ' +
                'centimeters. 500 cm is about as long as three desks in a row. ' +
                '50 cm is about the length of your arm.' },
  tags:   { def: 'the little labels above the track that say what this push uses',
            ex: 'The tags above the track, like Ice and Medium push. ' +
                'The tags tell you which surface and which push this try uses. ' +
                'The site picks the surface and the push for you. You just read the tags and press the button.' },
  cart:   { def: 'a little box on wheels that rolls',
            ex: 'Think of a toy car. Or a skateboard. Or the wagon you pull behind you. ' +
                'On your screen the cart is the small box with two wheels.' },
  track:  { def: 'the long straight path the cart rolls down',
            ex: 'Like a bowling lane, or a hallway, or the lines on a running track.' },
  /* Added 10/10 from an audit of words used against words explained. */
  object: { def: 'a thing',
            ex: 'A ball. A cart. A book. A truck. Anything you can touch and move is an object.' },
  mass:   { def: 'how much stuff a thing is made of',
            ex: 'An empty backpack and a full backpack. The full backpack has more mass, so the full ' +
                'backpack is heavier and harder to push. A truck has more mass than a car.' },
  centimeter:
          { def: 'a small unit for measuring how long something is. The short way to write centimeter is cm',
            ex: 'Your fingernail is about 1 centimeter wide. A new pencil is about 19 centimeters long. ' +
                'One big step is about 100 centimeters. The marks on the track count centimeters: 100, 200, 300.' },
  ramp:   { def: 'a slope that something rolls down',
            ex: 'A slide at the park. A wheelchair ramp. A skateboard ramp. ' +
                'A piece of cardboard with one end up on some books.' }
};

/* The one question a child doing try 2 of 2 is actually asking. It sits on
   the lesson, not on one investigation, because all four repeat. */
window.WHY_REPEAT =
  'You do every push <b>two times</b>. Why? Because one push can go wrong &mdash; maybe your hand ' +
  'slipped, or you pushed a little harder without meaning to. Doing each push two times lets you catch a mistake, ' +
  'and the middle of the two distances is closer to the truth. That middle distance is called the <dfn>average</dfn>. Scientists never trust one push.';

/* ══════════════════════════════════════════════════════
   THE PLAN — what used to be one eight-sentence paragraph

   Marcos 10/9: "this paragraph is too boring and needs to be broken up.
   Visually it's too monotonous." Same content, cut into pieces a student
   can see at a glance: which tests happen which day, each with its own
   picture, then the three things they do every time, then one calm line.
═══════════════════════════════════════════════════════ */
window.INTRO_PLAN = {
  days: [
    { label: 'Today', tests: [
      { inv: 'A', t: 'Test 1 &mdash; the surface',
        d: 'Push the cart on ice, wood, carpet and sand. Which surface lets the cart go farthest?' },
      { inv: 'B', t: 'Test 2 &mdash; the push',
        d: 'Give the cart a small push, a medium push and a big push. Does a bigger push send the cart farther?' } ] },
    { label: 'Next time', tests: [
      { inv: 'C', t: 'Test 3 &mdash; the ramp',
        d: 'A <dfn>ramp</dfn> is a slope, like a slide at the park. Let a car roll down a ramp. Does a taller ramp send the car farther?' },
      { inv: 'D', t: 'Test 4 &mdash; the truck',
        d: 'Push a car and a heavy truck the same way. Does the car or the truck go farther?' } ] }
  ],
  every: [
    { art: 'distance',      t: 'Measure the distance the cart traveled', d: 'See how far the cart traveled from START, in centimeters.' },
    { art: 'data table',    t: 'Write the distance in your data table', d: 'A <dfn>data table</dfn> is a set of boxes for writing down what you measure. What you write down is called your <dfn>data</dfn>. Put the distance the cart traveled in a box in your data table.' },
    { art: 'investigation', t: 'Explain why the cart stopped', d: 'Use the distances in your own data table to say why the cart stopped.' }
  ],
  calm: 'Take your time. This takes two days. Good scientists test more than once.'
};

/* ══════════════════════════════════════════════════════
   WHY SHOULD YOU CARE — on the cover, before they press Let's begin

   Marcos 10/9: "let's include why they should care about the answer." The
   cover asked the question but never said why a nine-year-old would want
   the answer. Three things from their own lives where stopping matters,
   each tied to the test where they will prove it themselves. The district
   unit is literally called Motion: Car Crashes, so the first one is safety.
═══════════════════════════════════════════════════════ */
window.CARE = [
  { art: 'crossing', test: 'You will test this idea in Test 4',
    t: 'Cars cannot stop right away',
    d: 'A heavy car or bus needs a long way to stop. That is why you wait for the crossing guard and look both ways.' },
  { art: 'icy', test: 'You will test this idea in Test 1',
    t: 'Sand on an icy sidewalk',
    d: 'In winter, people throw sand on ice. The sand adds <dfn>friction</dfn>. Friction is a rubbing that slows things down. So your feet can stop and you do not slip.' },
  { art: 'sneaker', test: 'You will test this idea in Test 1',
    t: 'The bumps on your sneakers',
    d: 'The bumps grab the gym floor on purpose. That is how you stop fast without falling.' }
];

/* ══════════════════════════════════════════════════════
   MEET YOUR CART — its own page, right before the plan

   Marcos 10/9: "You start talking about a cart and the kids have no idea why
   you are talking about it." The cart appeared on page two and on the
   summary with no introduction — not what it is, not that it lives on the
   screen, not why a scientist would use one. Now nothing mentions the cart
   until this page has introduced it, with a picture for every point.
═══════════════════════════════════════════════════════ */
/* THREE PAGES, each one idea (rewritten 10/10). Marcos: "we should be clear
   why we are using a cart in the first place. We are using a cart to help
   measure the effect of different surfaces and forces on motion. The
   distance the cart travels is what we are using to measure that. Be super
   clear and detailed and explicit with 4th graders. No ambiguity should be
   allowed." The old page said a cart "rolls easily" and stopped there. This
   one walks the whole chain: what a cart is, why we need a thing that moves,
   what we change, what we measure, and what that measurement tells us. */
window.CART_PAGES = [
  { scene: 'start',
    tiles: [
      { art: 'cart',   t: 'This is a cart',
        d: 'A <dfn>cart</dfn> is a little box on wheels. A cart rolls. A toy car is like a cart. A skateboard is like a cart.' },
      { art: 'screen', t: 'The cart is on your screen',
        d: 'You do not push a real cart. You press a button. Then the cart on your screen gets a push and rolls along a track. A <dfn>track</dfn> is a long straight path, like a hallway.' } ] },
  { head: 'Why we use a cart', scene: 'surfaces',
    tiles: [
      { art: 'why',      t: 'We have a question to answer',
        d: 'What makes a moving thing stop? To find the answer, we need a thing that moves. The cart is the thing that moves.' },
      { art: 'surfaces', t: 'We change one thing at a time',
        d: 'First we change the surface. The <dfn>surface</dfn> is what the cart rolls on: ice, wood, carpet or sand. After that, we change how hard the push is. A push is a force.' },
      { art: 'watch',    t: 'We watch what the cart does',
        d: 'After every push, we watch the cart. Does the cart roll a long way? Or does the cart stop soon?' } ] },
  { head: 'How the cart gives us the answer', scene: 'distance',
    tiles: [
      { art: 'distance',  t: 'We measure the distance the cart travels',
        d: 'The <dfn>distance</dfn> is how far the cart travels. We measure from START to the spot where the cart stops. We measure in centimeters. A <dfn>centimeter</dfn> is small. Your fingernail is about 1 centimeter wide.' },
      { art: 'longshort', t: 'What the distance tells us',
        d: 'A long distance means not much slowed the cart down. A short distance means something stopped the cart fast.' },
      { art: 'clue',      t: 'The distance is our clue',
        d: 'The distance the cart travels shows what the surface did to the cart. The distance also shows what the push did to the cart. That is how the cart helps us answer the big question.' } ] }
];

window.METHOD_WORDS = {
  predict:  'A <b>prediction</b> is your best guess <i>before</i> you test. A prediction is never marked wrong.',
  trial:    'A <b>trial</b> is one push.<br><br>In Test 1 you push <b>twice</b> on every ' +
            'surface. Here is why. One push can go wrong &mdash; maybe your hand slipped, or you ' +
            'pushed a tiny bit harder without meaning to. If you only pushed once you would never ' +
            'know. Pushing twice lets you catch a mistake. Real scientists never trust one try either.',
  /* Rewritten 10/10. Marcos: "we need to explain what an average is for their
     level." The old one said "add the two distances, then cut that total in
     half" — a division most of this class cannot yet do. For two amounts the
     average IS the amount in the middle, which a child can see. */
  average:  'The <b>average</b> is the amount in the middle of two amounts.<br><br>' +
            'Think of reading. On Monday you read 10 pages. On Tuesday you read 20 pages. ' +
            'The amount in the middle is 15 pages. So 15 pages is the average.<br><br>' +
            'In this lab the average is the distance in the middle of your two trials. ' +
            'Say the cart traveled 480 cm, then 500 cm. The distance in the middle is 490 cm. ' +
            'So the average is 490 cm. The site finds the average for you.',
  claim:    'A <b>claim</b> is what you think is true.',
  evidence: '<b>Evidence</b> is the distances from your data table that show your claim is true.',
  reasoning:'<b>Reasoning</b> is the reason why your claim is true.'
};

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
    'tell what makes a thing start moving and what makes a thing stop.',
    'use my data to say why one surface let the cart go farther.',
    'show that a bigger push sends the cart farther.',
    'use the distances in my data table to back up what I say.'
  ],

  icanDistrict: [
    'explain and model what causes objects to change motion.',
    'analyze data to explain different causes of changes in an object&rsquo;s motion.',
    'cite evidence to show how speed is related to energy for an object.',
    'model the cause-and-effect relationship between the force acting on an object and the object&rsquo;s motion.'
  ],

  /* Week 1 vocabulary from the Unit Plan, with its Spanish cognates.

     "surface" is NOT one of the district's five. It is here because the lab
     leans on it constantly — "First the surface, then the push" — and a word
     the task cannot be done without belongs on the word screen whether or not
     a pacing document lists it. Marcos asked for it 10/9/2026. */
  vocab: [
    { word: 'force',    es: 'fuerza',     def: 'a push or a pull on an object',
      ex: 'An object is any thing you can touch: a ball, a door, a backpack. Pushing a shopping cart at the store. Pulling the classroom door open. Kicking a ball. Dragging your backpack across the floor. Every single one of those is you making something move or stop. That is what a force does.' },
    { word: 'friction', es: 'resistencia',def: 'a force that pushes back on a moving object and slows the object down',
      ex: 'Your sneakers gripping the gym floor so you do not slip. Rubbing your hands together to get warm. A bike slowing down after you stop pedalling. Why it is hard to run on sand. In every one of those, something is rubbing and that rubbing is slowing things down. The rubbing is the friction.' },
    { word: 'motion',   es: '&mdash;',    def: 'when an object changes position',
      ex: 'A bus pulling away from the stop. A ball rolling down the hall. You, walking to lunch. A pencil rolling off a desk. In every one, the thing is in a different spot than the thing was a second ago. Changing spot is what motion means.' },
    { word: 'energy',   es: 'energ&iacute;a',def: 'what an object needs in order to move or do work',
      ex: 'The food you ate at lunch, which is what lets you run at recess. The battery in a toy. The gas in a car. Take any of those away and the thing stops working. That is what it means to need energy.' },
    { word: 'gravity',  es: 'gravedad',   def: 'the force that pulls objects down toward Earth',
      ex: 'A dropped phone hitting the floor. Rain falling down and never up. A ball coming back down after you throw the ball. Notice the phone, the rain and the ball all go the same direction: DOWN. Gravity is what pulls all three down.' },
    { word: 'surface',  es: 'superficie', def: 'the top of the thing an object moves on',
      ex: 'The gym floor. The carpet in the classroom. An icy sidewalk. Sand at the beach. Each one of those feels different under your shoe, and that is exactly why the cart will not roll the same way on each one.' }
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
    ice:    { name: 'Ice',    mu: 0.05, color: '#8FD3E8', emoji: '&#129482;', note: 'very smooth',
              ex: 'Like a frozen puddle in winter. If you step on a frozen puddle your foot slides right out from under you. Nothing grips. That is how little friction ice has.' },
    wood:   { name: 'Wood',   mu: 0.12, color: '#C98B4B', emoji: '&#129717;', note: 'a little rough',
              ex: 'Like the gym floor. You can slide a book a long way across the gym floor, but not forever. Wood grips a little, but not much.' },
    carpet: { name: 'Carpet', mu: 0.25, color: '#9B7FB8', emoji: '&#129532;', note: 'rough',
              ex: 'Like the rug in a classroom. Try sliding a book across a rug and the book stops fast. The fuzzy top grabs the book.' },
    sand:   { name: 'Sand',   mu: 0.45, color: '#E0C27C', emoji: '&#127958;', note: 'very rough',
              ex: 'Like the beach. Running on sand is hard work and your feet sink in. The sand grabs anything that tries to move across the sand.' }
  },

  pushes: {
    small:  { name: 'Small push',  v0: 1.6, arrows: '&rarr;',
              note: 'a little tap, like sliding a pencil' },
    medium: { name: 'Medium push', v0: 2.2, arrows: '&rarr;&rarr;',
              note: 'a normal push, like sliding a book across a desk' },
    big:    { name: 'Big push',    v0: 2.8, arrows: '&rarr;&rarr;&rarr;',
              note: 'a hard shove, as hard as you can' }
  },

  /* Test 1 — same push every time, four different surfaces.
     Objective: "Construct explanations of how the forces acting on
     objects cause them to change their motion." (friction) */
  invA: {
    id: 'A',
    label: 'Test 1',
    heading: 'Same push, different surfaces',
    headingPlain: 'That means you push the same way every time. The only thing that changes is what the cart rolls on.',
    question: 'If the push stays exactly the same, does the surface change how far the cart rolls?',
    measure: 'How we find out: we measure how far the cart travels on each surface. The distance the cart travels shows what that surface does to a moving cart.',
    sameLabel: 'Push stays the same:',
    sameValue: 'Medium push',
    changeLabel: 'What we change:',
    changeValue: 'the surface',
    predictQ: 'Before you test &mdash; which surface do you think will let the cart roll the FARTHEST?',
    predictOpts: ['Ice', 'Wood', 'Carpet', 'Sand'],
    /* Said out loud on the screen before they start. Nothing here is a hint
       about the answer — it is only what their hands have to do. */
    doCount: '8 pushes',
    doWhy:   'That is 4 surfaces. You push 2 times on each surface. Each push is called a <dfn>trial</dfn>.',
    doSteps: [
      'The site gets each push ready for you. Above the track you will see little <dfn>tags</dfn>, like Ice and Medium push. The tags tell you what this push uses. Read the tags.',
      'Press <b>Push the cart</b>.',
      'Watch where the cart stops.',
      'Press the <b>Write in my table</b> button. The distance the cart traveled drops into the glowing box.',
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

  /* Ramp heights for Test 3. A car released from rest at height h
     reaches the flat with v² = 2gh, then friction stops it:
         d = v² / (2µg) = h / µ
     so the distance on the flat is just the ramp height divided by the
     surface's friction. Heights are book-stack heights, as the district's
     own Rolling Cars picture shows (a board propped on a pile of books). */
  ramps: {
    low:  { name: '1 book',  cm: 10, blocks: 1, note: 'the lowest ramp' },
    mid:  { name: '2 books', cm: 20, blocks: 2, note: 'twice as tall as 1 book' },
    high: { name: '3 books', cm: 30, blocks: 3, note: 'the tallest ramp' }
  },

  /* Vehicles for Test 4. Same push means the same WORK done on the
     object, so both leave with the same energy; friction then takes that
     energy away faster from the heavier one:
         d = W / (µ m g)   — twice the mass, half the distance.
     Mass is relative to the car, which is 1. */
  vehicles: {
    car:   { name: 'Car',   mass: 1,   emoji: '\u{1F697}', note: 'the car is light',
             ex: 'A light thing has only a little mass. Mass is how much stuff a thing is made of.' },
    truck: { name: 'Truck', mass: 2.5, emoji: '\u{1F69B}', note: 'the truck is heavy',
             ex: 'A heavy thing has a lot of mass. Think of an empty backpack and a full backpack. ' +
                 'The full backpack has more mass, so the full backpack is harder to push.' }
  },

  /* Test 2 — same surface every time, three different pushes.
     Objective: "Analyze and interpret data to describe how different
     amounts of force cause an object to move different distances." */
  invB: {
    id: 'B',
    label: 'Test 2',
    heading: 'Same surface, different pushes',
    headingPlain: 'That means the cart always rolls on wood. The only thing that changes is how hard you push.',
    question: 'If the surface stays exactly the same, does the size of the push change how far the cart rolls?',
    measure: 'How we find out: we measure how far the cart travels after each push. The distance the cart travels shows what a bigger push does to the cart.',
    sameLabel: 'Surface stays the same:',
    sameValue: 'Wood',
    changeLabel: 'What we change:',
    changeValue: 'how hard we push',
    doCount: '6 pushes',
    doWhy:   'Three sizes of push. You do each size twice, so you can check how far the cart traveled.',
    doSteps: [
      'The site gets each push ready for you. Above the track you will see little <dfn>tags</dfn>, like Ice and Medium push. The tags tell you what this push uses. Read the tags.',
      'Press <b>Push the cart</b>.',
      'Watch where the cart stops.',
      'Press the <b>Write in my table</b> button. The distance the cart traveled drops into the glowing box.',
      'Do that 6 times. Then your table is full.'
    ],
    predictQ: 'Before you test &mdash; what will happen to the distance the cart travels when the push gets BIGGER?',
    predictOpts: ['The cart will roll farther', 'The cart will roll a shorter way', 'The cart will roll the same distance', 'The cart will not move at all'],
    /* Two trials, like every investigation. A single push cannot be checked,
       and averaging is the habit the lesson is teaching. */
    runs: [
      { surface: 'wood', push: 'small',  trial: 1 },
      { surface: 'wood', push: 'small',  trial: 2 },
      { surface: 'wood', push: 'medium', trial: 1 },
      { surface: 'wood', push: 'medium', trial: 2 },
      { surface: 'wood', push: 'big',    trial: 1 },
      { surface: 'wood', push: 'big',    trial: 2 }
    ]
  },

  /* Test 3 — same car, same surface, three ramp heights.
     This is the district's "angle of the ramp" question, which their
     Intellectual Prep names as the most rigorous SBAC question for the unit. */
  invC: {
    id: 'C',
    label: 'Test 3',
    heading: 'Same car, different ramp heights',
    headingPlain: 'That means the same car on the same wood every time. The only thing that changes is how tall the ramp is.',
    question: 'If nobody pushes the car, does a taller ramp send the car farther?',
    measure: 'How we find out: we measure how far the car travels after each ramp. The distance the car travels shows what a taller ramp does to the car.',
    sameLabel: 'Car and surface stay the same:',
    sameValue: 'The same car, on wood',
    changeLabel: 'What we change:',
    changeValue: 'how tall the ramp is',
    runVerb: '&#9660; Let the car go',
    runNoun: 'Run',
    doCount: '6 runs',
    doWhy:   'Three ramps. You use each ramp twice, so you can check how far the car traveled.',
    /* The "you do not push" line is first and said twice, because in A and B
       they pushed every time and the habit carries over. */
    doSteps: [
      '<b>You do not push the car this time.</b> You let the car go at the top.',
      'The site gets each ramp ready for you. Above the track you will see little <dfn>tags</dfn>, like Ramp of 1 book. The tags tell you what this run uses. Read the tags.',
      'Press <b>Let the car go</b>.',
      'Watch where the car stops.',
      'Press the <b>Write in my table</b> button. The distance the car traveled drops into the glowing box.',
      'Do that 6 times. Remember: no pushing.'
    ],
    predictQ: 'Before you test &mdash; what happens when the ramp gets TALLER?',
    predictOpts: ['The car rolls farther', 'The car rolls a shorter way', 'The car rolls the same distance', 'The car rolls backwards'],
    runs: [
      { surface: 'wood', ramp: 'low',  trial: 1 },
      { surface: 'wood', ramp: 'low',  trial: 2 },
      { surface: 'wood', ramp: 'mid',  trial: 1 },
      { surface: 'wood', ramp: 'mid',  trial: 2 },
      { surface: 'wood', ramp: 'high', trial: 1 },
      { surface: 'wood', ramp: 'high', trial: 2 }
    ]
  },

  /* Test 4 — same push, same surface, two different masses.
     This is the district's own Day 5 comparison: car vs. truck. */
  invD: {
    id: 'D',
    label: 'Test 4',
    heading: 'Same push, car against truck',
    headingPlain: 'That means the same push on the same wood every time. The only thing that changes is whether you push the car or the truck. The truck has more mass than the car. Mass is how much stuff a thing is made of.',
    question: 'If the push is exactly the same, does the heavy truck travel as far as the light car?',
    measure: 'How we find out: we measure how far the car travels and how far the truck travels. The two distances show what more mass does.',
    sameLabel: 'Push and surface stay the same:',
    sameValue: 'Medium push, on wood',
    changeLabel: 'What we change:',
    changeValue: 'the mass: a light car, then a heavy truck',
    doCount: '4 pushes',
    doWhy:   'The car twice, then the truck twice. Every push is the same size.',
    doSteps: [
      'The site gets each push ready for you. Above the track you will see little <dfn>tags</dfn>, like Ice and Medium push. The tags tell you what this push uses. Read the tags.',
      'Press <b>Push the car</b> or <b>Push the truck</b>.',
      'Watch where the car or the truck stops.',
      'Press the <b>Write in my table</b> button. The distance the car or the truck traveled drops into the glowing box.',
      'Do that 4 times. Then your table is full.'
    ],
    predictQ: 'Before you test &mdash; does the car or the truck go FARTHER with the very same push?',
    predictOpts: ['The car', 'The truck', 'The car and the truck go exactly the same distance', 'Neither the car nor the truck moves'],
    /* Discovery's own Activity 11 asks for repeated trials and an average on
       exactly this comparison, so one push here contradicted the district. */
    runs: [
      { surface: 'wood', push: 'medium', vehicle: 'car',   trial: 1 },
      { surface: 'wood', push: 'medium', vehicle: 'car',   trial: 2 },
      { surface: 'wood', push: 'medium', vehicle: 'truck', trial: 1 },
      { surface: 'wood', push: 'medium', vehicle: 'truck', trial: 2 }
    ]
  }
};
