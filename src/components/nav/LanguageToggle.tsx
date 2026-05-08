import { useEffect, useState } from 'react';
import { detectLocale, getStoredLocale, persistLocale } from '../../lib/i18n';
import type { Locale } from '../../lib/types';

type Props = { locale: Locale; enHref: string; ptHref: string };

export default function LanguageToggle({ locale, enHref, ptHref }: Props) {
  const route: Record<Locale, string> = { en: enHref, pt: ptHref };
  const [active, setActive] = useState<Locale>(locale);

  useEffect(() => {
    const stored = getStoredLocale();
    if (stored && stored !== locale) {
      window.location.replace(route[stored]);
      return;
    }
    if (!stored) {
      const detected = detectLocale(navigator.language);
      if (detected !== locale) {
        persistLocale(detected);
        window.location.replace(route[detected]);
      }
    }
  }, [locale]);

  const switchTo = (next: Locale) => {
    persistLocale(next);
    setActive(next);
    window.location.assign(route[next]);
  };

  return (
    <span className="lang-toggle">
      <button
        onClick={() => switchTo('en')}
        aria-pressed={active === 'en'}
        className={active === 'en' ? 'on' : ''}
      >
        EN
      </button>
      <span aria-hidden="true">/</span>
      <button
        onClick={() => switchTo('pt')}
        aria-pressed={active === 'pt'}
        className={active === 'pt' ? 'on' : ''}
      >
        PT
      </button>
    </span>
  );
}
