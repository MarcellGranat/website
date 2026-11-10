// One flat-style scene per stop on the stack page, drawn like the fleet on the home page: no frame, pale
// shapes with thin grey outlines floating on the page. Plain inline SVG, animated with CSS (see the
// "scenes" block in stack.css); the animation runs once the stop has scrolled into view.
const EDGE = '#8c939a';
const SKIN = '#e8b896';
const f = (n) => Math.round(n * 10) / 10;

// A face detail kit: eyes with a little white, pupils, brows. All drawn around (x, y).
const eyes = (x, y, gap, iris = '#4a6f94', r = 2.1) => [-1, 1].map((s) => `<ellipse cx="${f(x + s * gap)}" cy="${y}" rx="3.3" ry="2.3" fill="#fff"/><circle cx="${f(x + s * gap + 0.4)}" cy="${y + 0.2}" r="${r}" fill="${iris}"/><circle cx="${f(x + s * gap + 0.4)}" cy="${y + 0.2}" r="1" fill="#14181c"/>`).join('');

// ---------------------------------------------------------------------------------------------------
// shaggy fur: short tapered strokes, deterministic
const fur = (x0, x1, y0, y1, n, color, w = 2) => `<path d="${Array.from({ length: n }, (_, i) => {
  const x = x0 + (((i * 53) % 97) / 97) * (x1 - x0), y = y0 + (((i * 31 + 7) % 89) / 89) * (y1 - y0);
  const l = 8 + ((i * 7) % 9), d = ((i * 13) % 9) - 4;
  return `M${f(x)} ${f(y)} Q${f(x + d)} ${f(y + l / 2)} ${f(x + d * 1.6)} ${f(y + l)}`;
}).join(' ')}" stroke="${color}" stroke-width="${w}" stroke-linecap="round" fill="none"/>`;

