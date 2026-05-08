import type { Locale } from './types';

const STORAGE_KEY = 'bruno.locale';

export const detectLocale = (lang: string | undefined | null): Locale =>
  lang?.toLowerCase().startsWith('pt') ? 'pt' : 'en';

export const getStoredLocale = (): Locale | null => {
  if (typeof localStorage === 'undefined') return null;
  const v = localStorage.getItem(STORAGE_KEY);
  return v === 'en' || v === 'pt' ? v : null;
};

export const persistLocale = (locale: Locale): void => {
  if (typeof localStorage !== 'undefined') localStorage.setItem(STORAGE_KEY, locale);
};

type StringsTable = Record<Locale, Record<string, unknown>>;

export const t = (key: string, locale: Locale, table: StringsTable): string => {
  const path = key.split('.');
  let cur: unknown = table[locale];
  for (const seg of path) {
    if (!cur || typeof cur !== 'object' || !(seg in (cur as object))) return key;
    cur = (cur as Record<string, unknown>)[seg];
  }
  return typeof cur === 'string' ? cur : key;
};
