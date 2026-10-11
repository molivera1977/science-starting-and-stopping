/* ═══════════════════════════════════════════════════════
   SKILL TAGS — what each question is testing.
   Saved with every missed question so the teacher dashboard
   can rank skills (Focus next / Strongest).
   Every skill rolls up to NGSS 4-PS3-1 and 4-PS3-3.
═══════════════════════════════════════════════════════ */
/* L01-L05 word check  |  L06-L19 data questions  |  L20-L22, L29-L31 explanation
   L23-L28 exit ticket  |  L32-L33 cart check  |  L34-L36 what we talked about
   L37-L38 plan check */
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
  L28: 'Energy and work',

  /* the cart check, right after Meet your cart */
  L32: 'What the distance tells us', L33: 'What the distance tells us',

  /* the check after What we just talked about: one question for each of the
     three things Mr. O showed */
  L34: 'Identify forces', L35: 'Friction slows motion', L36: 'Friction slows motion',

  /* the check after Here is the plan */
  L37: 'Plan a fair test', L38: 'Plan a fair test'
};

/* ── VOCABULARY CHECK ──────────────────────────────────
   Week 1 words from the Unit Plan. Word -> meaning. */
/* `word` says which word a question checks. The word check asks only the
   words that get a page of their own in the word section (motion, energy,
   gravity). Marcos 10/11: "quiz the other words not force and friction
   again" — force and friction are checked right after What we just talked
   about (L34, L35), so L01 and L02 are out of the asked set (CORE_IDS). */
window.VOCAB_Q = [
  { id:'L01', word:'force',
    why: "A force is a push or a pull. Kicking a ball is a push. Opening a door is a pull.", q:'What is a <b>force</b>?',
    opts:['A push or a pull on an object','A kind of metal','How heavy something is','The color of an object'], a:0 },
  { id:'L02', word:'friction',
    why: "Friction pushes back on anything that is moving. That is why a ball rolling on grass slows down and stops.", q:'What is <b>friction</b>?',
    opts:['A force that pushes back on a moving object and slows the object down','A force that speeds objects up','The weight of an object','A machine with wheels'], a:0 },
  { id:'L03', word:'motion',
    why: "Motion means something moved to a new place. A rolling ball is in a new spot every second.", q:'An object is in <b>motion</b> when the object &hellip;',
    opts:['changes position','stays in one place','gets heavier','makes a sound'], a:0 },
  { id:'L04', word:'energy',
    why: "Things need energy to move. Your body gets energy from food. A toy car gets energy from a battery or a push.", q:'What does an object need in order to move or do work?',
    opts:['Energy','Color','A name','Friction'], a:0 },
  { id:'L05', word:'gravity',
    why: "Gravity pulls things down toward Earth. That is why a dropped pencil falls down, not up.", q:'What is <b>gravity</b>?',
    opts:['The force that pulls objects down toward Earth','A force that pushes objects up','A rough surface','The speed of an object'], a:0 }
];

/* ── UNDERSTANDING CHECKS ──────────────────────────────
   Marcos 10/11: "I want the pattern for all Science lessons to have frequent
   understanding checks." A student should never go far past something they
   were taught without being asked about that thing.

   So a check is a short set of questions, two or three, asked RIGHT AFTER
   the thing the questions are about:
     sumq     after What we just talked about  (SUM_Q, below)
     cartq    after Meet your cart             (CART_Q)
     planq    after Here is the plan           (PLAN_Q)
     vq       after the six words              (VOCAB_Q)
     checkA-D after each test's results        (that test's questions, from ANALYSIS_Q)
   The questions about a test used to wait in one block of fourteen on Day 3,
   two days after Test 1. Now each test is followed by its own. What is left
   for Day 3's "What does my data say?" are the look-back questions.

   CHECKS says which questions belong to which check and which page the
   check comes right `after`. A check with a `bank` asks that whole list; a
   check with `ids` asks those questions out of ANALYSIS_Q, and an ANALYSIS_Q
   question listed in no check is asked on Day 3. The place each check sits
   is its name in PHASES (script.js). qa.js C27 holds the pattern.

   The three checks before the name page (sumq, cartq, planq) are answered
   before the lesson knows who the student is; the answers go with the
   student at "Start the lesson". */

/* Marcos 10/11: "add a check after what we talked about and the plan."
   What we just talked about shows three things; one question for each.
   Nothing here may mention the cart: the cart is not met until the next page. */