// 1. Han and Chewbacca in the Falcon's cockpit (after the film still): "Chewy, start the hyper engine"
const switches = Array.from({ length: 3 * 8 }, (_, i) => {
  const r = Math.floor(i / 8), c = i % 8, col = ['#d9473b', '#e8b923', '#f4f1ea', '#3b82f6', '#2a2b31'][(i * 3 + r) % 5];
  return `<rect class="sc-sw" x="${182 + c * 13}" y="${15 + r * 9}" width="8" height="5" rx="1" fill="${col}"/>`;
}).join('');
const FALCON = `
<svg viewBox="0 0 300 200" role="img" aria-label="Han Solo and Chewbacca in the cockpit of the Millennium Falcon">
  <ellipse cx="150" cy="112" rx="146" ry="88" fill="#efe5d0"/>
  <g class="sc-rumble">
  <!-- the bulkhead door with the green engine lights -->
  <path d="M126 36 H174 L202 64 V118 L174 146 H126 L98 118 V64 Z" fill="#d6c8aa" stroke="#9a8f78" stroke-width="1.4" stroke-linejoin="round"/>
  <path d="M130 48 H170 L190 68 V114 L170 134 H130 L110 114 V68 Z" fill="#9c9278" stroke="#7d745e" stroke-width="1.2" stroke-linejoin="round"/>
  <g class="sc-gl">${[0, 1, 2, 3, 4].map((i) => `<rect class="g${i}" x="${116 + i * 15}" y="84" width="11" height="11" rx="2" fill="#a8f09a" stroke="#5a8f4e" stroke-width="1"/><circle cx="${121.5 + i * 15}" cy="89.5" r="3" fill="#2d3a28"/>`).join('')}</g>
  <path d="M126 36 L98 64 M174 36 L202 64 M98 118 L126 146 M202 118 L174 146" stroke="#b9ab8d" stroke-width="1.2"/>
  <!-- overhead switch panel -->
  <rect x="176" y="8" width="116" height="38" rx="5" fill="#c4cace" stroke="${EDGE}" stroke-width="1.2"/>${switches}
  <!-- Chewbacca: near-black brown fur, hair hanging over the face, grey nose, bandolier with silver pouches -->
  <g class="sc-chew">
    <path d="M6 200 Q4 130 50 117 Q78 112 106 117 Q150 130 148 200 Z" fill="#3b2818"/>
    ${fur(12, 140, 124, 188, 34, '#6a4830', 2.2)}${fur(14, 138, 130, 190, 20, '#241509', 2)}
    <g transform="translate(26 128) rotate(34)"><rect x="0" y="-5" width="122" height="10" rx="5" fill="#4a2420"/>${[0, 1, 2, 3].map((i) => `<rect x="${16 + i * 26}" y="-8" width="14" height="16" rx="1.6" fill="#b3b7bc" stroke="#6b7078" stroke-width="1"/><path d="M${19 + i * 26} -3 H${27 + i * 26} M${19 + i * 26} 1 H${27 + i * 26}" stroke="#7d848b" stroke-width="1"/>`).join('')}</g>
    <g class="sc-chew-head">
      <path d="M32 80 Q28 40 78 30 Q128 40 124 80 L128 100 L120 104 L124 124 L112 120 L110 138 L100 128 L94 146 L84 130 L74 148 L66 130 L56 142 L52 126 L42 130 L42 114 L30 108 L38 98 Z" fill="#3b2818"/>
      <path d="M45 74 Q49 48 78 46 Q107 48 111 74 Q113 92 101 108 Q78 118 55 108 Q43 92 45 74 Z" fill="#6e4a30"/>
      <ellipse cx="78" cy="104" rx="21" ry="13" fill="#96704c"/>
      <path d="M58 52 Q55 66 59 80 M68 48 Q65 66 70 84 M79 47 Q81 66 78 86 M90 48 Q94 64 91 82 M101 52 Q104 64 99 78" stroke="#3b2818" stroke-width="5" stroke-linecap="round" fill="none"/>
      <path d="M64 50 Q62 64 65 76 M85 48 Q86 62 84 74 M96 50 Q99 60 96 70" stroke="#2a1a0e" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M52 78 Q62 70 72 78 M84 78 Q94 70 104 78" stroke="#2a1a0e" stroke-width="4" fill="none" stroke-linecap="round"/>
      <path d="M56 85 Q63 80 71 85 M85 85 Q93 80 100 85" stroke="#140a04" stroke-width="2.6" fill="none" stroke-linecap="round"/>
      <ellipse cx="78" cy="96" rx="9.5" ry="7" fill="#55514e"/><ellipse cx="75" cy="93" rx="3.4" ry="1.9" fill="#8a8680"/><path d="M72 99 Q74 101 76 99 M80 99 Q82 101 84 99" stroke="#2c2a29" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      <path class="sc-smile" d="M66 108 Q78 115 90 108" stroke="#5a2d2a" stroke-width="2" fill="none" stroke-linecap="round"/>
      <g class="sc-roar"><path d="M64 106 Q78 103 92 106 Q90 122 78 124 Q66 122 64 106 Z" fill="#3a1d12"/><path d="M66 106 Q78 104 90 106 L88 111 Q78 108 68 111 Z" fill="#f4efe6"/><path d="M71 120 Q78 114 85 120 Q78 125 71 120 Z" fill="#d9626a"/></g>
      <path d="M52 112 L48 140 L60 122 L64 150 L74 126 L80 154 L88 126 L96 150 L100 122 L112 140 L106 112 Z" fill="#8a6446"/>
      <path d="M58 118 L56 134 M70 124 L70 144 M84 126 L84 146 M98 124 L100 140" stroke="#5a3d26" stroke-width="2.2" stroke-linecap="round"/>
    </g>
  </g>
  <!-- Han: tousled brown hair, big grin, cream shirt open over a black vest -->
  <g class="sc-han">
    <path d="M166 200 Q168 134 225 126 Q282 134 284 200 Z" fill="#e8dfc8"/>
    <path d="M178 150 Q186 160 192 176 M272 150 Q264 160 258 176" stroke="#cfc5aa" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M168 200 Q170 140 196 130 L208 200 Z M282 200 Q280 140 254 130 L242 200 Z" fill="#24242a"/>
    <path d="M208 126 L225 170 L242 126 Z" fill="#d6a07a"/>
    <path d="M198 122 L212 106 L224 142 Z M252 122 L238 106 L226 142 Z" fill="#f1e8d2" stroke="#cfc5aa" stroke-width="1"/>
    <rect x="213" y="104" width="24" height="24" fill="#d9a07c"/>
    <ellipse cx="200" cy="88" rx="4" ry="6.5" fill="#dca682"/><ellipse cx="250" cy="88" rx="4" ry="6.5" fill="#dca682"/>
    <path d="M201 84 Q199 62 225 60 Q251 62 249 84 Q251 104 239 113 Q225 122 211 113 Q199 104 201 84 Z" fill="#e9b690"/>
    <path d="M198 84 Q190 50 224 48 Q258 48 252 82 Q250 66 240 62 Q232 70 218 64 Q204 68 198 84 Z" fill="#7a5232"/>
    <path d="M212 54 L206 44 L220 52 M226 52 L228 41 L236 52 M240 56 L250 47 L248 60" stroke="#7a5232" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <path d="M201 82 Q200 92 202 98 M249 82 Q250 92 248 98" stroke="#7a5232" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    ${eyes(225, 82, 10, '#7f9570', 2)}
    <path d="M205 77 Q212 73 220 76 M231 75 Q239 71 246 76" stroke="#5a3b22" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M214 87 Q212 90 208 89 M236 87 Q238 90 242 89" stroke="#c48c6a" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <path d="M226 84 Q222 94 227 96" stroke="#c48c6a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path class="sc-grin" d="M211 101 Q225 114 241 99 Q226 106 211 101 Z" fill="#fff" stroke="#8a4a3a" stroke-width="1.5" stroke-linejoin="round"/>
    <path d="M208 98 Q207 106 213 110 M244 98 Q245 106 239 110" stroke="#cf9a78" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <g class="sc-han-arm"><path d="M196 62 V44" stroke="#8c939a" stroke-width="3" stroke-linecap="round"/><path d="M204 150 L190 122 L196 78" stroke="#e8dfc8" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" fill="none"/><path d="M193 104 L201 106" stroke="#cfc5aa" stroke-width="1.3" stroke-linecap="round"/><circle cx="196" cy="72" r="6" fill="#dca682"/><circle cx="196" cy="62" r="3.4" fill="#d9473b"/></g>
  </g>
  </g>
  <!-- console with two chrome knobs -->
  <path d="M30 200 L44 170 Q150 158 256 170 L270 200 Z" fill="#b4bbc0" stroke="${EDGE}" stroke-width="1.3" stroke-linejoin="round"/>
  <path d="M44 170 Q150 158 256 170" fill="none" stroke="#d3d8dc" stroke-width="4"/>
  <rect x="112" y="164" width="9" height="20" rx="2" fill="#c6cbd0" stroke="${EDGE}" stroke-width="1"/><rect x="126" y="168" width="9" height="16" rx="2" fill="#c6cbd0" stroke="${EDGE}" stroke-width="1"/>
  <ellipse cx="154" cy="182" rx="12" ry="5" fill="#c6cbd0" stroke="${EDGE}" stroke-width="1"/>
  <g class="sc-lights"><circle cx="70" cy="184" r="3.4" fill="#e8b923"/><circle cx="84" cy="188" r="3.4" fill="#22a65a"/><circle cx="216" cy="188" r="3.4" fill="#d9473b"/><circle cx="230" cy="184" r="3.4" fill="#3b82f6"/></g>
</svg>`;

