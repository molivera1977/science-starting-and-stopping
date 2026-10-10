/* ═══════════════════════════════════════════════════════════════
   STARTING AND STOPPING — Grade 4 Science, Quarter 1, Lesson 1.1
   NGSS 4-PS3-1 · 4-PS3-3

   Flow:  read-aloud → vocabulary → vocabulary check
          → Investigation A (predict · 8 runs · graph)
          → Investigation B (predict · 6 runs · graph)
          → data analysis (8 items, answered from the student's own table)
          → written explanation (CER, 2 prompts)
          → exit ticket (6 items)

   Standards this site follows (same as the math review sites):
     · skill tags on every item, misses saved as "[ID] (Skill) q (picked: …)"
     · elapsed is TIME ON TASK — the clock pauses while the page is hidden
     · session log: start · leave · return · resume · close · finish
     · resume never re-asks a question the student already answered
═══════════════════════════════════════════════════════════════ */

/* ── CONFIG ─────────────────────────────────────────── */
const STORAGE_KEY  = 'sci_startstop_session_v1';
const SCORES_KEY   = 'sci_startstop_scores_v1';
const SESSION_ID_KEY = 'sci_startstop_session_id_v1';
const TEACHER_PIN  = '9377';
const GAME_KEY     = 'startstop-lesson';
const WRITTEN_KEY  = 'startstop_written';

const SESSION_ID = (() => {
  let id = localStorage.getItem(SESSION_ID_KEY);
  if (!id) { id = 'SS-' + Math.random().toString(36).slice(2, 9).toUpperCase(); localStorage.setItem(SESSION_ID_KEY, id); }
  return id;
})();

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbzv8CWv1yyi8NeH04now9UxVL4IZm5yMqqsEGMcgGdrcAOWVB-aSp5siTvSSJXIUpzFMA/exec';

let tabSwitchCount = 0;

/* One saved miss: "[ID] (Skill) question (picked: answer)" — the standard
   every review uses, so the teacher dashboard can rank skills. */
function missEntry(m) {
  const skill  = m.skill || (window.SKILLS || {})[m.id] || 'Unsorted';
  const picked = m.yourAnswer == null || m.yourAnswer === '' ? '' :
    ` (picked: ${String(m.yourAnswer).replace(/\s*\|\s*/g, ' / ').replace(/\s+/g, ' ').trim()})`;
  return `[${m.id}] (${skill}) ${m.q}${picked}`;
}

function stripTags(s) {
  const d = document.createElement('div'); d.innerHTML = String(s == null ? '' : s);
  return (d.textContent || '').replace(/\s+/g, ' ').trim();
}

/* ── SHEET SUBMISSION ───────────────────────────────── */
function sheetBody(done) {
  const total = app.totalItems();
  const pct   = total ? Math.round((app.score / total) * 100) : 0;
  return {
    action:    'submit',
    game:      GAME_KEY,
    sessionId: SESSION_ID + (done ? '-F' : ''),
    name:      app.studentName || 'Unknown',
    form:      'Lesson 1.1 — Starting and Stopping',
    score:     app.score,
    total:     total,
    percent:   pct,
    status:    done ? 'Complete' : 'In Progress (' + app.phaseLabel() + ')',
    done:      !!done,
    elapsed:   app.timerSeconds,
    tabSwitches: tabSwitchCount,
    wrongQuestions: (app.missedQuestions || []).map(missEntry).join(' | '),
    startedAt:  app.startedAt || '',
    finishedAt: app.finishedAt || '',
    events:     JSON.stringify(app.events || []),
    timestamp:  new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
  };
}
/* PART 2 — the two written explanations, graded by Mr. O.
   Same shape every other site uses: tab "<game>_written", a fixed
   row of w1/w2/w3, paired to the score row by student name. */
function submitWritten() {
  /* Teacher preview must never write a student's save or a sheet row. */
  if (window.PREVIEW) return;
  try {
    fetch(SHEET_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action:    'written',
        game:      WRITTEN_KEY,
        sessionId: SESSION_ID + '-written',
        name:      app.studentName || 'Unknown',
        w1: app.written.W01 || '', w2: '', w3: '',
        elapsed:   app.timerSeconds,
        timestamp: new Date().toLocaleString('en-US', { timeZone: 'America/New_York' })
      })
    }).catch(() => {});
  } catch (e) {}
}

function post(done) {
  /* Teacher preview must never write a student's save or a sheet row. */
  if (window.PREVIEW) return;
  try {
    fetch(SHEET_URL, {
      method: 'POST', mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sheetBody(done))
    }).catch(() => {});
  } catch (e) { /* offline is fine — progress still saves on the device */ }
}
const submitPartial = () => post(false);
const submitFinal   = () => post(true);

/* ── ROSTER ─────────────────────────────────────────── */
const ROSTER = [
  { name: "Mr. O (Teacher)",           id: "9377" },
  { name: "Avery, Jo'Von",             id: "10053632" },
  { name: "Belasquez Bonilla, Eduin",  id: "10058674" },
  { name: "Castaneda, Kelvin",         id: "10053248" },
  { name: "Chicas-Santos, Allison",    id: "10066737" },
  { name: "Collado, Roniel",           id: "10060249" },
  { name: "Dejesus, Michael",          id: "10049434" },
  { name: "Dock, Fakeem",              id: "10059720" },
  { name: "Douglas, Iyana",            id: "10070980" },
  { name: "Dumphrey, Christopher",     id: "10060696" },
  { name: "Flores, Kiara",             id: "10052834" },
  { name: "Johnson, Destiny",          id: "10052926" },
  { name: "Jones, Tahji",              id: "10060315" },
  { name: "Lawrence, Eric",            id: "10057451" },
  { name: "Madero, Jovany",            id: "10076374" },
  { name: "Pettway, Lanaura",          id: "10060616" },
  { name: "Polanco Soriano, Thiara",   id: "10060503" },
  { name: "Roberts, Robyn",            id: "10060925" },
  { name: "Rojas, Alanie",             id: "10076388" },
  { name: "Sanchez Rodriguez, Johanelyz", id: "10076767" },
  { name: "Vega, Taishmara",           id: "10054043" },
  { name: "Watts, Autumn",             id: "10039032" },
  { name: "Zelaya-Osorto, Nazareth",   id: "10053626" }
];

/* ── READ ALOUD ─────────────────────────────────────────
   Speaks the text and highlights each word as it is said.
   Falls back silently when a device has no speech voices. */
/* Speech settings copied from the rounding reviews so every site sounds the
   same to the class. No voice is named on any of them — the browser default is
   used — so the rate is what makes the difference:
     0.82 for a screen that speaks itself (Marcos 10/6: "0.92 ran ahead of the
          highlight"), 0.92 for a read the student asks for by button. */
/* Slowed on this lesson, Marcos 10/9 after hearing the guided pages: "can we
   slow the rate of speech?" Every Listen button and speaker icon here now
   reads at 0.82, the pace he had already approved for screens that speak
   themselves. The other sites still read on demand at 0.92. */
const READ_RATE  = 0.82;
const INTRO_RATE = 0.82;
/* The 58 ms-a-letter figure that paces the highlight on voices with no word
   events was measured at 0.92. It is scaled from THAT, not from READ_RATE,
   or slowing the voice would leave the highlight running ahead of it. */
const PACE_BASE  = 0.92;

const speech = {
  words: [], parts: [], host: null, timer: null,

  prep(host) {
    this.host = host;
    host.querySelectorAll('.wrd').forEach(n => n.classList.remove('spk'));
    this.words = [...host.querySelectorAll('.wrd')];
  },

  say(host, onEnd, tail, rate) {
    this.stop();
    if (!('speechSynthesis' in window)) { if (onEnd) onEnd(); return; }
    this.prep(host);
    /* When a caller supplies its own spoken text, that text IS the speech: the
       host is only there to highlight words, and reading its raw markup as well
       runs the labels together ("forceen espanol: fuerzaa push or a pull"). */
    const text = this.words.map(w => w.textContent).join(' ') || (tail ? '' : stripTags(host.innerHTML));
    if (!text && !tail) { if (onEnd) onEnd(); return; }

    const u = new SpeechSynthesisUtterance(text + (tail || ''));
    u.lang = 'en-US'; u.rate = rate || READ_RATE;

    let spoken = false;
    u.onboundary = (e) => {
      if (e.name && e.name !== 'word') return;
      spoken = true;
      const upto = text.slice(0, e.charIndex).split(/\s+/).filter(Boolean).length;
      this.mark(upto);
    };
    u.onstart = () => {
      /* Some voices never fire onboundary. Pace the highlight by hand
         if nothing has arrived after a moment. */
      const per = Math.max(170, (text.length * 58) / Math.max(1, this.words.length) * (PACE_BASE / u.rate));
      let i = 0;
      this.timer = setInterval(() => {
        if (spoken) { clearInterval(this.timer); this.timer = null; return; }
        this.mark(i++);
        if (i > this.words.length) { clearInterval(this.timer); this.timer = null; }
      }, per);
    };
    u.onend = u.onerror = () => { this.clear(); if (onEnd) onEnd(); };

    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
    catch (e) { if (onEnd) onEnd(); }
  },

  mark(i) {
    this.words.forEach((w, k) => w.classList.toggle('spk', k === i));
  },

  /* EVERYTHING ON THIS CLASS'S SCREENS MUST BE HEARABLE (Marcos, 10/8).
     So a screen's speaker reads the WHOLE screen in reading order rather than a
     list someone curated — headings, prose, cards, choices, data rows, the
     feedback after an answer, the hints beside a writing box. Anything added
     later is covered without being remembered. Mark a node [data-noread] to
     leave it out (the speaker button itself, decoration). */
  /* What a block should SAY. Anything marked [data-noread] is stripped first
     (the speaker icons themselves), and an answer choice's letter badge is
     separated from its words — without this, choice A reads as
     "AA push or a pull on an object". */
  textOf(el) {
    /* Built from the same word list that gets highlighted (tokensOf), on a
       copy, so what a block SAYS and what LIGHTS UP can never drift apart. */
    return this.joinTokens(this.tokensOf(this.split(el.cloneNode(true), [])));
  },
  /* Words go back together with a space between — except a mark that stands
     alone ("?" after a bold word, "." after a bold number), which closes up
     to the word before it: "a force?", not "a force ?". */
  gap(t, i) { return (i > 0 && !/^[.,!?;:)]+$/.test(t)) ? ' ' : ''; },
  joinTokens(tokens) { return tokens.map((t, i) => this.gap(t, i) + t).join(''); },

  /* ── WORD BY WORD ────────────────────────────────────────
     Marcos 10/9: "is it not possible to have word for word highlighting
     instead of the entire box lit up". A lit box tells a child that
     something is being read; a lit word tells them WHERE. So when a block is
     about to be spoken its text is split into one span a word, in place, and
     put back exactly as it was when the voice stops.

     Left alone: anything [data-noread] (speaker icons, Listen buttons,
     Spanish), and controls and pictures inside the block. */
  PAUSE_AFTER: 'div,p,li,h1,h2,h3,h4,td,th,.pt,.pd,.cerlbl,.ctest,.lbl,.exlbl,.ltr',
  made: [],          /* spans this object added and has to take out again */
  wrapped: [],       /* the blocks they were added to */

  /* Split root's text into word spans. Spans it creates are noted in `made`
     (pass an array to keep a throwaway copy's spans out of the live list).
     Words already in a span (question text) are used as they are. */
  split(root, made) {
    const skip = n => n.hasAttribute('data-noread') ||
      /^(button|svg|canvas|select|textarea|input|script|style)$/i.test(n.tagName);
    const spans = [];
    (function walk(node) {
      [...node.childNodes].forEach(ch => {
        if (ch.nodeType === 3) {
          if (!/\S/.test(ch.textContent)) return;
          const frag = document.createDocumentFragment();
          ch.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (!/\S/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const w = document.createElement('span');
            w.className = 'wrd'; w.textContent = part;
            frag.appendChild(w); spans.push(w); made.push(w);
          });
          node.replaceChild(frag, ch);
        } else if (ch.nodeType === 1 && !skip(ch)) {
          if (ch.classList.contains('wrd')) spans.push(ch); else walk(ch);
        }
      });
    })(root);
    spans.root = root;
    return spans;
  },

  /* What each word span should SAY. A word that ends a line of the layout
     (a heading, a label, a table box, a choice's letter badge) gets a full
     stop, so the voice pauses where the page already does — without it a
     vocabulary card spoke as "surfacethe top of the thing you roll on" and a
     label ran straight into its sentence. */
  tokensOf(spans) {
    const root = spans.root;
    const lineOf = w => { const b = w.parentElement && w.parentElement.closest(this.PAUSE_AFTER);
                          return (b && b !== root && root.contains(b)) ? b : root; };
    return spans.map((w, i) => {
      let t = (w.textContent || '').trim();
      const ends = i === spans.length - 1 || lineOf(spans[i + 1]) !== lineOf(w);
      if (ends && t && !/[.!?:,;]$/.test(t)) t += '.';
      return t;
    });
  },

  /* Take the word spans back out, leaving the text exactly as it was. */
  unwrap() {
    this.made.forEach(w => {
      w.classList.remove('spk');
      if (w.parentNode) w.parentNode.replaceChild(document.createTextNode(w.textContent), w);
    });
    this.wrapped.forEach(el => { try { el.normalize(); } catch (e) {} });
    this.made = []; this.wrapped = [];
  },

  readable(root) {
    if (!root) return [];
    /* Everything a student can see, they can hear. Audited 10/9 by walking
       every phase and listing text blocks with no speaker: 19 of them,
       including the line announcing where a push landed and the graph's
       verdict on their prediction. The pair blocks (.same/.chg) are listed
       rather than their .lb/.v halves so a label is spoken with its value
       — "Push stays the same: Medium push" — instead of as two fragments. */
    const SEL = 'h1,h2,h3,h4,p,li,td,th,' +
      '.vcard,.opt,.grow,.readout,.fb,.g,.sb,.step,.box,' +
      '.runnow,.note,.eyebrow,.qcount,.lbl,.same,.chg,.plain,.say,.counter,.chips-lbl,.qdata-h,' +
      '.rcard,.rl,.rnow,.wh-def,.wh-ex,.wb-q,.ptile,.schip,.tnote';
    const out = [];
    root.querySelectorAll(SEL).forEach(el => {
      if (el.closest('[data-noread]')) return;
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return;  /* hidden */
      /* A container marked data-parts is a wrapper, not a block: its children
         are what get spoken. Directions are the case that needs this — a step
         a student did not catch has to be replayable on its own, without
         sitting through the whole list again. */
      if (el.hasAttribute('data-parts')) return;
      if (out.some(prev => prev.contains(el) && !prev.hasAttribute('data-parts'))) return;
      /* A table box holding only a dash or a ? has nothing to say. Giving it
         a speaker put an icon in every empty box of the data table. */
      if (!/[A-Za-z0-9]/.test(this.textOf(el))) return;
      out.push(el);
    });
    /* Anything else that carries visible text becomes its own block. The list
       above is a list someone has to remember to update; every block type
       added on 10/9 that it missed was silent. This makes "everything read
       aloud" the default instead of a list to maintain. Controls (buttons,
       inputs) are skipped — they are things to press, not text to read. */
    root.querySelectorAll('span,div,label,b,strong,em,small').forEach(el => {
      if (el.closest('[data-noread]')) return;
      if (el.closest('button,select,option,textarea,input')) return;
      if (el.classList.contains('wrd')) return;     /* a word of a block, not a block */
      if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return;
      /* its own text: loose text, or that same text while it is split into
         word spans because the block is being read right now */
      const own = [...el.childNodes].filter(t => (t.nodeType === 3 && t.textContent.trim()) ||
          (t.nodeType === 1 && t.classList.contains('wrd')))
        .map(t => t.textContent.trim()).join(' ');
      if (!/[A-Za-z]{2}/.test(own)) return;
      if (out.some(prev => prev.contains(el) || el.contains(prev))) return;
      if (!this.textOf(el)) return;
      out.push(el);
    });
    out.sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING) ? -1 : 1);
    return out.map(el => ({ el, text: this.textOf(el) }));
  },

  /* One block, on its own — what a speaker icon does. */
  sayOne(el, rate) { this.sayParts([{ el, text: this.textOf(el) }], rate); },

  sayScreen(root, rate) { this.sayParts(this.readable(root), rate); },

  /* Some screens are a layout, not a paragraph — vocabulary cards, a bar chart,
     a row of answer choices. There are no words to wrap there, so the thing that
     lights up is the PART being spoken: the card, the bar, the choice. Each part
     carries the text to say for it, and the boundary event picks the part whose
     words are being read. */
  /* onEnd(ok, why): ok is true only when the voice reached the end by
     itself. why is 'ended', 'cancelled' (someone stopped it or started
     another), 'unavailable' (this device has no speech) or 'error'. The
     guided screens (guide.js) unlock the next step on ok and on nothing
     else. onStart fires when sound actually begins. */
  sayParts(parts, rate, onEnd, onStart) {
    this.stop();
    this.parts = [];
    if (!('speechSynthesis' in window) || !parts.length) { if (onEnd) onEnd(false, 'unavailable'); return; }

    /* One entry per spoken word: the span to light, or — for a part with no
       words of its own to wrap — the part itself, lit as a box as before. */
    const list = [];
    parts.forEach(p => {
      const spans = p.el ? this.split(p.el, this.made) : [];
      if (p.el) this.wrapped.push(p.el);
      if (spans.length) {
        this.tokensOf(spans).forEach((t, i) => list.push({ t, w: spans[i] }));
      } else {
        String(p.text || '').trim().split(/\s+/).filter(Boolean).forEach(t => list.push({ t, box: p.el }));
        if (p.el) this.parts.push(p.el);
      }
    });
    const text = this.joinTokens(list.map(x => x.t));
    if (!text) { this.unwrap(); if (onEnd) onEnd(false, 'unavailable'); return; }
    const job = this.job = { cancelled: false };
    const total = list.length;

    /* where each word starts in the spoken text, so the voice's "I am at
       letter N" can be turned into "that is word K" */
    const starts = []; let at = 0;
    list.forEach((x, i) => { at += this.gap(x.t, i).length; starts.push(at); at += x.t.length; });
    const wordAt = ch => { let k = 0; while (k + 1 < total && starts[k + 1] <= ch) k++; return k; };

    let lit = null;
    const light = k => {
      const x = list[Math.max(0, Math.min(total - 1, k))];
      const el = x && (x.w || x.box);
      if (el === lit) return;
      if (lit) lit.classList.remove('spk');
      if (el) el.classList.add('spk');
      lit = el;
    };

    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'en-US'; u.rate = rate || READ_RATE;

    let spoken = false;
    u.onboundary = e => {
      if (e.name && e.name !== 'word') return;
      spoken = true;
      light(wordAt(e.charIndex));
    };
    u.onstart = () => {
      if (onStart) onStart();
      /* voices that never report a boundary still get a moving highlight */
      const per = Math.max(240, (text.length * 58) / Math.max(1, total) * (PACE_BASE / u.rate));
      let i = 0;
      this.timer = setInterval(() => {
        if (spoken) { clearInterval(this.timer); this.timer = null; return; }
        light(i++);
        if (i > total) { clearInterval(this.timer); this.timer = null; }
      }, per);
    };
    /* An utterance that was cut off by the NEXT one reports in late. It must
       not tidy up — by then the words on screen belong to the new one. */
    const mine = () => this.job === job;
    u.onend = () => { if (mine()) this.clear(); if (onEnd) onEnd(!job.cancelled, job.cancelled ? 'cancelled' : 'ended'); };
    u.onerror = e => {
      if (mine()) this.clear();
      const stopped = job.cancelled || /interrupted|cancell?ed/.test((e && e.error) || '');
      if (onEnd) onEnd(false, stopped ? 'cancelled' : 'error');
    };

    try { window.speechSynthesis.cancel(); window.speechSynthesis.speak(u); }
    catch (e) { this.clear(); if (onEnd) onEnd(false, 'error'); }
  },
  clear() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
    this.words.forEach(w => w.classList.remove('spk'));
    (this.parts || []).forEach(el => el.classList.remove('spk'));
    this.unwrap();
  },
  stop() {
    if (this.job) this.job.cancelled = true;
    this.clear();
    try { if ('speechSynthesis' in window) window.speechSynthesis.cancel(); } catch (e) {}
  }
};

