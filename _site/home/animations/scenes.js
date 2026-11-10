// One flat-style scene per stop on the stack page, drawn like the fleet on the home page: no frame, pale
// shapes with thin grey outlines floating on the page. Plain inline SVG, animated with CSS (see the
// "scenes" block in stack.css); the animation runs once the stop has scrolled into view.
const EDGE = '#8c939a';
const SKIN = '#e8b896';
const f = (n) => Math.round(n * 10) / 10;

// A face detail kit: eyes with a little white, pupils, brows. All drawn around (x, y).
const eyes = (x, y, gap, iris = '#4a6f94', r = 2.1) => [-1, 1].map((s) => `<ellipse cx="${f(x + s * gap)}" cy="${y}" rx="3.3" ry="2.3" fill="#fff"/><circle cx="${f(x + s * gap + 0.4)}" cy="${y + 0.2}" r="${r}" fill="${iris}"/><circle cx="${f(x + s * gap + 0.4)}" cy="${y + 0.2}" r="1" fill="#14181c"/>`).join('');

// ---------------------------------------------------------------------------------------------------
// 1. Han and Chewbacca in the Falcon's cockpit: "Chewy, start the hyper engine"
const switches = Array.from({ length: 17 }, (_, i) => {
  const x = 62 + i * 11.5, k = (x - 150) / 105, y = 56 - 15 * (1 - k * k);
  const c = ['#d9473b', '#e8b923', '#f4f1ea', '#3b82f6'][i % 4];
  return `<rect class="sc-sw" x="${f(x)}" y="${f(y)}" width="4" height="5" rx="1" fill="${c}"/>`;
}).join('');
const streaks = Array.from({ length: 26 }, (_, i) => {
  const a = (i / 26) * Math.PI * 2 + (i % 3) * 0.11, r0 = 14 + ((i * 37) % 30), r1 = r0 + 5;
  return `M${f(150 + Math.cos(a) * r0 * 1.5)} ${f(80 + Math.sin(a) * r0)} L${f(150 + Math.cos(a) * r1 * 1.5)} ${f(80 + Math.sin(a) * r1)}`;
}).join(' ');
const FALCON = `
<svg viewBox="0 0 300 200" role="img" aria-label="Han Solo and Chewbacca in the cockpit of the Millennium Falcon">
  <defs><clipPath id="sc-win"><path d="M34 132 L52 48 Q150 26 248 48 L266 132 Z"/></clipPath></defs>
  <ellipse cx="150" cy="112" rx="146" ry="88" fill="#efe5d0"/>
  <path d="M34 132 L52 48 Q150 26 248 48 L266 132 Z" fill="#8fb4d8"/>
  <g clip-path="url(#sc-win)"><g class="sc-stars"><path d="${streaks}" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></g></g>
  <path d="M150 36 V132 M101 42 L92 132 M199 42 L208 132" stroke="#d3d8dc" stroke-width="5"/>
  <path d="M34 132 L52 48 Q150 26 248 48 L266 132" fill="none" stroke="#d3d8dc" stroke-width="7" stroke-linejoin="round"/>
  <path d="M34 132 L52 48 Q150 26 248 48 L266 132 Z" fill="none" stroke="${EDGE}" stroke-width="1.3"/>
  <!-- overhead switch panel -->
  <path d="M46 56 Q150 30 254 56 L250 70 Q150 46 50 70 Z" fill="#c4cace" stroke="${EDGE}" stroke-width="1.2"/>${switches}
  <!-- seats -->
  <rect x="62" y="100" width="82" height="80" rx="16" fill="#cdd2d6" stroke="${EDGE}" stroke-width="1.2"/>
  <rect x="164" y="82" width="90" height="100" rx="16" fill="#cdd2d6" stroke="${EDGE}" stroke-width="1.2"/>
  <!-- Han: white shirt, black vest, swept brown hair, crooked smile -->
  <g class="sc-han">
    <path d="M68 180 Q68 128 104 122 Q140 128 140 180 Z" fill="#f4f1ea"/>
    <path d="M68 180 Q68 132 92 124 L102 180 Z M140 180 Q140 132 116 124 L106 180 Z" fill="#2a2b31"/>
    <path d="M90 124 L102 146 L98 120 Z M118 124 L106 146 L110 120 Z" fill="#fff" stroke="#d8d4c8" stroke-width=".8"/>
    <rect x="98" y="106" width="12" height="18" fill="#d9a07c"/><path d="M99 120 L104 136 L109 120 Z" fill="#d9a07c"/>
    <ellipse cx="87" cy="94" rx="3" ry="4.5" fill="#dca682"/><ellipse cx="121" cy="94" rx="3" ry="4.5" fill="#dca682"/>
    <path d="M88 96 Q86 112 104 114 Q122 112 120 96 Q122 74 104 74 Q86 74 88 96 Z" fill="${SKIN}"/>
    <path d="M86 92 Q82 68 104 66 Q128 66 123 94 Q122 80 112 76 Q100 72 92 78 Q88 82 86 92 Z" fill="#5a3d28"/>
    <path d="M90 78 Q104 68 120 76" stroke="#6e4c32" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M88 92 Q88 98 90 102 M120 92 Q120 98 118 102" stroke="#5a3d28" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    ${eyes(104, 93, 8, '#6a4a2a', 1.9)}
    <path d="M91 87 Q96 85 100 87 M108 86 Q113 82 118 85" stroke="#4a3220" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M103 95 Q101 101 104 102" stroke="#c48c6a" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M95 106 Q104 110 114 103" stroke="#8a4a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M113 103 Q116 102 117 100" stroke="#c48c6a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <g class="sc-han-arm"><path d="M142 60 V84" stroke="#8c939a" stroke-width="3" stroke-linecap="round"/><circle cx="142" cy="58" r="3.4" fill="#d9473b"/><path d="M130 142 L150 122 L142 88" stroke="#f4f1ea" stroke-width="11" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M146 100 L139 102" stroke="#d8d4c8" stroke-width="1.3" stroke-linecap="round"/><circle cx="142" cy="84" r="5.6" fill="#dca682"/></g>
  </g>
  <!-- Chewbacca: shaggy brown fur, blue eyes, bandolier -->
  <g class="sc-chew">
    <path d="M160 184 Q158 126 208 118 Q258 126 256 184 Z" fill="#7a4b26"/>
    <path d="M176 140 l4 7 M190 132 l3 8 M224 134 l-3 8 M240 144 l-4 7 M184 160 l3 8 M232 162 l-3 8 M208 130 l0 8 M200 150 l2 8 M220 152 l-2 8" stroke="#5a3318" stroke-width="2" stroke-linecap="round"/>
    <path d="M172 126 L246 178" stroke="#4a3320" stroke-width="11" stroke-linecap="round"/>
    <path d="M172 126 L246 178" stroke="#6b4a2e" stroke-width="7" stroke-linecap="round" stroke-dasharray="1 0"/>
    <rect x="196" y="144" width="10" height="12" rx="2" fill="#4a3320" transform="rotate(36 201 150)"/><rect x="212" y="154" width="10" height="12" rx="2" fill="#4a3320" transform="rotate(36 217 160)"/>
    <circle cx="180" cy="132" r="2.6" fill="#d9a43a"/><circle cx="238" cy="172" r="2.6" fill="#d9a43a"/>
    <g class="sc-chew-head">
      <path d="M174 70 L168 80 L176 86 L170 98 L180 102 L178 114 L190 112 L192 126 L202 118 L208 132 L214 118 L224 126 L226 112 L238 114 L236 102 L246 98 L240 86 L248 80 L242 70 Q240 46 208 44 Q176 46 174 70 Z" fill="#7a4b26"/>
      <path d="M182 70 Q182 52 208 50 Q234 52 234 70 Q236 92 226 104 Q208 114 190 104 Q180 92 182 70 Z" fill="#8d5a2e"/>
      <path d="M188 58 Q208 50 228 58 M186 64 Q208 56 230 64" stroke="#6e4220" stroke-width="2" fill="none" stroke-linecap="round"/>
      <path d="M190 94 Q208 82 226 94 Q226 108 208 112 Q190 108 190 94 Z" fill="#b98557"/>
      <path d="M184 74 Q196 66 204 74 M232 74 Q220 66 212 74" stroke="#2e1a0b" stroke-width="3.6" fill="none" stroke-linecap="round"/>
      <path d="M188 78 Q197 72 203 79 Q196 83 188 78 Z M228 78 Q219 72 213 79 Q220 83 228 78 Z" fill="#4a2b14"/>
      <ellipse cx="197" cy="80" rx="3.8" ry="2.8" fill="#fff"/><ellipse cx="219" cy="80" rx="3.8" ry="2.8" fill="#fff"/>
      <circle cx="197.6" cy="80.4" r="2.1" fill="#4f86b3"/><circle cx="218.4" cy="80.4" r="2.1" fill="#4f86b3"/><circle cx="197.6" cy="80.4" r="1" fill="#10151a"/><circle cx="218.4" cy="80.4" r="1" fill="#10151a"/>
      <path d="M200 88 Q208 83 216 88 Q215 95 208 96 Q201 95 200 88 Z" fill="#1e130a"/>
      <path d="M202 86 Q208 84 214 86" stroke="#5a3a20" stroke-width="1" fill="none"/>
      <g class="sc-roar"><path d="M194 100 Q208 97 222 100 Q220 114 208 116 Q196 114 194 100 Z" fill="#3a1d12"/><path d="M196 100 Q208 98 220 100 L218 104.5 Q208 102 198 104.5 Z" fill="#fff"/><path d="M201 112 Q208 108 215 112 Q208 117 201 112 Z" fill="#d9626a"/></g>
      <path d="M186 106 L190 126 L196 112 L200 130 L206 114 L212 132 L218 114 L224 130 L228 112 L234 126 L232 106" stroke="#7a4b26" stroke-width="3.4" fill="none" stroke-linejoin="round" stroke-linecap="round"/>
      <path d="M200 122 L202 138 M210 124 L210 140 M220 122 L218 138" stroke="#7a4b26" stroke-width="3" stroke-linecap="round"/>
    </g>
    <path class="sc-chew-arm" d="M182 142 Q166 160 160 176" stroke="#7a4b26" stroke-width="15" stroke-linecap="round" fill="none"/>
  </g>
  <!-- console -->
  <path d="M18 198 L38 158 Q150 140 262 158 L282 198 Z" fill="#b4bbc0" stroke="${EDGE}" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M38 158 Q150 140 262 158" fill="none" stroke="#d3d8dc" stroke-width="4"/>
  <g class="sc-lights">
    <circle cx="60" cy="172" r="3.6" fill="#e8b923"/><circle cx="76" cy="176" r="3.6" fill="#22a65a"/><circle cx="92" cy="180" r="3.6" fill="#d9473b"/>
    <circle cx="208" cy="180" r="3.6" fill="#3b82f6"/><circle cx="224" cy="176" r="3.6" fill="#e8b923"/><circle cx="240" cy="172" r="3.6" fill="#22a65a"/>
  </g>
  <rect x="116" y="166" width="68" height="24" rx="4" fill="#2a343c"/>
  <path d="M122 182 L134 174 L142 179 L154 170 L164 178 L178 171" stroke="#5fd0c0" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

// ---------------------------------------------------------------------------------------------------
// 2. Palpatine and Anakin at the opera: "Some say that it gives skills that are unnatural"
const OPERA = `
<svg viewBox="0 0 300 200" role="img" aria-label="Chancellor Palpatine talking to Anakin Skywalker at the opera">
  <ellipse cx="150" cy="112" rx="146" ry="88" fill="#efe3e8"/>
  <path d="M14 14 Q74 34 56 120 L56 160 L14 160 Z M286 14 Q226 34 244 120 L244 160 L286 160 Z" fill="#cda3ad" stroke="#b78592" stroke-width="1.2"/>
  <path d="M30 20 Q46 70 38 156 M46 26 Q60 74 52 156 M270 20 Q254 70 262 156 M254 26 Q240 74 248 156" stroke="#b78592" stroke-width="1.4" fill="none"/>
  <!-- the balloon opera: a floating bubble with a Mon Calamari squid dancer -->
  <circle cx="150" cy="70" r="52" fill="#d3e8f3" stroke="#9fc3d6" stroke-width="1.5"/>
  <path d="M120 40 Q130 28 142 34" stroke="#fff" stroke-width="3" stroke-linecap="round" fill="none" opacity=".9"/>
  <g class="sc-squid"><path d="M138 62 Q138 44 150 44 Q162 44 162 62 Q164 72 160 76 Q168 84 164 96 M141 76 Q132 84 136 96 M148 78 Q146 92 150 100 M155 78 Q158 92 154 100" stroke="#8fb8d0" stroke-width="5" stroke-linecap="round" fill="none"/><circle cx="145" cy="58" r="1.6" fill="#14181c"/><circle cx="155" cy="58" r="1.6" fill="#14181c"/></g>
  <circle cx="108" cy="52" r="6" fill="#e6f3f9" stroke="#9fc3d6"/><circle cx="196" cy="94" r="8" fill="#e6f3f9" stroke="#9fc3d6"/><circle cx="116" cy="102" r="4" fill="#e6f3f9" stroke="#9fc3d6"/>
  <!-- Palpatine: pale, wrinkled, white hair, heavy-lidded eyes, dark robes -->
  <g class="sc-palp">
    <path d="M44 162 Q44 120 96 114 Q148 120 148 162 Z" fill="#2c2530"/>
    <path d="M70 118 L78 98 L96 116 L114 98 L122 118 L96 134 Z" fill="#3a2f40" stroke="#1d1822" stroke-width="1"/>
    <path d="M84 126 L96 142 L108 126" stroke="#7a3340" stroke-width="2" fill="none"/>
    <path d="M86 98 Q86 112 96 116 Q106 112 106 98 Z" fill="#d6c3b0"/>
    <path d="M72 76 Q70 50 96 46 Q122 50 120 76 Q122 98 108 106 Q96 112 84 106 Q70 98 72 76 Z" fill="#ddccba"/>
    <ellipse cx="71" cy="80" rx="3.4" ry="6" fill="#d3bfab"/><ellipse cx="121" cy="80" rx="3.4" ry="6" fill="#d3bfab"/>
    <path d="M70 70 Q66 48 96 42 Q126 48 122 70 Q120 58 108 54 Q96 50 84 54 Q73 58 70 70 Z" fill="#e4e1dc"/>
    <path d="M76 62 Q96 52 116 62 M80 58 Q96 49 112 58" stroke="#cfcac4" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M80 66 Q96 60 112 66 M82 70 Q96 65 110 70" stroke="#c9b3a0" stroke-width="1.2" fill="none"/>
    <path d="M82 82 Q88 78 92 81 L92 85 Q87 87 82 85 Z M100 81 Q105 78 111 82 L110 85 Q104 87 100 85 Z" fill="#f4eee6"/>
    <path d="M81 80 Q88 76 93 80 M99 80 Q105 76 112 80" stroke="#6a5648" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <circle cx="88" cy="83" r="1.7" fill="#4a7ea0"/><circle cx="105" cy="83" r="1.7" fill="#4a7ea0"/>
    <path d="M81 89 Q88 92 93 89 M100 89 Q105 92 111 89" stroke="#b99f8a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M78 72 Q88 68 94 72 M99 72 Q106 68 114 72" stroke="#b8aca0" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M96 84 Q94 94 92 98 Q96 101 100 98" stroke="#c4ab96" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M83 96 Q80 104 88 108 M109 96 Q112 104 104 108" stroke="#c4ab96" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path class="sc-palp-mouth" d="M86 104 Q96 109 107 103" stroke="#7a4a44" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="112" cy="95" r="1" fill="#c4ab96"/><circle cx="80" cy="92" r="1" fill="#c4ab96"/>
  </g>
  <!-- Anakin: wavy dark-blond hair, scar across the right eyebrow, brown Jedi robes -->
  <g class="sc-ani">
    <path d="M160 162 Q160 120 206 114 Q252 120 252 162 Z" fill="#7d5f3d"/>
    <path d="M186 116 L206 148 L226 116 Q206 108 186 116 Z" fill="#dcc79c"/>
    <path d="M186 116 L206 148 M226 116 L206 148" stroke="#b99f72" stroke-width="1.4"/>
    <path d="M168 150 Q184 134 192 120 M244 150 Q228 134 220 120" stroke="#5e472c" stroke-width="2" fill="none"/>
    <rect x="199" y="104" width="14" height="14" fill="#d9a07c"/>
    <path d="M186 84 Q182 64 206 60 Q230 64 226 84 L230 112 Q222 104 222 98 L190 98 Q190 104 182 112 Z" fill="#8a6a3a"/>
    <path d="M190 90 Q190 112 206 114 Q222 112 222 90 Q224 70 206 68 Q188 70 190 90 Z" fill="${SKIN}"/>
    <path d="M188 80 Q190 62 206 62 Q224 62 224 80 Q216 70 208 72 Q198 70 190 78 Z" fill="#8a6a3a"/>
    <path d="M192 74 Q200 66 206 70 Q214 66 222 76" stroke="#a07e46" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${eyes(206, 89, 8.5, '#4a7ab0', 2)}
    <path d="M193 83 Q198 80 203 83 M210 83 Q215 80 220 83" stroke="#6a4a2c" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M191 76 L194 96" stroke="#c9826a" stroke-width="1.6" stroke-linecap="round"/><path d="M190 82 l3 -1 M192 89 l3 -1" stroke="#c9826a" stroke-width="1" stroke-linecap="round"/>
    <path d="M206 91 Q204 98 207 99" stroke="#c48c6a" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M198 105 Q206 106 214 104" stroke="#8a4a3a" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  </g>
  <g class="sc-ai"><path d="M150 112 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 Z" fill="#7ee0ff" stroke="#3aa7cf" stroke-width="1"/><circle cx="168" cy="108" r="2.4" fill="#7ee0ff"/><circle cx="134" cy="132" r="2" fill="#7ee0ff"/></g>
  <!-- the box rail -->
  <rect x="22" y="160" width="256" height="9" rx="4" fill="#d8b45a" stroke="#a8863a" stroke-width="1.2"/>
  <rect x="26" y="169" width="248" height="26" rx="4" fill="#b86b78" stroke="#8f4c59" stroke-width="1.2"/>
  <path d="M60 172 V192 M100 172 V192 M140 172 V192 M180 172 V192 M220 172 V192 M260 172 V192" stroke="#9d5562" stroke-width="2"/>
