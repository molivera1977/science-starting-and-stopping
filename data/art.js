/* ══════════════════════════════════════════════════════
   ART — inline SVG for the lesson.

   Why inline and not image files: no extra requests on a school
   Chromebook, no broken-image box if the network stalls mid-period,
   and the shapes inherit the theme so dark mode needs no second set.

   Every piece is decorative. Each carries aria-hidden and sits inside
   a [data-noread] wrapper, so the read-aloud enumerator skips it and
   a student never hears "image".

   Colours come from the stylesheet tokens, so these never fight the
   page: --sci (teal), --accent (orange), --ink-faint, --surface.
═══════════════════════════════════════════════════════ */

function svg(body, box) {
  return '<svg viewBox="0 0 ' + (box || '48 48') + '" aria-hidden="true" focusable="false">' +
         body + '</svg>';
}

/* ── the five Week-1 words ──────────────────────────────
   A picture is the fastest route to a word for a reader at Level 1.
   Each one shows the word DOING something, not an abstract symbol. */
window.WORD_ART = {
  /* a hand pushing a crate, with the push arrow behind it */
  force: svg(
    '<rect x="20" y="20" width="20" height="20" rx="2" fill="var(--sci)" opacity=".85"/>' +
    '<path d="M4 30h11" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M11 25l6 5-6 5" fill="none" stroke="var(--accent)" stroke-width="3.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6 42h38" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>'),

  /* a block dragging over a jagged surface, heat rising off it */
  friction: svg(
    '<rect x="14" y="19" width="20" height="14" rx="2" fill="var(--sci)" opacity=".85"/>' +
    '<path d="M4 40l5-5 5 5 5-5 5 5 5-5 5 5 5-5 5 5" fill="none" ' +
      'stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M19 14c0-3 3-3 3-6M26 14c0-3 3-3 3-6" fill="none" ' +
      'stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>'),

  /* a ball with speed lines — motion is change of position */
  motion: svg(
    '<circle cx="32" cy="26" r="10" fill="var(--sci)" opacity=".85"/>' +
    '<path d="M4 20h12M2 26h11M6 32h10" stroke="var(--accent)" stroke-width="3" ' +
      'stroke-linecap="round"/>' +
    '<path d="M6 42h38" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>'),

  /* a bolt — what a thing needs in order to move or do work */
  energy: svg(
    '<path d="M27 4L12 28h10l-3 16 17-25H25z" fill="var(--accent)"/>' +
    '<path d="M27 4L12 28h10l-3 16 17-25H25z" fill="none" stroke="var(--sci-dark)" ' +
      'stroke-width="1.5" stroke-linejoin="round"/>'),

  /* two strips, one smooth and one rough — the thing you roll ON */
  surface: svg(
    '<rect x="4" y="10" width="40" height="9" rx="2" fill="var(--sci)" opacity=".8"/>' +
    '<path d="M4 34l5-4 5 4 5-4 5 4 5-4 5 4 5-4 5 4" fill="none" ' +
      'stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<circle cx="14" cy="6" r="2.5" fill="var(--ink-faint)"/>' +
    '<circle cx="14" cy="27" r="2.5" fill="var(--ink-faint)"/>'),

  /* an apple on its way down, with the pull arrow */
  gravity: svg(
    '<circle cx="24" cy="12" r="7" fill="var(--accent)"/>' +
    '<path d="M24 9v-4" stroke="var(--sci-dark)" stroke-width="2" stroke-linecap="round"/>' +
    '<path d="M24 23v12" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round" ' +
      'stroke-dasharray="4 4"/>' +
    '<path d="M19 30l5 6 5-6" fill="none" stroke="var(--sci)" stroke-width="3.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6 42h38" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>')
};

/* ── one icon per investigation ─────────────────────────
   Each shows the thing that CHANGES in that investigation, because
   changing exactly one thing is the method the lesson teaches. */
window.INV_ART = {
  /* A — four surfaces, four different textures */
  A: svg(
    '<rect x="4" y="8"  width="40" height="7" rx="2" fill="var(--sci)" opacity=".9"/>' +
    '<rect x="4" y="18" width="40" height="7" rx="2" fill="var(--sci)" opacity=".62"/>' +
    '<rect x="4" y="28" width="40" height="7" rx="2" fill="var(--sci)" opacity=".4"/>' +
    '<path d="M4 41h40" stroke="var(--accent)" stroke-width="3" stroke-linecap="round" ' +
      'stroke-dasharray="2 3"/>'),

  /* B — the same cart, three sizes of push */
  B: svg(
    '<path d="M8 12h10" stroke="var(--accent)" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M8 24h18" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M8 36h27" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M15 8l5 4-5 4M23 20l5 4-5 4M32 32l5 4-5 4" fill="none" ' +
      'stroke="var(--accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>'),

  /* C — a ramp, and the car let go from the top */
  C: svg(
    '<path d="M6 40L40 40 40 12z" fill="var(--sci)" opacity=".25"/>' +
    '<path d="M6 40L40 12" stroke="var(--sci)" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M6 40h38" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>' +
    '<circle cx="33" cy="19" r="5" fill="var(--accent)"/>'),

  /* D — a small car and a big truck, same push */
  D: svg(
    '<rect x="4" y="24" width="15" height="10" rx="2" fill="var(--sci)" opacity=".85"/>' +
    '<circle cx="8" cy="37" r="3" fill="var(--ink-faint)"/>' +
    '<circle cx="15" cy="37" r="3" fill="var(--ink-faint)"/>' +
    '<rect x="24" y="15" width="21" height="19" rx="2" fill="var(--accent)" opacity=".9"/>' +
    '<circle cx="29" cy="37" r="3" fill="var(--ink-faint)"/>' +
    '<circle cx="40" cy="37" r="3" fill="var(--ink-faint)"/>')
};

/* ── surface swatches ───────────────────────────────────
   A chip beside the surface name. Sand should LOOK gritty and ice
   should look slick, so the word is not the only way in. */
window.SURFACE_ART = {
  ice: svg(
    '<rect width="28" height="20" rx="4" fill="#CFE8F5"/>' +
    '<path d="M4 15l6-7 5 5 4-4 5 6" fill="none" stroke="#6FA8C8" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>', '28 20'),
  wood: svg(
    '<rect width="28" height="20" rx="4" fill="#D9B38A"/>' +
    '<path d="M2 6h24M2 11h24M2 16h24" stroke="#A8794A" stroke-width="1.4" ' +
      'stroke-linecap="round"/>', '28 20'),
  carpet: svg(
    '<rect width="28" height="20" rx="4" fill="#C3B7D6"/>' +
    '<path d="M3 14c2-5 4-5 6 0s4 5 6 0 4-5 6 0 4 5 6 0" fill="none" ' +
      'stroke="#7E6DA0" stroke-width="1.6" stroke-linecap="round"/>', '28 20'),
  sand: svg(
    '<rect width="28" height="20" rx="4" fill="#E6CE9E"/>' +
    '<g fill="#B5924F">' +
    '<circle cx="6" cy="6" r="1.5"/><circle cx="13" cy="9" r="1.5"/>' +
    '<circle cx="21" cy="5" r="1.5"/><circle cx="9" cy="15" r="1.5"/>' +
    '<circle cx="18" cy="14" r="1.5"/><circle cx="24" cy="12" r="1.5"/>' +
    '</g>', '28 20')
};

/* A wrapper the read-aloud enumerator will skip. */
window.art = function (markup, cls) {
  if (!markup) return '';
  return '<span class="art' + (cls ? ' ' + cls : '') + '" data-noread>' + markup + '</span>';
};
