/* ═══════════════════════════════════════════════════════
   SKILL TAGS — what each question is testing.
   Saved with every missed question so the teacher dashboard
   can rank skills (Focus next / Strongest).
   Every skill rolls up to NGSS 4-PS3-1 and 4-PS3-3.
═══════════════════════════════════════════════════════ */
/* L01-L05 word check  |  L06-L13 data analysis  |  L20-L25 exit ticket */
/* FEEDBACK lives on each question as `why` (a sentence, or a function of the
   student's own averages). It used to sit in a separate table in script.js
   keyed by question number; when the bank was renumbered on 10/8 that table
   was not, and for two days most questions showed another question's
   feedback — the truck question explained push size. Keeping it inside the
   question means a renumber carries it along. */
window.SKILLS = {
  L01: 'Identify forces',       L02: 'Friction slows motion',
  L03: 'Motion and position',   L04: 'Energy and work',
  L05: 'Gravity',

  L06: 'Read data to compare',  L07: 'Read data to compare',
  L08: 'Friction slows motion', L09: 'Friction slows motion',
  L10: 'More force = more distance', L11: 'Read data to compare',
  L12: 'Read data to compare',  L13: 'Height gives an object energy',
  L14: 'Height gives an object energy', L15: 'Read data to compare',
  L16: 'Mass changes how far it goes',  L17: 'Mass changes how far it goes',
  L18: 'Objects keep moving unless a force acts',
  L19: 'Friction slows motion',

  /* the two that used to be written answers */
  L20: 'Objects keep moving unless a force acts',
  L21: 'Back a claim with evidence',
  L22: 'Back a claim with evidence',

  W01: 'Explain with evidence',

  L29: 'Back a claim with evidence',
  L30: 'Back a claim with evidence',
  L31: 'Friction slows motion',

  L23: 'Identify forces',       L24: 'Friction slows motion',
  L25: 'More force = more distance', L26: 'Friction slows motion',
  L27: 'Objects keep moving unless a force acts',
  L28: 'Energy and work'
};

/* ── VOCABULARY CHECK ──────────────────────────────────
   Week 1 words from the Unit Plan. Word -> meaning. */
window.VOCAB_Q = [
  { id:'L01',
    why: "A force is a push or a pull. Kicking a ball is a push. Opening a door is a pull.", q:'What is a <b>force</b>?',
    opts:['A push or a pull on an object','A kind of metal','How heavy something is','The color of an object'], a:0 },
  { id:'L02',
    why: "Friction pushes back on anything that is moving. That is why a ball rolling on grass slows down and stops.", q:'What is <b>friction</b>?',
    opts:['A force that pushes back on a moving object and slows the object down','A force that speeds objects up','The weight of an object','A machine with wheels'], a:0 },
  { id:'L03',
    why: "Motion means something moved to a new place. A rolling ball is in a new spot every second.", q:'An object is in <b>motion</b> when the object &hellip;',
    opts:['changes position','stays in one place','gets heavier','makes a sound'], a:0 },
  { id:'L04',
    why: "Things need energy to move. Your body gets energy from food. A toy car gets energy from a battery or a push.", q:'What does an object need in order to move or do work?',
    opts:['Energy','Color','A name','Friction'], a:0 },
  { id:'L05',
    why: "Gravity pulls things down toward Earth. That is why a dropped pencil falls down, not up.", q:'What is <b>gravity</b>?',
    opts:['The force that pulls objects down toward Earth','A force that pushes objects up','A rough surface','The speed of an object'], a:0 }
];

/* ── DATA ANALYSIS ─────────────────────────────────────
   These questions are answered from the student's OWN data table.
   `resolve` is handed the averages the student actually recorded,
   so the correct answer comes from their results, not from a key.
   Questions with a fixed answer use `a` like any other item. */
