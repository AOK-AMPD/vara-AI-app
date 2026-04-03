'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Loader2, Search, X } from 'lucide-react';
import { loadCompanyDirectory } from '../../services/agentEvidence';

interface CompanyLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

interface CompanyOption {
  cik: string;
  ticker: string;
  title: string;
}

const shellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '9px 12px',
  background: 'var(--input-bg)',
  border: '1px solid var(--input-border)',
  borderRadius: '12px',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'var(--text-primary)',
  fontSize: '0.82rem',
  padding: 0,
  minWidth: 0,
};

function normalize(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function scoreOption(option: CompanyOption, query: string): number {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 1;

  const title = normalize(option.title);
  const ticker = normalize(option.ticker);
  let score = 0;

  if (ticker === normalizedQuery || title === normalizedQuery) score += 120;
  if (ticker.startsWith(normalizedQuery)) score += 90;
  if (title.startsWith(normalizedQuery)) score += 75;
  if (title.split(' ').some(word => word.startsWith(normalizedQuery))) score += 60;
  if (title.includes(normalizedQuery)) score += 40;
  if (ticker.includes(normalizedQuery)) score += 30;

  return score;
}

export default function CompanyLookupField({
  value,
  onChange,
  placeholder = 'Type company or ticker...',
}: CompanyLookupFieldProps) {
  const [options, setOptions] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const directory = await loadCompanyDirectory();
      if (!cancelled) {
        setOptions(directory);
        setLoading(false);
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const matches = useMemo(() => {
    const normalizedQuery = normalize(value);
    const ranked = options
      .map(option => ({ option, score: scoreOption(option, value) }))
      .filter(item => !normalizedQuery || item.score > 0)
      .sort((a, b) => b.score - a.score || a.option.title.localeCompare(b.option.title))
      .slice(0, 14)
      .map(item => item.option);

    return ranked;
  }, [options, value]);

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div style={shellStyle}>
        {loading ? <Loader2 size={14} className="spinner" /> : <Search size={14} style={{ color: 'var(--text-muted)' }} />}
        <input
          value={value}
          onChange={event => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          style={inputStyle}
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              setOpen(false);
            }}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'var(--text-muted)' }}
          >
            <X size={14} />
          </button>
        )}
      </div>

      {open && (
        <div
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            zIndex: 40,
            borderRadius: '10px',
            border: '1px solid var(--border-color)',
            background: 'var(--surface-panel-strong)',
            boxShadow: '0 18px 42px rgba(58,30,65,0.12)',
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          {matches.length > 0 ? (
            matches.map(option => (
              <button
                key={`${option.ticker}-${option.cik}`}
                type="button"
                onClick={() => {
                  onChange(option.title);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid var(--border-color)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{option.title}</span>
                  <span style={{ fontSize: '0.74rem', color: 'var(--accent-primary)', fontFamily: 'var(--font-mono)' }}>{option.ticker}</span>
                </div>
                <div style={{ marginTop: '2px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>CIK {option.cik}</div>
              </button>
            ))
          ) : (
            <div style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {value.trim() ? 'No companies match that search yet.' : 'Start typing to search issuers by company name or ticker.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
