/* ══════════════════════════════════════════════════════
   QA — the one check that runs before every push

   Why this exists (10/9/2026): too many defects reached Marcos. Each one was
   a block type, phase or path that a hand-kept list did not know about, and
   each check I ran was written after the fact for the thing I had just
   thought of. This walks EVERY screen the same way every time.

   Run it: open the lesson with ?qa in the address. It does not run otherwise.
   It never sends anything to the sheet, and it puts back whatever was in
   this browser's storage when it started.

   What it checks:
     C1  closing the tab on the cover does not wipe a saved lesson
     C2  the opening path goes cover → why → care → summary → sumq → cart → cartq → plan →
         planq → goals → start
     C3  nothing starts talking on its own when a page opens
     C4  every preview stop shows exactly one screen, in the right phase
     C5  every visible piece of text belongs to a block that can be read aloud
     C6  every readable block has its own speaker (or its step's Listen button)
     C7  the word being read lights up, in every block, and the block is
         put back exactly as it was afterwards
     C8  no uncaught errors anywhere
     C9  no rows sent to the sheet
     C10 storage is unchanged at the end
     C11 nothing mentions the cart before the Meet your cart page
     C12 every question has its own feedback
     C13 no text a student reads is under 16px
     C14 guided screens: Next does not exist until every step was heard to
         the end, in order; stopping the voice early does not count
     C15 the teacher preview reaches every page of every guided screen
     C16 on a guided page a heading is read with its step, with no speaker
         of its own
     C17 student text names the thing and does not say "it"
     C18 every watched word is explained (<dfn>), in the lesson's own flow, at
         or before the first screen that uses it — the help panel does not count
     C19 student text says what was measured, not "your number"
     C20 a label is read with the line under it, on every screen
     C21 after every Listen the next thing to press is on screen, clear of
         the pinned help bar
     C22 after every push the helper says something (with a speaker), and
         the button and the glowing box of the table are on screen; on a
         Chromebook-size window the cart is on screen with them
     C23 no screen is wider than the window (no sideways scroll)
     C24 a lesson saved when each setup had a different number of pushes is
         made to fit: pushes that no longer line up are dropped and the
         student goes back to the first test that is not full; a save that
         already fits is left exactly as it is
     C25 the name page never clears saved work on one tap: with saved work
         "Pick up where I left off" is the big button, starting over asks
         for the teacher PIN (also when the saved work is under another
         name, and also when the saved lesson is finished), a student with
         nothing saved still starts with one tap, and a saved lesson is
         picked up with its pushes
     C26 the name page asks only for a name: almost nothing to read on it,
         and every "I can" line is inside a step of the locked page before it
     C28 Day 1 previews the later days and does not walk through their plan:
         the plan page shows today's test in full and the later days in one
         short step; the End of Day 1 page says one short thing about next time
     C29 the word section: a word already explained on an earlier page gets
         one short reminder, a word that is new gets its own page with an
         example, and the word check asks every new word and no word that
         was already checked
     C30 a question answered from the student's own data has the data table
         on the screen with it: every check after a test, the look back, and
         every explanation question; and the right test's table
     C27 frequent understanding checks: What we just talked about, Meet your
         cart, Here is the plan, the six words and every test's results page
         are each followed at once by a check of two or three questions about
         that thing; every scored question is asked exactly once, with
         feedback and a skill; the checks before the name page are answered
         on the way in and their answers go with the student who then picks
         a name; a lesson saved before a check existed is sent to that check
         and then back to where the student was
   It also lists how many words each screen asks a student to take in, and
   how many words each guided screen makes them listen to.

   The voice is replaced by a stand-in while the guided screens are tested,
   so C14 tests the lock, not the device's speech. Real speech has to be
   tried by ear on a real device.
═══════════════════════════════════════════════════════ */
(async function () {
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const KEY = 'sci_startstop_session_v1';
  const results = [];
  const rec = (id, label, pass, detail) => results.push({ id, label, pass, detail: detail || '' });
  const errors = [];
  window.addEventListener('error', e => errors.push(e.message));

  let sends = 0;
  const realFetch = window.fetch;
  window.fetch = function (u, o) { if (o && o.method === 'POST') sends++; return realFetch.apply(this, arguments); };

  const original = {};
  for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); original[k] = localStorage.getItem(k); }

  const visible = () => [...document.querySelectorAll('section')].filter(s => !s.classList.contains('hidden'));
  const shown = el => !!el && el.offsetParent !== null && getComputedStyle(el).visibility !== 'hidden';
  const wordsIn = t => (String(t).match(/[A-Za-z0-9']+/g) || []).length;
  const hush = () => { try { speechSynthesis.cancel(); speech.stop(); } catch (e) {} };
  await wait(900); hush();

  /* C1 */
  localStorage.setItem(KEY, JSON.stringify({ studentName: 'QA STUDENT', phase: 'runB',
    data: { A: [1, 2, 3, 4, 5, 6, 7, 8], B: [], C: [], D: [] }, runIndex: { A: 8, B: 0, C: 0, D: 0 } }));
  window.dispatchEvent(new Event('beforeunload'));
  const kept = JSON.parse(localStorage.getItem(KEY) || 'null');
  rec('C1', 'Closing on the cover keeps a saved lesson', !!kept && kept.studentName === 'QA STUDENT' &&
      kept.data.A.length === 8, kept ? (kept.studentName || '(no name)') + ', ' + kept.data.A.length + ' pushes' : 'save gone');
  /* Put back what was there. Removing the key outright made C10 fail on any
     browser that already held a saved lesson — the check blamed the lesson
     for a change this test made itself. */
  if (KEY in original) localStorage.setItem(KEY, original[KEY]); else localStorage.removeItem(KEY);

  /* ── the guided screens ──────────────────────────────────
     A stand-in for the voice: it "finishes" at once, or is "stopped early"
     when endOk is false. Anything that asks it to speak when this test did
     not press a button is the page talking on its own. */
  const realSay = speech.sayParts;
  let qaTap = false, endOk = true;
  const selfTalk = [], gateBad = [], listen = [], offScreen = [];
  guide.instant = true;      /* no scroll animation: positions can be read at once */
  /* C21 — after every Listen, the next thing to press is on screen, clear of
     the "Stuck? Tap here" bar. Marcos 10/10: "the page should move up so they
     see the next button." */
  const inView = el => { const r = el.getBoundingClientRect();
    return r.top >= 0 && r.bottom <= innerHeight - guide.barHeight() + 1; };
  speech.sayParts = function (parts, rate, onEnd, onStart) {
    if (!qaTap) selfTalk.push(app.phase);
    if (onStart) onStart();
    if (onEnd) setTimeout(() => onEnd(endOk, endOk ? 'ended' : 'cancelled'), 0);
  };
  const press = async btn => { qaTap = true; btn.click(); qaTap = false; await wait(40); };

  /* Do what a student has to do on the guided screen inside `sec`, and note
     anything the lock let through. `after` is what must stay out of reach
     until the last step has been heard. */
  async function gateCheck(name, sec, after) {
    const steps = () => [...sec.querySelectorAll('.gstep')];
    const done = () => steps().filter(e => e.classList.contains('g-done')).length;
    if (!steps().length) { gateBad.push(name + ': no steps at all'); return; }
    const tally = { screen: name, steps: steps().length, words: 0 };
    listen.push(tally);
    /* what one press of Listen makes them hear: the step and its headings */
    const heardWith = step => wordsIn(speech.textOf(step)) +
      [...sec.querySelectorAll('.glead')].filter(l => l._gstep === step && shown(l))
        .reduce((n, l) => n + wordsIn(speech.textOf(l)), 0);

    if (shown(after)) gateBad.push(name + ': Next is reachable before anything was heard');
    const open = steps().filter(shown);
    if (!open[0] || !open[0].classList.contains('g-live')) gateBad.push(name + ': the first step is not open');
    if (open.slice(1).some(e => !e.classList.contains('g-locked'))) gateBad.push(name + ': a later step is open too early');

    /* stopping the voice early must not count */
    endOk = false;
    await press(open[0].querySelector('.gbtn'));
    endOk = true;
    if (done() !== 0) gateBad.push(name + ': stopping the voice early still unlocked the step');

    let guard = 0;
    while (guard++ < 120) {
      const live = steps().filter(e => e.classList.contains('g-live')).find(shown);
      if (live) {
        const before = done();
        if (shown(after)) { gateBad.push(name + ': Next appeared with a step still unheard'); break; }
        tally.words += heardWith(live);
        await press(live.querySelector('.gbtn'));
        if (done() !== before + 1) { gateBad.push(name + ': a step did not unlock after it was heard'); break; }
        /* what does the student press now? It has to be where they can see it. */
        const nextLive = steps().filter(e => e.classList.contains('g-live')).find(shown);
        const todo = (nextLive && nextLive.querySelector('.gbtn')) || [...sec.querySelectorAll('.gnext')].find(shown) ||
                     (shown(after) ? after : null);
        if (todo && !inView(todo)) await wait(700);      /* some screens settle a moment later */
        if (todo && !inView(todo) && todo.getBoundingClientRect().height < innerHeight - 140)
          offScreen.push(name + ' after step ' + (before + 1) + ': "' + (todo.textContent || '').trim().slice(0, 24) + '"');
        continue;
      }
      const nx = [...sec.querySelectorAll('.gnext')].find(shown);
      if (nx) { nx.click(); await wait(60); continue; }
      break;
    }
    if (done() !== steps().length) gateBad.push(name + ': ' + done() + ' of ' + steps().length + ' steps heard at the end');
    if (!shown(after)) gateBad.push(name + ': Next never appeared after every step was heard');
  }

  /* C2, C3, C14 (opening pages) — the student's own path, through the lock */
  const path = [app.phase], talked = [], checkWalk = [];
  for (const id of ['cover-go', 'why-next', 'care-next', 'sum-next', 'cart-next', 'ra-next', 'goals-next']) {
    const b = document.getElementById(id);
    if (!b) { path.push('(no #' + id + ')'); break; }
    if (id !== 'cover-go') await gateCheck(app.phase, visible()[0], b);
    b.click(); await wait(1200);
    if (speechSynthesis.speaking || speechSynthesis.pending) talked.push(app.phase);
    hush(); path.push(app.phase);
    /* a check between two opening pages (the cart check): answer every
       question the way a student does, then carry on from where that leads */
    if (isQPhase(app.phase)) {
      const here = app.phase, n = bankFor(here).length;
      let guard = 0, sawTable = false;
      while (app.phase === here && guard++ < 20) {
        if (shown(document.getElementById('q-data'))) sawTable = true;
        const opt = [...document.querySelectorAll('#q-opts .opt')].find(o => !o.disabled);
        const nx = document.getElementById('q-next');
        if (shown(nx)) { nx.click(); await wait(300); } else if (opt) { opt.click(); await wait(80); }
      }
      checkWalk.push({ phase: here, asked: n, answered: bankFor(here).filter(x => answersFor(here)[x.id] != null).length, then: app.phase });
      if (speechSynthesis.speaking || speechSynthesis.pending) talked.push(app.phase);
      hush(); path.push(app.phase);
    }
  }
  const wantPath = ['cover', 'why', 'care', 'summary', 'sumq', 'cart', 'cartq', 'plan', 'planq', 'goals', 'start'];
  rec('C2', 'Opening path in order', JSON.stringify(path) === JSON.stringify(wantPath), path.join(' → '));

  /* C26 — THE NAME PAGE ASKS FOR A NAME AND NOTHING ELSE. Marcos 10/10: "are
     the students forced to read this page?" It held 143 words above the name
     picker, each with a small speaker, and Start woke up as soon as a name
     was chosen. Anything a student has to take in belongs on a locked page
     BEFORE this one. So, standing on the name page the way a first-time
     student arrives: there is almost nothing to read here, and every "I can"
     line was inside a step of the locked page that came just before. */
  {
    const st = document.getElementById('start-screen');
    const lines = (window.LESSON.icanKid || []).map(t => t.replace(/\s+/g, ' ').slice(0, 30));
    const here = speech.readable(st).filter(b => shown(b.el));
    const nameWords = here.reduce((n, b) => n + wordsIn(b.text), 0);
    const steps = [...document.querySelectorAll('#goals-screen .gstep')].map(e => e.textContent.replace(/\s+/g, ' '));
    const notLocked = lines.filter(t => !steps.some(x => x.includes(t)));
    const stillHere = lines.filter(t => st.textContent.replace(/\s+/g, ' ').includes(t));
    const prose = [...st.querySelectorAll('p, li, h3')].filter(shown).map(e => e.textContent.trim().slice(0, 30));
    rec('C26', 'The name page asks only for a name; every "I can" line is heard on a locked page first',
        app.phase === 'start' && visible().length === 1 && nameWords <= 20 && !notLocked.length && !stillHere.length && !prose.length,
        nameWords + ' words to read on the name page. ' +
        (visible().length !== 1 ? visible().length + ' screens showing at once: ' + visible().map(x => x.id).join(', ') + '. ' : '') +
        (notLocked.length ? 'Not in a locked step: ' + notLocked.join(' | ') + '. ' : '') +
        (stillHere.length ? 'Still on the name page: ' + stillHere.join(' | ') + '. ' : '') +
        (prose.length ? 'Paragraphs on the name page: ' + prose.join(' | ') : ''));
  }

  /* C11 — a thing is introduced before it is talked about. Marcos: "You start
     talking about a cart and the kids have no idea why you are talking about
     it." No page before Meet your cart may mention the cart. */
  const early = ['cover-screen', 'why-screen', 'care-screen', 'summary-screen']
    .filter(id => /\bcarts?\b/i.test((document.getElementById(id) || {}).textContent || ''));
  /* ...and no question asked before that page may mention the cart either */
  PHASES.slice(0, PHASES.indexOf('cart')).filter(isQPhase).forEach(p => bankFor(p).forEach(x => {
    if (/\bcarts?\b/i.test([x.q, (x.opts || []).join(' '), typeof x.why === 'string' ? x.why : ''].join(' '))) early.push(x.id + ' (asked on "' + p + '")');
  }));
  rec('C11', 'Nothing mentions the cart before Meet your cart introduces it', early.length === 0, early.join(', '));

  /* enter the preview */
  if (!window.startTeacherPreview) { rec('C4', 'Teacher preview exists', false, 'preview.js not loaded'); return report(); }
  window.startTeacherPreview(); await wait(150);
  document.getElementById('pin-input').value = TEACHER_PIN;
  document.getElementById('pin-ok').click(); await wait(500);
  const stops = window.__previewStops();
  const jump = async i => { const j = document.getElementById('tp-jump'); j.value = String(i);
    j.dispatchEvent(new Event('change')); await wait(250); };
  const SPK_ATTR = ['background-color', 'box-shadow'];
  const MIN_FS = 16;   /* px — labels. Sentences are 18 and up. */

  /* C14 (inside the lesson) — the same lock on the words, the predict pages
     and the end of Day 1. guide.testGate turns the lock on inside the
     preview, so this needs no student name and sends nothing. */
  guide.testGate = true;
  /* which part of the screen holds the steps, and what must stay locked */
  const GATED = ph => /^predict/.test(ph) ? ['predict-card', 'pr-opts']
                    : /^run/.test(ph)     ? ['run-card', 'run-btn']
                    : /^graph/.test(ph)   ? ['graph-card', 'gr-next']
                    : ph === 'vocab'      ? ['vocab-screen', 'vocab-next']
                    :                       ['daygate-screen', 'dg-next'];
  /* every paged screen, plus the four push screens (their first push always
     has something new to hear before the button exists) */
  const toGate = [...new Set(stops.filter(s => s.gp != null || /^(run|graph)[ABCD]$/.test(s.phase)).map(s => s.phase))];
  for (const ph of toGate) {
    if (ph === 'plan' || ph === 'cart') continue;      /* walked above, as a student */
    guide.testHeard = {};
    await jump(stops.findIndex(s => s.phase === ph));
    const [rootId, afterId] = GATED(ph);
    await gateCheck(ph, document.getElementById(rootId), document.getElementById(afterId));
    if (/^daygate/.test(ph)) {
      document.getElementById('dg-next').click(); await wait(200);
      await gateCheck('day 2 recap', document.getElementById('dg-recap'), document.getElementById('dg-go'));
    }
  }
  guide.testGate = false; guide.testHeard = {};
  speech.sayParts = realSay;
  guide.instant = false;
  rec('C21', 'After every Listen the next button is on screen, above the help bar', offScreen.length === 0,
      offScreen.length + ' hidden. ' + offScreen.slice(0, 6).join(' | '));
  rec('C14', 'Guided screens: Next is locked until every step is heard (' + listen.length + ' screens)',
      gateBad.length === 0, gateBad.slice(0, 6).join(' | '));

  const phaseBad = [], uncovered = [], noSpeaker = [], noLight = [], words = [], tiny = {};
  const cover = {}, lockedInPreview = [], apart = [], loose = [], flow = [];
  const tooWide = [], noData = [];
  /* C17 — name the thing. Marcos 10/10, on "Which one lets it go farthest?":
     "don't say it, say what you are talking about". A struggling reader
     cannot carry "it" back to the noun, so student text says the noun again.
     Two phrases use "it" with nothing to point back to and are allowed. */
  const IT_OK = [/it is hard to run on sand/gi, /what it means to need energy/gi];
  const vague = {}, bareNumber = {};
  let corpus = '';
  const lintIt = (text, where) => {
    let t = String(text || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ');
    corpus += ' ' + t;
    IT_OK.forEach(rx => { t = t.replace(rx, ''); });
    const m = /(?:\S+\s+){0,4}\b[Ii]t(?:'s)?\b(?:\s+\S+){0,3}/.exec(t);
    if (m) vague[m[0].trim().slice(0, 60)] = where;
    /* C19 — say WHAT was measured. Marcos 10/10: "the distance the cart
       traveled. Be more specific in what is happening." "Your number" and
       "the numbers" do not say what the number is a number OF. */
    const n = /(?:\S+\s+){0,3}\b(?:your|the|that|those|these|two|own|real) numbers?\b(?:\s+\S+){0,3}/i.exec(t);
    if (n) bareNumber[n[0].trim().slice(0, 60)] = where;
  };
  /* every sentence the lesson keeps as data, whether or not a preview stop
     happens to show it */
  (function walk(v, where) {
    if (typeof v === 'string') lintIt(v, where);
    else if (Array.isArray(v)) v.forEach(x => walk(x, where));
    else if (v && typeof v === 'object') Object.keys(v).forEach(k => walk(v[k], where));
  })([window.LESSON.vocab, window.LESSON.icanKid, window.LESSON.driving, window.RECAP, window.INTRO_PLAN,
      window.CARE, window.CART_PAGES, window.METHOD_WORDS, window.THING_WORDS, window.WHY_REPEAT,
      window.WHY_BANK, window.WHY_DISTRACTORS, window.LAB.surfaces, window.LAB.pushes, window.LAB.ramps,
      window.LAB.vehicles,
      ['A', 'B', 'C', 'D'].map(k => { const v = invOf(k); return [v.heading, v.headingPlain, v.question,
        v.sameLabel, v.sameValue, v.changeLabel, v.changeValue, v.predictQ, v.predictOpts, v.doCount, v.doWhy, v.doSteps, v.measure]; })],
     'lesson text');
  for (let i = 0; i < stops.length; i++) {
    await jump(i);
    await wait(650);
    if (speechSynthesis.speaking || speechSynthesis.pending) talked.push(stops[i].label);
    hush();
    const v = visible();
    if (v.length !== 1 || app.phase !== stops[i].phase) { phaseBad.push(stops[i].label); continue; }
    const sec = v[0];
    const blocks = speech.readable(sec);
    const set = new Set(blocks.map(b => b.el));

    /* C30 — THE DATA IS ON THE SCREEN WITH THE QUESTION. Marcos 10/11, on the
       first claim question: "shouldn't they be able to see their data when
       answering the explain questions. It should be right there." A question
       needs the table when its words, its choices or its answer come from
       the student's own data, when it names a test or the data table, or
       when it is part of building the explanation. */
    if (stops[i].q != null) {
      const qq = bankFor(stops[i].phase)[stops[i].q];
      const text = [stemOf(qq)].concat(optsOf(qq)).join(' ').replace(/<[^>]+>/g, ' ');
      /* (a question asked before the first push, like the plan check, can
         name Test 1 or the data table: there is no data yet to show) */
      const hasData = PHASES.indexOf(stops[i].phase) > PHASES.indexOf('runA');
      const fromData = ['resolve', 'optsFrom', 'qFrom'].some(k => typeof qq[k] === 'function') ||
        (hasData && /data table|your (own )?data|\bTest [1-4]\b/i.test(text)) || stops[i].phase === 'claims';
      const box = document.getElementById('q-data');
      /* one test: its whole table. All four: a short list of averages for each. */
      const tables = shown(box) ? [...box.querySelectorAll('table')].filter(shown).length : 0;
      const lists = shown(box) ? [...box.querySelectorAll('.qtable')].filter(shown) : [];
      if (fromData && !tables && !lists.length) noData.push(stops[i].label + ' (' + qq.id + ')');
      const one = ['A', 'B', 'C', 'D'].indexOf(qq.inv);
      if (one !== -1 && (tables !== 1 || lists.length || box.textContent.indexOf('Test ' + (one + 1)) === -1))
        noData.push(stops[i].label + ' (' + qq.id + ') does not show the Test ' + (one + 1) + ' table alone');
      if (qq.inv === 'all' && lists.length !== 4) noData.push(stops[i].label + ' (' + qq.id + ') shows ' + lists.length + ' tests, not all four');
      /* every setup of every test has its distance in the list, on one line */
      lists.forEach((l, n) => {
        const rows = [...l.querySelectorAll('.qrow')];
        if (rows.length !== groupsFor('ABCD'[n]).length || rows.some(r => !/\d+ cm/.test(r.textContent)))
          noData.push(stops[i].label + ' (' + qq.id + '): the list for Test ' + (n + 1) + ' is missing a distance');
        if (innerWidth >= 1000 && rows.some(r => r.getBoundingClientRect().height > 48))
          noData.push(stops[i].label + ' (' + qq.id + '): a line of the Test ' + (n + 1) + ' list wraps');
      });
      /* ...and the data must not bury the choices: on a Chromebook-size
         window the first choice starts within a screen and a half of the
         top (four full tables once put the choices two screens down) */
      const firstOpt = document.querySelector('#q-opts .opt');
      const down = firstOpt ? Math.round(firstOpt.getBoundingClientRect().top + window.scrollY) : 0;
      if ((tables || lists.length) && innerWidth >= 700 && innerHeight >= 640 && down > innerHeight * 1.5)
        noData.push(stops[i].label + ' (' + qq.id + '): the choices start ' + down + 'px down the page');
    }

    /* C23 — nothing sticks out past the side of the window. The help bar did,
       by 16px, for two days: a sideways scroll on every working screen. */
    { const de = document.documentElement;
      if (de.scrollWidth > de.clientWidth + 1) tooWide.push(stops[i].label + ' (+' + (de.scrollWidth - de.clientWidth) + 'px)'); }

    /* C15 — which page of which guided screen is this? */
    const g = guide.current;
    if (g && shown(g.root) && (g.root === sec || sec.contains(g.root))) {
      (cover[g.id] = cover[g.id] || { n: g.pageCount, seen: new Set() }).seen.add(g.page);
      if ([...sec.querySelectorAll('.gstep')].some(e => shown(e) && !e.classList.contains('g-done')))
        lockedInPreview.push(stops[i].label);
    }

    /* C16 — on a guided page, nothing above a step has a speaker of its own.
       Marcos 10/9: "these two should be read combined." Every block that
       comes before the last step showing, and is not itself in a step, has
       to be one of that page's headings (read by a step's Listen button). */
    if (g && g.leads && shown(g.root) && (g.root === sec || sec.contains(g.root))) {
      const stepsOn = [...g.root.querySelectorAll('.gstep')].filter(shown);
      const lastStep = stepsOn[stepsOn.length - 1];
      if (lastStep) blocks.forEach(b => {
        if (!g.root.contains(b.el) || b.el.closest('.gstep,[data-gafter],.gnav')) return;
        if (!(b.el.compareDocumentPosition(lastStep) & Node.DOCUMENT_POSITION_FOLLOWING)) return;
        if (!b.el.classList.contains('glead')) apart.push(stops[i].label + ': "' + b.text.slice(0, 36) + '"');
      });
    }

    /* C20 — a label never has a speaker of its own when the line it labels is
       right under it. Marcos 10/10, on "QUESTION 1 OF 2" above "What is a
       force?": "should be combined." Any block the page styles in capitals
       (that is what a label looks like here) with another block right under
       it must have been joined to that block. */
    blocks.forEach((b, k) => {
      const el = b.el, nx = blocks[k + 1] && blocks[k + 1].el;
      if (!nx || el.closest('.gstep,.glead,table') || nx.closest('table')) return;
      if (getComputedStyle(el).textTransform !== 'uppercase') return;
      const ra = el.getBoundingClientRect(), rb = nx.getBoundingClientRect();
      if (!(rb.top - ra.bottom < 56 && rb.top >= ra.top - 6)) return;
      const own = el.querySelector(':scope > .mini-spk');
      if (own && getComputedStyle(own).display !== 'none') loose.push(stops[i].label + ': "' + b.text.slice(0, 30) + '"');
    });

    /* C5 — no visible text outside a readable block */
    sec.querySelectorAll('span,div,p,li,h1,h2,h3,h4,td,th,label,b').forEach(el => {
      if (el.closest('[data-noread]') || el.offsetParent === null) return;
      const own = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim())
        .map(n => n.textContent.trim()).join(' ');
      if (own.length < 12 || set.has(el)) return;
      let p = el.parentElement, ok = false;
      while (p && p !== sec) { if (set.has(p)) { ok = true; break; } p = p.parentElement; }
      if (!ok) uncovered.push(stops[i].label + ': "' + own.slice(0, 40) + '"');
    });

    /* C13 — nothing a student reads is small. Marcos 10/9: "the writing seems
       very small... It needs to be more kid friendly." Text inside a drawing
       scales with the drawing, so it is skipped. */
    sec.querySelectorAll('*').forEach(el => {
      if (el.offsetParent === null || el.closest('svg,[data-noread]')) return;
      const own = [...el.childNodes].filter(n => n.nodeType === 3 && /[A-Za-z]{2}/.test(n.textContent))
        .map(n => n.textContent.trim()).join(' ');
      if (!own) return;
      const fs = parseFloat(getComputedStyle(el).fontSize);
      if (fs < MIN_FS) tiny[fs + 'px "' + own.slice(0, 30) + '"'] = stops[i].label;
    });

    blocks.forEach(b => lintIt(b.text, stops[i].label));
    /* C18 — this stop's words, and which words it EXPLAINS (<dfn>). A push
       stop also carries every "New this time" card of its test, since the
       preview shows only the first push. */
    {
      let used = blocks.map(b => b.text).join(' ');
      const taught = [...sec.querySelectorAll('dfn')].filter(shown).map(d => d.textContent);
      const mRun = /^run([ABCD])$/.exec(stops[i].phase);
      if (mRun) invOf(mRun[1]).runs.forEach((r, n) => {
        const nw = newInRun(mRun[1], n);
        let html = nw.fresh.map(b => b.name + ' ' + b.full).join(' ') + ' ' + setupBits(r).map(b => b.name + ' ' + b.short).join(' ');
        if (nw.whyTwice) html += ' ' + (window.WHY_REPEAT || '');
        if (nw.average) html += ' The <dfn>average</dfn> is the distance in the middle.';
        (html.match(/<dfn>(.*?)<\/dfn>/g) || []).forEach(x => taught.push(x.replace(/<[^>]+>/g, '')));
        used += ' ' + html.replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ');
      });
      flow.push({ label: stops[i].label, used, taught: taught.map(t => t.toLowerCase().trim()) });
    }
    [...sec.querySelectorAll('button')].filter(shown).forEach(bt => lintIt(bt.textContent, stops[i].label + ' (button)'));

    blocks.forEach(b => {
      const el = b.el;
      /* C6 — a way to hear it: its own speaker icon that can be seen, or the
         Listen button of the guided step it sits in. Attached by the page
         itself, not by this test. */
      const mine = el.querySelector(el.classList.contains('opt') ? '.mini-spk' : ':scope > .mini-spk');
      const step = el.closest('.gstep');
      const lead = el.closest('.glead');       /* a heading read with its step */
      const joined = el.closest('.slead');     /* a label read with the line under it */
      const heardBy = (mine && getComputedStyle(mine).display !== 'none') ||
                      (step && shown(step.querySelector('.gbtn'))) ||
                      (lead && lead._gstep && lead._gstep.querySelector('.gbtn')) ||
                      (joined && joined._sfor && shown(joined._sfor.querySelector('.mini-spk')));
      if (!heardBy) noSpeaker.push(stops[i].label + ': "' + b.text.slice(0, 40) + '"');
      /* C7 — the WORD being read lights up (Marcos 10/9: "word for word
         highlighting instead of the entire box lit up"). The block is split
         into words the way speech does it; the first word must change colour
         when marked, every word must be in the spoken text, and the block
         must be put back exactly as it was. A block with no words to split
         falls back to lighting the box, and that has to be visible too. */
      const htmlBefore = el.innerHTML;
      const made = [];
      const spans = speech.split(el, made);
      const lit = spans[0] || el;
      const off = SPK_ATTR.map(k => getComputedStyle(lit).getPropertyValue(k)).join('|');
      lit.classList.add('spk');
      const on = SPK_ATTR.map(k => getComputedStyle(lit).getPropertyValue(k)).join('|');
      lit.classList.remove('spk');
      const said = spans.length ? speech.joinTokens(speech.tokensOf(spans)) : b.text;
      made.forEach(w => { if (w.parentNode) w.parentNode.replaceChild(document.createTextNode(w.textContent), w); });
      el.normalize();
      if (off === on) noLight.push(stops[i].label + ': "' + b.text.slice(0, 40) + '"');
      else if (said !== b.text) noLight.push(stops[i].label + ' (says one thing, lights another): "' + b.text.slice(0, 30) + '"');
      else if (el.innerHTML !== htmlBefore) noLight.push(stops[i].label + ' (not put back): "' + b.text.slice(0, 30) + '"');
    });
    words.push({ screen: stops[i].label.replace(/ · (?:word |page )?\d+ of \d+$/, ''),
      words: blocks.reduce((n, b) => n + (b.text.match(/[A-Za-z]+/g) || []).length, 0) });
  }

  talked.push(...selfTalk);
  rec('C3', 'Nothing speaks on its own', talked.length === 0, talked.join(', ') || 'silent');
  rec('C4', 'Every preview stop shows one screen in the right phase (' + stops.length + ' stops)',
      phaseBad.length === 0, phaseBad.join(', '));
  rec('C5', 'All visible text can be read aloud', uncovered.length === 0, uncovered.slice(0, 6).join(' | '));
  rec('C6', 'Every readable block has its own speaker', noSpeaker.length === 0,
      noSpeaker.length + ' missing. ' + noSpeaker.slice(0, 6).join(' | '));
  rec('C7', 'Every block lights up word by word while read', noLight.length === 0,
      noLight.length + ' dark. ' + noLight.slice(0, 6).join(' | '));
  const tinyList = Object.keys(tiny);
  rec('C13', 'No text a student reads is under ' + MIN_FS + 'px', tinyList.length === 0,
      tinyList.length + ' small. ' + tinyList.slice(0, 6).map(k => k + ' on ' + tiny[k]).join(' | '));

  /* C15 — a guided page the preview never lands on is a page Marcos cannot
     check. Every phase the lesson says has pages must show all of them. */
  const missed = Object.keys(cover).filter(id => cover[id].seen.size !== cover[id].n)
    .map(id => id + ' ' + cover[id].seen.size + '/' + cover[id].n);
  const expectPaged = [...new Set(stops.filter(s => s.gp != null).map(s => s.phase))].length;
  const gotPaged = Object.keys(cover).filter(id => cover[id].n > 1).length;
  rec('C15', 'Teacher preview reaches every guided page (' + Object.keys(cover).length + ' guided screens)',
      missed.length === 0 && lockedInPreview.length === 0 && gotPaged === expectPaged,
      (missed.length ? 'pages missed: ' + missed.join(', ') + '. ' : '') +
      (lockedInPreview.length ? 'locked in preview: ' + lockedInPreview.slice(0, 4).join(', ') + '. ' : '') +
      (gotPaged !== expectPaged ? gotPaged + ' paged screens seen, ' + expectPaged + ' expected' : ''));

  rec('C16', 'On guided pages a heading is read with its step, not by a separate speaker',
      apart.length === 0, apart.length + ' apart. ' + apart.slice(0, 6).join(' | '));

  rec('C20', 'A label is read with the line under it, not by a speaker of its own', loose.length === 0,
      loose.length + ' loose. ' + [...new Set(loose)].slice(0, 6).join(' | '));

  /* C12 — every question carries its own feedback. On 10/9 the feedback
     table was found keyed to the OLD question numbers: the truck question
     explained push size and the newest questions had none. This catches a
     missing or copy-pasted explanation (matching it to the right question
     still needs a human read — see the list in the commit). */
  const bank = Object.keys(Q_PHASE).reduce((all, p) => all.concat(bankFor(p)), []).filter(q => !q.adaptive);
  const fb = bank.map(q => ({ id: q.id, t: whyRight(q) }));
  const empty = fb.filter(f => !f.t).map(f => f.id);
  const seenT = {}, dupes = [];
  fb.forEach(f => { if (f.t) { if (seenT[f.t]) dupes.push(f.id + '=' + seenT[f.t]); else seenT[f.t] = f.id; } });
  fb.forEach(f => lintIt(f.t, f.id + ' feedback'));
  /* The helper's lines exist only after a push, which the preview never
     shows. So make every one — each test, run by run, with a prediction that
     hits and one that misses — and hold them to the same wording rules. */
  ['A', 'B', 'C', 'D'].forEach(k => {
    const opts = invOf(k).predictOpts || [];
    opts.concat(['']).forEach(pred => {
      const rows = [];
      invOf(k).runs.forEach((r, n) => {
        const cm = distanceCm(r, true);
        lintIt(helperSays(k, n, cm, rows, String(pred || '').replace(/<[^>]+>/g, '')), 'helper, Test ' + ({ A:1, B:2, C:3, D:4 })[k] + ' push ' + (n + 1));
        rows.push(Object.assign({}, r, { cm }));
      });
    });
  });

  rec('C30', 'A question answered from the student\'s own data has the data table on screen', noData.length === 0,
      noData.length + ' do not. ' + noData.slice(0, 6).join(' | '));
  rec('C23', 'No screen is wider than the window', tooWide.length === 0,
      tooWide.length + ' are. ' + tooWide.slice(0, 6).join(' | '));

  /* C22 — THE PUSH SCREEN, after a push. The preview never pushes, so this
     does: every run of every test, before the push and after the cart lands,
     laid out the way a student sees it (cards already heard and folded).
     Marcos 10/9: "kids won't know where the data table is and its connection
     to cart moving" — so the box the distance goes into must be on screen
     with the button, and on a Chromebook the cart with them. 10/10: the
     helper has to say something every time. */
  {
    const keep = { data: JSON.stringify(app.data), runIndex: JSON.stringify(app.runIndex),
                   predictions: JSON.stringify(app.predictions), lastRun: app.lastRun };
    const pushBad = [];
    guide.testGate = true; guide.instant = true; guide.testHeard = {};
    const R = el => el.getBoundingClientRect();
    const roomy = innerWidth >= 700 && innerHeight >= 640;      /* a Chromebook, not a phone */
    for (const k of ['A', 'B', 'C', 'D']) {
      const inv = invOf(k), opts = inv.predictOpts || [''];
      inv.runs.forEach((r, n) => { guide.testHeard['run' + k + n] = 99; });
      await jump(stops.findIndex(s => s.phase === 'run' + k)); await wait(120);
      /* a prediction that misses makes the longest thing the helper says */
      app.predictions[k] = opts[opts.length - 1]; app.data[k] = [];
      for (let n = 0; n < inv.runs.length; n++) {
        const run = inv.runs[n], cm = distanceCm(run, true);
        for (const landed of [false, true]) {
          app.runIndex[k] = n; app.lastRun = landed ? { index: n, cm } : null;
          paintRun(k); focusRun(true);
          const tag = 'Test ' + ({ A: 1, B: 2, C: 3, D: 4 })[k] + ' push ' + (n + 1) + (landed ? ' landed' : '');
          const floor = innerHeight - guide.barHeight() + 1;
          const box = document.querySelector('#run-card td.target'), cv = document.querySelector('#run-card canvas');
          const btn = [...document.querySelectorAll('#run-record, #run-btn')].find(shown);
          const h = document.getElementById('run-helper');
          if (!btn) { pushBad.push(tag + ': no button'); continue; }
          if (R(btn).top < 0 || R(btn).bottom > floor) pushBad.push(tag + ': the button is off screen');
          if (!box) pushBad.push(tag + ': no glowing box');
          else if (R(box).top < 0 || R(box).bottom > floor) pushBad.push(tag + ': the glowing box is off screen');
          if (roomy && R(cv).top < -4) pushBad.push(tag + ': the cart is cut off by ' + Math.round(-R(cv).top) + 'px');
          if (landed) {
            if (!shown(h) || wordsIn(h.textContent) < 8) pushBad.push(tag + ': the helper says nothing');
            else if (!h.querySelector('.mini-spk')) pushBad.push(tag + ': the helper cannot be read aloud');
            lintIt(h.querySelector('p') ? h.querySelector('p').textContent : '', 'helper, ' + tag);
          } else if (shown(h)) pushBad.push(tag + ': the helper is talking before the push');
          const de = document.documentElement;
          if (de.scrollWidth > de.clientWidth + 1) pushBad.push(tag + ': wider than the window');
        }
        app.data[k].push(Object.assign({}, run, { cm }));
      }
    }
    app.data = JSON.parse(keep.data); app.runIndex = JSON.parse(keep.runIndex);
    app.predictions = JSON.parse(keep.predictions); app.lastRun = keep.lastRun;
    guide.testGate = false; guide.instant = false; guide.testHeard = {};
    await jump(0); await wait(150);
    rec('C22', 'After every push: the helper speaks, and the button and the glowing box are on screen', pushBad.length === 0,
        pushBad.length + ' problems. ' + [...new Set(pushBad)].slice(0, 6).join(' | '));
  }

  /* the answers a student who has reached `phase` has given: every question
     of every question screen before it (so a planted save is one the lesson
     as it is today could have written) */
  const answeredBefore = phase => {
    const out = {};
    PHASES.slice(0, PHASES.indexOf(phase)).filter(isQPhase).forEach(p => {
      const k = Q_PHASE[p].ans; out[k] = out[k] || {};
      bankFor(p).forEach(x => { out[k][x.id] = 0; });
    });
    return out;
  };

  /* C24 — picking up a lesson that was saved before the runs changed. */
  {
    const fitBad = [];
    const rowsOf = (k, runs) => runs.map(r => Object.assign({}, r, { cm: distanceCm(r, true) }));
    /* a save that fits: every test full, the student on the last questions */
    const full = Object.assign({ phase: 'exit', heard: { runA0: 2, graphA: 7, vocab: 12 },
      data: { A: rowsOf('A', invOf('A').runs), B: rowsOf('B', invOf('B').runs), C: rowsOf('C', invOf('C').runs), D: rowsOf('D', invOf('D').runs) } },
      answeredBefore('exit'));
    const f1 = fitSaved(full);
    if (f1.redo || f1.catchUp || f1.phase !== 'exit') fitBad.push('a save that fits was sent back to ' + f1.phase);
    ['A', 'B', 'C', 'D'].forEach(k => { if (f1.data[k].length !== invOf(k).runs.length || f1.runIndex[k] !== invOf(k).runs.length) fitBad.push('a save that fits lost pushes in ' + k); });
    if (f1.heard.runA0 !== 2 || f1.heard.graphA !== 7) fitBad.push('a save that fits lost what was heard');
    /* partway through a test, nothing wrong with it */
    const mid = Object.assign({ phase: 'runA', data: { A: rowsOf('A', invOf('A').runs.slice(0, 5)) } }, answeredBefore('runA'));
    const f2 = fitSaved(mid);
    if (f2.redo || f2.catchUp || f2.phase !== 'runA' || f2.runIndex.A !== 5) fitBad.push('a save in the middle of Test 1 was changed');
    /* a save from a lesson with one push fewer per setup: the same runs with
       the last trial of every setup left out */
    const top = k => invOf(k).runs.reduce((m, r) => Math.max(m, r.trial), 1);
    const old = Object.assign({ phase: 'analysis', heard: { runA0: 2, runA3: 1, graphA: 7, runB0: 1 },
      data: { A: rowsOf('A', invOf('A').runs.filter(r => r.trial < top('A'))), B: rowsOf('B', invOf('B').runs.filter(r => r.trial < top('B'))),
              C: rowsOf('C', invOf('C').runs.filter(r => r.trial < top('C'))), D: rowsOf('D', invOf('D').runs.filter(r => r.trial < top('D'))) } },
      answeredBefore('analysis'));
    const f3 = fitSaved(old);
    if (top('A') > 1) {
      if (f3.redo !== 'A' || f3.phase !== 'runA') fitBad.push('an older save was not sent back to Test 1 (went to ' + f3.phase + ')');
      ['A', 'B', 'C', 'D'].forEach(k => {
        const want = top(k) - 1;                       /* the first setup's pushes still line up; nothing after them does */
        if (f3.data[k].length !== want || f3.runIndex[k] !== want) fitBad.push('an older save kept ' + f3.data[k].length + ' pushes in ' + k + ', not ' + want);
        if (f3.data[k].some((r, n) => runKey(r) !== runKey(invOf(k).runs[n]) || r.trial !== invOf(k).runs[n].trial)) fitBad.push('an older save kept a push that does not line up in ' + k);
      });
      if ('runA0' in f3.heard || 'runA3' in f3.heard || 'runB0' in f3.heard) fitBad.push('an older save kept "new this time" cards as heard');
      if (f3.heard.graphA !== 7) fitBad.push('an older save lost a page that was heard');
    }
    /* answers to questions the lesson no longer asks are taken out, and so is
       the point for the one that was right (the score is out of today's
       questions); everything that is still asked is kept */
    const stale = fitSaved(Object.assign({}, mid, { score: 5, missedQuestions: [{ id: 'L99' }],
      vocabAns: Object.assign({ L98: 0, L99: 1 }, mid.vocabAns) }));
    if (stale.score !== 4 || 'L98' in stale.answers.vocabAns || 'L99' in stale.answers.vocabAns || stale.missed.length)
      fitBad.push('answers to questions no longer asked were kept (score ' + stale.score + ', ' + stale.missed.length + ' misses)');
    if (Object.keys(mid.vocabAns || {}).some(id => !(id in stale.answers.vocabAns)) || stale.phase !== 'runA' || stale.catchUp)
      fitBad.push('taking out old answers disturbed answers that are still asked');
    /* rows that are not rows at all (a damaged save) must not crash */
    try { const f4 = fitSaved({ phase: 'runB', data: { A: [1, 2, 3], B: null } }); if ((f4.resumeAt || f4.phase) !== 'runA' || f4.data.A.length) fitBad.push('a damaged save was not reset to Test 1'); }
    catch (e) { fitBad.push('a damaged save crashed: ' + e.message); }
    rec('C24', 'A lesson saved before the pushes changed is made to fit when it is picked up', fitBad.length === 0, fitBad.slice(0, 5).join(' | '));
  }

  /* C25 — THE NAME PAGE, coming back on Day 2 and Day 3. Every student passes
     through it with saved pushes. Until 10/10 the big button there read
     "Start over from the beginning" and cleared them on one tap, no PIN.
     The preview never picks a name, so this does: a planted save, then the
     buttons pressed the way a student would press them. app.go is held, so
     nothing starts; the preview is on, so nothing is saved or sent. */
  {
    const nameBad = [];
    const sel = document.getElementById('name-select'), sec = document.getElementById('start-screen');
    const begin = document.getElementById('begin-btn'), resume = document.getElementById('resume-btn');
    const small = document.getElementById('teacher-btn');          /* a small button, to measure against */
    const box = document.getElementById('resume-box'), modal = document.getElementById('pin-modal');
    const me = sel.options[2].value, other = sel.options[3].value;
    const R = el => el.getBoundingClientRect();
    const look = el => { const cs = getComputedStyle(el); return { size: parseFloat(cs.fontSize), ink: cs.color }; };
    /* the big button is bigger than a small one and filled in, not outlined */
    const big = el => shown(el) && look(el).size > look(small).size && look(el).ink !== look(small).ink;
    const quiet = el => shown(el) && look(el).size === look(small).size && look(el).ink === look(small).ink;
    const pinUp = () => !modal.classList.contains('hidden');
    const stored = () => localStorage.getItem(KEY);
    const pick = async n => { sel.value = n; sel.dispatchEvent(new Event('change')); await wait(60); };
    const cancel = async () => { document.getElementById('pin-cancel').click(); await wait(30); };
    /* three saved lessons. `save`: from when each setup had one push fewer,
       stopped at the end of Day 1. `saveNow`: the lesson as it is today,
       stopped partway through Test 2. `saveDone`: a finished lesson. */
    const rowsOf = runs => runs.map(r => Object.assign({}, r, { cm: distanceCm(r, true) }));
    const top = k => invOf(k).runs.reduce((m, r) => Math.max(m, r.trial), 1);
    const partB = Math.min(4, invOf('B').runs.length);
    const save = JSON.stringify(Object.assign({ studentName: me, phase: 'daygate', timerSeconds: 900, score: 2, heard: { vocab: 12, graphA: 7 },
      data: { A: rowsOf(invOf('A').runs.filter(r => r.trial < top('A'))), B: [], C: [], D: [] } }, answeredBefore('daygate')));
    const saveNow = JSON.stringify(Object.assign({ studentName: me, phase: 'runB', timerSeconds: 1500, score: 2, heard: { vocab: 12, graphA: 7 },
      data: { A: rowsOf(invOf('A').runs), B: rowsOf(invOf('B').runs.slice(0, partB)), C: [], D: [] } }, answeredBefore('runB')));
    const saveDone = JSON.stringify({ studentName: me, phase: 'end', timerSeconds: 3000, score: 11, finishedAt: '2026-10-09T14:00:00.000Z',
      data: { A: rowsOf(invOf('A').runs), B: rowsOf(invOf('B').runs), C: rowsOf(invOf('C').runs), D: rowsOf(invOf('D').runs) } });
    const pushes = JSON.parse(save).data.A.length;
    const STARTS = OPENING.filter(isQPhase).concat(['vocab']);   /* the first opening check, or the first word */
    const plant = () => localStorage.setItem(KEY, save);
    /* the note about saved work is on screen, can be heard, and follows the wording rules */
    const noteOk = tag => {
      const blk = speech.readable(sec).find(b => b.el === box);
      const spk = box.querySelector(':scope > .mini-spk');
      if (!blk) { nameBad.push(tag + ': no note about the saved work'); return ''; }
      if (!spk || getComputedStyle(spk).display === 'none') nameBad.push(tag + ': the note cannot be read aloud');
      if (parseFloat(getComputedStyle(box).fontSize) < MIN_FS) nameBad.push(tag + ': the note is small');
      lintIt(blk.text, 'name page, ' + tag);
      [begin, resume].filter(shown).forEach(b => lintIt(b.textContent, 'name page, ' + tag + ' (button)'));
      return blk.text;
    };

    const FIELDS = ['studentName', 'phase', 'score', 'missedQuestions', 'events', 'startedAt', 'finishedAt', 'timerSeconds',
      'labStart', 'labEnd', 'qIndex', 'checkAns', 'vocabAns', 'analysisAns', 'claimsAns', 'exitAns', 'written', 'predictions',
      'data', 'runIndex', 'heard', 'refit', 'resumeAt'];
    const keep = {}; FIELDS.forEach(f => { keep[f] = JSON.stringify(app[f]); });
    const keepTabs = tabSwitchCount, keepChip = document.getElementById('who-chip').textContent;
    const realGo = app.go, realTimer = app.startTimer;
    let went = '';
    app.go = p => { went = p; }; app.startTimer = () => {};
    try {
      await jump(stops.findIndex(s => s.phase === 'start')); await wait(120);

      /* nothing saved: one tap starts the lesson, as before */
      localStorage.removeItem(KEY); await pick(me);
      if (!big(begin) || shown(resume) || shown(box)) nameBad.push('nothing saved: "Start the lesson" is not the one big button');
      went = ''; begin.click(); await wait(40);
      /* the lesson starts at the cart check when the opening pages were not walked, else at the first word */
      if (pinUp() || STARTS.indexOf(went) === -1) nameBad.push('nothing saved: one tap did not start the lesson');
      await cancel();

      /* this student's own saved work */
      plant(); await pick(me);
      if (!big(resume)) nameBad.push('saved work: "Pick up where I left off" is not the big button');
      if (shown(begin) && !quiet(begin)) nameBad.push('saved work: starting over is not a small button ("' + begin.textContent.trim() + '")');
      if (shown(begin) && shown(resume) && (R(begin).top < R(resume).top - 1 ||
          (Math.abs(R(begin).top - R(resume).top) <= 1 && R(begin).left < R(resume).left)))
        nameBad.push('saved work: starting over comes before "Pick up where I left off"');
      noteOk('saved work');
      went = ''; begin.click(); await wait(40);
      if (!pinUp()) nameBad.push('saved work: starting over did not ask for the teacher PIN');
      if (stored() !== save || went) nameBad.push('saved work: one tap on starting over cleared ' + pushes + ' saved pushes');
      document.getElementById('pin-input').value = TEACHER_PIN + '0'; document.getElementById('pin-ok').click(); await wait(40);
      if (stored() !== save || went) nameBad.push('saved work: a wrong PIN cleared the saved pushes');
      await cancel();
      if (pinUp() || stored() !== save || went) nameBad.push('saved work: Cancel did not leave the saved pushes alone');

      /* the saved work is under another name: a wrong pick, or a shared computer */
      plant(); await pick(other);
      if (shown(resume)) nameBad.push('work under another name: it can be picked up under the wrong name');
      if (big(begin)) nameBad.push('work under another name: a big button starts a new lesson over the saved work');
      noteOk('work under another name');
      if (!shown(box) || box.textContent.indexOf(me) === -1) nameBad.push('work under another name: the page does not say whose work is saved');
      went = ''; begin.click(); await wait(40);
      if (!pinUp() || stored() !== save || went) nameBad.push('work under another name: one tap cleared the saved pushes');
      await cancel();

      /* a FINISHED lesson is kept the same way. The end screen asks for the
         PIN before it starts over; the name page let the same student, or
         the next student on that computer, do it with one tap on "Start the
         lesson". Marcos 10/10: "PIN it". */
      for (const [tag, who] of [['finished lesson', me], ['finished lesson under another name', other]]) {
        localStorage.setItem(KEY, saveDone); await pick(''); await pick(who);
        if (shown(resume)) nameBad.push(tag + ': a finished lesson is offered to pick up');
        if (big(begin)) nameBad.push(tag + ': a big button starts a new lesson over the finished one');
        noteOk(tag);
        if (who !== me && (!shown(box) || box.textContent.indexOf(me) === -1)) nameBad.push(tag + ': the page does not say whose work is saved');
        went = ''; begin.click(); await wait(40);
        if (!pinUp() || stored() !== saveDone || went) nameBad.push(tag + ': one tap cleared the finished lesson');
        await cancel();
      }

      /* with the PIN, Mr. O can still clear the saved work and start the lesson */
      for (const [tag, sv] of [['saved work', save], ['a finished lesson', saveDone]]) {
        localStorage.setItem(KEY, sv); await pick(''); await pick(me);
        went = ''; begin.click(); await wait(40);
        document.getElementById('pin-input').value = TEACHER_PIN; document.getElementById('pin-ok').click(); await wait(40);
        if (pinUp() || stored() !== null || STARTS.indexOf(went) === -1) nameBad.push('the teacher PIN did not clear ' + tag + ' and start the lesson');
        await cancel();
      }

      /* and the big button picks a saved lesson up, pushes and all: the lesson
         as it is today goes on where the student stopped; the older lesson
         goes back to Test 1 with the pushes that still line up (see C24) */
      for (const [what, sv, phase, nA, nB] of [
        ['a lesson saved as the lesson is today', saveNow, 'runB', invOf('A').runs.length, partB],
        ['a lesson saved before the pushes changed', save, 'runA', top('A') - 1, 0]]) {
        localStorage.setItem(KEY, sv); await pick(''); await pick(me);
        went = ''; resume.click(); await wait(40);
        if (went !== phase || app.studentName !== me || app.data.A.length !== nA || app.data.B.length !== nB || app.score !== 2)
          nameBad.push('"Pick up where I left off" did not bring back ' + what + ' (went to "' + went + '" with ' +
            app.data.A.length + ' and ' + app.data.B.length + ' pushes, not "' + phase + '" with ' + nA + ' and ' + nB + ')');
        if (stored() !== sv) nameBad.push('"Pick up where I left off" changed ' + what + ' before the student did anything');
      }
    } catch (e) { nameBad.push('the check itself broke: ' + e.message); }
    app.go = realGo; app.startTimer = realTimer;
    await cancel();
    FIELDS.forEach(f => { if (keep[f] === undefined) delete app[f]; else app[f] = JSON.parse(keep[f]); });
    tabSwitchCount = keepTabs; document.getElementById('who-chip').textContent = keepChip; app.tickTimer();
    if (KEY in original) localStorage.setItem(KEY, original[KEY]); else localStorage.removeItem(KEY);
    await pick(''); await jump(0); await wait(150);
    rec('C25', 'On the name page, saved work is never cleared by one tap', nameBad.length === 0,
        nameBad.length + ' problems. ' + nameBad.slice(0, 6).join(' | '));
  }

  /* C27 — FREQUENT UNDERSTANDING CHECKS. Marcos 10/11, asking for questions
     before the End of Day 1 page and after Meet your cart: "I want the
     pattern for all Science lessons to have frequent understanding checks."
     A check is two or three questions asked RIGHT AFTER the thing the
     questions are about. This holds the pattern, so a later lesson built
     from this one cannot quietly drop a check or pile the questions up at
     the end again. */
  {
    const chk = [];
    const next = a => PHASES[PHASES.indexOf(a) + 1];
    const tN = { A: 1, B: 2, C: 3, D: 4 };
    /* every check sits right after the page CHECKS says it is about */
    Object.keys(window.CHECKS).forEach(p => {
      const page = window.CHECKS[p].after;
      if (!page) chk.push('"' + p + '" does not say which page it comes after');
      else if (next(page) !== p) chk.push('"' + page + '" is followed by "' + next(page) + '", not its check "' + p + '"');
    });
    /* the pages Marcos named, and the tests, each have one */
    ['summary', 'cart', 'plan', 'graphA', 'graphB', 'graphC', 'graphD'].forEach(page => {
      if (!Object.keys(window.CHECKS).some(p => window.CHECKS[p].after === page)) chk.push('no check comes after "' + page + '"');
    });
    if (next('vocab') !== 'vq') chk.push('the six words are followed by "' + next('vocab') + '", not the word check');
    ['A', 'B', 'C', 'D'].forEach(k => {
      if (bankFor('check' + k).some(x => x.inv !== k)) chk.push('the check after Test ' + tN[k] + ' asks about another test');
    });
    /* each check: two or three questions */
    Object.keys(window.CHECKS).concat(['vq', 'analysis']).forEach(p => {
      const n = bankFor(p).length;
      if (n < 2 || n > 3) chk.push(p + ' has ' + n + ' question' + (n === 1 ? '' : 's') + ', not 2 or 3');
    });
    /* every scored question is asked on exactly one screen, with feedback and a skill */
    const where = {};
    Object.keys(Q_PHASE).forEach(p => {
      if (PHASES.indexOf(p) === -1) chk.push('"' + p + '" is not a screen of the lesson');
      bankFor(p).forEach(x => {
        if (where[x.id]) chk.push(x.id + ' is asked on "' + where[x.id] + '" and again on "' + p + '"');
        where[x.id] = p;
        if (!x.adaptive && !whyRight(x)) chk.push(x.id + ' has no feedback');
        if (!(window.SKILLS || {})[x.id]) chk.push(x.id + ' has no skill');
      });
    });
    [].concat(SUM_Q, CART_Q, PLAN_Q, VOCAB_Q, ANALYSIS_Q, CLAIMS_Q, EXIT_Q).forEach(x => { if (!where[x.id]) chk.push(x.id + ' is never asked'); });
    if (app.totalItems() !== Object.keys(where).length)
      chk.push('the score is out of ' + app.totalItems() + ' but ' + Object.keys(where).length + ' questions are asked');
    /* the answer key the teacher dashboard reads (data/form_l.js, not loaded by
       the lesson) has every question that is asked */
    try {
      const key = await (await fetch('data/form_l.js?qa=' + Date.now())).text();
      const lost = Object.keys(where).filter(id => key.indexOf('id:"' + id + '"') === -1);
      if (lost.length) chk.push('not in the dashboard answer key (form_l.js): ' + lost.join(' '));
    } catch (e) { chk.push('could not read data/form_l.js: ' + e.message); }
    /* the cart check was really answered on the way in, and led on to the plan */
    OPENING.filter(isQPhase).forEach(p => {
      const cw = checkWalk.find(c => c.phase === p), want = OPENING[OPENING.indexOf(p) + 1];
      if (!cw) chk.push('the opening pages never reached the check "' + p + '"');
      else if (cw.answered !== cw.asked || cw.then !== want)
        chk.push('the check "' + p + '": ' + cw.answered + ' of ' + cw.asked + ' answered, then went to "' + cw.then + '", not "' + want + '"');
    });

    /* STARTING THE LESSON keeps the cart check: the answers were given before
       the name was picked. And a student who starts without having had the
       cart check is asked it first. app.go is held, so nothing starts. */
    {
      const F = ['studentName', 'phase', 'score', 'missedQuestions', 'events', 'startedAt', 'finishedAt', 'timerSeconds', 'labStart',
        'labEnd', 'qIndex', 'checkAns', 'vocabAns', 'analysisAns', 'claimsAns', 'exitAns', 'written', 'predictions', 'data',
        'runIndex', 'heard', 'refit', 'resumeAt'];
      const keep = {}; F.forEach(f => { keep[f] = JSON.stringify(app[f]); });
      const keepChip = document.getElementById('who-chip').textContent, hadSave = localStorage.getItem(KEY);
      const realGo = app.go, realTimer = app.startTimer;
      let went = '';
      app.go = p => { went = p; }; app.startTimer = () => {};
      try {
        const sel = document.getElementById('name-select'), begin = document.getElementById('begin-btn');
        const openQ = OPENING.filter(isQPhase).reduce((all, p) => all.concat(bankFor(p)), []);
        const ids = openQ.map(x => x.id);
        await jump(stops.findIndex(s => s.phase === 'start')); await wait(100);
        localStorage.removeItem(KEY);
        sel.value = sel.options[2].value; sel.dispatchEvent(new Event('change')); await wait(40);
        /* one right, one wrong, the way a student might have answered on the way in */
        /* every opening question answered, the second one wrong */
        app.checkAns = Object.fromEntries(openQ.map((x, k) => [x.id, k === 1 ? (x.a + 1) % 4 : x.a]));
        app.missedQuestions = [{ id: ids[1], q: 'x', yourAnswer: 'x', correct: 'x', skill: 'x' }, { id: 'L99', q: 'someone else' }];
        app.events = openQ.map((x, k) => ({ e: 'answer', id: x.id, ok: k !== 1 })).concat([{ e: 'cover_go' }]);
        app.score = 99;
        went = ''; begin.click(); await wait(40);
        if (went !== 'vocab') chk.push('with the opening checks answered, the lesson started at "' + went + '", not the first word');
        if (Object.keys(app.checkAns).length !== ids.length || app.score !== ids.length - 1 || app.missedQuestions.length !== 1 || app.missedQuestions[0].id !== ids[1])
          chk.push('starting the lesson did not keep the opening checks as answered (score ' + app.score + ', ' + app.missedQuestions.length + ' misses)');
        if (app.events.filter(e => e.e === 'answer').length !== ids.length || app.events.some(e => e.e === 'cover_go'))
          chk.push('starting the lesson did not keep exactly the opening check answers in the record');
        /* only the first check answered: the lesson starts at the next one */
        const firstOpen = OPENING.filter(isQPhase);
        app.checkAns = Object.fromEntries(bankFor(firstOpen[0]).map(x => [x.id, 0])); app.missedQuestions = []; app.events = []; app.score = 0;
        went = ''; begin.click(); await wait(40);
        if (firstOpen[1] && went !== firstOpen[1]) chk.push('a student with only the first check answered started at "' + went + '", not "' + firstOpen[1] + '"');
        /* no opening check yet: the first one is asked first */
        app.checkAns = {}; app.missedQuestions = []; app.events = []; app.score = 0;
        went = ''; begin.click(); await wait(40);
        if (went !== firstOpen[0]) chk.push('a student who never had the opening checks started at "' + went + '", not "' + firstOpen[0] + '"');

        /* A LESSON SAVED BEFORE A CHECK EXISTED. At the end of Day 1, every
           push done, but no cart check and no Test 1 check in the save. */
        const rowsOf = runs => runs.map(r => Object.assign({}, r, { cm: distanceCm(r, true) }));
        const sv = Object.assign(answeredBefore('daygate'), { studentName: 'x', phase: 'daygate', score: 2,
          data: { A: rowsOf(invOf('A').runs), B: [], C: [], D: [] } });
        const mine = Object.assign({}, sv, { checkAns: {}, analysisAns: {} });
        const fit = fitSaved(mine);
        /* every check before the end of Day 1 whose answers are missing, in order, then back */
        const owed = PHASES.slice(0, PHASES.indexOf('daygate')).filter(p => isQPhase(p) && ['checkAns', 'analysisAns'].indexOf(Q_PHASE[p].ans) !== -1);
        if (fit.phase !== owed[0] || fit.resumeAt !== 'daygate' || fit.redo)
          chk.push('a lesson saved before the checks existed went to "' + fit.phase + '" (back to "' + fit.resumeAt + '"), not "' + owed[0] + '" and then the end of Day 1');
        if (fitSaved(sv).catchUp || fitSaved(sv).phase !== 'daygate') chk.push('a lesson with every check answered was sent back to "' + fitSaved(sv).phase + '"');
        /* ...and walking it: cart check, then the Test 1 check, then back */
        app.restore(JSON.parse(JSON.stringify(mine)));      /* a copy: restore() keeps the objects handed to it */
        const walked = [app.phase];
        for (let hop = 0; hop < 12 && app.resumeAt; hop++) {
          bankFor(app.phase).forEach(x => { answersFor(app.phase)[x.id] = 0; });
          went = ''; app.next(); app.phase = went; walked.push(went);
        }
        if (walked.join(' > ') !== owed.concat(['daygate']).join(' > ') || app.resumeAt)
          chk.push('catching up walked ' + walked.join(' > ') + ', not ' + owed.concat(['daygate']).join(' > '));
        /* stopped halfway through catching up (the opening checks done, the
           Test 1 check not): picked up again, the real place is not lost */
        const half = fitSaved(Object.assign({}, mine, { phase: owed[0], resumeAt: 'daygate', checkAns: answeredBefore('goals').checkAns }));
        if (half.phase !== 'checkA' || half.resumeAt !== 'daygate') chk.push('a lesson saved halfway through catching up went to "' + half.phase + '" (back to "' + half.resumeAt + '")');
      } catch (e) { chk.push('the check itself broke: ' + e.message); }
      app.go = realGo; app.startTimer = realTimer;
      F.forEach(f => { if (keep[f] === undefined) delete app[f]; else app[f] = JSON.parse(keep[f]); });
      document.getElementById('who-chip').textContent = keepChip;
      if (hadSave == null) localStorage.removeItem(KEY); else localStorage.setItem(KEY, hadSave);
      const sel2 = document.getElementById('name-select'); sel2.value = ''; sel2.dispatchEvent(new Event('change'));
      await jump(0); await wait(150);
    }

    /* How long a student listens between two questions. Not a pass or fail
       yet (no number has been agreed) — reported, so the longest stretch is
       known. Counted in lesson order from the locked steps measured above. */
    const heardOn = {}, recaps = listen.filter(l => /recap/.test(l.screen)).map(l => l.words);
    listen.forEach(l => { if (!/recap/.test(l.screen)) heardOn[l.screen] = l.words; });
    let run = 0, from = '', worst = { words: 0, from: '', to: '' };
    PHASES.forEach(p => {
      if (isQPhase(p)) { if (run > worst.words) worst = { words: run, from, to: p }; run = 0; from = ''; return; }
      const w = (heardOn[p] || 0) + (/^daygate/.test(p) ? (recaps.shift() || 0) : 0);
      if (w && !from) from = p;
      run += w;
    });
    window.__qaStretch = worst;
    rec('C27', 'Understanding checks after every block, 2 or 3 questions each (' + Object.keys(window.CHECKS).length + ' checks + the word check, ' +
        Object.keys(where).length + ' scored questions)', chk.length === 0,
        chk.slice(0, 6).join(' | '));
  }

  /* C29 — THE WORD SECTION SPENDS ITS TIME ON THE NEW WORDS. Marcos 10/11, on
     a full page for "force" two pages after force was taught and checked:
     "reference force and friction but focus more on the other vocab words
     that have not been talked about. Also quiz the other words not force and
     friction again." A word is `met` in data/lesson.js when an earlier page
     already explains it. */
  {
    const wb = [];
    const metW = LESSON.vocab.filter(v => v.met), newW = LESSON.vocab.filter(v => !v.met);
    const fv = flow.findIndex(f => /^Six words/.test(f.label));
    if (fv === -1) wb.push('the word section is not in the preview');
    const before = fv === -1 ? [] : flow.slice(0, fv);
    /* shown short ONLY if an earlier page really explains the word... */
    metW.forEach(v => { if (!before.some(f => f.taught.indexOf(v.word) !== -1)) wb.push('"' + v.word + '" is only a reminder here, but no earlier page explains "' + v.word + '"'); });
    /* ...and a word an earlier page explains is not given a whole page again */
    newW.forEach(v => { if (before.some(f => f.taught.indexOf(v.word) !== -1)) wb.push('"' + v.word + '" gets a full page although an earlier page already explains "' + v.word + '"');
                        if (!v.ex) wb.push('"' + v.word + '" is new and has no example'); });
    /* the reminder is one short sentence a word */
    const remWords = wordsIn(metW.map(v => String(v.short || '').replace(/<[^>]+>/g, ' ')).join(' '));
    metW.forEach(v => { if (!v.short) wb.push('"' + v.word + '" has no reminder sentence'); });
    if (metW.length && remWords > 20 * metW.length) wb.push('the reminder is ' + remWords + ' words for ' + metW.length + ' words (20 a word at most)');
    /* pages: one reminder page, then one page for each new word */
    const pages = stops.filter(s => s.phase === 'vocab').length, wantPages = (metW.length ? 1 : 0) + newW.length;
    if (pages !== wantPages) wb.push('the word section has ' + pages + ' pages, not ' + wantPages);
    /* the word check asks every new word, and no word that was already checked */
    const vq = bankFor('vq');
    vq.forEach(x => { const v = LESSON.vocab.find(w => w.word === x.word);
      if (!v) wb.push(x.id + ' does not say which word it checks');
      else if (v.met) wb.push(x.id + ' asks about "' + x.word + '" again'); });
    newW.forEach(v => { if (!vq.some(x => x.word === v.word)) wb.push('no question in the word check asks about "' + v.word + '"'); });
    rec('C29', 'The word section: a reminder for words already taught, a page for each new word, and the check asks the new words',
        wb.length === 0, wb.slice(0, 6).join(' | '));
  }

  /* C28 — DAY 1 PREVIEWS THE LATER DAYS, IT DOES NOT WALK THROUGH THEM.
     Marcos 10/11, with Day 1 running long: "we dont need to describe day 2
     and 3 on day 1", then "preview yes, go through whole plan no." The plan
     page had a tile for each of the four tests and the explanation, and the
     End of Day 1 page spent 118 words on the two tests of Day 2. A preview
     is a sentence or two; the word limits below are what "short" means here. */
  {
    const pv = [], P = window.INTRO_PLAN || {}, g = (window.DAY_GATES || {}).daygate || {};
    const plain = h => String(h || '').replace(/<[^>]+>/g, ' ').replace(/&\w+;/g, ' ');
    const laterTiles = (planHTML().match(/class="pt">\s*Test [2-9]/g) || []).length;
    if (laterTiles) pv.push('the plan page has ' + laterTiles + ' tile' + (laterTiles === 1 ? '' : 's') + ' for tests of later days');
    if ((P.days || []).length !== 1) pv.push('the plan page lays out ' + (P.days || []).length + ' days, not today only');
    const laterWords = wordsIn(plain((P.later || {}).text));
    if (!laterWords) pv.push('the plan page has no preview of the later days');
    if (laterWords > 45) pv.push('the preview on the plan page is ' + laterWords + ' words (45 at most)');
    const nextSteps = (g.next || []).length, nextWords = wordsIn(plain((g.next || []).join(' ')));
    if (!nextSteps) pv.push('the End of Day 1 page has no preview of next time');
    if (nextSteps > 1 || nextWords > 30) pv.push('the End of Day 1 page spends ' + nextSteps + ' steps and ' + nextWords + ' words on next time (1 step and 30 words at most)');
    if ((g.nextTests || []).length) pv.push('the End of Day 1 page counts the runs of next time');
    rec('C28', 'Day 1 previews the later days and does not walk through their plan', pv.length === 0, pv.join(' | '));
  }

  const vagueList = Object.keys(vague);
  rec('C17', 'Student text names the thing and does not say "it"', vagueList.length === 0,
      vagueList.length + ' found. ' + vagueList.slice(0, 6).map(k => '"' + k + '" (' + vague[k] + ')').join(' | '));
  const bareList = Object.keys(bareNumber);
  rec('C19', 'Student text says what was measured, not "your number"', bareList.length === 0,
      bareList.length + ' found. ' + bareList.slice(0, 6).map(k => '"' + k + '" (' + bareNumber[k] + ')').join(' | '));

  /* C18 — a word is explained, in a step the student has to hear, at or before
     the first place the word appears. Marcos 10/10: "was mass really
     discussed? It shows in the experiments yet it was not mentioned in the
     lead up." and, when "average" turned out the same: "we can never assume
     understanding."

     The first version of this check asked only whether a word was defined
     SOMEWHERE. "Average" passed it: a definition sat in the optional Stuck?
     panel that no student has to open. Now the lesson is walked in order.
     For every word below, the first screen that uses the word must be the
     screen, or come after the screen, where the word is marked <dfn> (the
     HTML tag for "this is where the term is defined"). The help panel does
     not count. Add each new lesson's words to this list. */
  const WATCH = { mass:'mass', average:'averages?', trial:'trials?', prediction:'predict\\w*', 'data table':'data table',
    data:'data', surface:'surfaces?', friction:'friction', force:'forces?', energy:'energy', motion:'motion',
    gravity:'gravity', distance:'distances?', centimeter:'centimeters?|cm', claim:'claims?', evidence:'evidence',
    reasoning:'reasoning', explanation:'explanations?', ramp:'ramps?', tags:'tags', bar:'bars?', cart:'carts?',
    object:'objects?', track:'track', scientist:'scientists?', test:'tests?', investigation:'investigations?',
    setup:'setups?', vehicle:'vehicles?', 'from rest':'from rest', unbalanced:'unbalanced', magnetism:'magnetism' };
  const untaught = [];
  Object.keys(WATCH).forEach(w => {
    const use = new RegExp('\\b(?:' + WATCH[w] + ')\\b', 'i');
    const isDef = t => new RegExp('^(?:' + WATCH[w] + ')$', 'i').test(t);
    const fu = flow.findIndex(f => use.test(f.used));
    if (fu === -1) return;
    const ft = flow.findIndex(f => f.taught.some(isDef));
    if (ft === -1) untaught.push(w + ' (never explained; first on "' + flow[fu].label + '")');
    else if (ft > fu) untaught.push(w + ' (used on "' + flow[fu].label + '" before it is explained on "' + flow[ft].label + '")');
  });
  rec('C18', 'Every word is explained at or before the first place a student meets it', untaught.length === 0,
      untaught.length + ' not. ' + untaught.slice(0, 8).join(' | '));

  rec('C12', 'Every question has its own feedback (' + bank.length + ' questions)',
      !empty.length && !dupes.length, (empty.length ? 'none: ' + empty.join(' ') + '. ' : '') + (dupes.length ? 'same as another: ' + dupes.join(' ') : ''));

  rec('C8', 'No errors', errors.length === 0, errors.slice(0, 4).join(' | '));
  rec('C9', 'Nothing sent to the sheet', sends === 0, sends + ' sends');

  /* put storage back exactly as it was */
  const now = {}; for (let i = 0; i < localStorage.length; i++) { const k = localStorage.key(i); now[k] = localStorage.getItem(k); }
  rec('C10', 'Storage unchanged', JSON.stringify(now) === JSON.stringify(original), '');
  Object.keys(now).forEach(k => { if (!(k in original)) localStorage.removeItem(k); });
  Object.keys(original).forEach(k => localStorage.setItem(k, original[k]));

  const dense = {};
  words.forEach(w => { if (!dense[w.screen] || dense[w.screen] < w.words) dense[w.screen] = w.words; });
  window.__qaDensity = Object.entries(dense).sort((a, b) => b[1] - a[1]);
  window.__qaListen = listen;
  report();

  function report() {
    window.__qa = results;
    const pass = results.every(r => r.pass);
    const box = document.createElement('div');
    box.id = 'qa-report';
    box.setAttribute('data-noread', '');
    box.style.cssText = 'position:fixed;right:10px;bottom:10px;z-index:9999;max-width:480px;max-height:70vh;' +
      'overflow:auto;background:#fff;color:#16211F;border:3px solid ' + (pass ? '#1E7D45' : '#B3261E') +
      ';border-radius:12px;padding:12px 14px;font:13px/1.45 system-ui,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.3)';
    box.innerHTML = '<b style="font-size:15px">QA ' + (pass ? 'PASSED' : 'FAILED') + '</b>' +
      results.map(r => '<div style="margin-top:6px"><b style="color:' + (r.pass ? '#1E7D45' : '#B3261E') + '">' +
        (r.pass ? '✓' : '✗') + ' ' + r.id + '</b> ' + r.label +
        (r.pass ? '' : '<br><span style="color:#5A6E68">' + String(r.detail).replace(/</g, '&lt;') + '</span>') + '</div>').join('');
    document.body.appendChild(box);
  }
})();