</svg>`;

// ---------------------------------------------------------------------------------------------------
// 3. Anakin and Obi-Wan in a starfighter over Coruscant: "This is where the fun begins"
const FIGHTER = `
<svg viewBox="0 0 300 200" role="img" aria-label="Anakin Skywalker and Obi-Wan Kenobi in a Jedi starfighter during the Battle of Coruscant">
  <defs><clipPath id="sc-can"><path d="M22 146 Q22 28 150 24 Q278 28 278 146 Z"/></clipPath></defs>
  <ellipse cx="150" cy="114" rx="146" ry="88" fill="#e3e9ee"/>
  <path d="M22 146 Q22 28 150 24 Q278 28 278 146 Z" fill="#9fb4c9"/>
  <g clip-path="url(#sc-can)">
    <g class="sc-fly">
      <path d="M30 50 h6 M84 40 h5 M126 70 h7 M176 44 h5 M220 62 h6 M62 92 h5 M158 100 h6 M250 84 h5 M104 116 h5 M204 122 h7 M12 118 h6 M330 50 h6 M384 40 h5 M426 70 h7 M476 44 h5 M520 62 h6 M362 92 h5 M458 100 h6 M550 84 h5 M404 116 h5 M504 122 h7 M312 118 h6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    </g>
    <g class="sc-venator"><path d="M170 34 L262 46 L170 58 L186 46 Z" fill="#dfe5ea" stroke="${EDGE}" stroke-width="1"/><path d="M196 45 L240 46 M196 48 L240 47" stroke="#b6bec5" stroke-width="1"/><rect x="176" y="42" width="10" height="8" fill="#c9d0d6" stroke="${EDGE}" stroke-width=".8"/></g>
    <path d="M60 78 L96 66 M70 96 L104 86" stroke="#7de08a" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
    <circle class="sc-boom a" cx="66" cy="58" r="10" fill="#ff9f3a"/><circle class="sc-boom b" cx="214" cy="90" r="8" fill="#ffd05a"/><circle class="sc-boom c" cx="148" cy="52" r="7" fill="#ff7a3a"/>
  </g>
  <path d="M22 146 Q22 28 150 24 Q278 28 278 146" fill="none" stroke="#eef1f3" stroke-width="8"/>
  <path d="M22 146 Q22 28 150 24 Q278 28 278 146" fill="none" stroke="${EDGE}" stroke-width="1.3"/>
  <path d="M150 24 V146" stroke="#eef1f3" stroke-width="5"/>
  <!-- Anakin (left): grin, scar, dark-blond hair, brown robe, flight vest -->
  <g class="sc-ani2">
    <path d="M60 156 Q60 116 106 110 Q152 116 152 156 Z" fill="#7d5f3d"/>
    <path d="M86 112 L106 144 L126 112 Q106 104 86 112 Z" fill="#dcc79c"/>
    <rect x="99" y="100" width="14" height="14" fill="#d9a07c"/>
    <path d="M86 80 Q82 60 106 56 Q130 60 126 80 L130 108 Q122 100 122 94 L90 94 Q90 100 82 108 Z" fill="#8a6a3a"/>
    <path d="M90 86 Q90 110 106 112 Q122 110 122 86 Q124 66 106 64 Q88 66 90 86 Z" fill="${SKIN}"/>
    <path d="M88 76 Q90 58 106 58 Q124 58 124 76 Q116 66 108 68 Q98 66 90 74 Z" fill="#8a6a3a"/>
    <path d="M92 70 Q100 62 106 66 Q114 62 122 72" stroke="#a07e46" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${eyes(106, 85, 8.5, '#4a7ab0', 2)}
    <path d="M93 79 Q98 75 103 79 M110 79 Q115 75 120 79" stroke="#6a4a2c" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M91 70 L94 90" stroke="#c9826a" stroke-width="1.6" stroke-linecap="round"/><path d="M90 76 l3 -1 M92 83 l3 -1" stroke="#c9826a" stroke-width="1" stroke-linecap="round"/>
    <path d="M106 88 Q104 95 107 96" stroke="#c48c6a" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path class="sc-grin" d="M94 99 Q106 110 119 98 Q106 104 94 99 Z" fill="#fff" stroke="#8a4a3a" stroke-width="1.5" stroke-linejoin="round"/>
  </g>
  <!-- Obi-Wan (right): auburn hair and trimmed beard, brows raised, tan robe -->
  <g class="sc-obi">
    <path d="M160 156 Q160 116 206 110 Q252 116 252 156 Z" fill="#c8a36e"/>
    <path d="M160 156 Q160 128 178 118 L190 156 Z M252 156 Q252 128 234 118 L222 156 Z" fill="#7a5a38"/>
    <path d="M190 112 L206 140 L222 112 Q206 106 190 112 Z" fill="#e6d4ac"/>
    <rect x="199" y="100" width="14" height="14" fill="#d9a07c"/>
    <path d="M190 90 Q190 110 206 114 Q222 110 222 90 Q224 66 206 64 Q188 66 190 90 Z" fill="${SKIN}"/>
    <path d="M190 90 Q190 110 206 114 Q222 110 222 90 Q219 98 214 100 Q206 96 198 100 Q193 98 190 90 Z" fill="#b8733f"/>
    <path d="M198 101 Q206 97 214 101 Q206 104 198 101 Z" fill="#a8683a"/>
    <path d="M188 78 Q188 60 206 60 Q226 60 224 78 Q222 68 214 66 Q206 64 198 66 Q190 68 188 78 Z" fill="#b56a38"/>
    <path d="M192 68 Q206 60 220 68" stroke="#cc8450" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M188 76 Q186 84 188 90 M224 76 Q226 84 224 90" stroke="#b56a38" stroke-width="3" stroke-linecap="round"/>
    ${eyes(206, 85, 8, '#4a7ab0', 2)}
    <path d="M193 80 Q198 76 203 79 M209 79 Q214 76 219 80" stroke="#8a5a30" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M206 88 Q204 94 207 95" stroke="#c48c6a" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M200 100 Q206 102 212 100" stroke="#8a4a3a" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </g>
  <!-- hull -->
  <path d="M0 146 H300 V198 H0 Z" fill="#c2c9ce" stroke="${EDGE}" stroke-width="1.3"/>
  <rect x="0" y="146" width="300" height="7" fill="#aab1b6"/>
  <path d="M20 146 Q24 132 40 132 Q56 132 60 146 Z" fill="#f4f6f7" stroke="${EDGE}" stroke-width="1"/><path d="M26 140 H54 M34 134 V146 M46 134 V146" stroke="#3b82f6" stroke-width="1.4" opacity=".8"/><circle cx="40" cy="138" r="2.4" fill="#d9473b"/>
  <rect x="96" y="158" width="108" height="22" rx="5" fill="#2a343c"/>
  <circle class="sc-b1" cx="114" cy="169" r="3.4" fill="#e8b923"/><circle class="sc-b2" cx="132" cy="169" r="3.4" fill="#22a65a"/><circle class="sc-b1" cx="150" cy="169" r="3.4" fill="#d9473b"/><circle class="sc-b2" cx="168" cy="169" r="3.4" fill="#3b82f6"/><circle class="sc-b1" cx="186" cy="169" r="3.4" fill="#e8b923"/>