/* Wrap every word of an HTML string in <span class="wrd"> without
   breaking the markup inside it. */
function wrapWords(htmlStr) {
  const tmp = document.createElement('div');
  tmp.innerHTML = htmlStr;
  (function walk(node) {
    if (node.nodeType === 3) {
      const parts = node.textContent.split(/(\s+)/);
      const frag = document.createDocumentFragment();
      parts.forEach(p => {
        if (/\S/.test(p)) {
          const s = document.createElement('span');
          s.className = 'wrd'; s.textContent = p; frag.appendChild(s);
        } else if (p) { frag.appendChild(document.createTextNode(p)); }
      });
      node.parentNode.replaceChild(frag, node);
    } else { [...node.childNodes].forEach(walk); }
  })(tmp);
  return tmp.innerHTML;
}

/* ── SESSION EVENT LOG ──────────────────────────────────
   start · leave · return · resume · close · finish, each stamped with
   the on-task clock. elapsed is time ON TASK: the timer pauses while
   the page is hidden, so a sleeping device cannot inflate it. */
/* A speaker beside every block a student might want to hear on its own
   (Marcos, 10/8: everything has to be able to be read aloud). The icon is a
   span, not a button, because the answer choices ARE buttons and a button
   cannot sit inside one; the click is stopped so tapping the speaker never
   answers the question by accident. */
function attachSpeakers(root) {
  if (!root) return;
  const blocks = speech.readable(root).map(b => b.el);
  blocks.forEach(el => {
    if (el.querySelector(':scope > .mini-spk')) return;
    const b = document.createElement('span');
    b.className = 'mini-spk';
    b.setAttribute('role', 'button');
    b.setAttribute('tabindex', '0');
    b.setAttribute('data-noread', '');
    b.setAttribute('aria-label', 'Read this part to me');
    b.title = 'Read this part to me';
    b.textContent = '\u{1F50A}';
    const fire = e => { e.preventDefault(); e.stopPropagation(); sayJoined(el); };
    b.addEventListener('click', fire);
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') fire(e); });
    /* BEFORE the text, not after. A reader who needs the button should meet it
       on the way in, not after reading to the end of the line to find it — and
       IXL puts its speakers on the left, so this is the placement the class
       already knows.

       It goes before the first thing that CARRIES TEXT, so on a vocabulary
       card it sits beside the word rather than between the picture and the
       word. Leading decoration is skipped. */
    let anchor = el.firstChild;
    while (anchor &&
           ((anchor.nodeType === 3 && !anchor.textContent.trim()) ||
            (anchor.nodeType === 1 && anchor.classList && anchor.classList.contains('art')))) {
      anchor = anchor.nextSibling;
    }
    el.insertBefore(b, anchor);
  });
  joinLabels(root, blocks);
}

/* A LABEL IS READ WITH WHAT IT LABELS — on every screen.
   Marcos 10/10, on "QUESTION 1 OF 2" with one speaker and "What is a force?"
   with another: "should be combined." (He had said the same of a label on a
   guided page the day before; guide.js handles those. This is everywhere
   else.)

   A small capitals label says nothing on its own, so it gets no speaker of
   its own. Whatever is right under it — a heading or a sentence — speaks
   for both: "Question 1 of 2. Word check. What is a force?" and
   "Investigation A results. What my data looks like."

   Nothing is listed by class. A label is any block the page styles in
   capitals; "right under" is measured on the screen. So a label added later
   joins up without anyone remembering to. Table boxes and guided steps are
   left alone. */
function sayJoined(el) {
  const leads = (el._sleads || []).filter(l => l.isConnected && l._sfor === el && l.classList.contains('slead'));
  speech.sayParts(leads.concat([el]).map(x => ({ el: x, text: speech.textOf(x) })));
}
function joinLabels(root, els) {
  root.querySelectorAll('.slead').forEach(n => { n.classList.remove('slead'); n._sfor = null; });
  els.forEach(el => { el._sleads = null; });
  const apart = el => !!el.closest('.gstep,.glead,table');
  const kind = el => (!apart(el) && getComputedStyle(el).textTransform === 'uppercase') ? 'label' : '';
  /* b is right under a (or beside it on the same line) */
  const under = (a, b) => { const ra = a.getBoundingClientRect(), rb = b.getBoundingClientRect();
                            return rb.top - ra.bottom < 56 && rb.top >= ra.top - 6; };
  let i = 0;
  while (i < els.length) {
    if (!kind(els[i])) { i++; continue; }
    let j = i;
    while (j + 1 < els.length && kind(els[j + 1]) && under(els[j], els[j + 1])) j++;
    const next = els[j + 1];
    let target = null, leads = [];
    if (next && !apart(next) && under(els[j], next)) { target = next; leads = els.slice(i, j + 1); }
    else if (j > i) { target = els[j]; leads = els.slice(i, j); }   /* nothing under them: the last label speaks for the row */
    leads.forEach(l => { l.classList.add('slead'); l._sfor = target; });
    if (target) target._sleads = leads;
    i = j + (target === next && target ? 2 : 1);
  }
}

/* ══════════════════════════════════════════════════════
   WORD HELP — the definitions, always one tap away

   Shown on every screen between the word check and the exit ticket. The
   lesson words come from LESSON.vocab so there is one source of truth; the
   method words (trial, average, claim…) come from METHOD_WORDS, because
   those were used on screen dozens of times and never defined once.
══════════════════════════════════════════════════════ */
const WH_HIDE_ON = ['cover', 'why', 'care', 'summary', 'cart', 'plan', 'start', 'vocab', 'end'];

function buildWordHelp() {
  const row = document.getElementById('wh-words');
  const ans = document.getElementById('wh-answer');
  if (!row || row.childElementCount) return;

  const items = LESSON.vocab.map(v => ({
    label: v.word,
    html: art(WORD_ART[v.word], 'whart') +
          '<p class="wh-def"><b>' + v.word + '</b> &mdash; ' + v.def + '</p>' +
          (v.ex ? '<p class="wh-ex"><span class="exlbl" data-noread>For example</span>' + v.ex + '</p>' : '')
  })).concat(Object.keys(window.THING_WORDS || {}).map(k => ({
    label: k, cls: 'thing',
    html: art((window.THING_ART || {})[k], 'whart') +
          '<p class="wh-def"><b>' + k + '</b> &mdash; ' + THING_WORDS[k].def + '</p>' +
          '<p class="wh-ex"><span class="exlbl" data-noread>For example</span>' +
          THING_WORDS[k].ex + '</p>'
  }))).concat(Object.keys(METHOD_WORDS || {}).map(k => ({
    label: k, cls: 'word', html: '<p class="wh-def">' + METHOD_WORDS[k] + '</p>'
  })));

  items.forEach(it => {
    const b = document.createElement('button');
    b.type = 'button';
    b.className = 'chipbtn' + (it.cls ? ' ' + it.cls : '');
    b.setAttribute('data-noread', '');
    b.textContent = it.label;
    b.onclick = () => {
      ans.innerHTML = it.html;
      ans.classList.remove('hidden');
      [...row.children].forEach(c => c.classList.remove('on'));
      b.classList.add('on');
      attachSpeakers(ans);
      logEvent('wordhelp', { w: it.label });
    };
    row.appendChild(b);
  });

  document.querySelectorAll('.wh-tab').forEach(t => {
    t.onclick = () => {
      document.querySelectorAll('.wh-tab').forEach(x => x.classList.remove('on'));
      t.classList.add('on');
      const words = t.dataset.tab === 'words';
      document.getElementById('wh-wordpane').classList.toggle('hidden', !words);
      document.getElementById('wh-do').classList.toggle('hidden', words);
    };
  });

  const toggle = document.getElementById('wh-toggle');
  const panel = document.getElementById('wh-panel');
  toggle.onclick = () => {
    const open = panel.classList.toggle('hidden') === false;
    toggle.setAttribute('aria-expanded', String(open));
    document.getElementById('wordhelp').classList.toggle('open', open);
  };
}

/* What to do, on the screen they are on, at the moment they forget. The
   steps are stated once on the predict screen and then gone — by push six a
   student who lost the routine had nowhere to look. Marcos 10/9: "frequent
   and constant reminding of what to do and how to do it." */
