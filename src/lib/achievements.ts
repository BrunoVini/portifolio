/**
 * Easter-egg achievement tracker.
 *
 * Every egg calls `unlock(id)` exactly once per find. We store the set in
 * `localStorage["portifolio:achievements"]` and show a small HUD toast on
 * every unlock with the localized title. Threshold rewards (5 / 10 / all)
 * trigger site-wide flourishes so the user feels the score climb.
 *
 * The tracker is locale-aware via document.documentElement.lang.
 */
const KEY = 'portifolio:achievements';

type Locale = 'en' | 'pt';

type Title = { en: string; pt: string };

export const ACHIEVEMENTS: Record<string, Title> = {
  konami: { en: 'old-school cheat', pt: 'truque do videogame' },
  'rocket-roll': { en: 'barrel roll', pt: 'pirueta espacial' },
  'bruno-typed': { en: 'name dropper', pt: 'chamou pelo nome' },
  'sticky-7': { en: 'sticker collector', pt: 'colecionador de stickers' },
  'margin-secrets': { en: 'reading the margins', pt: 'lendo as margens' },
  'bug-squashed': { en: 'pest control', pt: 'dedetizador' },
  'bug-bandaid': { en: 'with care', pt: 'com cuidado' },
  'bug-ghost': { en: 'undead bug', pt: 'bug zumbi' },
  'bug-union': { en: 'they unionized', pt: 'eles se sindicalizaram' },
  'cheese-touched': { en: 'cheese touch!', pt: 'toque do queijo!' },
  zoowee: { en: 'ZOO-WEE-MAMA', pt: 'ZOO-WEE-MAMA' },
  manny: { en: 'PLOOPY!', pt: 'PLOOPY!' },
  'journal-corrected': { en: "it's a JOURNAL", pt: 'é um REGISTRO' },
  'loded-diper': { en: 'rock star', pt: 'astro do rock' },
  avengers: { en: 'assemble', pt: 'avante, vingadores' },
  snap: { en: "fine. I'll do it myself.", pt: 'tudo bem. eu faço.' },
  excelsior: { en: 'excelsior!', pt: 'excelsior!' },
  spidey: { en: 'thwip', pt: 'thwip' },
  'mjolnir-worthy': { en: 'worthy', pt: 'digno' },
  'mailto-confetti': { en: 'reach out', pt: 'puxar conversa' },
};

const TOTAL = Object.keys(ACHIEVEMENTS).length;

const readSet = (): Set<string> => {
  try {
    return new Set<string>(JSON.parse(localStorage.getItem(KEY) ?? '[]'));
  } catch {
    return new Set();
  }
};

const writeSet = (s: Set<string>) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.from(s)));
  } catch {
    /* noop */
  }
};

const getLocale = (): Locale => (document.documentElement.lang === 'pt' ? 'pt' : 'en');

const showToast = (id: string, found: number) => {
  const lang = getLocale();
  const title = ACHIEVEMENTS[id]?.[lang] ?? id;
  const counterText = lang === 'pt' ? 'encontrado' : 'found';
  const toast = document.createElement('div');
  toast.className = 'ach-toast';
  toast.innerHTML = `
    <span class="ach-icon" aria-hidden="true">🏆</span>
    <span class="ach-body">
      <strong>${title}</strong>
      <small>${found}/${TOTAL} ${counterText}</small>
    </span>`;
  document.body.appendChild(toast);
  toast.animate(
    [
      { opacity: 0, transform: 'translate(-50%, -10px)' },
      { opacity: 1, transform: 'translate(-50%, 0)', offset: 0.15 },
      { opacity: 1, transform: 'translate(-50%, 0)', offset: 0.85 },
      { opacity: 0, transform: 'translate(-50%, -10px)' },
    ],
    { duration: 2400, easing: 'cubic-bezier(0.4, 0, 0.2, 1)' },
  ).onfinish = () => toast.remove();
};

const triggerThresholdReward = (n: number) => {
  if (n === 5) {
    document.body.dataset.achievementsTier = '1';
  } else if (n === 10) {
    document.body.dataset.achievementsTier = '2';
    spawnTrophy('half-way');
  } else if (n === TOTAL) {
    document.body.dataset.achievementsTier = '3';
    spawnTrophy('completionist');
    document.body.classList.add('confetti-rain');
    setTimeout(() => document.body.classList.remove('confetti-rain'), 6000);
  }
};

const spawnTrophy = (variant: 'half-way' | 'completionist') => {
  if (document.querySelector(`.trophy.${variant}`)) return;
  const lang = getLocale();
  const text =
    variant === 'completionist'
      ? lang === 'pt'
        ? 'CAÇADOR DE OVOS DE PÁSCOA — 100%'
        : 'EASTER EGG HUNTER — 100%'
      : lang === 'pt'
        ? 'METADE DA SAGA'
        : 'HALFWAY THERE';
  const t = document.createElement('div');
  t.className = `trophy ${variant}`;
  t.innerHTML = `<span aria-hidden="true">🏆</span><span>${text}</span>`;
  document.body.appendChild(t);
};

export const unlock = (id: string): void => {
  if (typeof document === 'undefined' || !ACHIEVEMENTS[id]) return;
  const set = readSet();
  if (set.has(id)) return;
  set.add(id);
  writeSet(set);
  document.body.dataset.achievementsCount = String(set.size);
  showToast(id, set.size);
  triggerThresholdReward(set.size);
};

export const initAchievements = (): void => {
  if (typeof document === 'undefined') return;
  const set = readSet();
  document.body.dataset.achievementsCount = String(set.size);
  if (set.size >= 5) document.body.dataset.achievementsTier = '1';
  if (set.size >= 10) document.body.dataset.achievementsTier = '2';
  if (set.size >= TOTAL) document.body.dataset.achievementsTier = '3';
};
