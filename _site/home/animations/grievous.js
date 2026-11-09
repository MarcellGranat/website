// General Grievous: scuttles along the underside of the top bar like a spider on four limbs and
// asks the kind of questions every data person has heard. Uses the shared Jedi walk/bubble code.
const TOOLS = ['DuckDB', 'Neovim', 'marimo', 'Quarto', 'uv', 'DVC', 'Herdr', 'lazygit', 'VisiData', 'yazi', 'just', 'Snakemake', 'television'];

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
    <path d="M85 42 L98 35 L111 42 L113 64 Q111 80 98 93 Q85 80 83 64 Z" fill="#e0dac8"/>
    <path d="M98 35 V56" stroke="${PLATE_DARK}" stroke-width="1.8"/>
    <path d="M85 42 L98 35 L111 42 L110 50 L98 44 L86 50 Z" fill="${PLATE_DARK}"/>
    <path d="M84 53 L97 61 L98 65 L85 58 Z M112 53 L99 61 L98 65 L111 58 Z" fill="${JOINT}"/>
    <ellipse cx="91.5" cy="67" rx="4.6" ry="4" fill="#e8b923"/><ellipse cx="104.5" cy="67" rx="4.6" ry="4" fill="#e8b923"/>
    <ellipse cx="91.5" cy="67" rx="1.2" ry="3.7" fill="#1a1a1a"/><ellipse cx="104.5" cy="67" rx="1.2" ry="3.7" fill="#1a1a1a"/>
    <path d="M98 68 V76" stroke="#8b8578" stroke-width="1.6" stroke-linecap="round"/>
    <path d="M85 68 Q88 82 98 91 M111 68 Q108 82 98 91" stroke="#8b8578" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <g class="gr-mouth"><path d="M93.5 79 V86 M98 80 V89 M102.5 79 V86" stroke="#5a5446" stroke-width="1.7" stroke-linecap="round"/></g>
  </g>
</svg>`;