window.ANALYSIS_Q = [
  { id:'L06',
    why: d => "Look at your table. " + d.farthestA + " went the farthest, " + d.maxAvgA + " cm. " + d.farthestA + " had the least friction pushing back.", inv:'A',
    q:'Look at your Investigation A table. Which surface let the cart roll the <b>farthest</b>?',
    opts:['Ice','Wood','Carpet','Sand'], resolve: d => d.farthestA },

  { id:'L07',
    why: d => "Look at your table. " + d.shortestA + " stopped the soonest, after only " + d.minAvgA + " cm. " + d.shortestA + " had the most friction.", inv:'A',
    q:'Which surface stopped the cart the <b>soonest</b>?',
    opts:['Ice','Wood','Carpet','Sand'], resolve: d => d.shortestA },

  { id:'L08',
    why: "Every push was the same. The only thing that changed was the surface. So the surface made the difference.", inv:'A',
    q:'In Investigation A you gave the cart the <b>same medium push every single time</b>. So what caused the distances to be so different?',
    opts:['The surface the cart rolled on','The cart got heavier each time','Someone pushed harder on sand','Nothing &mdash; the distances were all the same'], a:0 },

  { id:'L09',
    why: d => d.shortestA + " stopped the cart the soonest, after only " + d.minAvgA + " cm. " + d.shortestA + " pushed back the hardest, so " + d.shortestA.toLowerCase() + " had the most friction.", inv:'A',
    q:'Friction is the force that pushes back on the rolling cart. On which surface was friction the <b>strongest</b>?',
    opts:['Ice','Wood','Carpet','Sand'], resolve: d => d.shortestA },

  { id:'L10',
    why: "A bigger push gives the cart more energy. More energy means the cart rolls farther before friction stops the cart.", inv:'B',
    q:'In Investigation B the surface never changed &mdash; only the push did. When the push got <b>bigger</b>, what happened to the distance?',
    opts:['The distance got longer','The distance got shorter','The distance stayed exactly the same','The cart stopped moving'], a:0 },

  { id:'L11',
    why: "The big push gave the cart the most energy, so the cart went the farthest.", inv:'B',
    q:'Which push sent the cart the farthest on wood?',
    opts:['Small push','Medium push','Big push','All three pushes went the same distance'], a:2 },

  { id:'L12',
    why: d => "Your table shows " + d.tallestC + " sent the car the farthest. The car started higher, so the car had more energy.", inv:'C',
    q:'Look at your Investigation C table. Which ramp sent the car the <b>farthest</b>?',
    opts:['1 book','2 books','3 books','All three ramps sent the car the same distance'], resolve: d => d.tallestC },

  { id:'L13',
    why: "You did not push, and the car and the wood stayed the same. Only the height of the ramp changed, so that made the difference.", inv:'C',
    q:'In Investigation C the car and the surface never changed. You did not push the car at all &mdash; you let the car go. So what made the distances different?',
    opts:['How tall the ramp was','How hard you pushed','The colour of the car','The surface'], a:0 },

  { id:'L14',
    why: "Starting higher gives the car more energy. Think of a slide: the taller the slide, the faster you go at the bottom.", inv:'C',
    q:'A taller ramp means the car starts higher up. Starting higher gives the car more &hellip;',
    opts:['energy','friction','mass','colour'], a:0 },

  { id:'L15',
    why: d => "Your table shows " + d.fartherD.toLowerCase() + " went farther with the very same push. A lighter thing goes farther with the same push.", inv:'D',
    q:'Look at your Investigation D table. With the <b>same push</b>, did the car or the truck travel farther?',
    opts:['The car','The truck','The car and the truck went exactly the same','Neither the car nor the truck moved'], resolve: d => d.fartherD },

  { id:'L16',
    why: "The truck is heavier. The truck has more mass. The same push cannot move something heavy as far. Think of pushing an empty shopping cart, then a full one.", inv:'D',
    q:'The car and the truck got the exact same push. Why did the <b>truck</b> stop sooner?',
    opts:['The truck has more mass','The truck was on a rougher surface','The truck got a smaller push','The truck has no friction'], a:0 },

  { id:'L17',
    why: "A heavy truck needs a bigger push to go as far. A bigger push gives the truck more energy.", inv:'D',
    q:'What could you do to make the <b>truck</b> travel as far as the car?',
    opts:['Push the truck harder','Push the truck more softly','Use a rougher surface','Nothing would work'], a:0 },

  { id:'L18',
    why: "With almost no friction, nothing slows the cart down, so the cart keeps moving for a long time. That is the big idea of this lesson.", inv:'&mdash;',
    q:'A cart is rolling across smooth ice. Nothing is in the way of the cart and almost no friction is pushing back. What will the cart do?',
    opts:['Keep moving for a long time','Stop right away','Turn around and come back','Speed up with no push'], a:0 },

  { id:'L19',
    why: "Carpet is rough and fuzzy, so carpet grabs the cart. Ice is smooth. Rough surfaces have more friction.", inv:'&mdash;',
    q:'Two carts get the exact same push. One rolls on carpet and one rolls on ice. Which cart has <b>more friction</b> pushing back?',
    opts:['The cart on carpet','The cart on ice','Both carts have the same friction','Neither cart has friction'], a:0 }
];