// ---------------------------------------------------------------------------------------------------
// 2. Palpatine and Anakin in the opera box (after the film still): "The dark side of the Force is a pathway to many abilities some consider to be unnatural"
const OPERA = `
<svg viewBox="0 0 300 200" role="img" aria-label="Chancellor Palpatine talking to Anakin Skywalker in the opera box">
  <ellipse cx="150" cy="112" rx="146" ry="88" fill="#e6e1ec"/>
  <path d="M14 20 Q64 40 50 130 L50 170 L14 170 Z M286 20 Q236 40 250 130 L250 170 L286 170 Z" fill="#c9bdd6" stroke="#a899b8" stroke-width="1.2"/>
  <path d="M30 24 Q44 74 36 166 M270 24 Q256 74 264 166" stroke="#a899b8" stroke-width="1.4" fill="none"/>
  <path d="M60 150 Q150 96 240 150" fill="none" stroke="#cfc6dc" stroke-width="10" stroke-linecap="round"/>
  <circle cx="150" cy="56" r="34" fill="#d3e8f3" stroke="#9fc3d6" stroke-width="1.4"/>
  <path d="M128 40 Q136 30 146 34" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".9"/>
  <g class="sc-squid"><path d="M143 52 Q143 40 150 40 Q157 40 157 52 Q159 60 156 64 Q162 70 159 78 M145 64 Q138 70 141 78 M150 66 Q148 76 151 82 M154 66 Q156 76 153 82" stroke="#8fb8d0" stroke-width="3.6" stroke-linecap="round" fill="none"/><circle cx="147" cy="50" r="1.2" fill="#14181c"/><circle cx="153" cy="50" r="1.2" fill="#14181c"/></g>
  <!-- Palpatine: three-quarter view, white hair swept back, long pale wrinkled face, high dark collar -->
  <g class="sc-palp">
    <path d="M28 192 Q26 140 78 128 Q124 124 156 152 L162 192 Z" fill="#1f1b23"/>
    <path d="M60 130 L68 100 L88 124 L106 108 L120 130 L92 152 Z" fill="#2c2630" stroke="#15121a" stroke-width="1"/>
    <path d="M80 104 L80 126 Q94 134 108 126 L108 102 Z" fill="#cdb8a3"/>
    <path d="M66 72 Q64 40 96 34 Q126 36 128 64 Q130 74 126 80 Q134 84 137 90 Q133 95 126 95 Q128 102 120 108 Q112 116 98 116 Q78 114 71 98 Q66 86 66 72 Z" fill="#dccab6"/>
    <path d="M64 74 Q58 40 96 28 Q128 30 130 62 Q120 48 104 47 Q86 46 74 60 Q70 66 64 74 Z" fill="#e8e5e0"/>
    <path d="M66 66 Q60 82 68 96 Q70 80 76 68 Z" fill="#e1ded8"/>
    <ellipse cx="73" cy="82" rx="4" ry="7" fill="#d1bca8"/>
    <path d="M80 58 Q98 50 118 58 M82 53 Q98 46 116 53" stroke="#cfc8c0" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M82 66 Q98 61 116 66 M84 70 Q98 66 114 70" stroke="#c4ad98" stroke-width="1.1" fill="none"/>
    <path d="M85 74 Q92 70 98 74 L98 79 Q91 81 85 79 Z M107 73 Q113 70 118 74 L117 78 Q112 80 107 78 Z" fill="#f4eee6"/>
    <path d="M84 73 Q92 68 99 73 M106 72 Q113 68 119 73" stroke="#5a4638" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <circle cx="94" cy="76" r="1.9" fill="#5b88a8"/><circle cx="113" cy="75" r="1.7" fill="#5b88a8"/><circle cx="94.4" cy="76" r=".9" fill="#14181c"/><circle cx="113.4" cy="75" r=".9" fill="#14181c"/>
    <path d="M85 82 Q92 86 99 82 M107 81 Q113 84 118 81" stroke="#b99f8a" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M82 66 Q90 62 99 65 M107 64 Q114 61 122 65" stroke="#b8aca0" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M104 78 Q103 88 100 92 Q108 96 114 92" stroke="#c4ab96" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M76 92 Q76 102 86 108 M122 98 Q118 104 112 108" stroke="#c4ab96" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path class="sc-palp-mouth" d="M94 101 Q108 106 122 99" stroke="#7a4a44" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <circle cx="80" cy="90" r="1" fill="#c4ab96"/><circle cx="119" cy="88" r="1" fill="#c4ab96"/>
  </g>
  <!-- Anakin: seen from behind, turned towards Palpatine, thick wavy hair -->
  <g class="sc-ani">
    <path d="M158 192 Q158 142 214 132 Q268 142 270 192 Z" fill="#7d5f3d"/>
    <path d="M194 132 L214 154 L236 130 Z" fill="#dcc79c"/>
    <path d="M168 160 Q186 142 196 128 M268 160 Q246 142 238 128" stroke="#5e472c" stroke-width="2" fill="none"/>
    <rect x="203" y="108" width="24" height="26" fill="#d9a07c"/>
    <path d="M204 72 Q192 70 190 76 L184 82 L190 86 L188 93 Q190 99 196 101 L206 110 Q218 110 224 98 L228 74 Z" fill="#e8b896"/>
    <ellipse cx="226" cy="94" rx="5" ry="8" fill="#dca682"/>
    <path d="M200 52 Q232 30 258 58 Q268 84 258 112 Q252 126 240 130 Q236 118 226 112 Q214 96 210 76 Z" fill="#6b4528"/>
    ${[[212, 46], [228, 40], [244, 44], [256, 56], [262, 72], [262, 90], [258, 108], [252, 122], [244, 130], [236, 124]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="8" fill="#6b4528"/>`).join('')}
    <path d="M190 68 Q186 46 212 40 Q196 52 198 70 Q194 72 190 68 Z" fill="#6b4528"/>
    <path d="M214 50 Q228 42 244 50 M224 70 Q240 62 254 72 M232 94 Q246 88 256 98 M240 116 Q246 112 250 120" stroke="#8a6038" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M196 62 Q200 70 208 70" stroke="#6b4528" stroke-width="5" stroke-linecap="round" fill="none"/>
    <path d="M192 74 Q198 70 204 73" stroke="#4a2e1a" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M193 79 Q198 76 203 79 Q198 83 193 79 Z" fill="#fff"/><circle cx="196" cy="79" r="1.9" fill="#4a7ab0"/><circle cx="195.6" cy="79" r=".9" fill="#14181c"/>
    <path d="M187 90 Q190 92 194 91" stroke="#8a4a3a" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  </g>
  <g class="sc-ai"><path d="M146 114 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 Z" fill="#7ee0ff" stroke="#3aa7cf" stroke-width="1"/><circle cx="164" cy="110" r="2.4" fill="#7ee0ff"/><circle cx="130" cy="134" r="2" fill="#7ee0ff"/></g>
  <rect x="22" y="162" width="256" height="9" rx="4" fill="#cdbfdc" stroke="#a899b8" stroke-width="1.2"/>
  <rect x="26" y="171" width="248" height="26" rx="4" fill="#b9a8cc" stroke="#9a88b0" stroke-width="1.2"/>
  <path d="M60 174 V194 M100 174 V194 M140 174 V194 M180 174 V194 M220 174 V194 M260 174 V194" stroke="#a592ba" stroke-width="2"/>
