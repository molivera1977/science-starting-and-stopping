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

/* ── the equipment and the method, drawn ───────────────
   Every word in the helper gets a picture as well as words. Marcos 10/9:
   "examples are not just visuals, they must be explained with easy to
   understand words" — and then "words and visuals". Both, for each. */
window.THING_ART = {
  cart: svg(
    '<rect x="10" y="16" width="28" height="14" rx="3" fill="var(--sci)" opacity=".85"/>' +
    '<circle cx="18" cy="35" r="5" fill="var(--ink-faint)"/>' +
    '<circle cx="32" cy="35" r="5" fill="var(--ink-faint)"/>' +
    '<path d="M4 42h40" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>'),
  track: svg(
    '<path d="M4 30h40" stroke="var(--sci)" stroke-width="5" stroke-linecap="round"/>' +
    '<path d="M8 20v6M18 20v6M28 20v6M38 20v6" stroke="var(--ink-faint)" stroke-width="2" ' +
      'stroke-linecap="round"/>' +
    '<path d="M4 38h40" stroke="var(--accent)" stroke-width="2.5" stroke-dasharray="3 4" ' +
      'stroke-linecap="round"/>'),
  ramp: svg(
    '<path d="M6 40L40 40 40 12z" fill="var(--sci)" opacity=".3"/>' +
    '<path d="M6 40L40 12" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>' +
    '<circle cx="33" cy="19" r="4.5" fill="var(--accent)"/>' +
    '<path d="M4 42h40" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>'),
  investigation: svg(
    '<circle cx="21" cy="20" r="12" fill="none" stroke="var(--sci)" stroke-width="4"/>' +
    '<path d="M30 29l12 12" stroke="var(--sci)" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M16 20h10M21 15v10" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round"/>'),
  'data table': svg(
    '<rect x="5" y="9" width="38" height="30" rx="3" fill="none" stroke="var(--sci)" stroke-width="3"/>' +
    '<path d="M5 19h38M5 29h38M19 9v30M31 9v30" stroke="var(--sci)" stroke-width="2" opacity=".65"/>' +
    '<rect x="20" y="20" width="10" height="8" fill="var(--accent)" opacity=".75"/>'),
  distance: svg(
    '<path d="M6 24h36" stroke="var(--sci)" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M6 16v16M42 16v16" stroke="var(--accent)" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M12 19l-6 5 6 5M36 19l6 5-6 5" fill="none" stroke="var(--sci)" stroke-width="2.5" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>'),
  setup: svg(
    '<rect x="5" y="11" width="38" height="9" rx="2" fill="var(--sci)" opacity=".8"/>' +
    '<rect x="5" y="25" width="24" height="9" rx="2" fill="var(--accent)" opacity=".8"/>' +
    '<path d="M34 29.5h9" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round" ' +
      'stroke-dasharray="2 3"/>')
};

/* ── why-should-you-care pictures ──────────────────────── */
window.CARE_ART = {
  /* a car with speed lines coming up to a crosswalk */
  crossing: svg(
    '<path d="M3 36h42" stroke="var(--ink-faint)" stroke-width="2.5" stroke-linecap="round"/>' +
    '<rect x="31" y="20" width="3" height="14" rx="1" fill="var(--accent)"/>' +
    '<rect x="36" y="20" width="3" height="14" rx="1" fill="var(--accent)"/>' +
    '<rect x="41" y="20" width="3" height="14" rx="1" fill="var(--accent)"/>' +
    '<rect x="9" y="22" width="17" height="9" rx="2.5" fill="var(--sci)"/>' +
    '<circle cx="13" cy="33" r="3" fill="var(--sci-dark)"/>' +
    '<circle cx="22" cy="33" r="3" fill="var(--sci-dark)"/>' +
    '<path d="M2 22h5M1 27h5" stroke="var(--sci)" stroke-width="2" stroke-linecap="round" opacity=".55"/>'),
  /* an ice patch with sand sprinkled on it */
  icy: svg(
    '<rect x="4" y="22" width="40" height="14" rx="5" fill="#CFE8F5"/>' +
    '<path d="M9 31l6-5 5 4 4-3 6 5" fill="none" stroke="#6FA8C8" stroke-width="1.6" ' +
      'stroke-linecap="round" stroke-linejoin="round"/>' +
    '<g fill="#B5924F"><circle cx="12" cy="26" r="1.6"/><circle cx="20" cy="29" r="1.6"/>' +
    '<circle cx="27" cy="25" r="1.6"/><circle cx="34" cy="30" r="1.6"/><circle cx="39" cy="26" r="1.6"/>' +
    '<circle cx="24" cy="12" r="1.6"/><circle cx="30" cy="8" r="1.6"/><circle cx="18" cy="7" r="1.6"/></g>'),
  /* a sneaker with a bumpy sole */
  sneaker: svg(
    '<path d="M5 31c0-6 3-10 8-11l7-7c2-2 5-1 6 1l3 5c4 2 9 4 13 6 2 1 2 4 2 6H5z" ' +
      'fill="var(--sci)" opacity=".85"/>' +
    '<path d="M5 31h39" stroke="var(--sci-dark)" stroke-width="3" stroke-linecap="round"/>' +
    '<path d="M6 36l3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3 3-3 3 3" fill="none" ' +
      'stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>')
};

