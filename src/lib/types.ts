export type Locale = 'en' | 'pt';

export type I18nString = { en: string; pt: string };

export type ExperienceStat = {
  label: I18nString;
  icon?: 'chart' | 'rocket' | 'tests' | 'users' | 'sparkle';
};

export type ExperienceEntry = {
  company: string;
  /** Optional path under /public for a company logo (SVG/PNG). */
  companyLogo?: string;
  /** Short location label (e.g. "Brazil · Remote"). */
  location?: I18nString;
  /** Employment type label (e.g. "Full-time"). */
  employmentType?: I18nString;
  role: I18nString;
  startDate: string;
  endDate: string | 'present';
  description: I18nString;
  highlights: I18nString[];
  stats?: ExperienceStat[];
};

export type SkillItem = { name: string; note?: I18nString; featured?: boolean };
export type SkillGroup = { category: I18nString; items: SkillItem[] };

export type Project = {
  id: string;
  title: I18nString;
  tagline: I18nString;
  description: I18nString;
  stack: string[];
  links: { repo?: string; demo?: string };
  thumbnail: string;
  featured: boolean;
  tradeOffs?: I18nString[];
};

export type Profile = {
  name: string;
  handle: string;
  email: string;
  location: I18nString;
  links: { github: string; linkedin: string; email: string };
  hero: {
    eyebrow: I18nString;
    titleLine1: I18nString;
    titleLine2: I18nString;
    titleAccent: I18nString;
    subtitle: I18nString;
    primaryCTA: I18nString;
    secondaryCTA: I18nString;
    currentlyNote: I18nString;
    currentlyCycle?: I18nString[];
  };
  about: { headline: I18nString; bio: I18nString[]; portraitAlt: I18nString };
  experience: ExperienceEntry[];
  skills: SkillGroup[];
  projects: Project[];
  contact: { headline: I18nString; cta: I18nString; signoff: I18nString };
};

export type ResolvedExperienceStat = { label: string; icon?: ExperienceStat['icon'] };

export type ResolvedExperienceEntry = Omit<
  ExperienceEntry,
  'role' | 'description' | 'highlights' | 'location' | 'employmentType' | 'stats'
> & {
  role: string;
  description: string;
  highlights: string[];
  location?: string;
  employmentType?: string;
  stats?: ResolvedExperienceStat[];
};

export type ResolvedSkillGroup = {
  category: string;
  items: { name: string; note?: string; featured?: boolean }[];
};

export type ResolvedProject = Omit<Project, 'title' | 'tagline' | 'description' | 'tradeOffs'> & {
  title: string;
  tagline: string;
  description: string;
  tradeOffs?: string[];
};

export type ResolvedProfile = {
  name: string;
  handle: string;
  email: string;
  location: string;
  links: { github: string; linkedin: string; email: string };
  hero: {
    eyebrow: string;
    titleLine1: string;
    titleLine2: string;
    titleAccent: string;
    subtitle: string;
    primaryCTA: string;
    secondaryCTA: string;
    currentlyNote: string;
    currentlyCycle?: string[];
  };
  about: { headline: string; bio: string[]; portraitAlt: string };
  experience: ResolvedExperienceEntry[];
  skills: ResolvedSkillGroup[];
  projects: ResolvedProject[];
  contact: { headline: string; cta: string; signoff: string };
};