const DO_STEPS = {
  vq:       ['Read the question. Tap the speaker to hear the question read to you.',
             'Tap the answer you think is right.',
             'Press <b>Check my answer</b>.'],
  analysis: ['Look at <b>your own data table</b> on this screen. The distances are the ones you measured.',
             'Read the question, then find the answer in your table.',
             'Tap your answer, then press <b>Check my answer</b>.'],
  claims:   ['You are building one explanation out of three picks.',
             'First the <b>claim</b> — what you think is true.',
             'Then the <b>evidence</b> — the distances from your data table.',
             'Then the <b>reasoning</b> — the reason why.'],
  exit:     ['Last few questions. Nothing new &mdash; same as before.',
             'Read the question, tap your answer, press <b>Check my answer</b>.']
};
function doStepsFor(phase) {
  const m = /^(predict|run|graph)([ABCD])$/.exec(phase);
  if (m) {
    const inv = invOf(m[2]);
    if (m[1] === 'predict')
      return ['Read what this test changes.', 'Make your guess. A guess is never marked wrong.',
              'Press <b>Lock in my prediction</b>.'];
    if (m[1] === 'run') return (inv && inv.doSteps) || null;
    return ['Look at the bars. A longer bar means ' + moverOf(inv.runs[0]) + ' traveled farther.',
            'Read what the page says about your guess.', 'Press <b>Next</b> to keep going.'];
  }
  return DO_STEPS[phase] || null;
}
function renderDoSteps(phase) {
  const host = document.getElementById('wh-do');
  if (!host) return;
  const steps = doStepsFor(phase);
  if (!steps) { host.innerHTML = '<p class="wh-def">Keep going &mdash; press the green button to move on.</p>'; }
  else {
    host.innerHTML = '<ol class="wh-steps">' +
      steps.map(t => '<li>' + t + '</li>').join('') + '</ol>';
  }
  /* On a push screen: what this push is using, in full, any time they want
     it again. It is heard once when it is new, and then lives here. */
  const m = /^run([ABCD])$/.exec(phase);
  const run = m && invOf(m[1]).runs[app.runIndex[m[1]]];
  if (run) host.innerHTML += '<p class="wh-def"><b>What you are using for this one</b></p>' +
    setupBits(run).map(b => '<p class="wh-ex">' + b.pic + '<b>' + b.name + '</b> &mdash; ' + b.full + '</p>').join('');
  attachSpeakers(host);
}

function syncWordHelp(phase) {
  const el = document.getElementById('wordhelp');
  if (!el) return;
  buildWordHelp();
  el.classList.toggle('hidden', WH_HIDE_ON.indexOf(phase) !== -1);
  renderDoSteps(phase);

  /* The driving question rides every working screen. */
  const wb = document.getElementById('whybar');
  if (wb) {
    const q = document.getElementById('wb-q');
    if (q && !q.innerHTML) { q.innerHTML = LESSON.driving; attachSpeakers(wb); }
    wb.classList.toggle('hidden', ['cover', 'why', 'care', 'summary', 'cart', 'plan', 'start', 'end'].indexOf(phase) !== -1);
  }
}

function logEvent(kind, extra) {
  if (!app.events) app.events = [];
  app.events.push(Object.assign({
    at: new Date().toISOString(), e: kind, p: app.phase || 'start', on: app.timerSeconds || 0
  }, extra || {}));
  if (app.events.length > 300) app.events.splice(0, app.events.length - 300);
}

/* ══════════════════════════════════════════════════════
   PHASES
══════════════════════════════════════════════════════ */
const PHASES = ['cover','why','care','summary','cart','plan','start','vocab','vq','predictA','runA','graphA',
                'predictB','runB','graphB',
                'daygate',
                'predictC','runC','graphC',
                'predictD','runD','graphD','analysis','claims','write','exit','end'];

/* Session 1 is the words and Investigation A — the only investigation that
   runs two trials, because averaging only needs teaching once. Session 2 is
   the other three at one push each, plus all of the thinking. Thirty minutes
   a session is the entire budget; see the lesson plan for where it goes.
   The site resumes mid-lab, so the split costs the student nothing. */
const DAY2_STARTS = 'daygate';   /* the stop between the two sessions */

const RAIL = [
  { key:'words', n:'Day 1', l:'Words',   phases:['vocab','vq'] },
  { key:'invA',  n:'Day 1', l:'Surfaces',phases:['predictA','runA','graphA'] },
  { key:'invB',  n:'Day 1', l:'Push',    phases:['predictB','runB','graphB','daygate'] },
  { key:'invC',  n:'Day 2', l:'Ramp',    phases:['predictC','runC','graphC'] },
  { key:'invD',  n:'Day 2', l:'Truck',   phases:['predictD','runD','graphD'] },
  { key:'anal',  n:'Day 2', l:'Analyze', phases:['analysis'] },
  { key:'write', n:'Day 2', l:'Explain', phases:['claims','write'] },
  { key:'exit',  n:'Day 2', l:'Exit',    phases:['exit','end'] }
];

/* (The old one-paragraph intro text lived here. Nothing has read it since
   the plan became tiles; removed so stale wording cannot be mistaken for
   something a student sees.) */

/* ══════════════════════════════════════════════════════
   APP
══════════════════════════════════════════════════════ */
const app = {
  studentName:'', phase:'start',
  score:0, missedQuestions:[], events:[],
  startedAt:'', finishedAt:'',
  timerSeconds:0, timerInterval:null, timerOn:false,
  labStart:null, labEnd:null,

  qIndex:0, qLocked:false, qTry:1, firstPick:null,
  vocabAns:{}, analysisAns:{}, claimsAns:{}, exitAns:{},
  written:{}, predictions:{},
  data:{ A:[], B:[], C:[], D:[] },
  runIndex:{ A:0, B:0, C:0, D:0 },
  lastRun:null,
  heard:{},        /* guide.js: how many steps of each guided screen were heard to the end */

  /* ── screens ── */
  show(id) {
    ['cover-screen','why-screen','care-screen','summary-screen','cart-screen','plan-screen','start-screen','vocab-screen','q-screen','lab-screen',
     'daygate-screen','write-screen','end-screen']
      .forEach(s => { const el = document.getElementById(s); if (el) el.classList.add('hidden'); });
    const el = document.getElementById(id); if (el) el.classList.remove('hidden');
    window.scrollTo({ top:0, behavior:'smooth' });
    /* Speakers attach when a screen is SHOWN, not when the page loads.
       attachSpeakers skips hidden blocks, so the name-picker — hidden at boot
       since the cover went in — silently lost every speaker. Attaching here,
       and again a tick later for content rendered right after show(), covers
       every screen no matter which function shows it. Safe to repeat: blocks
       that already have a speaker are skipped. */
    if (el) { attachSpeakers(el); setTimeout(() => attachSpeakers(el), 0); }
  },

  phaseLabel() {
    const m = { vocab:'Words', vq:'Word check',
      predictA:'Surfaces predict', runA:'Surfaces runs', graphA:'Surfaces graph',
      predictB:'Push predict',     runB:'Push runs',     graphB:'Push graph',
      predictC:'Ramp predict',     runC:'Ramp runs',     graphC:'Ramp graph',
      predictD:'Truck predict',    runD:'Truck runs',    graphD:'Truck graph',
      analysis:'Analyze data', claims:'Claim and evidence', write:'Explain',
      daygate:'End of Day 1', exit:'Exit ticket', end:'Done' };
    return m[this.phase] || this.phase;
  },

  totalItems() { return VOCAB_Q.length + ANALYSIS_Q.length + CLAIMS_Q.length + EXIT_Q.length; },
  labSeconds() {
    if (this.labStart == null) return 0;
    return Math.max(0, (this.labEnd == null ? this.timerSeconds : this.labEnd) - this.labStart);
  },

  /* ── timer (time ON TASK) ── */
  startTimer() {
    if (this.timerOn) return;
    this.timerOn = true;
    this.timerInterval = setInterval(() => {
      this.timerSeconds++;
      this.tickTimer();
      if (this.timerSeconds % 30 === 0) this.save();
      if (this.timerSeconds % 120 === 0) submitPartial();
    }, 1000);
  },
  stopTimer() {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = null; this.timerOn = false;
  },
  tickTimer() {
    const m = Math.floor(this.timerSeconds / 60), s = this.timerSeconds % 60;
    const box = document.getElementById('timer-box');
    if (box) box.textContent = m + ':' + String(s).padStart(2, '0');
  },

  /* ── persistence ── */
  save() {
    if (window.PREVIEW) return;   /* never overwrite a student's save on this device */
    /* Never write a session with no student in it. Closing the tab on the
       cover — before anyone has picked a name — used to save an EMPTY
       session over the real one, wiping a student's yesterday. Caught
       10/9: a planted save with 8 pushes came back with 0. Guarding here
       rather than at each caller closes every path at once. */
    if (!this.studentName) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({
        studentName:this.studentName, phase:this.phase, score:this.score,
        missedQuestions:this.missedQuestions, events:this.events,
        startedAt:this.startedAt, finishedAt:this.finishedAt,
        timerSeconds:this.timerSeconds, labStart:this.labStart, labEnd:this.labEnd,
        qIndex:this.qIndex, vocabAns:this.vocabAns, analysisAns:this.analysisAns, claimsAns:this.claimsAns,
        exitAns:this.exitAns, written:this.written, predictions:this.predictions,
        data:this.data, runIndex:this.runIndex, tabSwitches:tabSwitchCount,
        heard:this.heard,
        savedAt:new Date().toISOString()
      }));
    } catch (e) {}
  },
  loadSaved() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch (e) { return null; }
  },
  clearSaved() { try { localStorage.removeItem(STORAGE_KEY); } catch (e) {} },

  restore(s) {
    this.studentName = s.studentName || '';
    this.phase = s.phase || 'vocab';
    this.score = s.score || 0;
    this.missedQuestions = s.missedQuestions || [];
    this.events = s.events || [];
    this.startedAt = s.startedAt || new Date().toISOString();
    this.finishedAt = s.finishedAt || '';
    this.timerSeconds = s.timerSeconds || 0;
    this.labStart = (s.labStart == null ? null : s.labStart);
    this.labEnd   = (s.labEnd == null ? null : s.labEnd);
    this.qIndex = s.qIndex || 0;
    this.vocabAns = s.vocabAns || {};
    this.analysisAns = s.analysisAns || {};
    this.claimsAns = s.claimsAns || {};
    this.exitAns = s.exitAns || {};
    this.written = s.written || {};
    this.predictions = s.predictions || {};
    this.data = Object.assign({ A:[], B:[], C:[], D:[] }, s.data || {});
    this.runIndex = s.runIndex || { A:this.data.A.length, B:this.data.B.length, C:this.data.C.length, D:this.data.D.length };
    tabSwitchCount = s.tabSwitches || 0;
    this.heard = s.heard || {};
  },

  /* ── router ── */
  go(phase) {
    this.phase = phase;
    this.qLocked = false;
    drawRail();
    syncWordHelp(phase);
    this.save();

    /* guide.run AFTER the screen is showing: it works out which headings
       belong to which step from what is visible. */
    if (phase === 'vocab')    { this.startTimer(); renderVocab(); this.show('vocab-screen'); attachSpeakers(document.getElementById('vocab-screen'));
                                guide.run(document.getElementById('vocab-screen'), { id: 'vocab' }); }
    else if (phase === 'vq')       { this.qIndex = firstUnanswered(VOCAB_Q, this.vocabAns); renderQ(); }
    else if (phase === 'analysis') { this.qIndex = firstUnanswered(ANALYSIS_Q, this.analysisAns); renderQ(); }
    else if (phase === 'claims')   { this.qIndex = firstUnanswered(CLAIMS_Q, this.claimsAns); renderQ(); }
    else if (phase === 'exit')     { if (this.labEnd == null) this.labEnd = this.timerSeconds;
                                     this.qIndex = firstUnanswered(EXIT_Q, this.exitAns); renderQ(); }
    else if (phase === 'predictA') { if (this.labStart == null) this.labStart = this.timerSeconds; renderPredict(LAB.invA); }
    else if (phase === 'predictB') { renderPredict(LAB.invB); }
    else if (phase === 'predictC') { renderPredict(LAB.invC); }
    else if (phase === 'predictD') { renderPredict(LAB.invD); }
    else if (phase === 'runA')     { renderRun('A'); }
    else if (phase === 'runB')     { renderRun('B'); }
    else if (phase === 'runC')     { renderRun('C'); }
    else if (phase === 'runD')     { renderRun('D'); }
    else if (phase === 'graphA')   { renderGraph('A'); }
    else if (phase === 'graphB')   { renderGraph('B'); }
    else if (phase === 'graphC')   { renderGraph('C'); }
    else if (phase === 'graphD')   { renderGraph('D'); }
    else if (phase === 'daygate')  { renderDayGate(); }
    else if (phase === 'write')    { renderWrite(); }
    else if (phase === 'end')      { finish(); }
    submitPartial();
  },

  next() {
    const i = PHASES.indexOf(this.phase);
    this.go(PHASES[Math.min(i + 1, PHASES.length - 1)]);
  }
};

/* ── RAIL ───────────────────────────────────────────── */
function drawRail() {
  const rail = document.getElementById('rail');
  const at = PHASES.indexOf(app.phase);
  rail.innerHTML = RAIL.map(st => {
    const last = PHASES.indexOf(st.phases[st.phases.length - 1]);
    const on = st.phases.includes(app.phase);
    const cls = on ? 'step on' : (at > last ? 'step done' : 'step');
    return '<div class="' + cls + '"><span class="n">' + st.n + '</span><span class="l">' + st.l + '</span></div>';
  }).join('');
  rail.classList.toggle('hidden', ['cover','why','care','summary','cart','plan','start'].indexOf(app.phase) !== -1);
}