/* ── meet-your-cart pictures ──────────────────────────── */
window.CART_ART = {
  /* a laptop screen with a cart on it — the cart lives on the screen */
  screen: svg(
    '<rect x="6" y="8" width="36" height="24" rx="3" fill="none" stroke="var(--sci-dark)" stroke-width="3"/>' +
    '<path d="M2 38h44" stroke="var(--sci-dark)" stroke-width="3.5" stroke-linecap="round"/>' +
    '<path d="M11 26h26" stroke="var(--ink-faint)" stroke-width="1.8" stroke-linecap="round"/>' +
    '<rect x="15" y="17" width="12" height="7" rx="1.5" fill="var(--sci)"/>' +
    '<circle cx="18" cy="25" r="2" fill="var(--sci-dark)"/><circle cx="24" cy="25" r="2" fill="var(--sci-dark)"/>'),
  /* a long arrow over a short arrow: a long distance and a short distance */
  longshort: svg(
    '<path d="M6 16h34" stroke="var(--sci)" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M33 9l8 7-8 7" fill="none" stroke="var(--sci)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>' +
    '<path d="M6 34h12" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>' +
    '<path d="M13 27l8 7-8 7" fill="none" stroke="var(--accent)" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>'),
  /* a question mark beside a rolling cart */
  why: svg(
    '<rect x="4" y="24" width="20" height="11" rx="2.5" fill="var(--sci)"/>' +
    '<circle cx="9" cy="37" r="3.2" fill="var(--sci-dark)"/><circle cx="19" cy="37" r="3.2" fill="var(--sci-dark)"/>' +
    '<path d="M31 14c0-5 10-5 10 0 0 4-5 4-5 9" fill="none" stroke="var(--accent)" stroke-width="3.5" ' +
      'stroke-linecap="round"/><circle cx="36" cy="30" r="2.4" fill="var(--accent)"/>')
};
/* The scene at the top of the page: the cart at START on the same kind of
   track the lab draws, with the push arrow and distance marks. */
window.MEET_CART_SCENE =
  '<svg viewBox="0 0 400 120" aria-hidden="true" focusable="false" class="coverscene">' +
  '<rect width="400" height="120" fill="var(--sci-soft)"/>' +
  '<path d="M14 92h372" stroke="var(--sci-dark)" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M80 92V40" stroke="var(--accent)" stroke-width="3" stroke-dasharray="4 4"/>' +
  '<text x="64" y="32" font-size="12" font-weight="700" fill="var(--accent)" ' +
    'font-family="IBM Plex Mono, monospace">START</text>' +
  '<path d="M30 74h22" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M45 67l8 7-8 7" fill="none" stroke="var(--accent)" stroke-width="5" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
  '<rect x="84" y="62" width="44" height="22" rx="4" fill="var(--sci)"/>' +
  '<circle cx="96" cy="87" r="6" fill="var(--sci-dark)"/><circle cx="116" cy="87" r="6" fill="var(--sci-dark)"/>' +
  '<path d="M80 102v8M160 102v8M240 102v8M320 102v8" stroke="var(--sci-dark)" stroke-width="2.5" ' +
    'stroke-linecap="round" opacity=".5"/>' +
  '<g font-size="10" fill="var(--ink-faint)" font-family="IBM Plex Mono, monospace">' +
    '<text x="76" y="118">0</text><text x="140" y="118">100 cm</text><text x="220" y="118">200 cm</text>' +
    '<text x="300" y="118">300 cm</text></g>' +
  '</svg>';

