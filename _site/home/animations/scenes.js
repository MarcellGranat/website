// One small flat-style scene per stop on the stack page. Plain inline SVG, animated with CSS
// (see the "scenes" block in stack.css); the animation runs once the stop has scrolled into view.
const SKIN = '#e8b896';

// 1. Han and Chewbacca in the Falcon's cockpit: "Chewy, start the hyper engine"
const FALCON = `
<svg viewBox="0 0 260 170" role="img" aria-label="Han Solo and Chewbacca in the cockpit of the Millennium Falcon">
  <defs><clipPath id="sc-win"><rect x="14" y="10" width="232" height="104" rx="22"/></clipPath></defs>
  <rect width="260" height="170" rx="16" fill="#cfd6d8"/>
  <rect x="14" y="10" width="232" height="104" rx="22" fill="#14202e"/>
  <g clip-path="url(#sc-win)">
    <g class="sc-stars">
      <path d="M40 30 L36 28 M70 20 L68 17 M105 28 L103 25 M165 24 L167 21 M205 30 L208 28 M225 56 L229 56 M30 62 L26 62 M215 92 L219 94 M35 92 L31 94 M90 100 L88 103 M170 100 L172 103 M130 18 L130 14" stroke="#fff" stroke-width="2.2" stroke-linecap="round"/>
    </g>
  </g>
  <rect x="14" y="10" width="232" height="104" rx="22" fill="none" stroke="#9aa5a8" stroke-width="5"/>
  <path d="M130 10 V114 M72 12 L98 114 M188 12 L162 114" stroke="#9aa5a8" stroke-width="3" opacity=".7"/>
  <!-- Han -->
  <g class="sc-han">
    <path d="M52 124 Q52 96 76 94 Q100 96 100 124 Z" fill="#f4f1ea"/>
    <path d="M52 124 Q52 100 66 95 L72 124 Z M100 124 Q100 100 86 95 L80 124 Z" fill="#26272c"/>
    <circle cx="76" cy="76" r="15" fill="${SKIN}"/>
    <path d="M60 74 Q60 58 76 58 Q93 58 92 74 Q86 64 76 66 Q66 64 60 74 Z" fill="#6b4a2e"/>
    <circle cx="70" cy="77" r="1.8" fill="#14181c"/><circle cx="83" cy="77" r="1.8" fill="#14181c"/>
    <path d="M70 85 Q78 89 85 83" stroke="#7a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M66 72 Q70 70 74 72 M80 72 Q84 70 88 72" stroke="#6b4a2e" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <!-- Chewbacca -->
  <g class="sc-chew">
    <path d="M150 128 Q146 92 176 88 Q208 92 204 128 Z" fill="#8a5a32"/>
    <path d="M154 96 L200 126 M200 96 L156 126" stroke="#3b2a1b" stroke-width="5" opacity=".85"/>
    <g class="sc-chew-head">
      <path d="M158 70 Q158 44 178 44 Q198 44 198 70 Q198 90 178 94 Q158 90 158 70 Z" fill="#9a6a3c"/>
      <path d="M158 70 Q154 90 160 100 M198 70 Q202 90 196 100" stroke="#8a5a32" stroke-width="7" stroke-linecap="round" fill="none"/>
      <ellipse cx="178" cy="78" rx="12" ry="9" fill="#c79a6e"/>
      <circle cx="170" cy="66" r="3.2" fill="#fff"/><circle cx="186" cy="66" r="3.2" fill="#fff"/>
      <circle cx="171" cy="67" r="1.6" fill="#14181c"/><circle cx="185" cy="67" r="1.6" fill="#14181c"/>
      <path d="M163 59 Q170 56 175 60 M193 59 Q186 56 181 60" stroke="#5a3a1f" stroke-width="2" fill="none" stroke-linecap="round"/>
      <ellipse cx="178" cy="75" rx="3.4" ry="2" fill="#2b1d12"/>
      <ellipse class="sc-roar" cx="178" cy="84" rx="5" ry="3" fill="#2b1d12"/>
    </g>
    <path class="sc-chew-arm" d="M156 100 Q132 112 118 128" stroke="#8a5a32" stroke-width="10" stroke-linecap="round" fill="none"/>
  </g>
  <!-- console -->
  <rect x="0" y="122" width="260" height="48" rx="0" fill="#7e8b90"/>
  <rect x="0" y="122" width="260" height="6" fill="#68767b"/>
  <g class="sc-lights">
    <circle cx="36" cy="142" r="4" fill="#e8b923"/><circle cx="54" cy="142" r="4" fill="#22c55e"/><circle cx="72" cy="142" r="4" fill="#e03a3a"/>
    <circle cx="190" cy="142" r="4" fill="#3b82f6"/><circle cx="208" cy="142" r="4" fill="#e8b923"/><circle cx="226" cy="142" r="4" fill="#22c55e"/>
  </g>
  <rect x="100" y="134" width="60" height="22" rx="4" fill="#26323a"/>
  <path d="M106 150 L116 144 L124 148 L134 138 L142 146 L154 140" stroke="#5fd0c0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
  <rect x="110" y="116" width="6" height="22" rx="2" fill="#3a3d45"/><circle class="sc-lever" cx="113" cy="116" r="5" fill="#e03a3a"/>
</svg>`;