</svg>`;

// ---------------------------------------------------------------------------------------------------
// 4. The Death Star under construction: "Deploying to production…"
const GIRDERS = Array.from({ length: 5 }, (_, i) => `M${70 + i * 14} 100 L${90 + i * 14} 170`).join(' ');
const DEATH_STAR = `
<svg viewBox="0 0 300 200" role="img" aria-label="A Death Star under construction">
  <defs><clipPath id="sc-ds"><circle cx="150" cy="96" r="70"/></clipPath></defs>
  <ellipse cx="150" cy="112" rx="146" ry="88" fill="#e8e6e0"/>
  <ellipse cx="150" cy="176" rx="86" ry="7" fill="rgba(20,24,28,.12)"/>
  <circle cx="150" cy="96" r="70" fill="#dfe2e4"/>
  <g clip-path="url(#sc-ds)">
    <!-- the finished shell -->
    <path d="M70 26 H230 V96 H70 Z" fill="#e4e7e9"/>
    <path d="M70 44 H230 M70 62 H230 M70 80 H230 M96 26 V96 M126 26 V96 M156 26 V96 M186 26 V96 M210 26 V96" stroke="#bcc3c8" stroke-width="1.2"/>
    <path d="M150 96 H230 V170 H150 Z" fill="#dde0e3"/>
    <path d="M150 114 H230 M150 132 H230 M150 150 H230 M180 96 V170 M208 96 V170" stroke="#bcc3c8" stroke-width="1.2"/>
    <!-- the unfinished part: bare girders -->
    <path d="M70 96 H150 V170 H70 Z" fill="#b9c1c7"/>
    <path d="${GIRDERS}" stroke="#7f8a92" stroke-width="1.6"/>
    <path d="M70 118 H150 M70 140 H150 M70 160 H150" stroke="#7f8a92" stroke-width="1.6"/>
    <rect class="sc-panel p1" x="70" y="96" width="26" height="22" fill="#e4e7e9" stroke="#bcc3c8"/>
    <rect class="sc-panel p2" x="96" y="96" width="27" height="22" fill="#e4e7e9" stroke="#bcc3c8"/>
    <rect class="sc-panel p3" x="123" y="96" width="27" height="22" fill="#e4e7e9" stroke="#bcc3c8"/>
    <rect class="sc-panel p4" x="70" y="118" width="26" height="22" fill="#e4e7e9" stroke="#bcc3c8"/>
    <rect class="sc-panel p5" x="96" y="118" width="27" height="22" fill="#e4e7e9" stroke="#bcc3c8"/>
    <rect class="sc-panel p6" x="123" y="118" width="27" height="22" fill="#e4e7e9" stroke="#bcc3c8"/>
    <rect class="sc-panel p7" x="70" y="140" width="40" height="22" fill="#e4e7e9" stroke="#bcc3c8"/>
    <rect class="sc-panel p8" x="110" y="140" width="40" height="22" fill="#e4e7e9" stroke="#bcc3c8"/>
  </g>
  <path d="M80 96 H220" stroke="#7f8a92" stroke-width="4"/><path d="M84 96 H216" stroke="#cfd4d8" stroke-width="1.2"/>
  <!-- the superlaser dish -->
  <circle cx="190" cy="58" r="19" fill="#d3d8dc" stroke="${EDGE}" stroke-width="1.5"/><circle cx="190" cy="58" r="13" fill="#c2c9ce" stroke="${EDGE}" stroke-width="1"/><circle cx="190" cy="58" r="7" fill="#aab1b6" stroke="${EDGE}" stroke-width="1"/><circle cx="190" cy="58" r="2.6" fill="#7f8a92"/>
  <circle cx="150" cy="96" r="70" fill="none" stroke="${EDGE}" stroke-width="1.6"/>
  <!-- gantry crane -->
  <path d="M22 178 V84 M42 178 V84 M22 104 L42 124 M22 124 L42 144 M22 144 L42 164 M22 164 L42 178" stroke="#d98a00" stroke-width="3" fill="none" stroke-linejoin="round"/>
  <g class="sc-crane"><path d="M42 84 L110 92" stroke="#d98a00" stroke-width="4.5" stroke-linecap="round"/><path d="M42 84 L56 72 L72 90" stroke="#d98a00" stroke-width="2.2" fill="none" stroke-linejoin="round"/><path class="sc-rope" d="M104 93 V106" stroke="#7f8a92" stroke-width="1.4"/><rect class="sc-load" x="92" y="106" width="24" height="12" fill="#e4e7e9" stroke="${EDGE}" stroke-width="1"/></g>
  <circle class="sc-spark a" cx="124" cy="132" r="3.4" fill="#ffd05a"/><circle class="sc-spark b" cx="86" cy="142" r="3" fill="#ffd05a"/>
  <!-- a Star Destroyer drifting by -->
  <g class="sc-sd"><path d="M0 0 L46 -6 L46 6 Z" fill="#cfd4d8" stroke="${EDGE}" stroke-width="1" stroke-linejoin="round"/><path d="M30 -3 H44 M30 0 H44 M30 3 H44" stroke="#aab1b6" stroke-width=".8"/><rect x="34" y="-9" width="8" height="5" fill="#bcc3c8" stroke="${EDGE}" stroke-width=".8"/><rect x="36" y="-12" width="4" height="3" fill="#aab1b6" stroke="${EDGE}" stroke-width=".7"/><path d="M46 -3 L50 -3 M46 3 L50 3" stroke="#7fb4ff" stroke-width="2" stroke-linecap="round"/></g>
  <!-- progress -->
  <rect x="64" y="186" width="172" height="6" rx="3" fill="#d3d8dc"/>
  <rect class="sc-bar" x="64" y="186" width="172" height="6" rx="3" fill="#0f8f86"/>
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