/* Page 2 of Meet your cart: the same cart, waiting at START on each of the
   four surfaces. Every cart is at START on purpose — which surface lets the
   cart travel farthest is what the student is about to find out. */
window.CART_SCENE_SURFACES = (function () {
  const s = [['Ice', '#8FD3E8'], ['Wood', '#C98B4B'], ['Carpet', '#9B7FB8'], ['Sand', '#E0C27C']];
  return '<svg viewBox="0 0 400 112" aria-hidden="true" focusable="false" class="coverscene">' +
    '<rect width="400" height="112" fill="var(--sci-soft)"/>' +
    s.map(function (p, i) {
      const x = 10 + i * 97;
      return '<rect x="' + x + '" y="64" width="88" height="16" rx="3" fill="' + p[1] + '"/>' +
        '<rect x="' + (x + 8) + '" y="41" width="32" height="16" rx="3" fill="var(--sci)"/>' +
        '<circle cx="' + (x + 16) + '" cy="60" r="5" fill="var(--sci-dark)"/>' +
        '<circle cx="' + (x + 32) + '" cy="60" r="5" fill="var(--sci-dark)"/>' +
        '<text x="' + (x + 44) + '" y="100" text-anchor="middle" font-size="13" font-weight="700" ' +
          'fill="var(--ink)" font-family="Public Sans, sans-serif">' + p[0] + '</text>';
    }).join('') + '</svg>';
})();

/* Page 3: what "the distance the cart travels" IS. A faint cart at START,
   the same cart where it stopped, and one arrow between the two. */
window.CART_SCENE_DISTANCE =
  '<svg viewBox="0 0 400 120" aria-hidden="true" focusable="false" class="coverscene">' +
  '<rect width="400" height="120" fill="var(--sci-soft)"/>' +
  '<path d="M14 92h372" stroke="var(--sci-dark)" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M80 92V30" stroke="var(--accent)" stroke-width="3" stroke-dasharray="4 4"/>' +
  '<text x="20" y="24" font-size="12" font-weight="700" fill="var(--accent)" ' +
    'font-family="IBM Plex Mono, monospace">START</text>' +
  '<g opacity=".28"><rect x="84" y="62" width="44" height="22" rx="4" fill="var(--sci)"/>' +
    '<circle cx="96" cy="87" r="6" fill="var(--sci-dark)"/><circle cx="116" cy="87" r="6" fill="var(--sci-dark)"/></g>' +
  '<rect x="250" y="62" width="44" height="22" rx="4" fill="var(--sci)"/>' +
  '<circle cx="262" cy="87" r="6" fill="var(--sci-dark)"/><circle cx="282" cy="87" r="6" fill="var(--sci-dark)"/>' +
  '<path d="M250 92V30" stroke="var(--sci-dark)" stroke-width="2" stroke-dasharray="3 4"/>' +
  '<path d="M88 44h154" stroke="var(--accent)" stroke-width="4" stroke-linecap="round"/>' +
  '<path d="M96 37l-9 7 9 7M234 37l9 7-9 7" fill="none" stroke="var(--accent)" stroke-width="4" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
  '<text x="165" y="32" text-anchor="middle" font-size="13" font-weight="700" fill="var(--ink)" ' +
    'font-family="Public Sans, sans-serif">the distance: 212 cm</text>' +
  '<path d="M80 102v8M160 102v8M240 102v8M320 102v8" stroke="var(--sci-dark)" stroke-width="2.5" ' +
    'stroke-linecap="round" opacity=".5"/>' +
  '<g font-size="10" fill="var(--ink-faint)" font-family="IBM Plex Mono, monospace">' +
    '<text x="76" y="118">0</text><text x="140" y="118">100 cm</text><text x="220" y="118">200 cm</text>' +
    '<text x="300" y="118">300 cm</text></g>' +
  '</svg>';

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

/* ── THE COVER SCENE ────────────────────────────────────
   The first thing a student sees, at 2:25 on a Friday. It shows the whole
   lesson in one picture: a cart being pushed on a track, a ramp with a car
   on it, and the heavy truck — the three things they will actually do.
   Wide, so it fills the top of the cover like a book jacket. */
