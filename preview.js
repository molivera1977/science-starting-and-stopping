/* ══════════════════════════════════════════════════════
   TEACHER PREVIEW — scan the whole lesson

   Marcos 10/9: "where is the teacher mode so I can scan the entire lesson."
   The old Teacher button asked for a step number, jumped once, and left you
   stranded — the button only lived on the name-picker page.

   This one: unlock with the teacher PIN, then a bar across the top with
   Back / Next and a jump list. Every screen and every single question is a
   stop, in the order a student meets them. Left and right arrow keys work
   too.

   Guided screens (guide.js) show every step already unlocked here, so you
   can read straight through without listening to each one.

   Sample numbers fill every data table (the lesson plan's expected averages),
   so graphs, data questions and the built explanation all show real values.
   On a push screen that investigation's table is emptied, so you see what a
   student sees when they arrive there.

   NOTHING IS SAVED OR SENT. window.PREVIEW stops app.save(), post(),
   submitWritten() and the local score list — so previewing on a student's
   Chromebook cannot overwrite their work, and no rows reach the sheet.
   Exit reloads the page clean.

   Open it three ways: the Teacher button on the name-picker page, the small
   "Teacher preview" link at the bottom of the cover, or ?teacher in the URL.
═══════════════════════════════════════════════════════ */
(function () {
  /* The lesson plan's expected averages, in cm. */
  const SAMPLE = {
    A: { by: 'surface', v: { ice: 494, wood: 206, carpet: 99, sand: 55 } },
    B: { by: 'push',    v: { small: 109, medium: 206, big: 333 } },
    C: { by: 'ramp',    v: { low: 83, mid: 167, high: 250 } },
    D: { by: 'vehicle', v: { car: 206, truck: 82 } }
  };

  const NAMES = {
    cover: 'Cover', why: 'The big question', care: 'Why should you care', cart: 'Meet your cart', summary: 'What we just talked about', plan: 'Here is the plan',
    start: 'Pick your name', vocab: 'Six words', vq: 'Word check',
    predictA: 'Test 1 · predict', runA: 'Test 1 · push (surfaces)', graphA: 'Test 1 · graph',
    predictB: 'Test 2 · predict', runB: 'Test 2 · push (push size)', graphB: 'Test 2 · graph',
    daygate:  'End of Day 1 · ask Mr. O', daygate2: 'End of Day 2 · ask Mr. O',
    predictC: 'Test 3 · predict', runC: 'Test 3 · let go (ramp)', graphC: 'Test 3 · graph',
    predictD: 'Test 4 · predict', runD: 'Test 4 · push (car vs truck)', graphD: 'Test 4 · graph',
    analysis: 'Read my data', claims: 'Build the explanation', write: 'Written answer',
    exit: 'Exit ticket', end: 'Finished'
  };
  const GROUP = p =>
    ['cover', 'why', 'care', 'summary', 'cart', 'plan', 'start'].indexOf(p) !== -1 ? 'Before the lesson'
    : PHASES.indexOf(p) <= PHASES.indexOf('daygate')  ? 'Day 1'
    : PHASES.indexOf(p) <= PHASES.indexOf('daygate2') ? 'Day 2'
    : 'Day 3';

  const BANK = {
    vq: () => VOCAB_Q, analysis: () => ANALYSIS_Q,
    claims: () => CLAIMS_Q, exit: () => EXIT_Q
  };

  /* Every screen, and every question inside a question screen, as one list. */
  function buildStops() {
    const out = [];
    PHASES.forEach(p => {
      if (p === 'write' && !(window.WRITTEN_Q || []).length) return;   /* skipped in this lesson */
      if (BANK[p]) {
        const qs = BANK[p]();
        qs.forEach((q, i) => out.push({ phase: p, q: i,
          label: NAMES[p] + ' · ' + (i + 1) + ' of ' + qs.length }));
      } else {
        /* A guided screen with several pages (one word per page, the three
           predict pages) is one stop PER PAGE, so the preview shows exactly
           what a student sees. The count comes from the screen's own markup. */
        const n = window.guide ? guide.pagesFor(p) : 0;
        if (n > 1) {
          for (let i = 0; i < n; i++) out.push({ phase: p, gp: i,
            label: (NAMES[p] || p) + ' \u00b7 ' + (p === 'vocab' ? 'word ' : 'page ') + (i + 1) + ' of ' + n });
        } else {
          out.push({ phase: p, label: NAMES[p] || p });
        }
      }
    });
    return out;
  }

  let STOPS = [], at = 0;

  function sampleRows(k) {
    const inv = invOf(k), S = SAMPLE[k];
    return inv.runs.map(r => Object.assign({}, r, {
      /* first trial a little long, last a little short, any between exact:
         the average comes out as the plan's number */
      cm: S.v[r[S.by]] + (r.trial === 1 ? 3 : r.trial === LAB.TRIALS ? -3 : 0)
    }));
  }
  function fillAll() {
    ['A', 'B', 'C', 'D'].forEach(k => {
      app.data[k] = sampleRows(k);
      app.runIndex[k] = app.data[k].length;
      const inv = invOf(k);
      app.predictions[k] = inv.predictOpts[0];
    });
    app.lastRun = null;
  }

  function prepare(stop) {
    app.studentName = 'Mr. O (Teacher)';
    const chip = document.getElementById('who-chip');
    if (chip) chip.textContent = 'Teacher preview';
    fillAll();
    app.vocabAns = {}; app.analysisAns = {}; app.claimsAns = {}; app.exitAns = {};
    app.missedQuestions = [];
    const m = /^run([ABCD])$/.exec(stop.phase);
    if (m) { app.data[m[1]] = []; app.runIndex[m[1]] = 0; }
    if (stop.phase === 'end') {
      /* show the explanation a student would have built */
      const d = labSummary();
      CLAIMS_Q.filter(q => q.cer).forEach(q => { app.claimsAns[q.id] = q.resolve(d); });
    }
  }

  function show(i) {
    at = Math.max(0, Math.min(STOPS.length - 1, i));
    const stop = STOPS[at];
    try { speech.stop(); } catch (e) {}
    prepare(stop);
    const p = stop.phase;
    if (p === 'cover')        { app.phase = 'cover'; app.show('cover-screen'); drawRail(); }
    else if (p === 'why')     { showWhy(); }
    else if (p === 'care')    { showCare(); }
    else if (p === 'summary') { showSummary(); }
    else if (p === 'cart')    { showCart(); }
    else if (p === 'plan')    { showPlan(); }
    else if (p === 'start')   { app.phase = 'start'; app.show('start-screen'); drawRail(); }
    else {
      app.go(p);
      if (stop.q != null) { app.qIndex = stop.q; app.qLocked = false; renderQ(); }
    }
    if (stop.gp != null && window.guide && guide.current) guide.current.goto(stop.gp);
    syncWordHelp(p);
    document.getElementById('tp-jump').value = String(at);
    document.getElementById('tp-pos').textContent = (at + 1) + ' / ' + STOPS.length;
    document.getElementById('tp-prev').disabled = at === 0;
    document.getElementById('tp-next').disabled = at === STOPS.length - 1;
    window.scrollTo(0, 0);
  }

  function buildBar() {
    if (document.getElementById('tpbar')) return;
    const groups = {};
    STOPS.forEach((s, i) => {
      const g = GROUP(s.phase);
      (groups[g] = groups[g] || []).push('<option value="' + i + '">' + s.label + '</option>');
    });
    const bar = document.createElement('div');
    bar.id = 'tpbar';
    bar.setAttribute('data-noread', '');
    bar.innerHTML =
      '<span class="tp-tag">Teacher preview</span>' +
      '<span class="tp-note">nothing is saved or sent</span>' +
      '<button type="button" id="tp-prev">&#9664; Back</button>' +
      '<select id="tp-jump" aria-label="Jump to a screen">' +
        Object.keys(groups).map(g => '<optgroup label="' + g + '">' + groups[g].join('') + '</optgroup>').join('') +
      '</select>' +
      '<span id="tp-pos"></span>' +
      '<button type="button" id="tp-next">Next &#9654;</button>' +
      '<button type="button" id="tp-exit">Exit</button>';
    document.body.prepend(bar);
    document.body.classList.add('tp-on');
    document.getElementById('tp-prev').onclick = () => show(at - 1);
    document.getElementById('tp-next').onclick = () => show(at + 1);
    document.getElementById('tp-jump').onchange = e => show(parseInt(e.target.value, 10));
    document.getElementById('tp-exit').onclick = () => {
      try { speech.stop(); } catch (e) {}
      location.href = location.pathname;          /* reload clean, preview off */
    };
    document.addEventListener('keydown', e => {
      if (!window.PREVIEW) return;
      const t = (e.target && e.target.tagName) || '';
      if (/INPUT|TEXTAREA|SELECT/.test(t)) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); show(at + 1); }
      if (e.key === 'ArrowLeft')  { e.preventDefault(); show(at - 1); }
    });
  }

  function begin() {
    window.PREVIEW = true;
    app.stopTimer && app.stopTimer();
    STOPS = buildStops();
    buildBar();
    show(0);
  }

  /* Exposed for the Teacher button, the cover link and ?teacher. */
  window.startTeacherPreview = function () {
    if (window.PREVIEW) return;
    askPin('Teacher preview: scan every screen of the lesson. Nothing is saved or sent.', begin);
  };
  /* for testing, and for anything that needs the list without the PIN */
  window.__previewStops = () => buildStops();

  const link = document.getElementById('cv-teacher');
  if (link) link.onclick = e => { e.preventDefault(); window.startTeacherPreview(); };

  if (/[?&]teacher\b/.test(location.search)) window.startTeacherPreview();
})();