// 2. Anakin and Palpatine at the opera: "Some say that it gives skills that are unnatural"
const OPERA = `
<svg viewBox="0 0 260 170" role="img" aria-label="Palpatine talking to Anakin Skywalker">
  <rect width="260" height="170" rx="16" fill="#6e3040"/>
  <path d="M0 0 H70 Q50 60 62 170 H0 Z M260 0 H190 Q210 60 198 170 H260 Z" fill="#8a3f52"/>
  <path d="M16 0 Q22 80 14 170 M40 0 Q46 80 38 170 M244 0 Q238 80 246 170 M220 0 Q214 80 222 170" stroke="#5a2634" stroke-width="3" fill="none"/>
  <rect x="0" y="140" width="260" height="30" fill="#4a2230"/>
  <rect x="0" y="136" width="260" height="8" fill="#c79a3a"/>
  <g class="sc-ai"><path d="M130 40 l3 8 8 3 -8 3 -3 8 -3 -8 -8 -3 8 -3 Z" fill="#7ee0ff"/><circle cx="148" cy="34" r="2.2" fill="#7ee0ff"/><circle cx="114" cy="62" r="1.8" fill="#7ee0ff"/></g>
  <!-- Palpatine -->
  <g class="sc-palp">
    <path d="M30 142 Q28 98 64 92 Q100 98 98 142 Z" fill="#1b1b22"/>
    <path d="M36 80 Q36 50 64 50 Q92 50 92 80 Q92 98 78 106 L50 106 Q36 98 36 80 Z" fill="#1b1b22"/>
    <path d="M48 80 Q48 62 64 62 Q80 62 80 80 Q80 94 64 100 Q48 94 48 80 Z" fill="#dcc6b0"/>
    <path d="M54 76 Q58 73 62 76 M68 76 Q72 73 76 76" stroke="#3a2a22" stroke-width="2" fill="none" stroke-linecap="round"/>
    <circle cx="58" cy="79" r="1.7" fill="#14181c"/><circle cx="72" cy="79" r="1.7" fill="#14181c"/>
    <path d="M53 68 Q64 64 75 68 M52 88 Q58 91 62 89 M66 89 Q72 91 77 88" stroke="#b79d86" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path class="sc-palp-mouth" d="M58 92 Q64 95 70 92" stroke="#5a3a30" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </g>
  <!-- Anakin -->
  <g class="sc-ani">
    <path d="M160 142 Q158 100 194 96 Q230 100 228 142 Z" fill="#a8784a"/>
    <path d="M178 98 L194 124 L210 98 Z" fill="#6a4a2c"/>
    <circle cx="194" cy="76" r="16" fill="${SKIN}"/>
    <path d="M177 76 Q176 56 194 56 Q212 56 211 76 Q205 66 194 68 Q184 66 177 76 Z" fill="#8a6a3a"/>
    <path d="M211 76 Q216 82 214 92" stroke="#8a6a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="188" cy="78" r="1.8" fill="#14181c"/><circle cx="201" cy="78" r="1.8" fill="#14181c"/>
    <path d="M183 73 Q188 70 192 73 M197 73 Q201 70 206 73" stroke="#6a4a2c" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <path d="M205 70 L208 80" stroke="#c98a72" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M190 88 Q195 90 200 88" stroke="#7a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
</svg>`;

