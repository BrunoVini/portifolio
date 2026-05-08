import type { Locale, Profile, ResolvedProfile, I18nString } from './types';
import profileJson from '../data/profile.json';

const isI18nString = (v: unknown): v is I18nString =>
  !!v &&
  typeof v === 'object' &&
  'en' in (v as object) &&
  'pt' in (v as object) &&
  typeof (v as { en: unknown }).en === 'string' &&
  typeof (v as { pt: unknown }).pt === 'string';

const walk = (value: unknown, locale: Locale): unknown => {
  if (isI18nString(value)) return value[locale];
  if (Array.isArray(value)) return value.map((v) => walk(v, locale));
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as object)) {
      out[k] = walk(v as unknown, locale);
    }
    return out;
  }
  return value;
};

export const resolveProfile = (profile: Profile, locale: Locale): ResolvedProfile =>
  walk(profile, locale) as ResolvedProfile;

export const getProfile = (locale: Locale): ResolvedProfile =>
  resolveProfile(profileJson as Profile, locale);
