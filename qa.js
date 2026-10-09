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
     C6  every readable block has its own speaker icon
     C7  every readable block visibly lights up while it is being read
     C8  no uncaught errors anywhere
     C9  no rows sent to the sheet
     C10 storage is unchanged at the end
   It also lists how many words each screen asks a student to take in.
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
  const hush = () => { try { speechSynthesis.cancel(); speech.stop(); } catch (e) {} };
  await wait(900); hush();

  /* C1 */
  localStorage.setItem(KEY, JSON.stringify({ studentName: 'QA STUDENT', phase: 'runB',
    data: { A: [1, 2, 3, 4, 5, 6, 7, 8], B: [], C: [], D: [] }, runIndex: { A: 8, B: 0, C: 0, D: 0 } }));
  window.dispatchEvent(new Event('beforeunload'));
  const kept = JSON.parse(localStorage.getItem(KEY) || 'null');
  rec('C1', 'Closing on the cover keeps a saved lesson', !!kept && kept.studentName === 'QA STUDENT' &&
      kept.data.A.length === 8, kept ? (kept.studentName || '(no name)') + ', ' + kept.data.A.length + ' pushes' : 'save gone');
  localStorage.removeItem(KEY);

  /* C2, C3 */
  const path = [app.phase], talked = [];
  for (const id of ['cover-go', 'why-next', 'care-next', 'sum-next', 'cart-next', 'ra-next']) {
    const b = document.getElementById(id);
    if (!b) { path.push('(no #' + id + ')'); break; }
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
  const SPK_ATTR = ['background-color', 'box-shadow'];

  const phaseBad = [], uncovered = [], noSpeaker = [], noLight = [], words = [];
  for (let i = 0; i < stops.length; i++) {
    if (i > 0) { document.getElementById('tp-next').click(); }
    await wait(1000);
    if (speechSynthesis.speaking || speechSynthesis.pending) talked.push(stops[i].label);
    hush();
    const v = visible();
    if (v.length !== 1 || app.phase !== stops[i].phase) { phaseBad.push(stops[i].label); continue; }
    const sec = v[0];
    const blocks = speech.readable(sec);
    const set = new Set(blocks.map(b => b.el));

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

    blocks.forEach(b => {
      const el = b.el;
      /* C6 — its own speaker, attached by the page itself, not by this test */
      if (!el.querySelector(':scope > .mini-spk') && !el.classList.contains('opt'))
        noSpeaker.push(stops[i].label + ': "' + b.text.slice(0, 40) + '"');
      else if (el.classList.contains('opt') && !el.querySelector('.mini-spk'))
        noSpeaker.push(stops[i].label + ' (choice): "' + b.text.slice(0, 40) + '"');
      /* C7 — visibly lights up */
      const off = getComputedStyle(el); const a = SPK_ATTR.map(k => off.getPropertyValue(k));
      el.classList.add('spk');
      const on = getComputedStyle(el); const c = SPK_ATTR.map(k => on.getPropertyValue(k));
      el.classList.remove('spk');
      if (a.join('|') === c.join('|')) noLight.push(stops[i].label + ': "' + b.text.slice(0, 40) + '"');
    });
    words.push({ screen: stops[i].label.replace(/ · \d+ of \d+$/, ''),
      words: blocks.reduce((n, b) => n + (b.text.match(/[A-Za-z]+/g) || []).length, 0) });
  }

  rec('C3', 'Nothing speaks on its own', talked.length === 0, talked.join(', ') || 'silent');
  rec('C4', 'Every preview stop shows one screen in the right phase (' + stops.length + ' stops)',
      phaseBad.length === 0, phaseBad.join(', '));
  rec('C5', 'All visible text can be read aloud', uncovered.length === 0, uncovered.slice(0, 6).join(' | '));
  rec('C6', 'Every readable block has its own speaker', noSpeaker.length === 0,
      noSpeaker.length + ' missing. ' + noSpeaker.slice(0, 6).join(' | '));
  rec('C7', 'Every readable block lights up while read', noLight.length === 0,
      noLight.length + ' dark. ' + noLight.slice(0, 6).join(' | '));
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
