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
      <path d="M51 78 Q62 72 73 75 M105 78 Q94 72 83 75" stroke="#2a1a0e" stroke-width="4.2" fill="none" stroke-linecap="round"/>
      <ellipse cx="63" cy="87" rx="5.6" ry="6.4" fill="#0e0a07"/><ellipse cx="93" cy="87" rx="5.6" ry="6.4" fill="#0e0a07"/>
      <circle cx="65" cy="84.6" r="1.7" fill="#fff"/><circle cx="95" cy="84.6" r="1.7" fill="#fff"/>
      <ellipse cx="78" cy="96" rx="9.5" ry="7" fill="#55514e"/><ellipse cx="75" cy="93" rx="3.4" ry="1.9" fill="#8a8680"/><path d="M72 99 Q74 101 76 99 M80 99 Q82 101 84 99" stroke="#2c2a29" stroke-width="1.2" fill="none" stroke-linecap="round"/>
      
      <g class="sc-roar"><path d="M64 106 Q78 103 92 106 Q90 122 78 124 Q66 122 64 106 Z" fill="#3a1d12"/><path d="M66 106 Q78 104 90 106 L88 111 Q78 108 68 111 Z" fill="#f4efe6"/><path d="M71 120 Q78 114 85 120 Q78 125 71 120 Z" fill="#d9626a"/></g>
      <path d="M52 112 L48 140 L60 122 L64 150 L74 126 L80 154 L88 126 L96 150 L100 122 L112 140 L106 112 Z" fill="#8a6446"/>
      <path d="M58 118 L56 134 M70 124 L70 144 M84 126 L84 146 M98 124 L100 140" stroke="#5a3d26" stroke-width="2.2" stroke-linecap="round"/>
    </g>
  </g>
  <!-- Han: tousled brown hair, big grin, cream shirt open over a black vest -->
  <g class="sc-han">
    <g style="transform-box: view-box" transform="translate(225 0) scale(.8 1) translate(-225 0)">
    <path d="M166 200 Q168 134 225 126 Q282 134 284 200 Z" fill="#e8dfc8"/>
    <path d="M178 150 Q186 160 192 176 M272 150 Q264 160 258 176" stroke="#cfc5aa" stroke-width="1.4" fill="none" stroke-linecap="round"/>

    <path d="M168 200 Q168 138 194 128 L214 132 L217 200 Z M282 200 Q282 138 256 128 L236 132 L233 200 Z" fill="#24242a"/>
    <path d="M225 140 V200" stroke="#cfc5aa" stroke-width="1.3"/><circle cx="225" cy="152" r="1.4" fill="#cfc5aa"/><circle cx="225" cy="166" r="1.4" fill="#cfc5aa"/><circle cx="225" cy="180" r="1.4" fill="#cfc5aa"/>
    </g>
    <g class="sc-han-arm"><path d="M196 60 V44" stroke="#8c939a" stroke-width="3" stroke-linecap="round"/>
      <path d="M198 146 L187 116" stroke="#24242a" stroke-width="17.5" stroke-linecap="round"/><path d="M187 116 L194 86" stroke="#24242a" stroke-width="11" stroke-linecap="round"/><circle cx="187" cy="116" r="8" fill="#24242a"/>
      <path d="M187 88 L199 84" stroke="#e8dfc8" stroke-width="8" stroke-linecap="round"/>
      <circle cx="194" cy="76" r="6" fill="#dca682"/><circle cx="196" cy="64" r="3.4" fill="#d9473b"/></g>
    <path d="M216 108 L216 126 Q225 132 234 126 L234 108 Z" fill="#d9a07c"/>
    <path d="M206 116 L212 98 L224 124 L221 134 Z M244 116 L238 98 L226 124 L229 134 Z" fill="#efe6cc" stroke="#cfc5aa" stroke-width="1" stroke-linejoin="round"/>
    <path d="M222 126 L225 136 L228 126 Z" fill="#d9a07c"/>
    <ellipse cx="200" cy="88" rx="4" ry="6.5" fill="#dca682"/><ellipse cx="250" cy="88" rx="4" ry="6.5" fill="#dca682"/>
    <path d="M201 84 Q199 62 225 60 Q251 62 249 84 Q251 104 239 113 Q225 122 211 113 Q199 104 201 84 Z" fill="#e9b690"/>
    <path d="M198 84 Q190 50 224 48 Q258 48 252 82 Q250 66 240 62 Q232 70 218 64 Q204 68 198 84 Z" fill="#7a5232"/>
    <path d="M240 60 Q254 66 252 84 Q250 70 240 66 Z" fill="#7a5232"/>
    <path d="M212 54 L206 44 L220 52 M226 52 L228 41 L236 52 M240 56 L250 47 L248 60" stroke="#7a5232" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    <ellipse cx="215" cy="82" rx="3.8" ry="3" fill="#fff"/><ellipse cx="235" cy="82" rx="3.8" ry="3" fill="#fff"/>
    <circle cx="213.4" cy="82" r="2.2" fill="#7f9570"/><circle cx="233.4" cy="82" r="2.2" fill="#7f9570"/><circle cx="213.2" cy="82" r="1.1" fill="#14181c"/><circle cx="233.2" cy="82" r="1.1" fill="#14181c"/>
    <path d="M206 75 L221 79 M244 75 L229 79" stroke="#5a3b22" stroke-width="2.8" fill="none" stroke-linecap="round"/>
    <path d="M222 70 L226 72 M228 71 L232 69" stroke="#cf9a78" stroke-width="1.1" stroke-linecap="round"/>
    <path d="M214 87 Q212 90 208 89 M236 87 Q238 90 242 89" stroke="#c48c6a" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <path d="M226 84 Q222 94 227 96" stroke="#c48c6a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <g class="sc-grin"><path d="M218 102 Q225 100 232 102 Q231 109 225 109.5 Q219 109 218 102 Z" fill="#5a2220" stroke="#8a4a3a" stroke-width="1.2" stroke-linejoin="round"/><path d="M219.4 102.4 Q225 100.8 230.6 102.4 L230 105 Q225 103.6 220 105 Z" fill="#fff"/></g>
    <path d="M211 98 Q210 105 215 108 M241 98 Q242 105 236 108" stroke="#cf9a78" stroke-width="1.2" fill="none" stroke-linecap="round"/>
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
  <ellipse cx="150" cy="112" rx="146" ry="88" fill="#f8dccf"/>
  <path d="M14 20 Q64 40 50 130 L50 170 L14 170 Z M286 20 Q236 40 250 130 L250 170 L286 170 Z" fill="#e89a7a" stroke="#c4623f" stroke-width="1.2"/>
  <path d="M30 24 Q44 74 36 166 M270 24 Q256 74 264 166" stroke="#c4623f" stroke-width="1.4" fill="none"/>
  <path d="M60 150 Q150 96 240 150" fill="none" stroke="#f0b9a0" stroke-width="10" stroke-linecap="round"/>
  <circle cx="150" cy="56" r="34" fill="#d3e8f3" stroke="#9fc3d6" stroke-width="1.4"/>
  <path d="M128 40 Q136 30 146 34" stroke="#fff" stroke-width="2.6" stroke-linecap="round" fill="none" opacity=".9"/>
  <g class="sc-squid"><path d="M143 52 Q143 40 150 40 Q157 40 157 52 Q159 60 156 64 Q162 70 159 78 M145 64 Q138 70 141 78 M150 66 Q148 76 151 82 M154 66 Q156 76 153 82" stroke="#8fb8d0" stroke-width="3.6" stroke-linecap="round" fill="none"/><circle cx="147" cy="50" r="1.2" fill="#14181c"/><circle cx="153" cy="50" r="1.2" fill="#14181c"/></g>
  <!-- Palpatine: three-quarter view, white hair swept back, long pale wrinkled face, high dark collar -->
  <g class="sc-palp">
    <path d="M24 192 Q24 140 76 128 Q124 124 158 152 L164 192 Z" fill="#18141b"/>
    <path d="M46 150 Q30 70 92 22 Q150 56 146 118 Q130 132 96 130 Q60 132 46 150 Z" fill="#1d1822"/>
    <path d="M56 130 L62 98 L88 124 L108 104 L124 130 L92 152 Z" fill="#2c2630" stroke="#120f16" stroke-width="1"/>
    <path d="M84 128 L96 146 L108 128" stroke="#7a2630" stroke-width="2.2" fill="none"/>
    <path d="M80 104 L80 126 Q94 134 108 126 L108 102 Z" fill="#c5b0a0"/>
    <path d="M66 74 Q64 44 96 40 Q126 42 130 66 Q133 88 126 100 Q120 112 108 117 Q98 119 90 114 Q72 106 69 94 Q66 86 66 74 Z" fill="#d8c4b0"/>
    <path d="M66 72 Q62 42 96 34 Q128 36 130 62 Q120 50 104 49 Q86 48 74 60 Q70 66 66 72 Z" fill="#cfcbc6"/>
    <path d="M66 66 Q60 82 68 96 Q70 80 76 68 Z" fill="#c4c0ba"/>
    <ellipse cx="73" cy="82" rx="4" ry="7" fill="#cdb7a2"/>
    <path d="M80 58 Q98 51 118 58 M82 54 Q98 47 116 54" stroke="#b9b3ac" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M82 66 Q98 63 116 67 M84 70 Q98 67 114 71" stroke="#bda791" stroke-width="1.1" fill="none"/>
    <ellipse cx="92" cy="77" rx="9" ry="5.6" fill="#a08c7c" opacity=".55"/><ellipse cx="113" cy="76" rx="7.6" ry="5" fill="#a08c7c" opacity=".55"/>
    <path d="M85 77 Q92 73 99 77 Q92 82 85 77 Z M107 76 Q113 73 119 76 Q113 80 107 76 Z" fill="#efe8de"/>
    <circle cx="95" cy="77" r="2" fill="#7f9db0"/><circle cx="115" cy="76" r="1.8" fill="#7f9db0"/><circle cx="95.4" cy="77" r="1" fill="#0e0c10"/><circle cx="115.4" cy="76" r=".9" fill="#0e0c10"/>
    <path d="M84 75.4 Q92 71 100 76 M106 75 Q113 71 120 75.6" stroke="#2a2128" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M80 67 Q90 69 100 73 M123 66 Q113 67 106 72" stroke="#4a4048" stroke-width="2.6" fill="none" stroke-linecap="round"/>
    <path d="M85 83 Q92 87 99 83 M107 82 Q113 85 119 82" stroke="#a9917e" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <path d="M105 85 Q104 91 104.5 94 M110 86 Q111.5 91 111 94" stroke="#b59b86" stroke-width="1.4" fill="none" stroke-linecap="round"/><path d="M102.5 95.5 Q107 98 112.5 95.5" stroke="#8a7464" stroke-width="1.5" fill="none" stroke-linecap="round"/><path d="M103 95.5 Q101.5 96.8 100.6 96 M112 95.5 Q113.5 96.8 114.4 96" stroke="#8a7464" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <path d="M75 90 Q74 102 86 109 M126 94 Q124 104 114 111" stroke="#b59b86" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M86 90 Q90 100 98 104 M124 88 Q121 98 116 103" stroke="#b9a290" stroke-width="1.1" fill="none" stroke-linecap="round"/>
    <path class="sc-palp-mouth" d="M94 107 Q106 109 119 104 L121 102" stroke="#5a2f34" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M99 112 Q107 115 114 111" stroke="#a9917e" stroke-width="1.1" fill="none" stroke-linecap="round"/>
  </g>
  <!-- Anakin: seen from behind, turned towards Palpatine, thick wavy hair -->
  <g class="sc-ani">
    <path d="M158 192 Q158 130 214 120 Q268 130 270 192 Z" fill="#7d5f3d"/>
    <path d="M196 122 L214 148 L234 120 Z" fill="#dcc79c"/>
    <path d="M170 156 Q188 136 198 122 M266 156 Q246 136 236 120" stroke="#5e472c" stroke-width="2" fill="none"/>
    <path d="M207 104 L207 124 Q217 130 228 124 L228 104 Z" fill="#d9a07c"/>
    <path d="M194 72 Q194 42 222 40 Q252 42 252 72 Q256 90 250 106 L246 116 L240 104 L236 118 L230 98 Z" fill="#5b3a22"/>
    <ellipse cx="236" cy="90" rx="5" ry="8" fill="#dca682"/>
    <path d="M200 80 Q199 60 216 58 Q234 58 235 78 Q236 96 228 108 Q218 118 208 111 Q200 104 200 80 Z" fill="${SKIN}" stroke="#d09a78" stroke-width=".8" stroke-linejoin="round"/>
    <path d="M194 84 Q192 54 216 50 Q244 52 242 78 Q236 66 230 70 L226 62 L220 72 L214 62 L209 72 L204 64 L200 76 Z" fill="#5b3a22"/>
    <path d="M230 66 Q244 66 246 84 Q244 96 240 100 Q240 84 232 74 Z" fill="#5b3a22"/>
    <path d="M204 54 Q218 48 232 54 M236 62 Q246 70 244 84 M240 84 Q244 94 240 102" stroke="#7a5030" stroke-width="1.6" fill="none" stroke-linecap="round"/>
    <path d="M200 73 L211 69 M220 69 L231 73" stroke="#4a2e1a" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M202 85 Q207 79 213 83 Q208 90 202 85 Z M220 83 Q226 79 231 84 Q226 89 220 83 Z" fill="#fff"/>
    <circle cx="206" cy="85" r="1.9" fill="#4a7ab0"/><circle cx="224" cy="84" r="1.7" fill="#4a7ab0"/><circle cx="205.6" cy="85" r=".9" fill="#14181c"/><circle cx="223.6" cy="84" r=".8" fill="#14181c"/>
    <path d="M203 69 L205 77 M204 88 L205 96" stroke="#c9826a" stroke-width="1.6" stroke-linecap="round" fill="none"/>
    <path d="M214 87 Q213 92 212.4 94.6 M217 88 Q218 92 217.6 95" stroke="#c48c6a" stroke-width="1.2" fill="none" stroke-linecap="round"/><path d="M210.4 96 Q214.6 98.6 219 96" stroke="#a9745a" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M207 105 Q213 102.5 219 105 Q213 111 207 105 Z" fill="#5a2220" stroke="#8a4a3a" stroke-width=".9" stroke-linejoin="round"/>
  </g>
  <g class="sc-ai"><path d="M146 114 l3 9 9 3 -9 3 -3 9 -3 -9 -9 -3 9 -3 Z" fill="#7ee0ff" stroke="#3aa7cf" stroke-width="1"/><circle cx="164" cy="110" r="2.4" fill="#7ee0ff"/><circle cx="130" cy="134" r="2" fill="#7ee0ff"/></g>
  <rect x="22" y="162" width="256" height="9" rx="4" fill="#e8a283" stroke="#b9573a" stroke-width="1.2"/>
  <rect x="26" y="171" width="248" height="26" rx="4" fill="#d97757" stroke="#b9573a" stroke-width="1.2"/>
  <path d="M60 174 V194 M100 174 V194 M140 174 V194 M180 174 V194 M220 174 V194 M260 174 V194" stroke="#bd5f3f" stroke-width="2"/>