/* ══════════════════════════════════════════════════════
   START SCREEN
══════════════════════════════════════════════════════ */
/* The cover. One picture, the question, one button — nothing to decide. */
function buildCover() {
  /* The app's default phase string is 'start', but the cover is what is on
     screen at boot. Leaving them out of step would save and resume a student
     to the wrong place and mislabel every event logged before they begin. */
  app.phase = 'cover';
  /* NOT named "art": that would shadow the global art() picture helper used
     below for the care tiles, throw, and leave Let's begin unwired. */
  const coverArtHost = document.getElementById('cover-art');
  if (coverArtHost) coverArtHost.innerHTML = window.COVER_ART || '';
  const q = document.getElementById('cv-driving');
  if (q) q.innerHTML = LESSON.driving;
  /* Built before attachSpeakers below, so every tile gets its own speaker. */
  const care = document.getElementById('cv-care');
  if (care) care.innerHTML = (window.CARE || []).map(c =>
    '<div class="ptile ctile" data-step>' + art((window.CARE_ART || {})[c.art], 'ptart') +
    '<div><b class="pt">' + c.t + '</b><span class="pd">' + c.d + '</span>' +
    '<span class="ctest">' + c.test + '</span></div></div>').join('');
  document.getElementById('cover-go').onclick = () => { logEvent('cover_begin'); showWhy(); };

  /* Coming back? The resume button lives on the name-picker page, which is
     now six pages in. If this device holds an unfinished lesson, the cover
     offers a shortcut straight to the name picker — and the name check there
     still stops one student picking up another's work on a shared device. */
  const back = document.getElementById('cv-resume');
  const saved = app.loadSaved();
  if (back && saved && saved.studentName && saved.phase && saved.phase !== 'end') {
    back.classList.remove('hidden');
    document.getElementById('cv-resume-go').onclick = () => {
      logEvent('cover_resume');
      app.phase = 'start'; app.show('start-screen'); drawRail();
    };
  }
  attachSpeakers(document.getElementById('cover-screen'));
}

function buildStart() {
  document.getElementById('ican-list').innerHTML =
    LESSON.icanKid.map(s => '<li>I can ' + s + '</li>').join('');

  const sel = document.getElementById('name-select');
  ROSTER.forEach(r => {
    const o = document.createElement('option');
    o.value = r.name; o.textContent = r.name; sel.appendChild(o);
  });

  const begin = document.getElementById('begin-btn');
  const resumeBox = document.getElementById('resume-box');
  const resumeBtn = document.getElementById('resume-btn');

  sel.addEventListener('change', () => {
    begin.disabled = !sel.value;
    const s = app.loadSaved();
    const resumable = s && s.studentName === sel.value && s.phase && s.phase !== 'end';
    resumeBox.classList.toggle('hidden', !resumable);
    resumeBtn.classList.toggle('hidden', !resumable);
    if (resumable) {
      const m = Math.floor((s.timerSeconds || 0) / 60);
      const howLong = m < 1 ? 'less than a minute' : m + ' minute' + (m === 1 ? '' : 's');
      document.getElementById('resume-text').innerHTML =
        'You stopped at <b>' + (s.phase === 'runA' || s.phase === 'runB' ? 'the lab' : app.phaseLabel.call({ phase:s.phase })) +
        '</b> after ' + howLong + ' of work. Nothing you finished will be asked again.';
      begin.textContent = 'Start over from the beginning';
    } else {
      begin.textContent = 'Start the lesson';
    }
  });

  begin.addEventListener('click', () => {
    app.studentName = sel.value;
    app.clearSaved();
    app.score = 0; app.missedQuestions = []; app.events = [];
    app.vocabAns = {}; app.analysisAns = {}; app.claimsAns = {}; app.exitAns = {};
    app.written = {}; app.predictions = {};
    app.data = { A:[], B:[], C:[], D:[] }; app.runIndex = { A:0, B:0, C:0, D:0 };
    app.heard = {};
    app.timerSeconds = 0; app.labStart = null; app.labEnd = null;
    app.startedAt = new Date().toISOString();
    logEvent('start', { name:app.studentName });
    document.getElementById('who-chip').textContent = app.studentName;
    app.go('vocab');
  });

  resumeBtn.addEventListener('click', () => {
    const s = app.loadSaved(); if (!s) return;
    app.restore(s);
    logEvent('resume');
    document.getElementById('who-chip').textContent = app.studentName;
    app.startTimer(); app.tickTimer();
    app.go(['cover','why','care','summary','cart','plan','start'].indexOf(app.phase) !== -1 ? 'vocab' : app.phase);
  });

  /* No whole-page reader anywhere now. Marcos 10/9: "I don't like the read to
     me that reads the entire page." Every block carries its own speaker, so a
     student hears the one line they are stuck on instead of sitting through
     the screen. */

  /* The Teacher button opens the full preview (preview.js): Back / Next
     through every screen and every question, nothing saved or sent. It used
     to jump once to a typed step number and then strand you there. */
  document.getElementById('teacher-btn').addEventListener('click', () => {
    if (window.startTeacherPreview) window.startTeacherPreview();
  });
}

/* The teacher-led minutes and the lab are the same lesson, but a student
   who looks up from the board to a screen has nothing carrying the thread.
   This is that thread: what Mr. O just did, named by its demo, with the
   one rule of the day underneath. */
function recapHTML(which) {
  const r = (window.RECAP || {})[which];
  if (!r) return '';
  return '<div class="recap">' +
    '<span class="lbl">What Mr. O just showed you</span>' +
    '<p class="rl" data-step>' + r.lead + '</p>' +
    r.items.map((it, i) =>
      '<div class="rcard" data-step><span class="rnum" data-noread>' + (i + 1) + '</span>' +
      '<div class="rbody"><div class="rt">' + it.t + '</div>' +
      '<div class="rd">' + it.d + '</div></div></div>').join('') +
    '<div class="rnow" data-step>' + r.now + '</div>' +
  '</div>';
}

/* The plan, as tiles: two days side by side with a picture for each test,
   then the three things they do every time, then one calm line. Each tile
   is one read-aloud block so a student can hear just that piece. */
function planHTML() {
  const P = window.INTRO_PLAN;
  if (!P) return '';
  const tArt = window.THING_ART || {};
  /* One page per idea: today's tests, next time's tests, then what happens
     every single time. Each tile is a step that has to be heard (guide.js). */
  return P.days.map(day =>
      '<div data-gpage><span class="plan-h">Which test, which day</span>' +
      '<div class="plan-day"><p class="pday">' + day.label + '</p>' +
      day.tests.map(t =>
        '<div class="ptile" data-step>' + art(INV_ART[t.inv], 'ptart') +
        '<div><b class="pt">' + t.t + '</b><span class="pd">' + t.d + '</span></div></div>'
      ).join('') + '</div></div>').join('') +
    '<div data-gpage><span class="plan-h">Every single time</span>' +
    '<div class="plan-every">' + P.every.map((e, i) =>
      '<div class="ptile step3" data-step><span class="pnum" data-noread>' + (i + 1) + '</span>' +
      art(tArt[e.art], 'ptart') +
      '<div><b class="pt">' + e.t + '</b><span class="pd">' + e.d + '</span></div></div>'
    ).join('') + '</div>' +
    '<p class="plan-calm" data-step>' + P.calm + '</p></div>';
}

/* Page two: the big question, "you will be the scientist", and why they
   should care. Its tiles are built at boot by buildCover; speakers are
   attached here because they no longer live inside the cover. */
function showWhy() {
  app.phase = 'why'; drawRail();
  app.show('why-screen');
  attachSpeakers(document.getElementById('why-screen'));
  guide.run(document.getElementById('why-screen'), { id: 'why' });
  document.getElementById('why-next').onclick = () => { speech.stop(); showCare(); };
}

/* Why should you care — its own page, so the three cards are not a scroll
   away under the big question. */
function showCare() {
  app.phase = 'care'; drawRail();
  app.show('care-screen');
  attachSpeakers(document.getElementById('care-screen'));
  guide.run(document.getElementById('care-screen'), { id: 'care' });
  document.getElementById('care-next').onclick = () => { speech.stop(); showSummary(); };
}

function showSummary() {
  app.phase = 'summary'; drawRail();
  document.getElementById('recap-host').innerHTML = recapHTML('day1');
  app.show('summary-screen');
  attachSpeakers(document.getElementById('summary-screen'));
  guide.run(document.getElementById('summary-screen'), { id: 'summary' });
  /* Nothing on these pages speaks on its own. Marcos 10/9: "this read on its
     own. It shouldn't." Twenty-two devices would all start talking at once. */
  document.getElementById('sum-next').onclick = () => { speech.stop(); showCart(); };
}

/* The plan gets its own page. Marcos 10/9: the summary was one long screen,
   "perhaps push it to another page". */
/* Meet your cart — the cart is introduced here and mentioned nowhere earlier.
   Every point has a picture as well as words. */
function showCart() {
  app.phase = 'cart'; drawRail();
  /* Three pages: what the cart is, why we use a cart, and how the distance the
     cart travels gives the answer. One picture at the top of each page, then
     the points one under the other so the order is never in doubt. */
  const pics = Object.assign({}, window.THING_ART || {}, window.CART_ART || {},
    { surfaces: INV_ART.A, watch: (window.THING_ART || {}).investigation, clue: (window.THING_ART || {}).investigation });
  const scenes = { start: window.MEET_CART_SCENE, surfaces: window.CART_SCENE_SURFACES, distance: window.CART_SCENE_DISTANCE };
  document.getElementById('cart-pages').innerHTML = (window.CART_PAGES || []).map(pg =>
    '<div data-gpage>' + (pg.head ? '<h3 class="cart-h">' + pg.head + '</h3>' : '') +
    '<div class="cscene" data-noread>' + (scenes[pg.scene] || '') + '</div>' +
    '<div class="cart-list">' + pg.tiles.map(c =>
      '<div class="ptile crow" data-step>' + art(pics[c.art], 'ptart') +
      '<div><b class="pt">' + c.t + '</b><span class="pd">' + c.d + '</span></div></div>').join('') +
    '</div></div>').join('');
  app.show('cart-screen');
  guide.run(document.getElementById('cart-screen'), { id: 'cart' });
  document.getElementById('cart-next').onclick = () => { speech.stop(); showPlan(); };
}

function showPlan() {
  app.phase = 'plan'; drawRail();
  const host = document.getElementById('ra-text');
  host.innerHTML = planHTML();
  app.show('plan-screen');
  attachSpeakers(document.getElementById('plan-screen'));
  guide.run(document.getElementById('plan-screen'), { id: 'plan' });
  /* Plan -> the name picker, not straight into the lesson. */
  document.getElementById('ra-next').onclick = () => {
    speech.stop(); app.phase = 'start'; app.show('start-screen'); drawRail();
  };
}

/* ══════════════════════════════════════════════════════
   VOCABULARY
══════════════════════════════════════════════════════ */
function renderVocab() {
  /* One word per page (Marcos 10/9: "Split them"). Six cards at once was 3.5
     screens of text; now a page is one word and its examples, and each has to
     be heard before the next word appears (guide.js). */
  const n = LESSON.vocab.length;
  document.getElementById('vocab-cards').innerHTML = LESSON.vocab.map((v, i) =>
    '<div class="vpage" data-gpage>' +
    '<div class="vcard" data-step>' + art(WORD_ART[v.word], 'wordart') +
    '<div class="vn">Word ' + (i + 1) + ' of ' + n + '</div>' +
    '<div class="w">' + v.word + '</div>' +
    /* data-noread: textOf() strips these before speaking, so the Spanish
       stays on screen for the reader who wants it and the English voice
       never tries to pronounce it. */
    '<div class="es" data-noread>en espa&ntilde;ol: ' + v.es + '</div>' +
    '<div class="d">' + v.def + '</div></div>' +
    (v.ex ? '<div class="vex" data-step><span class="exlbl">For example</span>' + v.ex + '</div>' : '') +
    '</div>').join('');
  document.getElementById('vocab-next').onclick = () => app.go('vq');
}

/* ══════════════════════════════════════════════════════
   QUESTION ENGINE — vocabulary check, data analysis, exit ticket
══════════════════════════════════════════════════════ */
function bankFor(phase) {
  return phase === 'vq' ? VOCAB_Q : phase === 'analysis' ? ANALYSIS_Q
       : phase === 'claims' ? CLAIMS_Q : EXIT_Q;
}
function answersFor(phase) {
  return phase === 'vq' ? app.vocabAns : phase === 'analysis' ? app.analysisAns
       : phase === 'claims' ? app.claimsAns : app.exitAns;
}
function firstUnanswered(bank, ans) {
  for (let i = 0; i < bank.length; i++) if (ans[bank[i].id] == null) return i;
  return bank.length; /* all done */
}

/* An item's stem and its choices may both be built from the student's own
   averages, so the question is made out of their table rather than a key. */
function stemOf(q) {
  if (q.adaptive) return adaptiveStem();
  if (typeof q.qFrom === 'function') return q.qFrom(labSummary());
  return q.q;
}
function optsOf(q) {
  if (q.adaptive) return adaptiveOpts().opts;
  if (typeof q.optsFrom === 'function') return q.optsFrom(labSummary());
  return q.opts;
}
function correctIndex(q) {
  if (q.adaptive) return adaptiveOpts().correct;
  if (typeof q.resolve === 'function') {
    const want = stripTags(String(q.resolve(labSummary()))).toLowerCase();
    const i = optsOf(q).findIndex(o => stripTags(o).toLowerCase() === want);
    return i < 0 ? 0 : i;
  }
  return q.a;
}

/* L22 — the item that used to be the third written answer. It asks about the
   prediction this student's data did NOT support, naming the investigation and
   what they said. If all four held, it asks why the least obvious one worked.
   The order of the choices is fixed per student, not reshuffled, so leaving and
   coming back shows the same question. */
const INV_NAME = { A:'Investigation A (the surfaces)', B:'Investigation B (how hard the push)',
                   C:'Investigation C (how tall the ramp)', D:'Investigation D (car against truck)' };

function adaptiveTarget() {
  const miss = missedPredictions();
  if (miss.length) return { inv:miss[0].inv, said:miss[0].said, got:miss[0].got, missed:true };
  return { inv:'D', said:stripTags(app.predictions.D || ''), got:lowerFirst(labSummary().fartherD) + ' traveled farther', missed:false };
}
function adaptiveStem() {
  const t = adaptiveTarget();
  if (t.missed) {
    return 'In <b>' + INV_NAME[t.inv] + '</b> you predicted <b>' + (t.said || 'something else') +
           '</b>, but your data showed that <b>' + t.got + '</b>. Which best explains what happened?';
  }
  return 'All four of your predictions matched your data &mdash; good scientific thinking. ' +
         'Take <b>' + INV_NAME.D + '</b>: your data showed that <b>' + t.got +
         '</b>. Why did the test turn out that way?';
}
function adaptiveOpts() {
  const t = adaptiveTarget();
  const right = WHY_BANK[t.inv];
  /* the correct choice sits in a different slot per investigation, so a student
     cannot learn "it is always B" from a neighbour */
  const slot = { A:0, B:1, C:2, D:1 }[t.inv];
  const opts = WHY_DISTRACTORS.slice();
  opts.splice(slot, 0, right);
  return { opts:opts, correct:slot };
}