window.SUM_Q = [
  { id:'L34',
    why: "Pulling a chair is a pull. A pull is a force. A color, a name and an age are not pushes or pulls.",
    q:'A <b>force</b> is a push or a pull. Which one is a force?',
    opts:['Pulling a chair','The color of a chair','The name of a chair','How old a chair is'], a:0 },
  { id:'L35',
    why: "That rubbing is friction. Friction pushes back on anything that moves.",
    q:'You rub your hands together. Your hands get warm. What is that rubbing called?',
    opts:['A pull','Friction','A surface','A color'], a:1 },
  { id:'L36',
    why: "A rougher surface has more friction. Your sleeve was harder to slide on than your desk. More friction stops things sooner.",
    q:'Which surface has <b>more friction</b>?',
    opts:['A smooth surface, like your desk','A rough surface, like your sleeve','Both surfaces have the same friction','No surface has friction'], a:1 }
];

/* Here is the plan: what changes in the first test, and what a student does
   every single time. */
window.PLAN_Q = [
  { id:'L37',
    why: "In Test 1 you push the cart on ice, wood, carpet and sand. Only the surface changes.",
    q:'What changes in <b>Test 1</b>?',
    opts:['How hard the push is','The surface the cart rolls on','How tall the ramp is','The color of the cart'], a:1 },
  { id:'L38',
    why: "Every single time, you measure the distance the cart traveled. Then you write the distance in your data table.",
    q:'What do you do <b>every single time</b> the cart stops?',
    opts:['Measure the distance and write the distance in my data table','Pick a new name','Start the lesson over','Guess the distance'], a:0 }
];

window.CART_Q = [
  { id:'L32',
    why: "After every push we measure the distance. The distance is how far the cart travels, from START to the spot where the cart stops.",
    q:'What do we <b>measure</b> after every push?',
    opts:['The distance the cart travels','The color of the cart','How loud the cart is','How heavy the cart is'], a:0 },
  { id:'L33',
    why: "A short distance means something stopped the cart fast. A long distance means not much slowed the cart down.",
    q:'The cart travels a <b>short distance</b>. What does a short distance tell us?',
    opts:['Nothing slowed the cart down','Something stopped the cart fast','The cart is broken','The push was too big'], a:1 }
];

window.CHECKS = {
  sumq:   { title:'What we talked about',  about:'what we talked about', after:'summary', bank:'SUM_Q' },
  cartq:  { title:'Cart check',            about:'the cart',             after:'cart',    bank:'CART_Q' },
  planq:  { title:'Plan check',            about:'the plan',             after:'plan',    bank:'PLAN_Q' },
  /* each test: first read the data table, then say what the test showed */
  checkA: { title:'What did Test 1 show?', about:'Test 1', after:'graphA', inv:'A', ids:['L06','L08','L09'] },
  checkB: { title:'What did Test 2 show?', about:'Test 2', after:'graphB', inv:'B', ids:['L11','L10'] },
  checkC: { title:'What did Test 3 show?', about:'Test 3', after:'graphC', inv:'C', ids:['L12','L14'] },
  checkD: { title:'What did Test 4 show?', about:'Test 4', after:'graphD', inv:'D', ids:['L15','L16'] }
};

/* ── DATA ANALYSIS ─────────────────────────────────────
   These questions are answered from the student's OWN data table.
   `resolve` is handed the averages the student actually recorded,
   so the correct answer comes from their results, not from a key.
   Questions with a fixed answer use `a` like any other item. */
