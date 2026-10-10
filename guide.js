/* ══════════════════════════════════════════════════════
   GUIDED READING — one thing at a time, heard to the end

   Marcos 10/9: "We need to develop a way to ensure we get the kids to read
   each one and guarantee that it has been read. There are so many things to
   look at but not guaranteed flow that the kids should follow."

   A screen used to show every tile at once with a Next button underneath, so
   nothing stopped a student pressing Next without reading a word. Now:

     - only ONE step is open. The steps after it are locked and blank.
     - the open step has one big Listen button. When the voice reaches the
       end, the step gets a check mark and the next one unlocks.
     - the screen's own Next button does not exist until every step on the
       page has been heard.

   Stopping the voice early does not count. A device that cannot speak falls
   back to a wait (long enough to read the step) and an "I read it" button.

   What this proves: the audio for every step played to the end, in order.
   It cannot prove a child was listening.

   Markup contract — a screen opts in by marking its own content:
     [data-step]    one thing to hear. Steps unlock in document order.
     [data-gpage]   optional. A group of steps shown on its own page, with
                    Back / Next. Without any, the whole screen is one page.
     [data-gafter]  shown only when every step on its page has been heard:
                    the real Next button, a question, the answer choices.
                    Outside every page (a screen's own button row), it
                    shows on the last page once everything has been heard.

   How far a student got is kept in app.heard and saved with the session, so
   coming back never makes them listen to the same step twice.

   The teacher preview shows every step unlocked. guide.testGate (set by
   qa.js only) turns the lock back on inside the preview so the gate itself
   can be tested without a student name or a row sent to the sheet.
══════════════════════════════════════════════════════ */
(function () {
  const wordsIn = t => (String(t).match(/[A-Za-z0-9']+/g) || []).length;
  /* how long a student whose device will not speak must stay on a step */
  const dwellMs = w => Math.min(15000, Math.max(3000, w * 450));
  const START_WAIT = 4000;      /* no sound started by then: this device cannot speak */
  let noVoice = false;

  function run(root, opts) {
    opts = opts || {};
    const id = opts.id || root.id || 'guide';

    /* A card is rendered more than once (the four predict screens share one),
       so take off whatever the last run left behind. */
    root.querySelectorAll('.gbar,.gnav,.gdots').forEach(n => n.remove());
    root.querySelectorAll('.gstep').forEach(n => n.classList.remove('gstep', 'g-live', 'g-done', 'g-locked', 'g-play'));
    root.querySelectorAll('.ghide').forEach(n => n.classList.remove('ghide'));
    root.classList.remove('g-alldone');

    let pageEls = [...root.querySelectorAll('[data-gpage]')];
    const paged = pageEls.length > 0;
    if (!paged) pageEls = [root];

    const steps = [];
    const pages = pageEls.map((el, p) => {
      const mine = [...el.querySelectorAll('[data-step]')].filter(s => speech.textOf(s));
      const first = steps.length;
      mine.forEach(s => steps.push({ el: s, page: p }));
      return { el, first, count: mine.length, after: [...el.querySelectorAll('[data-gafter]')] };
    });
    const total = steps.length;
    /* a screen's own button row sits outside the pages: it belongs to the end */
    const endAfter = paged
      ? [...root.querySelectorAll('[data-gafter]')].filter(a => !a.closest('[data-gpage]'))
      : [];

    const gate = !window.PREVIEW || !!guide.testGate;
    /* Under test the count is kept apart from the student's (and never
       saved), but it IS kept: a push screen repaints itself after every
       push, and a lock that forgot what was heard would shut again. */
    const store = () => guide.testGate
      ? (guide.testHeard || (guide.testHeard = {}))
      : (app.heard || (app.heard = {}));
    let heard = !gate ? total : Math.min(total, store()[id] || 0);
    let playing = -1;

    const pageDone = p => heard >= pages[p].first + pages[p].count;
    let page = opts.page != null ? opts.page : (heard < total ? steps[heard].page : pages.length - 1);

    steps.forEach((s, k) => {
      s.el.classList.add('gstep');
      const bar = document.createElement('div');
      bar.className = 'gbar';
      bar.setAttribute('data-noread', '');
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'gbtn';
      b.onclick = e => { e.preventDefault(); e.stopPropagation(); press(k); };
      bar.appendChild(b);
      s.el.appendChild(bar);
      s.btn = b;
    });

    let dots = null;
    if (paged && pages.length > 1) {
      dots = document.createElement('div');
      dots.className = 'gdots';
      dots.setAttribute('data-noread', '');
      dots.setAttribute('aria-hidden', 'true');
      pages.forEach(() => dots.appendChild(document.createElement('i')));
      pages[0].el.parentNode.insertBefore(dots, pages[0].el);

      pages.forEach((pg, p) => {
        const nav = document.createElement('div');
        nav.className = 'gnav btnrow';
        nav.setAttribute('data-noread', '');
        if (p < pages.length - 1) {
          const n = document.createElement('button');
          n.type = 'button'; n.className = 'btn gnext';
          n.innerHTML = 'Next &rarr;';
          n.onclick = () => goto(p + 1);
          nav.appendChild(n); pg.nextBtn = n;
        }
        if (p > 0) {
          const bk = document.createElement('button');
          bk.type = 'button'; bk.className = 'btn ghost small gback';
          bk.innerHTML = '&larr; Back';
          bk.onclick = () => goto(p - 1);
          nav.appendChild(bk);
        }
        pg.el.appendChild(nav);
      });
    }

    function label(s, k) {
      if (k < heard) return '\u{1F50A} Hear it again';
      if (playing === k) return '\u{1F50A} Listening…';
      if (s.manual) return Date.now() >= s.readyAt ? 'I read it ✓' : 'Read this part first…';
      return s.tried ? '\u{1F50A} Listen again, all the way to the end' : '\u{1F50A} Listen';
    }

    function paint() {
      pages.forEach((pg, p) => {
        if (paged) pg.el.classList.toggle('ghide', p !== page);
        const done = pageDone(p);
        pg.after.forEach(a => a.classList.toggle('ghide', !done));
        if (pg.nextBtn) pg.nextBtn.classList.toggle('ghide', !done);
      });
      const atEnd = heard >= total && page === pages.length - 1;
      endAfter.forEach(a => a.classList.toggle('ghide', !atEnd));
      /* A student who has heard everything: a screen may fold its steps away
         (the push screen does). Never in the teacher preview, where the
         point is to see them. */
      root.classList.toggle('g-alldone', gate && total > 0 && heard >= total);
      if (dots) [...dots.children].forEach((d, p) => { d.className = p === page ? 'on' : (pageDone(p) ? 'done' : ''); });
      steps.forEach((s, k) => {
        const live = k === heard;
        s.el.classList.toggle('g-done', k < heard);
        s.el.classList.toggle('g-live', live);
        s.el.classList.toggle('g-locked', k > heard);
        s.el.classList.toggle('g-play', playing === k);
        /* A silent device: the wait starts when the step is actually in front
           of the student, not while it sits on a page they have not reached. */
        if (live && gate && noVoice && !s.manual && s.page === page) arm(s);
        s.btn.textContent = label(s, k);
        s.btn.classList.toggle('wait', live && !!s.manual && Date.now() < s.readyAt);
      });
    }

    function arm(s) {
      const ms = dwellMs(wordsIn(speech.textOf(s.el)));
      s.manual = true; s.readyAt = Date.now() + ms;
      setTimeout(paint, ms + 60);
    }

    function mark(k) {
      if (k + 1 > heard) {
        heard = k + 1;
        if (gate) store()[id] = heard;
        if (gate && !guide.testGate) {
          try { app.save(); } catch (e) {}
          if (heard === total) logEvent('heard_all', { s: id, n: total });
        }
        if (heard === total && opts.onDone) { paint(); opts.onDone(); return; }
      }
      paint(); reveal();
    }

    /* Bring the next thing to do into view: the step that just unlocked, or
       the Next button that just appeared. */
    function reveal() {
      let target = null;
      if (heard < total && steps[heard].page === page) target = steps[heard].el;
      else {
        const pg = pages[page];
        target = (pg.nextBtn && !pg.nextBtn.classList.contains('ghide') && pg.nextBtn) || pg.after[0] ||
                 (heard >= total && page === pages.length - 1 && endAfter[0]) || null;
      }
      if (!target || !gate) return;
      /* Just far enough to show all of it. The help bar is pinned to the
         bottom of the working screens, so "on screen" stops short of it
         (the CSS scroll-margin on .gstep and the buttons matches). */
      const r = target.getBoundingClientRect();
      if (r.bottom > innerHeight - 76 || r.top < 8) target.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }

    function press(k) {
      if (k > heard) return;
      const s = steps[k];
      if (playing === k) return;                   /* a second tap must not cut the voice off */
      if (k === heard && s.manual) { if (Date.now() >= s.readyAt) mark(k); return; }
      play(k);
    }

    function play(k) {
      const s = steps[k];
      const text = speech.textOf(s.el);
      let settled = false, started = false, startTimer = null, watchdog = null;
      const settle = () => { settled = true; clearTimeout(startTimer); clearTimeout(watchdog); if (playing === k) playing = -1; };
      const finish = ok => { if (settled) return; settle(); if (ok) mark(k); else { s.tried = true; paint(); } };
      const silent = () => { if (settled) return; settle(); noVoice = true; if (k === heard && gate) arm(s); paint(); };

      playing = k; paint();
      speech.sayParts([{ el: s.el, text }], READ_RATE,
        (ok, why) => { if (why === 'unavailable' || why === 'error') silent(); else finish(ok); },
        () => { started = true; });
      if (settled) return;
      startTimer = setTimeout(() => { if (!started && !settled) { silent(); speech.stop(); } }, START_WAIT);
      /* Some voices never report that they finished. Generous on purpose —
         about 80 words a minute — so it can only fire after a real voice
         would be done. */
      watchdog = setTimeout(() => { if (started && !settled) { finish(true); speech.stop(); } },
        wordsIn(text) * 750 + 6000);
    }

    function goto(p) {
      try { speech.stop(); } catch (e) {}
      page = Math.max(0, Math.min(pages.length - 1, p));
      paint();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      later(reveal);
    }
    /* A screen scrolls itself to the top when it opens. Wait for that, then
       make sure the open step and its Listen button are actually on screen:
       on a Chromebook two screens opened with the button just out of sight. */
    function later(fn) { setTimeout(() => { if (guide.current === ctrl) fn(); }, 450); }

    paint();
    const ctrl = {
      id, root, total,
      pageCount: pages.length,
      get page() { return page; },
      get heard() { return heard; },
      goto
    };
    guide.current = ctrl;
    later(reveal);
    return ctrl;
  }

  /* How many pages a phase's guided screen has, read from the real markup so
     the teacher preview can list every page without a hand-kept number. */
  function pagesFor(phase) {
    const count = sel => document.querySelectorAll(sel + ' [data-gpage]').length;
    if (/^predict[ABCD]$/.test(phase)) return count('#predict-card');
    if (phase === 'daygate') return count('#daygate-screen');
    if (phase === 'vocab') return LESSON.vocab.length;
    if (phase === 'plan') return (planHTML().match(/data-gpage/g) || []).length;
    return 0;
  }

  window.guide = { run, pagesFor, current: null, testGate: false, testHeard: {} };
})();