/* ── CLAIM AND EVIDENCE ────────────────────────────────
   Two of the three written explanations became selected-response so Mr. O
   grades 22 pieces of writing instead of 66. What stayed written is W01,
   because 4-PS3-1 asks students to CONSTRUCT an explanation and a multiple
   choice item only tests whether they can recognise one.

   L20 and L21 are a two-part claim-then-evidence pair, the same shape as the
   Part A / Part B items on the SBAC review sites. L22 is built from the
   student's own four predictions.

   `qFrom` and `optsFrom` are handed the student's own averages, so the
   question and the choices are made out of their data, not a fixed key. */
window.CLAIMS_Q = [
  { id:'L20',
    why: "A moving thing keeps moving until a force stops that thing. On Earth friction is almost always there, so moving things do stop. A force is always what stops a moving thing.", part:'A',
    q:'A friend tells you, &ldquo;Once something is moving, that thing will just keep moving forever.&rdquo; ' +
      'Is your friend right?',
    opts:[
      'Partly right &mdash; a moving thing keeps moving until a force stops that thing',
      'Completely right &mdash; moving things never stop on their own',
      'Completely wrong &mdash; moving things always stop by themselves',
      'The answer depends on how heavy the object is'
    ], a:0 },

  { id:'L21',
    why: d => "That is your strongest evidence. Even on " + d.farthestA.toLowerCase() + ", where the cart went " + d.maxAvgA + " cm, the cart still stopped. Something stopped the cart: friction.", part:'B',
    q:'Now show your proof. Which piece of <b>your own data</b> best backs up the answer you just picked?',
    optsFrom: d => [
      'On ' + d.farthestA.toLowerCase() + ' the cart rolled about ' + d.maxAvgA + ' cm, and the cart still stopped',
      'On ' + d.shortestA.toLowerCase() + ' the cart stopped after only ' + d.minAvgA + ' cm',
      'The big push went farther than the small push',
      'The truck did not go as far as the car'
    ],
    resolve: d => 'On ' + d.farthestA.toLowerCase() + ' the cart rolled about ' + d.maxAvgA + ' cm, and the cart still stopped' },

  { id:'L22', adaptive:true, q:'', opts:[] },

  /* ── THE EXPLANATION, BUILT BY PICKING ──────────────
     This replaces the written response. Marcos ruled 10/8/2026: typing it
     was too much for the period, and the tap-to-insert starters that
     replaced the blanks would confuse the class just as badly.

     So the explanation is now three picks — claim, then evidence, then
     reasoning — and the three are stitched into one paragraph and shown
     back to the student at the end. They do not write it. They still watch
     it get built, in the right order, out of their own numbers.

     Known trade: 4-PS3-1 asks a student to CONSTRUCT an explanation, and
     choosing from four options tests recognition. Marcos's call, with the
     period and the reading levels in front of him. */
  { id:'L29',
    why: d => "That is your claim: " + d.shortestA.toLowerCase() + " stopped the cart the soonest.", cer:'claim',
    q:'Time to explain your Investigation A results. Start with your <b>claim</b>. ' +
      'Which surface stopped the cart the soonest?',
    opts:['Ice','Wood','Carpet','Sand'], resolve: d => d.shortestA },

  { id:'L30',
    why: "Those two numbers are your evidence. They show the biggest difference in your whole table.", cer:'evidence',
    q:'Now the <b>evidence</b>. Which two numbers from <b>your own table</b> show your claim best?',
    optsFrom: d => [
      'On ' + d.farthestA.toLowerCase() + ' the cart rolled ' + d.maxAvgA +
        ' cm, but on ' + d.shortestA.toLowerCase() + ' only ' + d.minAvgA + ' cm',
      'On ' + d.farthestA.toLowerCase() + ' the cart rolled ' + d.maxAvgA + ' cm',
      'Every surface gave about the same number',
      'The truck did not go as far as the car'
    ],
    resolve: d => 'On ' + d.farthestA.toLowerCase() + ' the cart rolled ' + d.maxAvgA +
      ' cm, but on ' + d.shortestA.toLowerCase() + ' only ' + d.minAvgA + ' cm' },

  { id:'L31',
    why: "That is your reasoning. The surface with the most friction pushes back the hardest, so that surface stops the cart soonest.", cer:'reasoning',
    q:'Last part &mdash; the <b>reasoning</b>. WHY did that surface stop the cart soonest?',
    optsFrom: d => [
      'That surface has the most friction, and friction slows a moving object down',
      'That surface got a smaller push than the other surfaces',
      'The cart was heavier on that surface',
      'There is no reason &mdash; the cart just stopped there'
    ],
    resolve: d => 'That surface has the most friction, and friction slows a moving object down' }
];

