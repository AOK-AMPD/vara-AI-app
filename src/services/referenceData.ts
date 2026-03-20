import { buildSecProxyUrl } from './secApi';

export interface SicDirectoryEntry {
  code: string;
  office: string;
  title: string;
}

let sicDirectoryCache: SicDirectoryEntry[] | null = null;
let sicDirectoryPromise: Promise<SicDirectoryEntry[]> | null = null;

function parseSicTable(doc: Document): SicDirectoryEntry[] {
  const entries: SicDirectoryEntry[] = [];
  const rows = Array.from(doc.querySelectorAll('table tr'));

  for (const row of rows) {
    const cells = Array.from(row.querySelectorAll('th, td'))
      .map(cell => (cell.textContent || '').replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    if (cells.length < 3 || !/^\d{3,4}$/.test(cells[0])) {
      continue;
    }

    entries.push({
      code: cells[0],
      office: cells[1],
      title: cells.slice(2).join(' '),
    });
  }

  return entries;
}

export async function loadSicDirectory(): Promise<SicDirectoryEntry[]> {
  if (sicDirectoryCache) return sicDirectoryCache;
  if (sicDirectoryPromise) return sicDirectoryPromise;

  sicDirectoryPromise = (async () => {
    try {
      const response = await fetch(buildSecProxyUrl('search-filings/standard-industrial-classification-sic-code-list'));
      if (!response.ok) {
        throw new Error(`Failed to load SIC directory (${response.status})`);
      }

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const entries = parseSicTable(doc)
        .filter(entry => entry.code && entry.title)
        .sort((a, b) => a.title.localeCompare(b.title));

      sicDirectoryCache = entries;
      return entries;
    } catch (error) {
      console.error('Failed to load SEC SIC directory:', error);
      sicDirectoryCache = [];
      return [];
    }
  })();

  return sicDirectoryPromise;
}