// 3. Anakin and Obi-Wan in a starfighter: "This is where the fun begins"
const FIGHTER = `
<svg viewBox="0 0 260 170" role="img" aria-label="Anakin and Obi-Wan in a starfighter">
  <defs><clipPath id="sc-can"><path d="M20 126 Q20 20 130 20 Q240 20 240 126 Z"/></clipPath></defs>
  <rect width="260" height="170" rx="16" fill="#d5dbe0"/>
  <path d="M20 126 Q20 20 130 20 Q240 20 240 126 Z" fill="#101b2a"/>
  <g clip-path="url(#sc-can)">
    <g class="sc-fly">
      <path d="M30 40 h5 M80 30 h4 M120 54 h6 M165 36 h4 M210 48 h5 M60 74 h4 M150 84 h5 M235 70 h4 M100 96 h4 M190 104 h6 M10 100 h5 M290 40 h5 M340 30 h4 M380 54 h6 M425 36 h4 M470 48 h5 M320 74 h4 M410 84 h5 M495 70 h4 M360 96 h4 M450 104 h6 M270 100 h5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    </g>
    <circle class="sc-boom a" cx="62" cy="52" r="9" fill="#ff9f3a"/><circle class="sc-boom b" cx="204" cy="66" r="7" fill="#ffd05a"/><circle class="sc-boom c" cx="150" cy="40" r="6" fill="#ff7a3a"/>
  </g>
  <path d="M20 126 Q20 20 130 20 Q240 20 240 126" fill="none" stroke="#8d99a3" stroke-width="6"/>
  <path d="M130 20 V126" stroke="#8d99a3" stroke-width="4"/>
  <!-- Obi-Wan (back seat) -->
  <g class="sc-obi">
    <path d="M142 130 Q142 100 168 98 Q194 100 194 130 Z" fill="#b9885a"/>
    <circle cx="168" cy="80" r="14" fill="${SKIN}"/>
    <path d="M153 78 Q152 62 168 62 Q184 62 183 78 Q178 69 168 70 Q158 69 153 78 Z" fill="#a8683a"/>
    <path d="M156 84 Q159 96 168 98 Q177 96 180 84 Q176 90 168 90 Q160 90 156 84 Z" fill="#a8683a"/>
    <circle cx="163" cy="79" r="1.6" fill="#14181c"/><circle cx="174" cy="79" r="1.6" fill="#14181c"/>
    <path d="M158 74 Q163 72 167 74 M170 74 Q174 72 179 74" stroke="#8a5a30" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </g>
  <!-- Anakin (front seat) -->
  <g class="sc-ani2">
    <path d="M72 134 Q72 102 98 100 Q124 102 124 134 Z" fill="#a8784a"/>
    <circle cx="98" cy="82" r="15" fill="${SKIN}"/>
    <path d="M83 82 Q82 64 98 64 Q114 64 113 82 Q108 72 98 74 Q88 72 83 82 Z" fill="#8a6a3a"/>
    <path d="M113 82 Q118 88 116 98" stroke="#8a6a3a" stroke-width="3" fill="none" stroke-linecap="round"/>
    <circle cx="92" cy="84" r="1.8" fill="#14181c"/><circle cx="105" cy="84" r="1.8" fill="#14181c"/>
    <path d="M87 79 Q92 76 96 79 M101 79 Q105 76 110 79" stroke="#6a4a2c" stroke-width="1.7" fill="none" stroke-linecap="round"/>
    <path class="sc-grin" d="M91 92 Q98 99 106 91" stroke="#7a4a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </g>
  <path d="M0 126 H260 V170 H0 Z" fill="#8d99a3"/>
  <rect x="0" y="126" width="260" height="6" fill="#77838d"/>
  <rect x="86" y="140" width="88" height="16" rx="4" fill="#2a343c"/>
  <circle class="sc-b1" cx="102" cy="148" r="3.2" fill="#e8b923"/><circle class="sc-b2" cx="118" cy="148" r="3.2" fill="#22c55e"/><circle class="sc-b1" cx="134" cy="148" r="3.2" fill="#e03a3a"/><circle class="sc-b2" cx="150" cy="148" r="3.2" fill="#3b82f6"/>
</svg>`;