</svg>`;

// ---------------------------------------------------------------------------------------------------
// 3. Anakin and Obi-Wan, each in their own Jedi starfighter (headset after the film still): "This is where the fun begins"
const brass = '#c9a85a';
const ship = (hull, hullLight, pilot) => `
    <path d="M12 164 L94 148 L178 164 L164 174 L94 168 L26 174 Z" fill="${hull}" stroke="${EDGE}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M52 154 Q56 130 94 128 Q132 130 136 154 Z" fill="${hullLight}" stroke="${EDGE}" stroke-width="1.2"/>
    <path d="M56 154 Q58 138 94 136" stroke="#fff" stroke-width="1.6" fill="none" opacity=".6"/>
    ${pilot}
    <path d="M52 138 Q52 76 94 72 Q136 76 136 138 Z" fill="#cfe0ee" opacity=".16"/>
    <path d="M52 138 Q52 76 94 72 Q136 76 136 138" fill="none" stroke="#f4f6f7" stroke-width="5"/>
    <path d="M52 138 Q52 76 94 72 Q136 76 136 138" fill="none" stroke="${EDGE}" stroke-width="1.2"/>
    <rect x="44" y="136" width="100" height="14" rx="5" fill="${hullLight}" stroke="${EDGE}" stroke-width="1.2"/>
    <circle cx="14" cy="164" r="3" fill="#d9473b"/><circle cx="178" cy="164" r="3" fill="#d9473b"/>`;
const ANAKIN_PILOT = `
    <path d="M62 140 Q64 118 94 116 Q124 118 126 140 Z" fill="#7d5f3d"/>
    <path d="M80 118 L94 134 L108 118 Z" fill="#dcc79c"/>
    <rect x="87" y="104" width="14" height="14" fill="#d9a07c"/>
    <path d="M70 100 Q64 78 92 76 Q118 78 116 100 L122 122 Q112 112 112 106 L76 106 Q76 112 68 122 Z" fill="#7a4a2a"/>
    <path d="M76 102 Q76 120 92 122 Q110 120 110 100 Q112 82 92 80 Q74 82 76 102 Z" fill="${SKIN}"/>
    <path d="M74 90 Q74 72 94 72 Q114 74 112 92 Q106 80 98 82 Q86 80 76 92 Z" fill="#7a4a2a"/>
    <path d="M80 82 Q86 76 92 80 Q86 78 82 86 M96 80 Q104 74 110 84 M108 96 Q116 100 112 112 M74 98 Q70 108 76 114" stroke="#9a6236" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    ${[[80, 76], [90, 71], [100, 71], [110, 76], [69, 90], [67, 102], [70, 114], [117, 90], [121, 102], [118, 114]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="6.5" fill="#7a4a2a"/>`).join('')}
    <path d="M80 82 Q86 76 92 80 Q86 78 82 86 M96 80 Q104 74 110 84" stroke="#9a6236" stroke-width="2.4" stroke-linecap="round" fill="none"/>
    <path d="M72 88 H112 a3 3 0 0 1 0 5 H72 Z" fill="${brass}" stroke="#8a7236" stroke-width="1"/><path d="M80 90.5 H104 M98 88 V93" stroke="#8a7236" stroke-width="1" stroke-linecap="round"/>
    <path d="M72 88 V108" stroke="${brass}" stroke-width="3" stroke-linecap="round"/><path d="M72 106 Q70 120 86 124" stroke="${brass}" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="87" cy="124" r="2.6" fill="${brass}" stroke="#8a7236" stroke-width=".8"/>
    ${eyes(93, 100, 8.5, '#6a8aa0', 1.9)}
    <path d="M80 94 Q86 90 91 94 M96 94 Q101 90 107 94" stroke="#5a3a20" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M94 102 Q92 108 96 108" stroke="#c48c6a" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path class="sc-grin" d="M86 114 Q94 119 103 112 Q94 116 86 114 Z" fill="#fff" stroke="#8a4a3a" stroke-width="1.4" stroke-linejoin="round"/>`;
const OBI_PILOT = `
    <path d="M62 140 Q64 118 94 116 Q124 118 126 140 Z" fill="#c8a36e"/>
    <path d="M62 140 Q64 124 76 120 L82 140 Z M126 140 Q124 124 112 120 L106 140 Z" fill="#7a5a38"/>
    <path d="M82 118 L94 134 L106 118 Z" fill="#e6d4ac"/>
    <rect x="87" y="104" width="14" height="14" fill="#d9a07c"/>
    <path d="M76 100 Q76 120 94 122 Q112 120 112 100 Q114 80 94 78 Q74 80 76 100 Z" fill="${SKIN}"/>
    <path d="M76 100 Q76 120 94 122 Q112 120 112 100 Q108 108 102 110 Q94 106 86 110 Q80 108 76 100 Z" fill="#b8733f"/>
    <path d="M86 112 Q94 108 102 112 Q94 116 86 112 Z" fill="#a8683a"/>
    <path d="M74 92 Q72 72 94 70 Q116 72 114 92 Q112 80 104 78 Q94 74 84 78 Q76 80 74 92 Z" fill="#b56a38"/>
    <path d="M80 78 Q94 70 108 78" stroke="#cc8450" stroke-width="2" fill="none" stroke-linecap="round"/>
    ${eyes(94, 95, 8, '#4a7ab0', 1.9)}
    <path d="M81 89 Q86 85 91 88 M97 88 Q102 85 107 89" stroke="#8a5a30" stroke-width="2" fill="none" stroke-linecap="round"/>
    <path d="M94 98 Q92 103 96 103" stroke="#c48c6a" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M88 109 Q94 110 100 109" stroke="#8a4a3a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M75 94 V106 Q75 118 86 122" stroke="#4a4f57" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="87" cy="122" r="2.2" fill="#4a4f57"/>`;
const FIGHTER = `
<svg viewBox="0 0 300 200" role="img" aria-label="Anakin Skywalker and Obi-Wan Kenobi, each in their own Jedi starfighter during the Battle of Coruscant">
  <defs><clipPath id="sc-sky"><ellipse cx="150" cy="106" rx="146" ry="92"/></clipPath></defs>
  <ellipse cx="150" cy="106" rx="146" ry="92" fill="#a9bbcc"/>
  <g clip-path="url(#sc-sky)">
    <g class="sc-fly">
      <path d="M30 40 h6 M84 30 h5 M130 60 h7 M180 34 h5 M226 52 h6 M62 80 h5 M168 96 h6 M262 78 h5 M12 104 h6 M330 40 h6 M384 30 h5 M430 60 h7 M480 34 h5 M526 52 h6 M362 80 h5 M468 96 h6 M562 78 h5 M312 104 h6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/>
    </g>
    <g class="sc-venator"><path d="M30 34 L122 46 L30 58 L46 46 Z" fill="#dfe5ea" stroke="${EDGE}" stroke-width="1"/><path d="M56 45 L100 46 M56 48 L100 47" stroke="#b6bec5" stroke-width="1"/><rect x="36" y="42" width="10" height="8" fill="#c9d0d6" stroke="${EDGE}" stroke-width=".8"/></g>
    <path d="M232 52 L268 64 M240 74 L274 84" stroke="#7de08a" stroke-width="2.4" stroke-linecap="round"/>
    <circle class="sc-boom a" cx="150" cy="52" r="10" fill="#ff9f3a"/><circle class="sc-boom b" cx="270" cy="110" r="8" fill="#ffd05a"/><circle class="sc-boom c" cx="22" cy="96" r="7" fill="#ff7a3a"/>
  </g>
  <g transform="translate(140 -4) scale(.8)"><g class="sc-shipB">${ship('#8fb0dc', '#b3cbe8', OBI_PILOT)}</g></g>
  <g transform="translate(0 12)"><g class="sc-shipA">${ship('#e9c75a', '#f1d97e', ANAKIN_PILOT)}</g></g>
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
  { svg: FALCON, lines: ['Chewy, start the hyper engine!'], hl: '#f3dca0' },
  { svg: OPERA, lines: ['The dark side of the Force is a pathway', 'to many abilities some consider', 'to be unnatural.'], hl: '#dccfe8' },
  { svg: FIGHTER, lines: ['This is where the fun begins.'], hl: '#bcd6ec' },
  { svg: DEATH_STAR, lines: ['Deploying to production…'], hl: '#bfe3dc' },
];

// The quote is part of the picture: italic lettering on a marker-style highlight, like a film subtitle.
const NS = 'http://www.w3.org/2000/svg';
const LH = 19;
function letter(svg, lines, hl) {
  const [, , w, h] = svg.getAttribute('viewBox').split(' ').map(Number);
  const top = h + 6;
  svg.setAttribute('viewBox', `0 0 ${w} ${top + lines.length * LH + 4}`);
  const g = document.createElementNS(NS, 'g');
  g.setAttribute('class', 'sc-text');
  g.setAttribute('aria-hidden', 'true');
  lines.forEach((line, i) => {
    const rect = document.createElementNS(NS, 'rect');
    rect.setAttribute('class', 'sc-hl');
    rect.setAttribute('fill', hl);
    const t = document.createElementNS(NS, 'text');
    t.setAttribute('x', String(w / 2));
    t.setAttribute('y', String(top + 14 + i * LH));
    t.setAttribute('text-anchor', 'middle');
    t.textContent = line;
    g.append(rect, t);
  });
  svg.appendChild(g);
  const fit = () => g.querySelectorAll('text').forEach((t, i) => {
    const b = t.getBBox(), r = g.querySelectorAll('rect')[i];
    r.setAttribute('x', String(b.x - 7)); r.setAttribute('y', String(b.y + 1));
    r.setAttribute('width', String(b.width + 14)); r.setAttribute('height', String(b.height - 1));
    r.setAttribute('rx', '5');
    r.setAttribute('transform', `rotate(${i % 2 ? .8 : -.8} ${w / 2} ${b.y + b.height / 2})`);
  });
  fit();
  document.fonts?.ready.then(fit);
}

export function mountScenes(root = document) {
  root.querySelectorAll('.route .stop').forEach((stop, i) => {
    const s = SCENES[i];
    if (!s) return;
    const fig = document.createElement('figure');
    fig.className = `scene scene-${i + 1}`;
    fig.innerHTML = `${s.svg}<figcaption class="sr-only">${s.lines.join(' ')}</figcaption>`;
    stop.insertBefore(fig, stop.querySelector('.kicker').nextSibling);
    letter(fig.querySelector('svg'), s.lines, s.hl);
  });
}