const PHASE_TITLE = { vq:'Word check', analysis:'What does my data say?',
                      claims:'Claim and evidence', exit:'Exit ticket' };

function renderQ() {
  const bank = bankFor(app.phase), ans = answersFor(app.phase);
  if (app.qIndex >= bank.length) { app.next(); return; }

  const q = bank[app.qIndex];
  app.qLocked = false;
  app.qTry = 1; app.firstPick = null;
  app.show('q-screen');

  document.getElementById('q-count').textContent =
    'Question ' + (app.qIndex + 1) + ' of ' + bank.length;
  document.getElementById('q-phase').textContent = PHASE_TITLE[app.phase] || '';
  const qt = document.getElementById('q-text');
  qt.innerHTML = wrapWords(stemOf(q));
  /* Read-aloud says the question AND the four choices — a student who cannot
     read the options cannot answer a question they understood. */

  /* L06–L13 ask the student to read their own table. Keeping it on the same
     screen means the question tests the science, not their memory of a table
     from two screens back. */
  const dataBox = document.getElementById('q-data');
  if (app.phase === 'analysis') {
    const which = ['A','B','C','D'].includes(q.inv) ? q.inv : null;
    dataBox.className = '';
    dataBox.innerHTML = '<div class="qdata"><div class="qdata-h">' +
      (which ? 'My Investigation ' + which + ' data' : 'My data') + '</div>' +
      '<div class="tablewrap">' + (which ? '<table class="data">' + tableHTML(which) + '</table>'
                                          : allTablesHTML()) + '</div></div>';
  } else {
    dataBox.className = 'hidden';
    dataBox.innerHTML = '';
  }
  document.getElementById('q-fb').innerHTML = '';
  document.getElementById('q-next').classList.add('hidden');
  document.getElementById('q-bar').style.width = Math.round((app.qIndex / bank.length) * 100) + '%';

  /* Move focus onto the new question: a screen reader announces it, and a
     keyboard user lands next to the choices instead of back at the page top. */
  setTimeout(() => { try { qt.focus({ preventScroll:true }); } catch (e) {} }, 30);

  const box = document.getElementById('q-opts');
  box.innerHTML = '';
  optsOf(q).forEach((o, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'opt';
    b.innerHTML = '<span class="ltr">' + 'ABCD'[i] + '</span><span>' + o + '</span>';
    b.onclick = () => answerQ(q, i, bank, ans);
    box.appendChild(b);
  });
  attachSpeakers(document.getElementById('q-screen'));
}

/* A wrong first pick gets ONE more try before the answer is shown. This is a
   lesson, not a test: a student who misreads an option should get back in, and
   a second look at two remaining choices is where the thinking happens.

   Scoring is unchanged and still comparable to every other site: the point is
   earned only on the FIRST pick, and the miss is logged with that first pick.
   The retry changes what the student learns, not what the data means. */
function answerQ(q, picked, bank, ans) {
  if (app.qLocked) return;
  const right = correctIndex(q);
  const ok = picked === right;
  const btns = [...document.getElementById('q-opts').children];
  const fb = document.getElementById('q-fb');
  const choices = optsOf(q);
  speech.stop();

  const firstTry = app.qTry !== 2;

  if (!ok && firstTry) {
    /* one more go — the wrong choice is taken off the table, nothing is revealed */
    app.qTry = 2;
    app.firstPick = picked;
    btns[picked].classList.add('wrong');
    btns[picked].disabled = true;
    fb.className = 'fb try';
    fb.innerHTML = '<b>Not that one — try once more.</b> ' +
      'Read the question again and pick from the choices that are left.';
    logEvent('answer', { id:q.id, ok:false, t:1 });
    app.save();
    const again = btns.find(b => !b.disabled);
    if (again) again.focus();
    return;
  }

  app.qLocked = true;
  btns.forEach((b, i) => {
    b.disabled = true;
    if (i === right) b.classList.add('right');
    else if (i === picked) b.classList.add('wrong');
  });

  /* the point rides on the first pick, whether or not a second try followed */
  const earned = ok && firstTry;
  const recordedPick = firstTry ? picked : app.firstPick;

  ans[q.id] = recordedPick;
  if (earned) app.score++;
  else app.missedQuestions.push({
    id:q.id, q:stripTags(stemOf(q)), yourAnswer:stripTags(choices[recordedPick]),
    correct:stripTags(choices[right]), skill:(window.SKILLS || {})[q.id] || 'Unsorted'
  });

  fb.className = earned ? 'fb ok' : 'fb no';
  fb.innerHTML = earned
    ? '<b>Correct.</b> ' + whyRight(q)
    : ok
      ? '<b>That is right — on your second try.</b> ' + whyRight(q)
      : '<b>Not quite.</b> The answer is <b>' + stripTags(choices[right]) + '</b>. ' + whyRight(q);

  logEvent('answer', { id:q.id, ok:earned, t:firstTry ? 1 : 2 });
  app.save();

  attachSpeakers(document.getElementById('q-screen'));

  const nx = document.getElementById('q-next');
  nx.classList.remove('hidden');
  nx.textContent = (app.qIndex + 1 >= bank.length) ? 'Finish this step →' : 'Next →';
  nx.onclick = () => { app.qIndex++; app.save(); renderQ(); };
  nx.focus();
}

/* A one-line reason, so a wrong answer still teaches something. */
/* Feedback comes from the question itself (questions.js, `why`). */
function whyRight(q) {
  if (typeof q.why === 'function') { try { return q.why(labSummary()); } catch (e) { return ''; } }
  return q.why || '';
}

/* ══════════════════════════════════════════════════════
   THE LAB
══════════════════════════════════════════════════════ */
/* The canvas is only as tall as the tallest thing drawn on it (the 3-book
   ramp), so the button and the data table can sit right under the cart. */
const TRACK = { w:900, h:132, x0:28, y:92 };
/* The start line sits further right on a ramp run so the ramp has room to the
   left of zero; the scale follows it, so a centimetre is a centimetre either way. */
const RAMP_ROOM = 150;
const originX = run => TRACK.x0 + (run && run.ramp ? RAMP_ROOM : 0);
const CM_PX = run => (TRACK.w - originX(run) - 40) / LAB.trackCm;

/* One run's distance, in whole centimetres.
     pushed  : d = v0² / (2µg)              — Investigations A and B
     ramp    : d = h / µ                     — Investigation C (v² = 2gh at the bottom)
     mass    : d = v0² / (2µg) ÷ m           — Investigation D (same work, more mass)
   Every run carries about ±4%, so two trials of the same setup never match
   exactly and the average is worth taking. */
function distanceCm(run, vary) {
  const mu = LAB.surfaces[run.surface].mu;
  let base;
  if (run.ramp) {
    base = LAB.ramps[run.ramp].cm / mu;
  } else {
    const v0 = LAB.pushes[run.push].v0;
    base = (v0 * v0) / (2 * mu * LAB.G) * 100;
    if (run.vehicle) base = base / LAB.vehicles[run.vehicle].mass;
  }
  const f = vary ? 1 + (Math.random() * 0.08 - 0.04) : 1;
  return Math.max(5, Math.round(base * f));
}

/* How long the real cart would take to stop — only used to pace the animation,
   so a low-friction run visibly rolls longer than a high-friction one. */
function stopTime(run) {
  const mu = LAB.surfaces[run.surface].mu;
  const v = run.ramp ? Math.sqrt(2 * LAB.G * (LAB.ramps[run.ramp].cm / 100))
                     : LAB.pushes[run.push].v0 / (run.vehicle ? 1 : 1);
  return v / (mu * LAB.G);
}
const MAX_STOP_TIME = 5.71;   /* ice + big push, the slowest stop in the model */

function drawTrack(run, cartCm, travelledCm) {
  const c = document.getElementById('track');
  if (!c) return;
  const g = c.getContext('2d');
  const s = LAB.surfaces[run.surface];
  const X0 = originX(run);
  const css = getComputedStyle(document.body);
  const ink = css.getPropertyValue('--ink').trim() || '#16211F';
  const faint = css.getPropertyValue('--ink-faint').trim() || '#7E918C';
  const sheet = css.getPropertyValue('--surface').trim() || '#fff';

  g.clearRect(0, 0, TRACK.w, TRACK.h);
  g.fillStyle = sheet; g.fillRect(0, 0, TRACK.w, TRACK.h);

  /* the surface band */
  g.fillStyle = s.color;
  g.fillRect(0, TRACK.y, TRACK.w, 30);
  g.globalAlpha = 0.35; g.fillStyle = '#000';
  for (let x = 0; x < TRACK.w; x += 6) {
    const bump = s.mu * 26;                     /* rougher surface, taller texture */
    g.fillRect(x, TRACK.y + 30 - bump * (0.4 + 0.6 * Math.abs(Math.sin(x))), 3, bump);
  }
  g.globalAlpha = 1;

  /* meter marks */
  g.strokeStyle = faint; g.fillStyle = faint;
  g.font = '600 15px "IBM Plex Mono", monospace'; g.lineWidth = 2;
  for (let m = 0; m <= 9; m++) {
    const x = X0 + m * 100 * CM_PX(run);
    g.beginPath(); g.moveTo(x, TRACK.y - 9); g.lineTo(x, TRACK.y); g.stroke();
    /* centimeters, the unit the readout and the data table use. The marks
       said "1 m" to "9 m" beside a readout in cm: two units, never explained. */
    if (m > 0) g.fillText((m * 100) + ' cm', x - 27, TRACK.y - 14);   /* 0 is the START line */
  }

  /* start line */
  g.strokeStyle = ink; g.lineWidth = 2;
  g.beginPath(); g.moveTo(X0, TRACK.y - 64); g.lineTo(X0, TRACK.y); g.stroke();
  g.font = '700 15px "IBM Plex Mono", monospace'; g.fillStyle = ink;
  g.fillText('START', X0 + 5, TRACK.y - 68);

  /* distance trail */
  if (travelledCm > 0) {
    g.strokeStyle = s.color; g.lineWidth = 3; g.setLineDash([5, 4]);
    g.beginPath(); g.moveTo(X0, TRACK.y + 2);
    g.lineTo(X0 + travelledCm * CM_PX(run), TRACK.y + 2); g.stroke();
    g.setLineDash([]);
  }

  /* the ramp, when the run has one: a board on a stack of books, drawn to the
     LEFT of the start line so the measured distance still begins at zero */
  if (run.ramp) {
    const h = LAB.ramps[run.ramp].cm * 1.5;        /* drawn taller than scale, to read */
    const topY = TRACK.y - h, bx = X0 - RAMP_ROOM;
    g.fillStyle = '#8D6E63';
    g.beginPath(); g.moveTo(bx, topY); g.lineTo(X0, TRACK.y); g.lineTo(X0, TRACK.y + 6);
    g.lineTo(bx, topY + 8); g.closePath(); g.fill();
    const bookH = Math.max(6, h / LAB.ramps[run.ramp].blocks);
    ['#C62828', '#1565C0', '#2E7D32'].slice(0, LAB.ramps[run.ramp].blocks).forEach((col, i) => {
      g.fillStyle = col;
      g.fillRect(bx - 16, TRACK.y - (i + 1) * bookH, 52, bookH - 2);
    });
    g.fillStyle = ink; g.font = '700 15px "IBM Plex Mono", monospace';
    g.fillText(LAB.ramps[run.ramp].name, bx - 14, TRACK.y + 21);
  }

  /* the vehicle — drawn a third bigger than it used to be, in its own scaled
     frame so every measurement below stays as it was */
  const big = run.vehicle === 'truck';
  const W = big ? 54 : 36, H = big ? 24 : 18;
  g.save();
  g.translate(X0 + cartCm * CM_PX(run), TRACK.y - 2);
  g.scale(1.35, 1.35);
  g.fillStyle = 'rgba(0,0,0,.18)';
  g.beginPath(); g.ellipse(W / 2, 3, W * 0.62, 4, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = big ? '#37474F' : '#C62828';
  roundRect(g, 0, -8 - H, W, H, 4); g.fill();
  g.fillStyle = big ? '#263238' : '#90302A';
  roundRect(g, 5, -16 - H, big ? 20 : 24, 10, 3); g.fill();
  const wheels = big ? [10, 28, 44] : [9, 27];
  g.fillStyle = '#2B2B2B';
  wheels.forEach(wx => { g.beginPath(); g.arc(wx, -6, 6.5, 0, Math.PI * 2); g.fill(); });
  g.fillStyle = '#9E9E9E';
  wheels.forEach(wx => { g.beginPath(); g.arc(wx, -6, 2.4, 0, Math.PI * 2); g.fill(); });
  g.restore();

  /* The surface's name used to be written under the band, in small type
     that the canvas edge cut in half. It is on the strip above the track
     now, where a speaker can read it. */

  /* The track is the lesson. Keep a spoken equivalent on it so a student using a
     screen reader gets the same information as one watching the cart. */
  c.setAttribute('aria-label',
    'Track 900 centimeters long. Surface: ' + stripTags(s.name) + ', ' + s.note + '. ' +
    (run.ramp ? 'Ramp of ' + LAB.ramps[run.ramp].name + ' at the start. ' : '') +
    (run.vehicle ? 'Vehicle: ' + LAB.vehicles[run.vehicle].name + '. ' : '') +
    (cartCm > 0 ? 'The cart is ' + Math.round(cartCm) + ' centimeters from the start.'
                : 'The cart is at the start line.'));
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath();
  g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r);
  g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r);
  g.arcTo(x, y, x + w, y, r); g.closePath();
}

