export interface AuditorOption {
  label: string;
  aliases: string[];
  queryTerms: string[];
  patterns: RegExp[];
}

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export const AUDITOR_OPTIONS: AuditorOption[] = [
  {
    label: 'Deloitte',
    aliases: ['Deloitte', 'Deloitte & Touche', 'Deloitte & Touche LLP', 'Deloitte LLP'],
    queryTerms: ['Deloitte', '"Deloitte & Touche"'],
    patterns: [
      /\bdeloitte(?:\s*&\s*touche)?(?:\s+llp)?\b/i,
    ],
  },
  {
    label: 'PwC',
    aliases: ['PwC', 'PricewaterhouseCoopers', 'PricewaterhouseCoopers LLP', 'Price Waterhouse Coopers'],
    queryTerms: ['PwC', '"PricewaterhouseCoopers"'],
    patterns: [
      /\bpricewaterhousecoopers(?:\s+llp)?\b/i,
      /\bpwc\b/i,
    ],
  },
  {
    label: 'EY',
    aliases: ['EY', 'EY LLP', 'Ernst & Young', 'Ernst & Young LLP', 'Ernst and Young', 'Ernst and Young LLP'],
    queryTerms: ['EY', '"Ernst & Young"'],
    patterns: [
      /\bernst\s*(?:&|and)\s*young(?:\s+llp)?\b/i,
      /\bey(?:\s+llp)?\b/i,
    ],
  },
  {
    label: 'KPMG',
    aliases: ['KPMG', 'KPMG LLP'],
    queryTerms: ['KPMG'],
    patterns: [
      /\bkpmg(?:\s+llp)?\b/i,
    ],
  },
  {
    label: 'BDO',
    aliases: ['BDO', 'BDO USA', 'BDO USA LLP', 'BDO LLP'],
    queryTerms: ['BDO'],
    patterns: [
      /\bbdo(?:\s+usa)?(?:\s+llp)?\b/i,
    ],
  },
  {
    label: 'Grant Thornton',
    aliases: ['Grant Thornton', 'Grant Thornton LLP'],
    queryTerms: ['"Grant Thornton"'],
    patterns: [
      /\bgrant\s+thornton(?:\s+llp)?\b/i,
    ],
  },
  {
    label: 'RSM',
    aliases: ['RSM', 'RSM US LLP', 'RSM US'],
    queryTerms: ['RSM'],
    patterns: [
      /\brsm(?:\s+us)?(?:\s+llp)?\b/i,
    ],
  },
  {
    label: 'Crowe',
    aliases: ['Crowe', 'Crowe LLP'],
    queryTerms: ['Crowe'],
    patterns: [
      /\bcrowe(?:\s+llp)?\b/i,
    ],
  },
  {
    label: 'Baker Tilly',
    aliases: ['Baker Tilly', 'Baker Tilly US', 'Baker Tilly US LLP', 'Baker Tilly Virchow Krause'],
    queryTerms: ['"Baker Tilly"'],
    patterns: [
      /\bbaker\s+tilly(?:\s+us)?(?:\s+llp)?\b/i,
      /\bbaker\s+tilly\s+virchow\s+krause\b/i,
    ],
  },
  {
    label: 'Moss Adams',
    aliases: ['Moss Adams', 'Moss Adams LLP'],
    queryTerms: ['"Moss Adams"'],
    patterns: [
      /\bmoss\s+adams(?:\s+llp)?\b/i,
    ],
  },
  {
    label: 'Marcum',
    aliases: ['Marcum', 'Marcum LLP', 'CBIZ Marcum'],
    queryTerms: ['Marcum', '"CBIZ Marcum"'],
    patterns: [
      /\bmarcum(?:\s+llp)?\b/i,
      /\bcbiz\s+marcum\b/i,
    ],
  },
];

const BIG_FOUR_LABELS = new Set(['Deloitte', 'PwC', 'EY', 'KPMG']);
const NORMALIZED_AUDITOR_INDEX = new Map<string, AuditorOption>();

for (const option of AUDITOR_OPTIONS) {
  for (const alias of option.aliases) {
    NORMALIZED_AUDITOR_INDEX.set(normalize(alias), option);
  }
  NORMALIZED_AUDITOR_INDEX.set(normalize(option.label), option);
}

function isBigFourValue(value: string): boolean {
  return /\bbig\s+4\b|\bbig\s+four\b/i.test(value);
}

export function canonicalizeAuditorInput(value: string): string {
  const trimmed = value.trim();
  if (!trimmed) return '';
  if (isBigFourValue(trimmed)) return 'Big 4';

  const exact = NORMALIZED_AUDITOR_INDEX.get(normalize(trimmed));
  if (exact) {
    return exact.label;
  }

  const mention = findAuditorMention(trimmed);
  return mention?.label || trimmed;
}

export function findAuditorMention(value: string): AuditorOption | null {
  const normalizedValue = normalize(value);
  if (!normalizedValue) return null;

  for (const option of AUDITOR_OPTIONS) {
    if (option.patterns.some(pattern => pattern.test(value))) {
      return option;
    }

    if (option.aliases.some(alias => normalizedValue.includes(normalize(alias)))) {
      return option;
    }
  }

  return null;
}

export function stripAuditorMentions(value: string, option: AuditorOption): string {
  let next = value;
  const aliases = Array.from(new Set([option.label, ...option.aliases]))
    .sort((a, b) => b.length - a.length);

  for (const alias of aliases) {
    const escaped = escapeRegex(alias).replace(/\s+/g, '\\s+');
    next = next
      .replace(new RegExp(`\\baudited\\s+by\\s+${escaped}\\b`, 'ig'), ' ')
      .replace(new RegExp(`\\bauditor\\s*:?\\s*${escaped}\\b`, 'ig'), ' ')
      .replace(new RegExp(`\\b${escaped}\\b`, 'ig'), ' ');
  }

  return next;
}

export function buildAuditorSearchTerms(value: string): string[] {
  const canonical = canonicalizeAuditorInput(value);
  if (!canonical) return [];

  if (canonical === 'Big 4') {
    return AUDITOR_OPTIONS
      .filter(option => BIG_FOUR_LABELS.has(option.label))
      .flatMap(option => option.queryTerms);
  }

  const option = NORMALIZED_AUDITOR_INDEX.get(normalize(canonical));
  if (!option) {
    return [canonical];
  }

  return Array.from(new Set([option.label, ...option.queryTerms]));
}

export function matchesAuditorSelection(resultAuditor: string, filterValue: string): boolean {
  const canonicalFilter = canonicalizeAuditorInput(filterValue);
  if (!canonicalFilter) return true;

  const canonicalResult = canonicalizeAuditorInput(resultAuditor);
  if (!canonicalResult) return false;

  if (canonicalFilter === 'Big 4') {
    return BIG_FOUR_LABELS.has(canonicalResult);
  }

  if (canonicalResult === canonicalFilter) {
    return true;
  }

  return normalize(resultAuditor).includes(normalize(filterValue));
}

function matchAuditorInChunk(chunk: string): string {
  for (const option of AUDITOR_OPTIONS) {
    if (option.patterns.some(pattern => pattern.test(chunk))) {
      return option.label;
    }
  }
  return '';
}

export function detectAuditorInText(text: string): string {
  if (!text.trim()) return '';

  const head = text.slice(0, 60000);
  const tail = text.length > 80000 ? text.slice(-40000) : '';

  return (
    matchAuditorInChunk(head) ||
    matchAuditorInChunk(tail) ||
    matchAuditorInChunk(text)
  );
}