/* The explanation that fits each investigation, plus three wrong turns that
   sound reasonable to a fourth grader. The last distractor is deliberate: it
   is the "science is just random" belief, and it is worth catching. */
window.WHY_BANK = {
  A: 'A rougher surface has MORE friction, so a rougher surface stops the cart sooner &mdash; not farther',
  B: 'A bigger push gives the cart more energy, so the cart travels farther',
  C: 'Starting higher up gives the car more energy, so a taller ramp sends the car farther',
  D: 'Both got the same push, but friction slows the heavier truck down sooner'
};
window.WHY_DISTRACTORS = [
  'The measuring went wrong, so the numbers in my table cannot be trusted',
  'The result was luck. If I ran the test again the other answer would probably win',
  'Nothing explains the result. Sometimes science just does not make sense'
];

/* ── WRITTEN RESPONSE ──────────────────────────────────
   Claim - Evidence - Reasoning. Scored by Mr. O, not by the site:
   the site checks only that real work was written. */
/* Sentence frames: a student who cannot start a paragraph can still build the
   explanation. The frame gives the STRUCTURE only — every blank is a decision
   the student has to make, and the site will not accept a turned-in answer that
   still has a blank in it, so the frame cannot be used to meet the length rule
   without doing the thinking. */
window.WRITTEN_Q = [
  { id:'W01', min:140,
    /* NOT a fill-in-the-blank frame. Marcos watched blank-filling fail on the
       reading test 10/8/2026: a template full of ____ asks a struggling writer
       to edit inside someone else's sentence, which is harder than writing,
       and a half-edited template looks like failure on the screen.
       These are starters you TAP. Each one drops its words into the student's
       own box at the cursor and leaves them writing forward. Nothing is ever
       deleted, nothing has to be edited in place, and a tap can always be
       undone by backspacing like any other typing. */
    starters:[
      'The cart stopped sooner on',
      'On ice the cart rolled',
      'On sand the cart rolled only',
      'This happened because',
      'There is more friction on'
    ],
    /* The words this task needs that a Level-1 speller will stall on. */
    wordbank:['friction', 'sand', 'ice', 'centimeters', 'surface', 'distance'],
    q:'Explain why the cart stopped much sooner on <b>sand</b> than on <b>ice</b>, even though you gave the cart the same push every time.',
    hints:['<b>Claim</b> &mdash; say which surface stopped the cart sooner.',
           '<b>Evidence</b> &mdash; use two real numbers from your data table.',
           '<b>Reasoning</b> &mdash; use the word <i>friction</i> to explain why.'] }
];