function renderPredict(inv) {
  app.show('lab-screen');
  document.getElementById('predict-card').classList.remove('hidden');
  document.getElementById('run-card').classList.add('hidden');
  document.getElementById('graph-card').classList.add('hidden');

  document.getElementById('pr-eyebrow').innerHTML = inv.label;
  document.getElementById('pr-head').innerHTML = art(INV_ART[inv.id], 'invart') + inv.heading;
  document.getElementById('pr-plain').innerHTML = inv.headingPlain || '';
  document.getElementById('pr-question').innerHTML = inv.question;
  /* what gets measured in this test, and what that measurement shows */
  document.getElementById('pr-measure').innerHTML = inv.measure || '';
  document.getElementById('pr-same-lb').innerHTML = inv.sameLabel;
  document.getElementById('pr-same-v').innerHTML = inv.sameValue;
  document.getElementById('pr-chg-lb').innerHTML = inv.changeLabel;
  document.getElementById('pr-chg-v').innerHTML = inv.changeValue;

  /* Say the job out loud before they start: how many pushes, why that many,
     and the exact buttons to press. A student who cannot infer the routine
     from the interface should not have to. */
  document.getElementById('pr-docount').textContent = inv.doCount || '';
  document.getElementById('pr-dowhy').textContent   = inv.doWhy || '';
  const steps = document.getElementById('pr-dosteps');
  steps.innerHTML = '';
  (inv.doSteps || []).forEach(t => {
    const li = document.createElement('li');
    li.setAttribute('data-step', '');
    li.innerHTML = t;
    steps.appendChild(li);
  });
  document.getElementById('pr-predict').innerHTML = inv.predictQ;

  const box = document.getElementById('pr-opts');
  const nx = document.getElementById('pr-next');
  const already = app.predictions[inv.id];
  box.innerHTML = '';
  inv.predictOpts.forEach((o, i) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'opt' + (already === o ? ' sel' : '');
    b.innerHTML = '<span class="ltr">' + 'ABCD'[i] + '</span><span>' + o + '</span>';
    b.onclick = () => {
      [...box.children].forEach(x => x.classList.remove('sel'));
      b.classList.add('sel');
      app.predictions[inv.id] = o;
      nx.disabled = false;
      app.save();
    };
    box.appendChild(b);
  });
  nx.disabled = !already;
  attachSpeakers(document.getElementById('predict-card'));
  guide.run(document.getElementById('predict-card'), { id: 'predict' + inv.id });
  nx.onclick = () => { logEvent('predict', { inv:inv.id, v:stripTags(app.predictions[inv.id]) }); app.next(); };

}

/* Describes a run in the words of whatever it varies. */
function setupLine(run) {
  const bits = [];
  if (run.vehicle) bits.push('<b>' + LAB.vehicles[run.vehicle].name + '</b>');
  if (run.ramp)    bits.push('ramp of <b>' + LAB.ramps[run.ramp].name + '</b>');
  bits.push('<b>' + LAB.surfaces[run.surface].name + '</b>');
  if (run.push)    bits.push('<b>' + LAB.pushes[run.push].name + '</b> ' + LAB.pushes[run.push].arrows);
  if (run.ramp)    bits.push('let go, no push');
  return bits.join(' &middot; ');
}

function renderRun(invKey) {
  const inv = invOf(invKey);
  app.show('lab-screen');
  document.getElementById('predict-card').classList.add('hidden');
  document.getElementById('run-card').classList.remove('hidden');
  document.getElementById('graph-card').classList.add('hidden');

  document.getElementById('run-eyebrow').innerHTML = inv.label;
  document.getElementById('run-head').innerHTML = inv.heading;
  document.getElementById('table-head').innerHTML = inv.label + ' &mdash; my data table';

  app.lastRun = null;
  paintRun(invKey);
  attachSpeakers(document.getElementById('run-card'));
}

/* WHAT moved, by name, for every sentence about a push. Tests 1 and 2 push a
   cart, Test 3 rolls a car down a ramp, Test 4 pushes a car and then a truck.
   Marcos 10/10: "the distance the cart traveled. Be more specific in what is
   happening." */
function moverOf(run) {
  if (run && run.vehicle) return 'the ' + stripTags(LAB.vehicles[run.vehicle].name).toLowerCase();
  return run && run.ramp ? 'the car' : 'the cart';
}
const lowerFirst = t => String(t || '').replace(/^[A-Z]/, c => c.toLowerCase());
/* The readout beside the button: a sentence, not the label "Distance:". */
function traveledText(run, cm, stopped) {
  const who = moverOf(run).replace(/^t/, 'T');
  return who + (stopped ? ' traveled ' : ' has traveled ') + cm + ' cm';
}

/* Every piece of one push, in a child's words. Used three ways: the strip
   above the track (short), the "new this time" card (full, heard once), and
   the Stuck? panel (full, any time). */
function setupBits(run) {
  const bits = [];
  const sf = LAB.surfaces[run.surface];
  if (sf) bits.push({ key:'surface:' + run.surface, kind:'surface', pic:art(SURFACE_ART[run.surface], 'swatch'),
    name:stripTags(sf.name), short:sf.note, full:sf.note + (sf.ex ? ' &mdash; ' + sf.ex : '') });
  if (run.ramp) { const r = LAB.ramps[run.ramp];
    bits.push({ key:'ramp:' + run.ramp, kind:'ramp', pic:art((window.THING_ART || {}).ramp, 'swatch'),
      name:'Ramp of ' + r.name, short:'let the car go, no push',
      full:(r.note || '') + '. You let the car go. You do not push the car.' }); }
  if (run.vehicle) { const v = LAB.vehicles[run.vehicle];
    bits.push({ key:'vehicle:' + run.vehicle, kind:'vehicle', pic:art(INV_ART.D, 'swatch'),
      name:stripTags(v.name), short:v.note || '', full:(v.note || '') + (v.ex ? ' &mdash; ' + v.ex : '') }); }
  if (run.push && !run.ramp) { const pu = LAB.pushes[run.push];
    bits.push({ key:'push:' + run.push, kind:'push', pic:art(INV_ART.B, 'swatch'),
      name:stripTags(pu.name), short:'', arrows:pu.arrows, full:pu.note || '' }); }
  return bits;
}
const bitKeys = run => [run.surface && 'surface:' + run.surface, run.ramp && 'ramp:' + run.ramp,
  run.vehicle && 'vehicle:' + run.vehicle, run.push && !run.ramp && 'push:' + run.push].filter(Boolean);

/* What is NEW in this push: any piece that no earlier push in the whole
   lesson has used, and the first second-try. Worked out from where the push
   sits in the lesson, so it needs no memory and is the same after a resume.
   Ice is explained when ice first appears, not on all eight pushes. */
function newInRun(invKey, i) {
  const seen = new Set(); let seenTwice = false;
  for (const k of ['A', 'B', 'C', 'D']) {
    const runs = invOf(k).runs;
    for (let j = 0; j < runs.length; j++) {
      if (k === invKey && j === i)
        return { fresh:setupBits(runs[j]).filter(b => !seen.has(b.key)),
                 whyTwice:runs[j].trial === 2 && !seenTwice };
      bitKeys(runs[j]).forEach(x => seen.add(x));
      if (runs[j].trial === 2) seenTwice = true;
    }
  }
  return { fresh:[], whyTwice:false };
}

/* Put the push in front of the student: the strip, the cart, the button and
   the table together. While something new is being explained, show that
   first. Waits for the screen's own scroll-to-top to finish. */
function focusRun() {
  setTimeout(() => {
    const card = document.getElementById('run-card');
    if (!card || card.offsetParent === null) return;
    const fresh = document.getElementById('run-new');
    const top = (fresh.offsetParent !== null && fresh.childElementCount) ? fresh : document.getElementById('run-strip');
    const tbl = document.getElementById('data-table').getBoundingClientRect();
    if (tbl.bottom > innerHeight - guide.barHeight() - 12 || top.getBoundingClientRect().top < 0)
      top.scrollIntoView({ block:'start', behavior: guide.instant ? 'instant' : 'smooth' });
  }, 500);
}

function paintRun(invKey) {
  const inv = invOf(invKey);
  const i = app.runIndex[invKey];
  const total = inv.runs.length;
  const done = i >= total;
  const card = document.getElementById('run-card');

  /* Investigation C is released, not pushed — the counter has to agree with
     the button and the steps, or the screen contradicts itself. */
  const unit = inv.runNoun || 'Push';
  document.getElementById('run-progress').textContent =
    unit + ' ' + Math.min(i + 1, total) + ' of ' + total;

  const runBtn = document.getElementById('run-btn');
  /* Investigation C releases the car from a ramp — nobody pushes it. The
     button has to say so, because the screen told them it would. */
  runBtn.innerHTML = inv.runVerb || '&#128072; Push the cart';
  const recBtn = document.getElementById('run-record');
  const doneBtn = document.getElementById('run-done');
  const read = document.getElementById('run-readout');
  const tnote = document.getElementById('table-note');
  const strip = document.getElementById('run-strip');
  const fresh = document.getElementById('run-new');

  /* the box that was filled a moment ago flashes once */
  const just = (app.justFilled && app.justFilled.inv === invKey)
    ? { key:app.justFilled.key, trial:app.justFilled.trial, cls:'just' } : null;
  app.justFilled = null;

  if (done) {
    renderTable(invKey, [just]);
    strip.innerHTML = ''; fresh.innerHTML = '';
    tnote.innerHTML = '<b>Your data table is full.</b> All ' + total + ' ' +
      (inv.runNoun ? inv.runNoun.toLowerCase() + 's' : 'pushes') + ' are in your data table. Now look at what the distances tell you.';
    read.textContent = 'Your data table is full';
    runBtn.classList.add('hidden'); recBtn.classList.add('hidden');
    doneBtn.classList.remove('hidden');
    doneBtn.onclick = () => app.next();
    const last = app.data[invKey][app.data[invKey].length - 1];
    if (last) drawTrack(last, last.cm, last.cm);
    attachSpeakers(card);
    guide.run(card, { id:'run' + invKey + 'end', leads:false });
    renderDoSteps(app.phase);
    focusRun();
    return;
  }

  doneBtn.classList.add('hidden');
  const run = inv.runs[i];
  /* Name the thing being pushed. Test 4 pushes a car and then a truck, and
     the button said "Push the cart" for both. */
  if (run.vehicle) runBtn.innerHTML = '&#128072; Push the ' + stripTags(LAB.vehicles[run.vehicle].name).toLowerCase();
  const bits = setupBits(run);
  const nTrials = trialsFor(invKey);
  const noun = inv.runNoun || 'Push';
  const landed = !!(app.lastRun && app.lastRun.index === i);

  /* THE STRIP — what this push uses, one glance, right above the cart. It
     replaces two paragraphs that sat between the cart and its button. */
  strip.innerHTML = bits.map(b =>
      '<span class="schip">' + b.pic + '<b>' + b.name + '</b>' + (b.short ? ' &mdash; ' + b.short : '') +
      (b.arrows ? ' <span data-noread aria-hidden="true">' + b.arrows + '</span>' : '') + '</span>').join('') +
    (nTrials > 1 ? '<span class="schip try">' + (run.trial === 1
        ? 'Trial 1 of ' + nTrials
        : 'Trial ' + run.trial + ' of ' + nTrials + ' &mdash; the same again, to be sure') + '</span>' : '');

  /* NEW THIS TIME — the full explanation, with its example, the first time a
     thing appears. It has to be heard (guide.js) before the button exists,
     then it folds away so the push screen stays the cart, the button and the
     table. The same words stay one tap away under "Stuck? Tap here". */
  const nw = newInRun(invKey, i);
  fresh.innerHTML = nw.fresh.map(b =>
      '<div class="newcard" data-step><span class="lbl">New this time</span>' +
      '<p>' + b.pic + '<b>' + b.name + '</b> &mdash; ' + b.full + '</p></div>').join('') +
    (nw.whyTwice ? '<div class="newcard" data-step><span class="lbl">Why twice?</span>' +
      '<p>' + (inv.whyRepeat || window.WHY_REPEAT || '') + '</p></div>' : '');

  /* THE TABLE — the box this push fills glows, so the number has somewhere
     visible to go. Marcos 10/9: "kids won't know where the data table is and
     its connection to cart moving." */
  renderTable(invKey, [just, { key:runKey(run), trial:run.trial, cls:'target' }]);

  /* A push that has landed but is not recorded yet keeps the cart where it
     stopped — redrawing at zero here used to snap it back to the start line
     while the readout still showed the distance. */
  const landedCm = landed ? app.lastRun.cm : 0;
  drawTrack(run, landedCm, landedCm);

  if (landed) {
    const cm = app.lastRun.cm;
    read.textContent = traveledText(run, cm, true);
    /* Say what just happened, in a sentence, and say what to do next. The
       number is on the button and the box it will land in is glowing. */
    tnote.innerHTML = '<b>On ' + noun.toLowerCase() + ' ' + (i + 1) + ' ' + moverOf(run) + ' traveled ' + cm + ' cm.</b> ' +
      'That distance is not in your data table yet. Press the button and ' + cm + ' cm drops into the <b>glowing box</b>.';
    runBtn.classList.add('hidden');
    recBtn.innerHTML = '&#11015; Write ' + cm + ' cm in my table';
    recBtn.classList.remove('hidden');
    recBtn.onclick = () => {
      /* keep every setting of the run, or ramp and vehicle rows never match
         their group and the averages come out empty */
      app.data[invKey].push(Object.assign({}, run, { cm:cm }));
      app.runIndex[invKey] = i + 1;
      app.lastRun = null;
      app.justFilled = { inv:invKey, key:runKey(run), trial:run.trial };
      logEvent('trial', Object.assign({ inv:invKey, cm:cm },
        { s:run.surface, p:run.push || '', r:run.ramp || '', v:run.vehicle || '', t:run.trial }));
      app.save();
      recBtn.classList.add('hidden');
      paintRun(invKey);
    };
  } else {
    read.textContent = traveledText(run, 0, false);
    tnote.innerHTML = 'The <b>glowing box</b> is where you will write how far ' + moverOf(run) + ' travels on this ' + noun.toLowerCase() + '.';
    recBtn.classList.add('hidden');
    runBtn.classList.remove('hidden');
    runBtn.disabled = false;
    runBtn.onclick = () => {
      runBtn.disabled = true;
      const cm = distanceCm(run, true);
      animateRun(run, cm, () => {
        app.lastRun = { index:i, cm:cm };
        read.textContent = traveledText(run, cm, true);
        runBtn.classList.add('hidden');
        paintRun(invKey);
      });
    };
  }

  attachSpeakers(card);
  /* leads:false — the push screen's title and counter are not part of a
     "new this time" card, which comes and goes. They keep their speakers. */
  guide.run(card, { id:'run' + invKey + i, onDone:focusRun, leads:false });
  renderDoSteps(app.phase);
  focusRun();
}