// 4. A Death Star under construction: "Deploying to production..."
const DEATH_STAR = `
<svg viewBox="0 0 260 170" role="img" aria-label="A Death Star under construction">
  <defs><clipPath id="sc-ds"><circle cx="130" cy="82" r="58"/></clipPath></defs>
  <rect width="260" height="170" rx="16" fill="#101b2a"/>
  <path d="M20 30 h3 M60 18 h3 M232 24 h3 M240 100 h3 M26 120 h3 M210 140 h3 M96 150 h3 M170 14 h3" stroke="#fff" stroke-width="2.4" stroke-linecap="round" opacity=".8"/>
  <circle cx="130" cy="82" r="58" fill="#2a343c"/>
  <g clip-path="url(#sc-ds)">
    <!-- finished half -->
    <path d="M60 24 H130 V150 H60 Z" fill="#aab3b8"/>
    <path d="M60 60 H130 M60 100 H130 M96 24 V150 M72 24 V150 M114 24 V150" stroke="#8b959a" stroke-width="1.5"/>
    <rect class="sc-panel p1" x="130" y="30" width="30" height="26" fill="#aab3b8"/>
    <rect class="sc-panel p2" x="160" y="30" width="30" height="26" fill="#aab3b8"/>
    <rect class="sc-panel p3" x="130" y="56" width="30" height="26" fill="#aab3b8"/>
    <rect class="sc-panel p4" x="160" y="56" width="30" height="26" fill="#aab3b8"/>
    <rect class="sc-panel p5" x="130" y="82" width="30" height="26" fill="#aab3b8"/>
    <rect class="sc-panel p6" x="160" y="82" width="30" height="26" fill="#aab3b8"/>
    <rect class="sc-panel p7" x="130" y="108" width="30" height="26" fill="#aab3b8"/>
    <rect class="sc-panel p8" x="160" y="108" width="30" height="26" fill="#aab3b8"/>
    <path d="M130 24 V150 M160 24 V150 M190 24 V150 M130 56 H190 M130 82 H190 M130 108 H190" stroke="#5f6b72" stroke-width="1.6"/>
  </g>
  <path d="M72 66 H188" stroke="#4d585e" stroke-width="5"/>
  <circle cx="98" cy="46" r="11" fill="#8b959a" stroke="#4d585e" stroke-width="2"/><circle cx="98" cy="46" r="4" fill="#4d585e"/>
  <circle cx="130" cy="82" r="58" fill="none" stroke="#4d585e" stroke-width="2"/>
  <!-- crane -->
  <g>
    <path d="M222 150 V64 L206 150 M222 64 H176" stroke="#e8b923" stroke-width="3.2" fill="none" stroke-linejoin="round"/>
    <g class="sc-crane"><path d="M222 64 L176 38" stroke="#e8b923" stroke-width="4" stroke-linecap="round"/><path class="sc-rope" d="M176 38 V54" stroke="#cfd6d8" stroke-width="1.6"/><rect class="sc-load" x="168" y="54" width="16" height="10" fill="#aab3b8"/></g>
  </g>
  <circle class="sc-spark a" cx="146" cy="70" r="3" fill="#ffd05a"/><circle class="sc-spark b" cx="176" cy="96" r="3" fill="#ffd05a"/>
  <!-- tiny TIE fighter -->
  <g class="sc-tie"><rect x="0" y="-5" width="2.4" height="10" fill="#cfd6d8"/><rect x="10" y="-5" width="2.4" height="10" fill="#cfd6d8"/><circle cx="6" cy="0" r="3.4" fill="#cfd6d8"/><path d="M2.4 0 H10" stroke="#cfd6d8" stroke-width="1.4"/></g>
  <!-- progress -->
  <rect x="26" y="152" width="120" height="8" rx="4" fill="#3a4750"/>
  <rect class="sc-bar" x="26" y="152" width="120" height="8" rx="4" fill="#5fd0c0"/>
</svg>`;

export const SCENES = [
  { svg: FALCON, quote: 'Chewy, start the hyper engine!' },
  { svg: OPERA, quote: 'Some say it gives skills that are unnatural…' },
  { svg: FIGHTER, quote: 'This is where the fun begins.' },
  { svg: DEATH_STAR, quote: 'Deploying to production…' },
];

export function mountScenes(root = document) {
  root.querySelectorAll('.route .stop').forEach((stop, i) => {
    const s = SCENES[i];
    if (!s) return;
    const fig = document.createElement('figure');
    fig.className = `scene scene-${i + 1}`;
    fig.innerHTML = `${s.svg}<figcaption class="scene-quote">${s.quote}</figcaption>`;
    stop.insertBefore(fig, stop.querySelector('.kicker').nextSibling);
  });
}
