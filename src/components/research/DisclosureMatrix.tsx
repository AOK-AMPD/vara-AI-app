'use client';

import { useState } from 'react';
import { Loader2, AlertCircle, FileText, FileDown, Columns } from 'lucide-react';
import { renderMarkdown } from '../../utils/markdownRenderer';

/* ------------------------------------------------------------------ */
/*  Filing-type → section mapping                                     */
/* ------------------------------------------------------------------ */

const FILING_TYPE_SECTIONS: Record<string, string[]> = {
  '10-K': [
    'Item 1. Business',
    'Item 1A. Risk Factors',
    'Item 7. MD&A',
    'Item 8. Financial Statements',
    'Item 9A. Controls & Procedures',
  ],
  '10-Q': [
    'Part I, Item 1. Financial Statements',
    'Part I, Item 2. MD&A',
    'Part I, Item 4. Controls & Procedures',
  ],
  'DEF 14A': [
    'Executive Compensation',
    'Board Composition',
    'Say-on-Pay Results',
    'Shareholder Proposals',
    'Corporate Governance',
  ],
};

const SUPPORTED_FILING_TYPES = Object.keys(FILING_TYPE_SECTIONS);

interface DisclosureMatrixProps {
  tickers: string[];
  section: string;
  filingType?: string;
  className?: string;
  filingContexts: Array<{ ticker: string; companyName: string; text: string }>;
  onExportDocx?: (analysis: string, tickers: string[], section: string) => void;
  onExportPdf?: (analysis: string, tickers: string[], section: string) => void;
  onFilingTypeChange?: (filingType: string) => void;
  onSectionChange?: (section: string) => void;
}

export function DisclosureMatrix({ tickers, section, filingType = '10-K', className = '', filingContexts, onExportDocx, onExportPdf, onFilingTypeChange, onSectionChange }: DisclosureMatrixProps) {
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateComparison = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tickers,
          section,
          filingContexts
        })
      });
      
      const payload = await response.json();
      
      if (!response.ok) {
        throw new Error(payload.error || 'Comparison API failed');
      }
      
      setAnalysis(payload.analysis);
    } catch (e: any) {
      setError(e.message || 'Failed to generate comparison. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`disclosure-matrix bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm ${className}`}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Columns size={18} />
            Disclosure Matrix
          </h3>
          <p className="text-sm text-gray-500 mt-1">Comparing {section} across: {tickers.join(', ')}</p>

          {/* Filing type + section selectors */}
          <div className="flex gap-2 mt-2">
            {onFilingTypeChange && (
              <select
                value={filingType}
                onChange={e => onFilingTypeChange(e.target.value)}
                className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                {SUPPORTED_FILING_TYPES.map(ft => (
                  <option key={ft} value={ft}>{ft}</option>
                ))}
              </select>
            )}
            {onSectionChange && FILING_TYPE_SECTIONS[filingType] && (
              <select
                value={section}
                onChange={e => onSectionChange(e.target.value)}
                className="text-xs border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200"
              >
                {FILING_TYPE_SECTIONS[filingType].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          {!analysis && !loading && (
            <button
              type="button"
              onClick={generateComparison}
              disabled={tickers.length < 2 || filingContexts.length < 2}
              className="px-4 py-2 bg-[var(--accent-purple)] hover:bg-[var(--accent-purple-dark)] text-white text-sm font-medium rounded-md transition-colors disabled:opacity-50"
            >
              Generate AI Comparison
            </button>
          )}

          {analysis && onExportDocx && (
            <button
              type="button"
              onClick={() => onExportDocx(analysis, tickers, section)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5"
            >
              <FileText size={16} />
              Export Word
            </button>
          )}

          {analysis && onExportPdf && (
            <button
              type="button"
              onClick={() => onExportPdf(analysis, tickers, section)}
              className="px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-md transition-colors flex items-center gap-1.5"
            >
              <FileDown size={16} />
              Export PDF
            </button>
          )}
        </div>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-500">
            <Loader2 size={32} className="animate-spin mb-4 text-[var(--accent-purple)]" />
            <p>Analyzing disclosures for {tickers.length} companies...</p>
            <p className="text-xs mt-2 opacity-75">This may take 10-15 seconds for complex comparisons.</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 p-4 rounded-md flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Comparison failed</h4>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        ) : analysis ? (
          <div 
            className="md-content font-sans text-sm leading-relaxed" 
            dangerouslySetInnerHTML={{ __html: renderMarkdown(analysis) }} 
          />
        ) : (
          <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg">
            <Columns size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-4" />
            <p className="text-gray-600 dark:text-gray-400 font-medium">Ready to compare {section}</p>
            <p className="text-sm mt-1 mb-4">Click Generate to build an AI-powered comparison matrix</p>
          </div>
        )}
      </div>
    </div>
  );
}

