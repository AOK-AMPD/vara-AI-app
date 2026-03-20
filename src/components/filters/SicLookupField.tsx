import { useEffect, useMemo, useRef, useState } from 'react';
import { Building2, Loader2, X } from 'lucide-react';
import { loadSicDirectory, type SicDirectoryEntry } from '../../services/referenceData';

interface SicLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const shellStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '7px 12px',
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
};

const inputStyle: React.CSSProperties = {
  flex: 1,
  background: 'transparent',
  border: 'none',
  outline: 'none',
  color: 'white',
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

function scoreOption(option: SicDirectoryEntry, query: string): number {
  const normalizedQuery = normalize(query);
  if (!normalizedQuery) return 1;

  const title = normalize(option.title);
  const code = normalize(option.code);
  const office = normalize(option.office);
  let score = 0;

  if (code === normalizedQuery) score += 120;
  if (title === normalizedQuery) score += 100;
  if (code.startsWith(normalizedQuery)) score += 95;
  if (title.startsWith(normalizedQuery)) score += 80;
  if (title.split(' ').some(word => word.startsWith(normalizedQuery))) score += 60;
  if (title.includes(normalizedQuery)) score += 40;
  if (office.includes(normalizedQuery)) score += 20;

  return score;
}

export default function SicLookupField({
  value,
  onChange,
  placeholder = 'Search SIC code or industry...',
}: SicLookupFieldProps) {
  const [options, setOptions] = useState<SicDirectoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      const directory = await loadSicDirectory();
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
    return options
      .map(option => ({ option, score: scoreOption(option, value) }))
      .filter(item => !normalizedQuery || item.score > 0)
      .sort((a, b) => b.score - a.score || a.option.title.localeCompare(b.option.title))
      .slice(0, 14)
      .map(item => item.option);
  }, [options, value]);

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div style={shellStyle}>
        {loading ? <Loader2 size={14} className="spinner" /> : <Building2 size={14} style={{ color: '#94A3B8' }} />}
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
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#64748B' }}
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
            border: '1px solid rgba(255,255,255,0.12)',
            background: '#172036',
            boxShadow: '0 14px 32px rgba(0,0,0,0.35)',
            maxHeight: '320px',
            overflowY: 'auto',
          }}
        >
          {matches.length > 0 ? (
            matches.map(option => (
              <button
                key={option.code}
                type="button"
                onClick={() => {
                  onChange(`${option.code} - ${option.title}`);
                  setOpen(false);
                }}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.06)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'white',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '10px', alignItems: 'baseline' }}>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600 }}>{option.title}</span>
                  <span style={{ fontSize: '0.74rem', color: '#60A5FA', fontFamily: 'var(--font-mono)' }}>{option.code}</span>
                </div>
                <div style={{ marginTop: '2px', fontSize: '0.72rem', color: '#94A3B8' }}>{option.office}</div>
              </button>
            ))
          ) : (
            <div style={{ padding: '12px', fontSize: '0.78rem', color: '#94A3B8' }}>
              {value.trim() ? 'No SIC codes match that search yet.' : 'Click or type to browse the full SEC SIC code list.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
