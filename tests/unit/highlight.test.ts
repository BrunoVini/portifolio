import { describe, expect, it } from 'vitest';
import { splitOnTerms } from '../../src/lib/highlight';

describe('splitOnTerms', () => {
  it('returns the whole string as text when no terms are given', () => {
    expect(splitOnTerms('hello world', [])).toEqual([{ kind: 'text', value: 'hello world' }]);
  });

  it('marks a single term, case-insensitive', () => {
    expect(splitOnTerms('I love TDD daily', ['tdd'])).toEqual([
      { kind: 'text', value: 'I love ' },
      { kind: 'mark', value: 'TDD' },
      { kind: 'text', value: ' daily' },
    ]);
  });

  it('matches the longer term first when terms overlap', () => {
    const out = splitOnTerms('high-performance apps', ['performance', 'high-performance']);
    expect(out).toEqual([
      { kind: 'mark', value: 'high-performance' },
      { kind: 'text', value: ' apps' },
    ]);
  });

  it('marks multiple terms and preserves text between them', () => {
    const out = splitOnTerms('TDD and CI/CD daily', ['TDD', 'CI/CD']);
    expect(out).toEqual([
      { kind: 'mark', value: 'TDD' },
      { kind: 'text', value: ' and ' },
      { kind: 'mark', value: 'CI/CD' },
      { kind: 'text', value: ' daily' },
    ]);
  });

  it('returns the original string when no term matches', () => {
    expect(splitOnTerms('plain text', ['nope'])).toEqual([{ kind: 'text', value: 'plain text' }]);
  });
});