function animateRun(run, cm, done) {
  const tReal = stopTime(run);
  const dur   = 800 + 1700 * Math.min(1, tReal / MAX_STOP_TIME);   /* ice visibly rolls longer than sand */
  const read  = document.getElementById('run-readout');
  const t0 = performance.now();

  /* A browser stops handing out animation frames while its tab is in the
     background, which would leave the push half-finished and the button
     stuck. finish() is idempotent and a timer calls it no matter what, so
     a run always lands. */
  /* A student who asked their device to reduce motion still needs the result,
     just not the moving cart. */
  const still = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let landed = false;
  function finish() {
    if (landed) return;
    landed = true;
    clearTimeout(app._runGuard); app._runGuard = null;
    app._runPending = null;
    drawTrack(run, cm, cm);
    read.textContent = traveledText(run, cm, true);
    done();
  }
  app._runPending = finish;
  app._runGuard = setTimeout(finish, dur + 600);

  if (still) { finish(); return; }

  (function frame(now) {
    if (landed) return;
    const tau = Math.min(1, (now - t0) / dur);
    const x = cm * (2 * tau - tau * tau);                 /* x = d(2τ − τ²) under constant friction */
    drawTrack(run, x, x);
    read.textContent = traveledText(run, Math.round(x), false);
    if (tau < 1) requestAnimationFrame(frame);
    else finish();
  })(t0);
}

/* ── DATA TABLE ─────────────────────────────────────── */
function invOf(k) { return { A:LAB.invA, B:LAB.invB, C:LAB.invC, D:LAB.invD }[k]; }

/* What makes one row of an investigation's table: the setting it varies first,
   then the setting it holds constant. Each investigation changes exactly one
   thing, which is the method the whole lesson is teaching. */
const INV_COLUMNS = {
  A: { first:'Surface', second:'Push',
       a:r => LAB.surfaces[r.surface].name,
       /* display only — a() is the key avgsFor() builds the averages on, and
          every data question matches its options against that key, so no
          markup may ever go in it. */
       aArt:r => art(SURFACE_ART[r.surface], 'swatch'),
       b:r => LAB.pushes[r.push].name },
  B: { first:'Push',    second:'Surface', a:r => LAB.pushes[r.push].name,      b:r => LAB.surfaces[r.surface].name },
  C: { first:'Ramp',    second:'Surface', a:r => LAB.ramps[r.ramp].name,       b:r => LAB.surfaces[r.surface].name },
  D: { first:'Car or truck', second:'Push',    a:r => LAB.vehicles[r.vehicle].name, b:r => LAB.pushes[r.push].name }
};
const runKey = r => [r.surface, r.push || '', r.ramp || '', r.vehicle || ''].join('|');

function groupsFor(invKey) {
  const seen = [], out = [];
  invOf(invKey).runs.forEach(r => {
    const k = runKey(r);
    if (!seen.includes(k)) { seen.push(k); out.push(Object.assign({ key:k }, r)); }
  });
  return out;
}
/* Investigation A runs two trials so averaging gets taught; B, C and D run one
   each, because repeating the lesson cost minutes the period does not have. */
function trialsFor(invKey) {
  return invOf(invKey).runs.reduce((m, r) => Math.max(m, r.trial), 1);
}
function cellsFor(invKey, g) {
  const rows = app.data[invKey].filter(r => runKey(r) === g.key);
  const t1 = rows.find(r => r.trial === 1), t2 = rows.find(r => r.trial === 2);
  const need = trialsFor(invKey);
  const got  = [t1, t2].slice(0, need).filter(Boolean);
  const avg  = got.length === need
    ? Math.round(got.reduce((a, r) => a + r.cm, 0) / need)
    : null;
  return { t1:t1 ? t1.cm : null, t2:t2 ? t2.cm : null, avg:avg };
}

/* marks: [{ key, trial, cls }] — cells to pick out. 'target' is the box the
   next push will fill (it glows and shows a ?), 'just' is the box that was
   filled a moment ago (it flashes). Only the push screen passes any. */
function tableHTML(invKey, marks) {
  const col = INV_COLUMNS[invKey];
  const two = trialsFor(invKey) > 1;
  let h = '<thead><tr><th>' + col.first + '</th><th>' + col.second + '</th>' +
    (two ? '<th>Trial 1 (cm)</th><th>Trial 2 (cm)</th><th>Average (cm)</th>'
         : '<th>Distance (cm)</th>') + '</tr></thead><tbody>';
  groupsFor(invKey).forEach(g => {
    const c = cellsFor(invKey, g);
    const found = t => (marks || []).find(m => m && m.key === g.key && m.trial === t);
    const hit = t => { const m = found(t); return m ? ' ' + m.cls : ''; };
    const rowOn = (marks || []).some(m => m && m.key === g.key && m.cls === 'target');
    const cell = (v, t) => v == null
      ? '<td class="num pending' + hit(t) + '">' + (/target/.test(hit(t)) ? '?' : '—') + '</td>'
      : '<td class="num' + hit(t) + '">' + v + '</td>';
    h += '<tr' + (rowOn ? ' class="rowon"' : '') + '><td>' +
         (col.aArt ? col.aArt(g) : '') + '<b>' + col.a(g) + '</b></td><td>' + col.b(g) + '</td>' +
         (two ? cell(c.t1, 1) + cell(c.t2, 2) +
                (c.avg == null ? '<td class="num pending">—</td>'
                               : '<td class="num"><b>' + c.avg + '</b></td>')
              : (c.avg == null ? '<td class="num pending' + hit(1) + '">' + (/target/.test(hit(1)) ? '?' : '—') + '</td>'
                               : '<td class="num' + hit(1) + '"><b>' + c.avg + '</b></td>')) + '</tr>';
  });
  return h + '</tbody>';
}
const INV_TITLE = { A:'A — surfaces', B:'B — how hard the push',
                    C:'C — how tall the ramp', D:'D — car against truck' };
function allTablesHTML() {
  return ['A','B','C','D'].map((k, i) =>
    '<div class="qdata-h"' + (i ? ' style="margin-top:.7rem"' : '') + '>Investigation ' + INV_TITLE[k] + '</div>' +
    '<table class="data">' + tableHTML(k) + '</table>').join('');
}

function renderTable(invKey, marks) {
  document.getElementById('data-table').innerHTML = tableHTML(invKey, marks);
}

/* ── SUMMARY used by the data-analysis questions ────── */
/* Averages per investigation, keyed by the label the question's options use,
   so every data question is answered from the student's own table. */
function avgsFor(invKey) {
  const col = INV_COLUMNS[invKey], out = {};
  groupsFor(invKey).forEach(g => {
    const c = cellsFor(invKey, g);
    if (c.avg != null) out[col.a(g)] = c.avg;
  });
  return out;
}
function pick(avgs, cmp, fallback) {
  const names = Object.keys(avgs);
  if (!names.length) return fallback;
  return names.reduce((b, n) => (b === null || cmp(avgs[n], avgs[b]) ? n : b), null);
}
function labSummary() {
  const A = avgsFor('A'), C = avgsFor('C'), D = avgsFor('D');
  const far = pick(A, (x, y) => x > y, 'Ice'), near = pick(A, (x, y) => x < y, 'Sand');
  return {
    avgsA: A,
    farthestA: far, shortestA: near,
    maxAvgA: A[far] || 0, minAvgA: A[near] || 0,
    tallestC: pick(C, (x, y) => x > y, '3 books'),
    fartherD: pick(D, (x, y) => x > y, 'The car') === 'Car' ? 'The car'
              : (pick(D, (x, y) => x > y, 'Car') === 'Truck' ? 'The truck' : 'The car')
  };
}

/* ── GRAPH ──────────────────────────────────────────── */
function renderGraph(invKey) {
  const inv = invOf(invKey);
  app.show('lab-screen');
  document.getElementById('predict-card').classList.add('hidden');
  document.getElementById('run-card').classList.add('hidden');
  document.getElementById('graph-card').classList.remove('hidden');

  document.getElementById('gr-eyebrow').innerHTML = inv.label + ' results';
  document.getElementById('gr-head').innerHTML = 'What my data looks like';
  const LEAD = {
    A: 'Each bar shows how far the cart traveled on that surface. The bar is the average of your two trials. The push was the same every time.',
    B: 'Each bar shows how far the cart traveled with that push. The bar is the average of your two trials. The surface was wood every time.',
    C: 'Each bar shows how far the car traveled from that ramp. The bar is the average of your two trials. You never pushed the car — you let the car go.',
    D: 'Each bar shows how far the car or the truck traveled. The bar is the average of your two trials. The car and the truck got the very same push, on wood.'
  };
  document.getElementById('gr-lead').innerHTML = LEAD[invKey];

  const col = INV_COLUMNS[invKey];
  const groups = groupsFor(invKey).map(g => {
    const c = cellsFor(invKey, g);
    const cm = c.avg || 0;
    /* Each bar says, in a sentence, what moved, where, and how far. A bar
       labelled "Ice" beside "507 cm" left the child to work out the rest. */
    const say = invKey === 'A' ? 'On ' + stripTags(LAB.surfaces[g.surface].name).toLowerCase() + ' the cart traveled <b>' + cm + ' cm</b>.'
              : invKey === 'B' ? 'With the ' + stripTags(LAB.pushes[g.push].name).toLowerCase() + ' the cart traveled <b>' + cm + ' cm</b>.'
              : invKey === 'C' ? 'From the ramp of ' + LAB.ramps[g.ramp].name + ' the car traveled <b>' + cm + ' cm</b>.'
              :                  'The ' + stripTags(LAB.vehicles[g.vehicle].name).toLowerCase() + ' traveled <b>' + cm + ' cm</b>.';
    return {
      label: col.a(g).replace(' push', ''),
      say: say,
      cm: cm,
      color: invKey === 'A' ? LAB.surfaces[g.surface].color : '#2E7D6B'
    };
  });
  const max = Math.max(1, ...groups.map(g => g.cm));
  /* The sentence sits ABOVE its bar and each row is one guided step. (The old
     row was a three-column grid; the speaker icon became a fourth cell and
     threw the bar to the far right and the number onto its own line.) */
  document.getElementById('graph-rows').innerHTML = groups.map(g =>
    '<div class="grow" data-step><p class="gsay">' + g.say + '</p>' +
    '<span class="gt" data-noread><i style="width:' + Math.max(2, Math.round((g.cm / max) * 100)) + '%; background:' + g.color + '"></i></span>' +
    '</div>').join('');

  /* Did the prediction hold up? Never graded — just checked. */
  const pred = app.predictions[invKey] || '';
  const box = document.getElementById('gr-predict-check');
  const said = '<span class="lb">Your prediction:</span> you said <b>' + (stripTags(pred) || '—') + '</b>. ';
  const vals = groups.map(x => x.cm);
  const rose = vals.length >= 2 && vals[vals.length - 1] > vals[0];

  if (invKey === 'A') {
    const win = labSummary().farthestA;
    const hit = stripTags(pred).toLowerCase() === win.toLowerCase();
    box.innerHTML = said + 'Your data says the cart traveled the farthest on <b>' + win.toLowerCase() + '</b>. ' +
      (hit ? 'Your prediction matched your data.' :
             'Your prediction did not match — and that is fine. Scientists learn the most from the predictions that miss.');
  } else if (invKey === 'B') {
    box.innerHTML = said + 'Your data shows the cart traveled <b>' + vals[0] +
      ' cm</b> with the small push and <b>' + vals[vals.length - 1] + ' cm</b> with the big push — so a bigger push ' +
      (rose ? 'moved the cart farther.' : 'did not move the cart farther, which is worth telling Mr. O about.');
  } else if (invKey === 'C') {
    box.innerHTML = said + 'Your data shows the car traveled <b>' + vals[0] + ' cm</b> from the shortest ramp and <b>' +
      vals[vals.length - 1] + ' cm</b> from the tallest ramp — so a taller ramp ' +
      (rose ? 'sent the car farther. Starting higher up gave the car more energy.'
            : 'did not send the car farther, which is worth telling Mr. O about.');
  } else {
    const win = labSummary().fartherD;
    const hit = stripTags(pred).toLowerCase() === win.toLowerCase();
    box.innerHTML = said + 'Your data says <b>' + lowerFirst(win) + '</b> traveled farther with the very same push. ' +
      (hit ? 'Your prediction matched your data.'
           : 'Your prediction did not match — and that is worth knowing. The heavy truck has more mass, so the truck does not travel as far as the car with the same push.');
  }


  attachSpeakers(document.getElementById('graph-card'));
  guide.run(document.getElementById('graph-card'), { id: 'graph' + invKey });

  document.getElementById('gr-next').onclick = () => app.next();
  /* What the button leads to, by name. After Investigation B comes the end of
     Day 1, not Investigation C — the label still said C from before the day
     split moved. */
  const NEXT = { A:'Start Investigation B →', B:'Go to the end of Day 1 →',
                 C:'Start Investigation D →', D:'Answer questions about my data →' };
  document.getElementById('gr-next').textContent = NEXT[invKey];
}

/* ══════════════════════════════════════════════════════
   WRITTEN RESPONSE — Claim · Evidence · Reasoning
══════════════════════════════════════════════════════ */
let wIdx = 0;

/* Which of the four predictions the data did NOT support. The district's
   Rolling Cars activity ends by asking the student to account for exactly
   that, so the prompt is built from their own four predictions. */
