// Obi-Wan: drawn to reuse the `.yoda` styles and animations (same hooks, different figure and lines),
// so he walks in, says something wise and does the Jedi mind-trick wave.
export const OBI_QUOTES = [
  'You want to try out Herdr, my young padawan.',
  'Neovim: an elegant weapon, for a more civilized age.',
  'Without data, you are just an opinion, my young padawan.',
  'Now show me your data, young padawan.',
  'You now go to the Dagoba... I mean, the database system, my young padawan.',
  'You will go to the Gradient Descent system. There you will find the global minimum. Maybe.',
  'May the Force be with you. And may your tests pass.',
  'May the data be with you, always.',
  'These are not the bugs you are looking for.',
  'Hello there! Have you tried uv?',
  'Only a Sith deals in hardcoded paths.',
  'Commit often, my young padawan.',
  'Use the Force, young padawan. And a lockfile.',
  'Excel... so uncivilized.',
  'I have the high ground, and the git history.',
  'There is no such thing as luck. Only reproducibility.',
];

export const OBI_SVG = `
<svg viewBox="0 0 120 150" class="yoda-svg" aria-hidden="true">
  <ellipse cx="60" cy="146" rx="30" ry="4" fill="rgba(20,24,28,.12)"/>
  <ellipse class="y-foot-a" cx="46" cy="141" rx="10" ry="5" fill="#3b2a1c"/>
  <ellipse class="y-foot-b" cx="74" cy="141" rx="10" ry="5" fill="#3b2a1c"/>
  <path d="M31 142 Q25 100 40 84 Q60 77 80 84 Q95 100 89 142 Z" fill="#7a5632"/>
  <path d="M50 86 Q60 95 70 86 L73 141 L47 141 Z" fill="#d9bf94"/>
  <path d="M60 94 L60 141" stroke="#b99f74" stroke-width="1.2"/>
  <rect x="39" y="113" width="42" height="6" rx="2" fill="#4a3320"/><rect x="56" y="112" width="8" height="8" rx="2" fill="#a98d68"/>
  <rect x="68" y="115" width="5" height="14" rx="1.6" fill="#9aa0a8"/><rect x="68" y="119" width="5" height="2" fill="#5d6269"/>
  <path d="M36 76 Q60 64 84 76 L89 92 Q60 82 31 92 Z" fill="#5e4226"/>
  <g class="y-arm-l">
    <path d="M42 94 Q31 106 35 120" stroke="#7a5632" stroke-width="9" stroke-linecap="round" fill="none"/>
    <circle cx="35" cy="123" r="4.4" fill="#e8bf9a"/>
  </g>
  <g class="y-head">
    <rect x="54" y="66" width="12" height="14" fill="#d6a985"/>
    <ellipse cx="60" cy="52" rx="15.5" ry="18" fill="#e8bf9a"/>
    <path d="M43 56 Q39 28 60 27 Q81 28 77 56 Q76 43 70 38 Q60 33 50 38 Q44 43 43 56 Z" fill="#b0733a"/>
    <path d="M44 55 Q45 76 60 80 Q75 76 76 55 Q73 65 66 65 Q60 63 54 65 Q47 65 44 55 Z" fill="#b9824b"/>
    <path d="M52 62 Q60 58 68 62 Q60 67 52 62 Z" fill="#a86f3a"/>
    <path d="M57 69 Q60 71 63 69" stroke="#7b4a28" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <g class="y-eyes"><circle cx="53" cy="52" r="2" fill="#1b2330"/><circle cx="67" cy="52" r="2" fill="#1b2330"/></g>
    <path d="M48.5 47 Q53 44.5 57 47 M63 47 Q67 44.5 71.5 47" stroke="#8a5a2b" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M60 52 L58.5 59 Q60 60.5 61.5 59" stroke="#c9966f" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  </g>
  <g class="y-force"><circle cx="109" cy="91" r="8"/><circle cx="109" cy="91" r="8"/><circle cx="109" cy="91" r="8"/></g>
  <g class="y-swirl">
    <path d="M98 80 Q108 74 118 82"/><path d="M100 92 Q112 84 124 94"/><path d="M100 104 Q112 98 122 106"/>
  </g>
  <g class="y-arm">
    <path d="M76 92 Q90 102 88 120" stroke="#7a5632" stroke-width="9" stroke-linecap="round" fill="none"/>
    <g class="y-hand">
      <circle cx="88" cy="123" r="4.8" fill="#e8bf9a"/>
      <path d="M85 126 L84 130 M88 127 L88 131 M91 126 L92 130 M93 123 L96 125" stroke="#e8bf9a" stroke-width="2" stroke-linecap="round"/>
    </g>
  </g>
  <g class="y-arm-bent">
    <path d="M78 91 Q87 96 89 114" stroke="#7a5632" stroke-width="9" stroke-linecap="round" fill="none"/>
    <g transform="translate(89 114)">
      <g class="y-fore">
        <path d="M0 0 Q3 -16 10 -30" stroke="#7a5632" stroke-width="9" stroke-linecap="round" fill="none"/>
        <circle cx="11" cy="-34" r="4.8" fill="#e8bf9a"/>
        <path d="M8 -38 L7 -43 M11 -39 L11 -44 M14 -38 L15 -43 M16 -34 L19 -36" stroke="#e8bf9a" stroke-width="2" stroke-linecap="round"/>
      </g>
      <circle cx="0" cy="0" r="4.5" fill="#7a5632"/>
    </g>
  </g>
</svg>`;
