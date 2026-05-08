import { describe, expect, it } from 'vitest';
import { resolveProfile } from '../../src/lib/profile';
import type { Profile } from '../../src/lib/types';

const fixture: Profile = {
  name: 'Bruno Vinicius',
  handle: 'BrunoVini',
  email: 'brunovinissouza@gmail.com',
  location: { en: 'Brazil', pt: 'Brasil' },
  links: { github: 'https://github.com/BrunoVini', linkedin: '', email: 'mailto:x@x' },
  hero: {
    eyebrow: { en: 'eyebrow-en', pt: 'eyebrow-pt' },
    titleLine1: { en: 'l1-en', pt: 'l1-pt' },
    titleLine2: { en: 'l2-en', pt: 'l2-pt' },
    titleAccent: { en: 'a-en', pt: 'a-pt' },
    subtitle: { en: 's-en', pt: 's-pt' },
    primaryCTA: { en: 'p-en', pt: 'p-pt' },
    secondaryCTA: { en: 'sc-en', pt: 'sc-pt' },
    currentlyNote: { en: 'cn-en', pt: 'cn-pt' },
  },
  about: {
    headline: { en: 'h-en', pt: 'h-pt' },
    bio: [{ en: 'b-en', pt: 'b-pt' }],
    portraitAlt: { en: 'pa-en', pt: 'pa-pt' },
  },
  experience: [],
  skills: [],
  projects: [],
  contact: {
    headline: { en: 'c-en', pt: 'c-pt' },
    cta: { en: 'cta-en', pt: 'cta-pt' },
    signoff: { en: 'so-en', pt: 'so-pt' },
  },
};

describe('resolveProfile', () => {
  it('returns English strings when locale is "en"', () => {
    const r = resolveProfile(fixture, 'en');
    expect(r.hero.subtitle).toBe('s-en');
    expect(r.about.bio).toEqual(['b-en']);
  });

  it('returns Portuguese strings when locale is "pt"', () => {
    const r = resolveProfile(fixture, 'pt');
    expect(r.hero.subtitle).toBe('s-pt');
    expect(r.location).toBe('Brasil');
  });

  it('keeps non-i18n fields untouched', () => {
    const r = resolveProfile(fixture, 'en');
    expect(r.name).toBe('Bruno Vinicius');
    expect(r.handle).toBe('BrunoVini');
    expect(r.email).toBe('brunovinissouza@gmail.com');
  });
});
