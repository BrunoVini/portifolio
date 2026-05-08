import { describe, expect, it, beforeEach } from 'vitest';
import { detectLocale, getStoredLocale, persistLocale, t } from '../../src/lib/i18n';

describe('i18n helper', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('detectLocale returns "pt" if navigator.language starts with pt', () => {
    expect(detectLocale('pt-BR')).toBe('pt');
    expect(detectLocale('pt')).toBe('pt');
    expect(detectLocale('PT-BR')).toBe('pt');
  });

  it('detectLocale returns "en" otherwise', () => {
    expect(detectLocale('en-US')).toBe('en');
    expect(detectLocale('fr')).toBe('en');
    expect(detectLocale(undefined)).toBe('en');
    expect(detectLocale(null)).toBe('en');
  });

  it('persists and retrieves locale via localStorage', () => {
    persistLocale('pt');
    expect(getStoredLocale()).toBe('pt');
    persistLocale('en');
    expect(getStoredLocale()).toBe('en');
  });

  it('getStoredLocale returns null when nothing is stored', () => {
    expect(getStoredLocale()).toBeNull();
  });

  it('t() resolves a key against the strings table for the active locale', () => {
    const en = { nav: { about: 'About' } };
    const pt = { nav: { about: 'Sobre' } };
    expect(t('nav.about', 'en', { en, pt })).toBe('About');
    expect(t('nav.about', 'pt', { en, pt })).toBe('Sobre');
  });

  it('t() returns the key itself when the path is missing', () => {
    expect(t('nav.missing', 'en', { en: {}, pt: {} })).toBe('nav.missing');
  });
});