window.ANALYSIS_Q = [
  { id:'L06',
    why: d => "Look at your data table. On " + d.farthestA.toLowerCase() + " the cart traveled the farthest, " + d.maxAvgA + " cm. " + d.farthestA + " had the least friction pushing back.", inv:'A',
    q:'Look at your Test 1 data table. Which surface let the cart roll the <b>farthest</b>?',
    opts:['Ice','Wood','Carpet','Sand'], resolve: d => d.farthestA },

  { id:'L07',
    why: d => "Look at your data table. On " + d.shortestA.toLowerCase() + " the cart stopped the soonest, after only " + d.minAvgA + " cm. " + d.shortestA + " had the most friction.", inv:'A',
    q:'Which surface stopped the cart the <b>soonest</b>?',
    opts:['Ice','Wood','Carpet','Sand'], resolve: d => d.shortestA },

  { id:'L08',
    why: "Every push was the same. The only thing that changed was the surface. So the surface made the difference.", inv:'A',
    q:'In Test 1 you gave the cart the <b>same medium push every single time</b>. So what caused the cart to travel such different distances?',
    opts:['The surface the cart rolled on','The cart got heavier each time','Someone pushed harder on sand','Nothing &mdash; the cart traveled the same distance every time'], a:0 },

  { id:'L09',
    why: d => d.shortestA + " stopped the cart the soonest, after only " + d.minAvgA + " cm. " + d.shortestA + " pushed back the hardest, so " + d.shortestA.toLowerCase() + " had the most friction.", inv:'A',
    q:'Friction is the force that pushes back on the rolling cart. On which surface was friction the <b>strongest</b>?',
    opts:['Ice','Wood','Carpet','Sand'], resolve: d => d.shortestA },

  { id:'L10',
    why: "A bigger push gives the cart more energy. More energy means the cart rolls farther before friction stops the cart.", inv:'B',
    q:'In Test 2 the surface never changed &mdash; only the push did. When the push got <b>bigger</b>, what happened to the distance the cart traveled?',
    opts:['The cart traveled a longer distance','The cart traveled a shorter distance','The cart traveled exactly the same distance','The cart stopped moving'], a:0 },

  { id:'L11',
    why: "The big push gave the cart the most energy, so the cart went the farthest.", inv:'B',
    q:'Which push sent the cart the farthest on wood?',
    opts:['Small push','Medium push','Big push','All three pushes sent the cart the same distance'], a:2 },

  { id:'L12',
    why: d => "Your table shows " + d.tallestC + " sent the car the farthest. The car started higher, so the car had more energy.", inv:'C',
    q:'Look at your Test 3 data table. Which ramp sent the car the <b>farthest</b>?',
    opts:['1 book','2 books','3 books','All three ramps sent the car the same distance'], resolve: d => d.tallestC },

  { id:'L13',
    why: "You did not push, and the car and the wood stayed the same. Only the height of the ramp changed, so that made the difference.", inv:'C',
    q:'In Test 3 the car and the surface never changed. You did not push the car at all &mdash; you let the car go. So what made the car travel different distances?',
    opts:['How tall the ramp was','How hard you pushed','The color of the car','The surface'], a:0 },

  { id:'L14',
    why: "Starting higher gives the car more energy. Think of a slide: the taller the slide, the faster you go at the bottom.", inv:'C',
    q:'A taller ramp means the car starts higher up. Starting higher gives the car more &hellip;',
    opts:['energy','friction','surface','color'], a:0 },

  { id:'L15',
    why: d => "Your table shows " + d.fartherD.toLowerCase() + " went farther with the very same push. A lighter thing goes farther with the same push.", inv:'D',
    q:'Look at your Test 4 data table. With the <b>same push</b>, did the car or the truck travel farther?',
    opts:['The car','The truck','The car and the truck went exactly the same','Neither the car nor the truck moved'], resolve: d => d.fartherD },

  { id:'L16',
    why: "The truck is heavier. The truck has more mass. The same push cannot move something heavy as far. Think of pushing an empty shopping cart, then a full shopping cart.", inv:'D',
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
/* `inv` says whose data sits on the screen with a question: 'A'-'D' is that
   test's data table, 'all' is all four. Marcos 10/11, on the first claim
   question with no table in sight: "shouldn't they be able to see their data
   when answering the explain questions. It should be right there." The
   claim, the evidence and the reasoning are about Test 1; the friend question
   and its proof draw on every test. qa.js C30 holds this for every question
   that is answered from the student's own data. */
window.CLAIMS_Q = [
  { id:'L20', inv:'all',
    why: "A moving thing keeps moving until a force stops that thing. On Earth friction is almost always there, so moving things do stop. A force is always what stops a moving thing.", part:'A',
    q:'A friend tells you, &ldquo;Once something is moving, that thing will just keep moving forever.&rdquo; ' +
      'Is your friend right?',
    opts:[
      'Partly right &mdash; a moving thing keeps moving until a force stops that thing',
      'Completely right &mdash; moving things never stop on their own',
      'Completely wrong &mdash; moving things always stop by themselves',
      'The answer depends on how heavy the object is'
    ], a:0 },

  { id:'L21', inv:'all',
    why: d => "That is your strongest evidence. Even on " + d.farthestA.toLowerCase() + ", where the cart went " + d.maxAvgA + " cm, the cart still stopped. Something stopped the cart: friction.", part:'B',
    q:'Now show your proof. Which piece of <b>your own data</b> best backs up the answer you just picked?',
    optsFrom: d => [
      'On ' + d.farthestA.toLowerCase() + ' the cart rolled about ' + d.maxAvgA + ' cm, and the cart still stopped',
      'On ' + d.shortestA.toLowerCase() + ' the cart stopped after only ' + d.minAvgA + ' cm',
      'The big push sent the cart farther than the small push',
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
  { id:'L29', inv:'A',
    why: d => "That is your claim: " + d.shortestA.toLowerCase() + " stopped the cart the soonest.", cer:'claim',
    q:'Time to explain what happened in Test 1. Start with your <b>claim</b>. A <dfn>claim</dfn> is what you think is true. ' +
      'Which surface stopped the cart the soonest?',
    opts:['Ice','Wood','Carpet','Sand'], resolve: d => d.shortestA },

  { id:'L30', inv:'A',
    why: "Those two distances are your evidence. Those two distances show the biggest difference in your whole data table.", cer:'evidence',
    q:'Now the <b>evidence</b>. <dfn>Evidence</dfn> is the distances that prove your claim. Which two distances from <b>your own data table</b> show your claim best?',
    optsFrom: d => [
      'On ' + d.farthestA.toLowerCase() + ' the cart rolled ' + d.maxAvgA +
        ' cm, but on ' + d.shortestA.toLowerCase() + ' only ' + d.minAvgA + ' cm',
      'On ' + d.farthestA.toLowerCase() + ' the cart rolled ' + d.maxAvgA + ' cm',
      'The cart traveled about the same distance on every surface',
      'The truck did not go as far as the car'
    ],
    resolve: d => 'On ' + d.farthestA.toLowerCase() + ' the cart rolled ' + d.maxAvgA +
      ' cm, but on ' + d.shortestA.toLowerCase() + ' only ' + d.minAvgA + ' cm' },

  { id:'L31', inv:'A',
    why: "That is your reasoning. The surface with the most friction pushes back the hardest, so that surface stops the cart soonest.", cer:'reasoning',
    q:'Last part &mdash; the <b>reasoning</b>. <dfn>Reasoning</dfn> is the reason why. WHY did that surface stop the cart soonest?',
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
  'The measuring went wrong, so the distances in my data table cannot be trusted',
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
           '<b>Evidence</b> &mdash; use two real distances from your data table.',
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
   THE CORE SET — which questions of the bank above are asked.

   The bank is the whole lesson. When the lesson had to fit two
   thirty-minute sessions it was cut to ONE ask per skill, fifteen
   questions, most of them in a block on the last day.

   10/11, three days now, and Marcos: "I want the pattern for all
   Science lessons to have frequent understanding checks", two or three
   questions at a time. So every check has at least two: the question
   that reads the data table and the question that says what the test
   showed. That brought five questions back (L08 L11 L12 L15 L19) and
   added the two about the cart (L32 L33). Then "add a check after what
   we talked about and the plan" added L34-L38. Then the word check moved
   off force and friction (L01 L02 out) onto the three words not yet
   talked about (L03 L04 L05 in): 28 scored questions.

   Day 1  what we talked about L34 L35 L36 · cart check L32 L33 ·
          plan check L37 L38 · word check L03 L04 L05 · Test 1 check L06 L08 L09
   Day 2  Test 2 check L11 L10 · Test 3 check L12 L14
   Day 3  Test 4 check L15 L16 · look back L18 L19 ·
          explanation L20 L21 L29 L30 L31 · exit ticket L26 L28

   Still cut, still in the file: L01 L02 L07 L13 L17 L22-L25 L27.
   Set CORE_ONLY to false and the full bank comes back.
═══════════════════════════════════════════════════════ */
window.CORE_ONLY = true;
window.CORE_IDS = ['L34','L35','L36','L32','L33','L37','L38','L03','L04','L05','L06','L08','L09','L11','L10','L12','L14','L15','L16','L18','L19',
                   'L20','L21','L29','L30','L31','L26','L28'];

if (window.CORE_ONLY) {
  const keep = a => a.filter(q => window.CORE_IDS.indexOf(q.id) !== -1);
  window.SUM_Q      = keep(window.SUM_Q);
  window.CART_Q     = keep(window.CART_Q);
  window.PLAN_Q     = keep(window.PLAN_Q);
  window.VOCAB_Q    = keep(window.VOCAB_Q);
  window.ANALYSIS_Q = keep(window.ANALYSIS_Q);
  window.CLAIMS_Q   = keep(window.CLAIMS_Q);
  window.EXIT_Q     = keep(window.EXIT_Q);
  window.WRITTEN_Q  = keep(window.WRITTEN_Q);
}