window.COVER_ART =
  '<svg viewBox="0 0 400 150" aria-hidden="true" focusable="false" class="coverscene">' +
  '<rect width="400" height="150" fill="var(--sci-soft)"/>' +
  /* The ramp is on the LEFT and slopes down to the RIGHT, matching the lab,
     where it is drawn to the left of the start line so the car rolls toward
     the measured track. Everything in this scene therefore travels the same
     way the cart does: rightward. */
  '<path d="M22 46L104 118 22 118z" fill="var(--sci)" opacity=".22"/>' +
  '<path d="M22 46L104 118" stroke="var(--sci)" stroke-width="4" stroke-linecap="round"/>' +
  /* books holding the ramp up */
  '<rect x="14" y="96" width="26" height="8" rx="1.5" fill="var(--accent)" opacity=".75"/>' +
  '<rect x="14" y="86" width="26" height="8" rx="1.5" fill="var(--sci-dark)" opacity=".55"/>' +
  /* the car, sitting ON the slope and pointing down it */
  '<g transform="translate(40,66) rotate(41)">' +
    '<rect x="-11" y="-9" width="22" height="11" rx="2.5" fill="var(--accent)"/>' +
    '<circle cx="-6" cy="3" r="3.4" fill="var(--sci-dark)"/>' +
    '<circle cx="6" cy="3" r="3.4" fill="var(--sci-dark)"/>' +
  '</g>' +
  /* the ground */
  '<path d="M14 118h372" stroke="var(--sci-dark)" stroke-width="5" stroke-linecap="round"/>' +
  /* the cart, mid-push, moving right */
  '<path d="M126 100h20" stroke="var(--accent)" stroke-width="5" stroke-linecap="round"/>' +
  '<path d="M139 93l8 7-8 7" fill="none" stroke="var(--accent)" stroke-width="5" ' +
    'stroke-linecap="round" stroke-linejoin="round"/>' +
  '<rect x="154" y="88" width="34" height="19" rx="3" fill="var(--sci)"/>' +
  '<circle cx="163" cy="111" r="5.5" fill="var(--sci-dark)"/>' +
  '<circle cx="179" cy="111" r="5.5" fill="var(--sci-dark)"/>' +
  /* speed marks BEHIND the cart, so they read as motion to the right */
  '<path d="M196 86h16M200 95h13M194 104h14" stroke="var(--sci)" stroke-width="3" ' +
    'stroke-linecap="round" opacity=".45"/>' +
  /* the heavy truck, further right, also facing right */
  '<rect x="262" y="78" width="46" height="29" rx="3" fill="var(--accent)" opacity=".92"/>' +
  '<rect x="308" y="90" width="18" height="17" rx="2.5" fill="var(--accent)" opacity=".75"/>' +
  '<circle cx="273" cy="111" r="6" fill="var(--sci-dark)"/>' +
  '<circle cx="298" cy="111" r="6" fill="var(--sci-dark)"/>' +
  '<circle cx="318" cy="111" r="5" fill="var(--sci-dark)"/>' +
  /* measuring ticks along the ground */
  '<path d="M110 124v7M180 124v7M250 124v7M320 124v7M380 124v7" stroke="var(--sci-dark)" ' +
    'stroke-width="2.5" stroke-linecap="round" opacity=".45"/>' +
  '</svg>';

/* the help panel's word list is keyed by word; these two share a picture */
window.THING_ART.test = window.THING_ART.investigation;
window.THING_ART.tags = window.THING_ART.setup;

/* The helper on the push screen: a small friendly robot. */
window.HELPER_ART = svg(
  '<path d="M24 5v6" stroke="var(--sci-dark)" stroke-width="3" stroke-linecap="round"/>' +
  '<circle cx="24" cy="4" r="3" fill="var(--accent)"/>' +
  '<rect x="8" y="11" width="32" height="25" rx="7" fill="var(--sci)"/>' +
  '<circle cx="18" cy="22" r="4.5" fill="#fff"/><circle cx="30" cy="22" r="4.5" fill="#fff"/>' +
  '<circle cx="18" cy="22" r="2" fill="var(--sci-dark)"/><circle cx="30" cy="22" r="2" fill="var(--sci-dark)"/>' +
  '<path d="M18 30q6 4 12 0" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>' +
  '<rect x="3" y="18" width="5" height="10" rx="2" fill="var(--sci-dark)"/><rect x="40" y="18" width="5" height="10" rx="2" fill="var(--sci-dark)"/>' +
  '<rect x="16" y="38" width="16" height="6" rx="2" fill="var(--sci-dark)"/>');
