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
     C2  the opening path goes cover → why → care → summary → cart → plan → start
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
  const path = [app.phase], talked = [];
  for (const id of ['cover-go', 'why-next', 'care-next', 'sum-next', 'cart-next', 'ra-next']) {
    const b = document.getElementById(id);
    if (!b) { path.push('(no #' + id + ')'); break; }
    if (id !== 'cover-go') await gateCheck(app.phase, visible()[0], b);
    b.click(); await wait(1200);
    if (speechSynthesis.speaking || speechSynthesis.pending) talked.push(app.phase);
    hush(); path.push(app.phase);
  }
  const wantPath = ['cover', 'why', 'care', 'summary', 'cart', 'plan', 'start'];
  rec('C2', 'Opening path in order', JSON.stringify(path) === JSON.stringify(wantPath), path.join(' → '));

  /* C11 — a thing is introduced before it is talked about. Marcos: "You start
     talking about a cart and the kids have no idea why you are talking about
     it." No page before Meet your cart may mention the cart. */
  const early = ['cover-screen', 'why-screen', 'care-screen', 'summary-screen']
    .filter(id => /\bcarts?\b/i.test((document.getElementById(id) || {}).textContent || ''));
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
  const tooWide = [];
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
  const bank = [].concat(VOCAB_Q, ANALYSIS_Q, CLAIMS_Q, EXIT_Q).filter(q => !q.adaptive);
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

  /* C24 — picking up a lesson that was saved before the runs changed. */
  {
    const fitBad = [];
    const rowsOf = (k, runs) => runs.map(r => Object.assign({}, r, { cm: distanceCm(r, true) }));
    /* a save that fits: every test full, the student on the last questions */
    const full = { phase: 'exit', heard: { runA0: 2, graphA: 7, vocab: 12 },
      data: { A: rowsOf('A', invOf('A').runs), B: rowsOf('B', invOf('B').runs), C: rowsOf('C', invOf('C').runs), D: rowsOf('D', invOf('D').runs) } };
    const f1 = fitSaved(full);
    if (f1.redo || f1.phase !== 'exit') fitBad.push('a save that fits was sent back to ' + f1.phase);
    ['A', 'B', 'C', 'D'].forEach(k => { if (f1.data[k].length !== invOf(k).runs.length || f1.runIndex[k] !== invOf(k).runs.length) fitBad.push('a save that fits lost pushes in ' + k); });
    if (f1.heard.runA0 !== 2 || f1.heard.graphA !== 7) fitBad.push('a save that fits lost what was heard');
    /* partway through a test, nothing wrong with it */
    const mid = { phase: 'runA', data: { A: rowsOf('A', invOf('A').runs.slice(0, 5)) } };
    const f2 = fitSaved(mid);
    if (f2.redo || f2.phase !== 'runA' || f2.runIndex.A !== 5) fitBad.push('a save in the middle of Test 1 was changed');
    /* a save from a lesson with one push fewer per setup: the same runs with
       the last trial of every setup left out */
    const top = k => invOf(k).runs.reduce((m, r) => Math.max(m, r.trial), 1);
    const old = { phase: 'analysis', heard: { runA0: 2, runA3: 1, graphA: 7, runB0: 1 }, analysisAns: { L05: 1 },
      data: { A: rowsOf('A', invOf('A').runs.filter(r => r.trial < top('A'))), B: rowsOf('B', invOf('B').runs.filter(r => r.trial < top('B'))),
              C: rowsOf('C', invOf('C').runs.filter(r => r.trial < top('C'))), D: rowsOf('D', invOf('D').runs.filter(r => r.trial < top('D'))) } };
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
    /* rows that are not rows at all (a damaged save) must not crash */
    try { const f4 = fitSaved({ phase: 'runB', data: { A: [1, 2, 3], B: null } }); if (f4.phase !== 'runA' || f4.data.A.length) fitBad.push('a damaged save was not reset to Test 1'); }
    catch (e) { fitBad.push('a damaged save crashed: ' + e.message); }
    rec('C24', 'A lesson saved before the pushes changed is made to fit when it is picked up', fitBad.length === 0, fitBad.slice(0, 5).join(' | '));
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
