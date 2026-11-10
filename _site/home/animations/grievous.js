// General Grievous: scuttles along the underside of the top bar like a spider on four limbs and
// asks the kind of questions every data person has heard. Uses the shared Jedi walk/bubble code.
const TOOLS = ['DuckDB', 'Neovim', 'marimo', 'Quarto', 'uv', 'DVC', 'Herdr', 'lazygit', 'VisiData', 'yazi', 'Snakemake', 'television'];

const QUESTIONS = [
  'Do you have that chart in Excel?',
  '*cough* Can you send me the model as a screenshot?',
  'Can you just add AI to it?',
  'Why does the CSV not open in Word?',
  'Could you make the chart pop a bit more?',
  'Is the model 100% accurate? I need it 100% accurate.',
  'Can we get the whole dataset by tomorrow?',
  'Is Python the one with the macros?',
  '*cough* Can you make the logo bigger?',
  'Did you try turning the dataset off and on again?',
  '*cough* You performed better on the training set, Jedi!',
  'Just replace it with the mean, Jedi. It should be fine. *cough*',
  'Can the dashboard fit on one printed page?',
];

export const GRIEVOUS_QUOTES = [
  ...QUESTIONS,
  ...TOOLS.map((t) => `Ah, this ${t} was missing from my collection.`),
];

const PLATE = '#d2ccb9';
const PLATE_DARK = '#bdb6a3';
const JOINT = '#3a3228';

// A plated limb: upper arm, forearm, a dark joint and a claw hooking onto the top bar.
const limb = (cls, [sx, sy], [ex, ey], [hx, hy]) => `<g class="${cls}">
    <path d="M${sx} ${sy} L${ex} ${ey}" stroke="${PLATE}" stroke-width="7" stroke-linecap="round" fill="none"/>
    <path d="M${ex} ${ey} L${hx} ${hy}" stroke="${PLATE_DARK}" stroke-width="5.5" stroke-linecap="round" fill="none"/>
    <circle cx="${ex}" cy="${ey}" r="4.2" fill="${JOINT}"/>
    <path d="M${hx - 4.5} ${hy + 3} Q${hx} ${hy - 3} ${hx + 4.5} ${hy + 3}" stroke="${JOINT}" stroke-width="2.2" stroke-linecap="round" fill="none"/>
  </g>`;

// His collection: lightsaber hilts hanging from the belt.
const HILTS = [['#3b82f6', 54, 8], ['#22c55e', 60, 3], ['#a855f7', 66, -2], ['#eab308', 72, -7]]
  .map(([c, x, r]) => `<g transform="translate(${x} 57) rotate(${r})"><rect x="-1.9" y="0" width="3.8" height="10" rx="1" fill="#5d6269"/><rect x="-1.9" y="8" width="3.8" height="3.2" rx="1" fill="${c}"/></g>`).join('');

export const GRIEVOUS_SVG = `
<svg viewBox="0 0 140 120" class="yoda-svg" aria-hidden="true">
  <path d="M46 40 Q38 72 46 100 L53 88 L59 104 L66 90 L73 104 L79 88 L86 98 Q94 70 86 40 Z" fill="#2a2018"/>
  ${limb('gr-a', [54, 38], [32, 26], [22, 5])}
  ${limb('gr-b', [60, 34], [48, 18], [42, 5])}
  <ellipse cx="66" cy="44" rx="22" ry="16" fill="${PLATE}"/>
  <path d="M52 40 Q66 47 80 40 M53 46 Q66 53 79 46 M57 51 Q66 56 75 51 M66 30 V58" stroke="#7a725f" stroke-width="1.6" fill="none" stroke-linecap="round"/>
  <ellipse cx="66" cy="44" rx="5" ry="7.5" fill="${JOINT}"/>
  <rect x="48" y="55" width="36" height="4" rx="2" fill="${JOINT}"/>
  ${HILTS}
  ${limb('gr-c', [74, 34], [88, 18], [95, 5])}
  ${limb('gr-d', [80, 40], [102, 28], [116, 5])}
  <path d="M80 46 Q89 50 94 58" stroke="${JOINT}" stroke-width="6" stroke-linecap="round" fill="none"/>
  <g class="gr-head">
    <path d="M91 94 Q84 106 90 119 M105 94 Q112 106 106 119" stroke="#3a3228" stroke-width="4" stroke-linecap="round" fill="none"/>
    <path d="M79 25 Q68 44 70 58 Q73 76 90 95 Q84 72 85 56 Q86 40 79 25 Z" fill="#e8e2d0" stroke="#bdb6a3" stroke-width="1"/>
    <path d="M117 25 Q128 44 126 58 Q123 76 106 95 Q112 72 111 56 Q110 40 117 25 Z" fill="#e8e2d0" stroke="#bdb6a3" stroke-width="1"/>
    <path d="M86.5 38 Q88 23 98 22 Q108 23 109.5 38 L113.5 50 Q113.5 61 106 71 L103 98 Q98 108 93 98 L90 71 Q82.5 61 82.5 50 Z" fill="#e0dac8"/>
    <path d="M84 52 Q90 49 97 53 L96 60.5 Q90 63.5 85 59 Z M112 52 Q106 49 99 53 L100 60.5 Q106 63.5 111 59 Z" fill="#6b2a26"/>
    <ellipse cx="91" cy="56" rx="3.7" ry="2.5" fill="#e8b923"/><ellipse cx="105" cy="56" rx="3.7" ry="2.5" fill="#e8b923"/>
    <ellipse cx="91" cy="56" rx="1" ry="2.3" fill="#1a1a1a"/><ellipse cx="105" cy="56" rx="1" ry="2.3" fill="#1a1a1a"/>
    <path d="M93.5 28 V47 M102.5 28 V47" stroke="#1d1a17" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M85 49 Q91 46 97 50 M111 49 Q105 46 99 50" stroke="#a69f8d" stroke-width="1.4" fill="none" stroke-linecap="round"/>
    <path d="M98 64 V78" stroke="#a69f8d" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M89.5 70 Q92 88 94 98 M106.5 70 Q104 88 102 98" stroke="#b5ae9b" stroke-width="1.2" fill="none" stroke-linecap="round"/>
    <g class="gr-mouth"><rect x="93" y="79" width="10" height="14" rx="1.6" fill="#d3ccb8" stroke="#8b8578" stroke-width=".8"/><path d="M94.9 81 V91 M97.3 81 V91 M99.7 81 V91 M102.1 81 V91" stroke="#5a5446" stroke-width="1.1" stroke-linecap="round"/></g>
  </g>
</svg>`;