</svg>`;

// ---------------------------------------------------------------------------------------------------
// 3. Anakin and Obi-Wan, each in their own Jedi starfighter (headset after the film still): "This is where the fun begins"
const brass = '#c9a85a';
const m = (x) => 188 - x; // mirror about the ship's centre line
const wing = (x) => `M${x(68)} 140 L${x(26)} 134 L${x(14)} 158 L${x(70)} 166 Z`;
const ship = (orange, grey, pilot, droid) => `
    <path d="${wing((x) => x)}" fill="${grey}" stroke="${EDGE}" stroke-width="1.2" stroke-linejoin="round"/><path d="${wing(m)}" fill="${grey}" stroke="${EDGE}" stroke-width="1.2" stroke-linejoin="round"/>
    <path d="M60 146 L30 142 L24 154 L62 160 Z M128 146 L158 142 L164 154 L126 160 Z" fill="${orange}" stroke="#a8742a" stroke-width="1" stroke-linejoin="round"/>
    <path d="M14 150 L42 164 L38 174 L9 160 Z M174 150 L146 164 L150 174 L179 160 Z" fill="#4d545a" stroke="${EDGE}" stroke-width="1"/>
    <path d="M17 154 L40 166 M13 158 L36 170 M171 154 L148 166 M175 158 L152 170" stroke="#7b848b" stroke-width="1"/>
    <path d="M24 66 L34 62 L44 136 L26 142 Z M164 66 L154 62 L144 136 L162 142 Z" fill="${orange}" stroke="#a8742a" stroke-width="1" stroke-linejoin="round"/>
    <rect x="77" y="160" width="4.5" height="16" rx="1.5" fill="#4d545a"/><rect x="106.5" y="160" width="4.5" height="16" rx="1.5" fill="#4d545a"/>
    <ellipse cx="94" cy="150" rx="28" ry="20" fill="#858c92" stroke="${EDGE}" stroke-width="1.2"/>
    <path d="M84 142 H104 L112 150 L104 158 H84 L76 150 Z" fill="#6b7279" stroke="#4d545a" stroke-width="1"/><path d="M94 142 V158 M76 150 H112 M84 142 L104 158 M104 142 L84 158" stroke="#4d545a" stroke-width="1"/>
    ${droid ? '<g><path d="M126 130 Q126 116 136 116 Q146 116 146 130 Z" fill="#f4f6f7" stroke="#8c939a" stroke-width="1"/><path d="M130 124 H142" stroke="#3b82f6" stroke-width="3"/><circle cx="136" cy="119" r="2" fill="#3b82f6"/></g>' : ''}
    ${pilot}
    <path d="M52 140 Q52 76 94 72 Q136 76 136 140 Z" fill="#46505a" opacity=".22"/>
    <path d="M52 140 Q52 76 94 72 Q136 76 136 140" fill="none" stroke="#6b7279" stroke-width="5"/>
    <path d="M52 140 Q52 76 94 72 Q136 76 136 140" fill="none" stroke="#a3aab0" stroke-width="1.2"/>
    <path d="M60 132 Q60 88 80 80" stroke="#fff" stroke-width="2" fill="none" opacity=".55" stroke-linecap="round"/>`;
const ANAKIN_PILOT = `
    <path d="M62 140 Q64 118 94 116 Q124 118 126 140 Z" fill="#7d5f3d"/>
    <path d="M80 118 L94 134 L108 118 Z" fill="#dcc79c"/>
    <rect x="87" y="104" width="14" height="14" fill="#d9a07c"/>
    <path d="M72 108 Q66 76 92 72 Q120 72 118 102 L122 118 L114 112 L112 104 L74 104 L70 116 Z" fill="#5b3a22"/>
    <path d="M76 102 Q76 120 92 122 Q110 120 110 100 Q112 82 92 80 Q74 82 76 102 Z" fill="${SKIN}"/>
    <path d="M73 96 Q72 74 94 72 Q114 74 113 94 L110 94 Q108 82 98 80 L100 90 L92 82 L90 92 L84 84 L80 94 Z" fill="#5b3a22"/>
    <path d="M80 80 Q90 74 104 78 M76 92 Q76 84 80 80" stroke="#7a5030" stroke-width="1.8" fill="none" stroke-linecap="round"/>
    <path d="M72 88 H112 a3 3 0 0 1 0 5 H72 Z" fill="${brass}" stroke="#8a7236" stroke-width="1"/><path d="M80 90.5 H104 M98 88 V93" stroke="#8a7236" stroke-width="1" stroke-linecap="round"/>
    <path d="M72 88 V108" stroke="${brass}" stroke-width="3" stroke-linecap="round"/><path d="M72 106 Q70 120 86 124" stroke="${brass}" stroke-width="2.2" fill="none" stroke-linecap="round"/><circle cx="87" cy="124" r="2.6" fill="${brass}" stroke="#8a7236" stroke-width=".8"/>
    <path d="M83 100 Q88 96 93 100 Q88 105 83 100 Z M97 100 Q102 96 107 100 Q102 105 97 100 Z" fill="#fff"/>
    <circle cx="88" cy="100" r="2.6" fill="#4a6f94"/><circle cx="102" cy="100" r="2.6" fill="#4a6f94"/><circle cx="88" cy="100" r="1.2" fill="#14181c"/><circle cx="102" cy="100" r="1.2" fill="#14181c"/><circle cx="88.8" cy="99" r=".8" fill="#fff"/><circle cx="102.8" cy="99" r=".8" fill="#fff"/>
    <path d="M80 92 Q86 85 92 90 M97 90 Q103 85 109 92" stroke="#5a3a20" stroke-width="2.2" fill="none" stroke-linecap="round"/>
    <path d="M77 94 Q73 88 77 83 M112 94 Q116 88 112 83" stroke="#e8c04a" stroke-width="0" fill="none"/>
    <path d="M94 102 Q92 108 96 108" stroke="#c48c6a" stroke-width="1.3" fill="none" stroke-linecap="round"/>
    <g class="sc-grin"><path d="M87 111 Q94 109 101 111 Q100 123 94 124 Q88 123 87 111 Z" fill="#4a1c1c" stroke="#8a4a3a" stroke-width="1.2" stroke-linejoin="round"/><path d="M88.4 111.4 Q94 109.8 99.6 111.4 L99 114.4 Q94 112.8 89 114.4 Z" fill="#fff"/><path d="M91 120.5 Q94 116.5 97 120.5 Q94 123.5 91 120.5 Z" fill="#d9626a"/></g>
    <g class="sc-shout" stroke="#e8a93a" stroke-width="2.2" stroke-linecap="round" fill="none"><path d="M64 88 L57 83 M62 98 L54 98 M64 108 L57 113"/><path d="M124 88 L131 83 M126 98 L134 98 M124 108 L131 113"/></g>
`;
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
  <g transform="translate(140 -4) scale(.8)"><g class="sc-shipB">${ship('#7ba3d6', '#a9b3bc', OBI_PILOT, false)}</g></g>
  <g transform="translate(0 12)"><g class="sc-shipA">${ship('#e8a93a', '#a9b3bc', ANAKIN_PILOT, true)}</g></g>
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
  { svg: FALCON, lines: ['Punch it, Chewie!'], hl: '#f3dca0' },
  { svg: OPERA, lines: ['The dark side of the Force is a pathway', 'to many abilities some consider', 'to be unnatural.'], hl: '#f6cdb8' },
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