/* ── EXIT TICKET ───────────────────────────────────────
   Six items. L24 and L21 target the Unit Plan misconception
   that an object in motion does not keep moving unless an
   unbalanced force acts on it. */
window.EXIT_Q = [
  { id:'L23',
    why: "Pulling a wagon is a force, because a pull is a force. Color, name and age are not pushes or pulls.", q:'Which of these is a <b>force</b>?',
    opts:['Pulling a wagon','The color of a wagon','The name of a wagon','How old a wagon is'], a:0 },
  { id:'L24',
    why: "Friction between the ball and the grass slowed the ball down and stopped the ball.", q:'A soccer ball rolls across the grass. The ball slows down and stops. Which force slowed the ball down?',
    opts:['Friction','Sound','Light','Magnetism'], a:0 },
  { id:'L25',
    why: "Cart B got more force. More force gives Cart B more energy, so Cart B goes farther.", q:'Two carts roll on the same wooden floor. Cart A gets a small push. Cart B gets a big push. Which cart travels farther?',
    opts:['Cart B, because Cart B got more force','Cart A, because Cart A got less force','Both carts go exactly the same distance','Neither cart moves'], a:0 },
  { id:'L26',
    why: "Snow is smoother than grass, so snow has less friction. Less friction means the sled slides farther.", q:'Why does a sled go farther on snow than on grass?',
    opts:['There is less friction on snow','Snow is colder than grass','The sled is heavier on snow','Gravity is stronger on snow'], a:0 },
  { id:'L27',
    why: "A moving thing keeps moving until a force acts on that thing, like friction, a wall, or a hand.", q:'An object that is moving will keep moving unless &hellip;',
    opts:['an unbalanced force acts on the object','someone looks at the object','the object gets tired','the sun goes down'], a:0 },
  { id:'L28',
    why: "The hard push gave that cart more energy of motion. More push, more energy.", q:'Two carts are the same size. One is pushed hard and one is pushed softly. Which cart has <b>more energy of motion</b>?',
    opts:['The cart pushed hard','The cart pushed softly','Both carts have the same energy','Neither cart has energy'], a:0 }
];

/* ═══════════════════════════════════════════════════════
   THE CORE SET — what fits two thirty-minute sessions.

   The bank above is the whole lesson. It is 28 scored items across
   11 skills, and 17 of those 28 are the second-or-later ask of a
   skill already tested: friction is asked six times, reading the
   data table five. Asking a Level-1 reader the same thing six times
   is not rigour, it is the reason the lesson did not fit.

   CORE keeps ONE ask per skill — the one tied to the investigation
   the student has just run, so their own numbers are still on the
   screen when they answer. Nine of the eleven skills are tested.
   The two that are not, "motion and position" and "gravity", are
   still TAUGHT on the vocabulary screen and are reinforced on IXL
   (XPH, 8GH) — see the lesson plan.

   Everything cut stays in the file. Set CORE_ONLY to false and the
   full bank comes back for the take-anywhere tail: WIN block, home,
   a sub day.

   Session 1   vocab + Investigation A   -> L01 L02 L06 L09   (8 runs)
   Session 2   Investigations B, C, D    -> L10 L14 L16 L18
                                            L20 L21 W01 L26 L28  (8 runs)
═══════════════════════════════════════════════════════ */
window.CORE_ONLY = true;
window.CORE_IDS = ['L01','L02','L06','L09','L10','L14','L16','L18',
                   'L20','L21','L29','L30','L31','L26','L28'];

if (window.CORE_ONLY) {
  const keep = a => a.filter(q => window.CORE_IDS.indexOf(q.id) !== -1);
  window.VOCAB_Q    = keep(window.VOCAB_Q);
  window.ANALYSIS_Q = keep(window.ANALYSIS_Q);
  window.CLAIMS_Q   = keep(window.CLAIMS_Q);
  window.EXIT_Q     = keep(window.EXIT_Q);
  window.WRITTEN_Q  = keep(window.WRITTEN_Q);
}