function missedPredictions() {
  const d = labSummary(), out = [];
  const say = k => stripTags(app.predictions[k] || '');
  const grew = k => { const v = groupsFor(k).map(g => cellsFor(k, g).avg || 0);
                      return v.length >= 2 && v[v.length - 1] > v[0]; };
  if (app.data.A.length && say('A').toLowerCase() !== d.farthestA.toLowerCase())
    out.push({ inv:'A', name:'Investigation A (the surfaces)', said:say('A'), got:'the cart traveled the farthest on ' + d.farthestA.toLowerCase() });
  if (app.data.B.length && say('B') && !/farther/i.test(say('B')) && grew('B'))
    out.push({ inv:'B', name:'Investigation B (how hard the push)', said:say('B'), got:'a bigger push sent the cart farther' });
  if (app.data.C.length && say('C') && !/farther/i.test(say('C')) && grew('C'))
    out.push({ inv:'C', name:'Investigation C (how tall the ramp)', said:say('C'), got:'a taller ramp sent the car farther' });
  if (app.data.D.length && say('D').toLowerCase() !== d.fartherD.toLowerCase())
    out.push({ inv:'D', name:'Investigation D (car against truck)', said:say('D'), got:lowerFirst(d.fartherD) + ' traveled farther' });
  return out;
}

/* ══════════════════════════════════════════════════════
   END OF DAY 1 — a real stop, not a scroll-past

   Day 1 is the words and Investigation A. Without a gate a fast student
   runs straight into the ramp and the truck, which are Day 2's lesson and
   have not been briefed yet. This asks them out loud, tells them what they
   already did, and lets them stop with everything saved.
══════════════════════════════════════════════════════ */
function renderDayGate() {
  app.show('daygate-screen');
  /* back to its opening state every time: the choices on, the rest off */
  document.getElementById('dg-choices').classList.remove('hidden');
  document.getElementById('dg-stopped').classList.add('hidden');
  const recapHost = document.getElementById('dg-recap');
  recapHost.classList.add('hidden'); recapHost.innerHTML = '';
  const gateRoot = document.getElementById('daygate-screen');
  const hidePages = () => gateRoot.querySelectorAll('[data-gpage],.gdots').forEach(n => n.classList.add('ghide'));
  const pushes = (app.data.A || []).length + (app.data.B || []).length;
  const surfaces = new Set((app.data.A || []).map(r => r.surface)).size;
  /* "1 different surfaces" is not a sentence. Count words out properly —
     this screen is congratulating a child on their work and bad grammar in
     a congratulation reads as carelessness. */
  const plural = (n, one, many) => n + ' ' + (n === 1 ? one : many);
  document.getElementById('dg-did').innerHTML =
    'You learned <b>' + LESSON.vocab.length + ' words</b>. You did <b>' +
    plural(pushes, 'push', 'pushes') + '</b> and filled <b>two data tables</b> &mdash; ' +
    'one for ' + (surfaces === 1 ? 'the surface' : surfaces + ' different surfaces') +
    ', one for the size of the push. All of your work is saved.';
  /* The teacher's answer is logged either way, so Mr. O can see on the
     dashboard who went on and who was told to wait. */
  document.getElementById('dg-next').onclick = () => {
    logEvent('day2_start', { cleared: 'teacher said yes' });
    document.getElementById('dg-choices').classList.add('hidden');
    hidePages();
    const host = document.getElementById('dg-recap');
    /* Day 2 opens with the RAMP test. This button said "push test" from when
       the push test was still on Day 2. */
    host.innerHTML = recapHTML('day2') +
      '<div class="btnrow" data-gafter><button class="btn" id="dg-go" type="button">' +
      'Start the ramp test &rarr;</button></div>';
    host.classList.remove('hidden');
    attachSpeakers(host);
    guide.run(host, { id: 'day2recap' });
    document.getElementById('dg-go').onclick = () => app.next();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  document.getElementById('dg-stop').onclick = () => {
    logEvent('day1_stop'); app.save(); submitPartial();
    document.getElementById('dg-choices').classList.add('hidden');
    hidePages();
    document.getElementById('dg-stopped').classList.remove('hidden');
    speech.stop();
  };
  attachSpeakers(gateRoot);
  guide.run(gateRoot, { id: 'daygate' });
}

function renderWrite() {
  /* pick up at the first prompt that is still short */
  wIdx = WRITTEN_Q.findIndex(w => (app.written[w.id] || '').trim().length < w.min);
  if (wIdx < 0) { app.next(); return; }

  const w = WRITTEN_Q[wIdx];
  app.show('write-screen');
  document.getElementById('w-head').textContent = WRITTEN_Q.length > 1
    ? 'Explanation ' + (wIdx + 1) + ' of ' + WRITTEN_Q.length
    : 'Explain like a scientist';
  const wt = document.getElementById('w-text');
  wt.innerHTML = wrapWords(w.q);
  document.getElementById('w-hints').innerHTML = w.hints.map(h => '<li>' + h + '</li>').join('');
  document.getElementById('w-data').innerHTML = allTablesHTML();

  const box = document.getElementById('w-box');
  const cnt = document.getElementById('w-counter');
  const nx  = document.getElementById('w-next');
  box.value = app.written[w.id] || '';

  /* Tapping a starter INSERTS its words where the cursor is and leaves the
     student writing forward. It never replaces what they have, never asks them
     to edit inside a sentence somebody else wrote, and leaves nothing on screen
     that looks like an unfinished form. Backspace undoes it like any typing. */
  function insertAtCursor(text) {
    const start = box.selectionStart == null ? box.value.length : box.selectionStart;
    const end   = box.selectionEnd   == null ? box.value.length : box.selectionEnd;
    const before = box.value.slice(0, start);
    const after  = box.value.slice(end);
    /* space before, unless we are at the very start or already after one */
    const lead  = (before === '' || /[\s(]$/.test(before)) ? '' : ' ';
    const added = lead + text;
    box.value = before + added + after;
    const caret = start + added.length;
    box.focus();
    box.setSelectionRange(caret, caret);
    box.dispatchEvent(new Event('input'));
  }

  const starterRow = document.getElementById('w-starters');
  starterRow.innerHTML = '';
  (w.starters || []).forEach(t => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chipbtn'; b.setAttribute('data-noread', '');
    b.textContent = t;
    b.onclick = () => { insertAtCursor(t); logEvent('starter', { id:w.id, t:t }); };
    starterRow.appendChild(b);
  });
  document.getElementById('w-starterwrap').classList.toggle('hidden', !(w.starters || []).length);

  const bankRow = document.getElementById('w-wordbank');
  bankRow.innerHTML = '';
  (w.wordbank || []).forEach(t => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'chipbtn word'; b.setAttribute('data-noread', '');
    b.textContent = t;
    b.onclick = () => { insertAtCursor(t); logEvent('word', { id:w.id, t:t }); };
    bankRow.appendChild(b);
  });
  document.getElementById('w-bankwrap').classList.toggle('hidden', !(w.wordbank || []).length);

  const upd = () => {
    const v = box.value;
    const n = v.trim().length;
    const need = Math.max(0, w.min - n);
    cnt.textContent = need > 0
      ? n + ' letters so far — write about ' + need + ' more to turn this in.'
      : n + ' letters. That is enough to turn in.';
    cnt.className = 'counter' + (need > 0 ? '' : ' ok');
    nx.disabled = need > 0;
    app.written[w.id] = v;
  };
  box.oninput = () => { upd(); if (box.value.length % 40 === 0) app.save(); };
  upd();

  attachSpeakers(document.getElementById('write-screen'));

  nx.textContent = (wIdx + 1 >= WRITTEN_Q.length) ? 'Turn in my explanation →' : 'Next explanation →';
  nx.onclick = () => {
    app.written[w.id] = box.value.trim();
    logEvent('written', { id:w.id, len:app.written[w.id].length });
    app.save(); submitPartial(); submitWritten();
    if (wIdx + 1 >= WRITTEN_Q.length) app.go('exit'); else renderWrite();
  };
}

/* ══════════════════════════════════════════════════════
   FINISH
══════════════════════════════════════════════════════ */
function finish() {
  app.stopTimer();
  app.finishedAt = new Date().toISOString();
  if (app.labEnd == null) app.labEnd = app.timerSeconds;
  logEvent('finish', { score:app.score, total:app.totalItems() });
  speech.stop();
  app.show('end-screen');

  const total = app.totalItems();
  const pct = total ? Math.round((app.score / total) * 100) : 0;
  const clock = n => Math.floor(n / 60) + ':' + String(n % 60).padStart(2, '0');

  document.getElementById('end-lead').innerHTML =
    'You ran <b>' + (app.data.A.length + app.data.B.length) + ' pushes</b>, filled two data tables, ' +
    'and used the distances you measured to explain what stops a moving object. Mr. O can see all of your work.';

  document.getElementById('end-scores').innerHTML = [
    ['' + app.score + '/' + total, 'Questions right'],
    [pct + '%', 'Score'],
    [clock(app.timerSeconds), 'Time on task'],
    [clock(app.labSeconds()), 'On the investigation']
  ].map(x => '<div class="sb"><div class="n tnum">' + x[0] + '</div><div class="l">' + x[1] + '</div></div>').join('');

  /* The three picks become one explanation, in the order a scientist writes
     one. They did not type it, but it is theirs — every part came from their
     own table — and seeing it whole is the point of having built it. */
  const cerFor = k => {
    const q = CLAIMS_Q.find(x => x.cer === k);
    return q ? (app.claimsAns[q.id] || '') : '';
  };
  const claim = cerFor('claim'), ev = cerFor('evidence'), why = cerFor('reasoning');
  const cerBox = document.getElementById('end-cer');
  if (claim && ev && why) {
    cerBox.innerHTML =
      '<hr class="hr"><h3 style="font-size:21px">The explanation you built</h3>' +
      '<div class="box cer" data-parts>' +
      '<p><span class="cerlbl">Claim</span>The cart stopped soonest on ' +
        stripTags(claim).toLowerCase() + '.</p>' +
      '<p><span class="cerlbl">Evidence</span>' + stripTags(ev) + '.</p>' +
      '<p><span class="cerlbl">Reasoning</span>' + stripTags(why) + '.</p>' +
      '</div>';
    cerBox.classList.remove('hidden');
  } else {
    cerBox.innerHTML = ''; cerBox.classList.add('hidden');
  }

  const miss = app.missedQuestions;
  document.getElementById('end-miss').innerHTML = miss.length
    ? '<hr class="hr"><h3 style="font-size:21px">Look at these again with Mr. O</h3><ul class="misslist">' +
      miss.map(x => '<li><b>' + (x.skill || '') + '</b> — ' + x.q +
        ' <i>(you picked: ' + x.yourAnswer + '; answer: ' + x.correct + ')</i></li>').join('') + '</ul>'
    : '<hr class="hr"><p class="lead">You got every question right. Nothing to go back over.</p>';

  document.getElementById('end-answer-back').innerHTML =
    '<hr class="hr"><h3 style="font-size:21px">My finished data</h3>' +
    '<div class="tablewrap">' + allTablesHTML() + '</div>' +
    (WRITTEN_Q.length
      ? '<h3 style="font-size:21px; margin-top:16px">My explanations</h3>' +
        WRITTEN_Q.map(w => '<p class="lead"><b>' + stripTags(w.q) + '</b><br>' +
          (app.written[w.id] ? app.written[w.id].replace(/</g, '&lt;') : '(blank)') + '</p>').join('')
      : '');

  submitFinal();
  submitWritten();
  if (!window.PREVIEW) try {
    const all = JSON.parse(localStorage.getItem(SCORES_KEY) || '[]');
    all.push({ name:app.studentName, score:app.score, total:total, percent:pct,
               elapsed:app.timerSeconds, at:new Date().toISOString() });
    localStorage.setItem(SCORES_KEY, JSON.stringify(all.slice(-80)));
  } catch (e) {}
  app.save();

  attachSpeakers(document.getElementById('end-screen'));


  document.getElementById('end-print').onclick = () => window.print();
  document.getElementById('end-restart').onclick = () =>
    askPin('Enter the teacher PIN to clear this student and start over.', () => {
      app.clearSaved(); location.reload();
    });
}

/* ══════════════════════════════════════════════════════
   PIN · THEME · VISIBILITY
══════════════════════════════════════════════════════ */
let pinCb = null;
function askPin(why, cb) {
  pinCb = cb;
  document.getElementById('pin-why').textContent = why;
  document.getElementById('pin-input').value = '';
  document.getElementById('pin-modal').classList.remove('hidden');
  document.getElementById('pin-input').focus();
}
document.getElementById('pin-ok').onclick = () => {
  if (document.getElementById('pin-input').value.trim() === TEACHER_PIN) {
    document.getElementById('pin-modal').classList.add('hidden');
    const cb = pinCb; pinCb = null; if (cb) cb();
  } else {
    document.getElementById('pin-why').textContent = 'That PIN is not right. Ask Mr. O.';
  }
};
document.getElementById('pin-cancel').onclick = () => {
  document.getElementById('pin-modal').classList.add('hidden'); pinCb = null;
};

document.getElementById('theme-btn').onclick = () => {
  const cur = document.documentElement.getAttribute('data-theme');
  const dark = cur ? cur === 'dark'
    : window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme', dark ? 'light' : 'dark');
  try { localStorage.setItem('sci_theme', dark ? 'light' : 'dark'); } catch (e) {}
  if (app.phase === 'runA' || app.phase === 'runB') paintRun(app.phase === 'runA' ? 'A' : 'B');
};
try {
  const t = localStorage.getItem('sci_theme');
  if (t) document.documentElement.setAttribute('data-theme', t);
} catch (e) {}

/* The clock pauses while the page is hidden, so elapsed is time ON TASK. */
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    if (!app.timerOn) return;
    tabSwitchCount++;
    logEvent('leave');
    app.stopTimer(); app.save(); submitPartial();
    speech.stop();
    app._wasRunning = true;
  } else {
    if (!app._wasRunning) return;
    app._wasRunning = false;
    logEvent('return');
    const b = document.getElementById('tab-warning-banner');
    if (b) b.classList.remove('hidden');
    app.startTimer();
    /* A push that was mid-animation when the student left still lands. */
    if (app._runPending) { const f = app._runPending; app._runPending = null; f(); }
    else { const m = /^run([ABCD])$/.exec(app.phase); if (m) paintRun(m[1]); }   /* all four, not just A and B */
  }
});
window.addEventListener('beforeunload', () => {
  if (app.studentName && PHASES.indexOf(app.phase) > PHASES.indexOf('start') && app.phase !== 'end') {
    logEvent('close'); app.save(); submitPartial();
  }
});

/* ── BOOT ───────────────────────────────────────────── */
buildCover();
buildStart();
attachSpeakers(document.getElementById('start-screen'));
drawRail();
app.tickTimer();
