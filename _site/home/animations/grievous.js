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

const limb = (cls, [sx, sy], [ex, ey], [hx, hy]) => `<g class="${cls}"><path d="M${sx} ${sy} L${ex} ${ey} L${hx} ${hy}" stroke="#d4d0c0" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" fill="none"/><circle cx="${ex}" cy="${ey}" r="3.6" fill="#8b877a"/><circle cx="${hx}" cy="${hy}" r="4" fill="#3a3d44"/></g>`;

export const GRIEVOUS_SVG = `
<svg viewBox="0 0 140 110" class="yoda-svg" aria-hidden="true">
  <path d="M46 40 Q40 70 48 92 L54 82 L60 96 L66 82 L74 96 L78 80 L84 90 Q90 66 86 40 Z" fill="#1c1e24"/>
  ${limb('gr-a', [52, 36], [32, 24], [22, 4])}
  ${limb('gr-b', [58, 32], [48, 16], [42, 4])}
  <ellipse cx="66" cy="42" rx="22" ry="15" fill="#2b2e35"/>
  <path d="M52 38 Q66 45 80 38 M53 43 Q66 50 79 43 M56 48 Q66 53 76 48" stroke="#cfcabb" stroke-width="1.8" fill="none" stroke-linecap="round"/>
  ${limb('gr-c', [76, 32], [88, 16], [94, 4])}
  ${limb('gr-d', [82, 38], [102, 26], [114, 4])}
  <path d="M80 46 Q91 50 95 56" stroke="#8b877a" stroke-width="6" stroke-linecap="round" fill="none"/>
  <g class="gr-head"><g transform="translate(98 48) scale(1.35) translate(-98 -48)">
    <path d="M85 62 Q85 46 98 46 Q111 46 111 62 Q111 74 104 84 Q98 88 92 84 Q85 74 85 62 Z" fill="#e6e1d0"/>
    <path d="M85 56 Q98 46 111 56 L105 62 Q98 58 91 62 Z" fill="#4a4d55"/>
    <circle cx="92.5" cy="64" r="4.2" fill="#e8b923"/><circle cx="103.5" cy="64" r="4.2" fill="#e8b923"/>
    <ellipse cx="92.5" cy="64" rx="1.2" ry="3.6" fill="#1a1a1a"/><ellipse cx="103.5" cy="64" rx="1.2" ry="3.6" fill="#1a1a1a"/>
    <path d="M98 66 L96.5 74 L99.5 74 Z" fill="#b9b4a2"/>
    <path d="M93 77 V84 M98 78 V86 M103 77 V84" stroke="#6b675a" stroke-width="1.4" stroke-linecap="round"/>
    <path d="M88 70 Q89 76 92 80 M108 70 Q107 76 104 80" stroke="#bdb8a6" stroke-width="1.2" fill="none" stroke-linecap="round"/>
  </g></g>
</svg>`;
