import { useState, useCallback } from 'react';
import { searchEdgarFilings, type EdgarSearchHit } from '../services/secApi';

interface UseEdgarSearchResult {
  results: EdgarSearchHit[];
  loading: boolean;
  error: string;
  totalResults: number;
  search: (query?: string) => Promise<void>;
  reset: () => void;
}

export default function useEdgarSearch(
  defaultForms: string = '10-K',
  defaultDateFrom?: string,
  defaultDateTo?: string
): UseEdgarSearchResult {
  const [results, setResults] = useState<EdgarSearchHit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [totalResults, setTotalResults] = useState(0);

  const search = useCallback(async (query: string = '') => {
    setLoading(true);
    setError('');
    try {
      const hits = await searchEdgarFilings(
        query,
        defaultForms,
        defaultDateFrom,
        defaultDateTo
      );
      setResults(hits);
      setTotalResults(hits.length);
    } catch (err) {
      console.error('EDGAR search error:', err);
      setError('Search failed. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [defaultForms, defaultDateFrom, defaultDateTo]);

  const reset = useCallback(() => {
    setResults([]);
    setError('');
    setTotalResults(0);
  }, []);

  return { results, loading, error, totalResults, search, reset };
}

/**
 * Parse a standard EDGAR search hit into a normalized filing object.
 */
function firstString(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
}

function resolvePrimaryDocument(hit: EdgarSearchHit, src: EdgarSearchHit['_source']): string {
  if (src?.primary_document) {
    return src.primary_document;
  }

  const idParts = hit._id.split(':');
  if (idParts.length > 2) {
    return idParts.slice(2).join(':').replace(/_/g, '/');
  }

  if (idParts.length > 1) {
    return idParts[1];
  }

  return '';
}

export function parseSearchHit(hit: EdgarSearchHit) {
  const src = hit._source;
  const entityName = (src?.display_names?.[0] || src?.entity_name || '').replace(/\s*\(CIK\s+\d+\)/, '').trim();
  const filingFormType = src?.form || src?.root_forms?.[0] || src?.file_type || '';
  const documentType = src?.file_type || filingFormType || '';
  return {
    entityName,
    fileDate: src?.file_date || '',
    formType: filingFormType,
    documentType,
    accessionNumber: src?.adsh || '',
    cik: firstString(src?.ciks).replace(/^0+/, ''),
    primaryDocument: resolvePrimaryDocument(hit, src),
    description: src?.file_description || documentType || '',
  };
}
