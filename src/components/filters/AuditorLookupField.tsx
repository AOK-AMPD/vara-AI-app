import { useEffect, useMemo, useRef, useState } from 'react';
import { BellRing, ChevronDown, X } from 'lucide-react';
import { AUDITOR_OPTIONS, canonicalizeAuditorInput } from '../../services/auditors';

interface AuditorLookupFieldProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
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

export default function AuditorLookupField({
  value,
  onChange,
  placeholder = 'Select auditor',
}: AuditorLookupFieldProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

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
    if (!normalizedQuery) {
      return AUDITOR_OPTIONS.slice(0, 10);
    }

    return AUDITOR_OPTIONS
      .map(option => {
        const aliases = [option.label, ...option.aliases];
        let score = 0;

        for (const alias of aliases) {
          const normalizedAlias = normalize(alias);
          if (!normalizedAlias) continue;
          if (normalizedAlias === normalizedQuery) score = Math.max(score, 120);
          else if (normalizedAlias.startsWith(normalizedQuery)) score = Math.max(score, 90);
          else if (normalizedAlias.includes(normalizedQuery)) score = Math.max(score, 60);
        }

        return { option, score };
      })
      .filter(item => item.score > 0)
      .sort((a, b) => b.score - a.score || a.option.label.localeCompare(b.option.label))
      .slice(0, 10)
      .map(item => item.option);
  }, [value]);

  const handleSelect = (nextValue: string) => {
    onChange(canonicalizeAuditorInput(nextValue));
    setOpen(false);
  };

  return (
    <div ref={rootRef} style={{ position: 'relative' }}>
      <div style={shellStyle}>
        <BellRing size={14} style={{ color: 'var(--text-muted)' }} />
        <input
          value={value}
          onChange={event => {
            onChange(event.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            if (!open) {
              onChange(canonicalizeAuditorInput(value));
            }
          }}
          placeholder={placeholder}
          style={inputStyle}
        />
        {value ? (
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
        ) : (
          <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
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
                key={option.label}
                type="button"
                onMouseDown={event => event.preventDefault()}
                onClick={() => handleSelect(option.label)}
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
                <div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{option.label}</div>
                <div style={{ marginTop: '2px', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                  {option.aliases.slice(0, 3).join(' | ')}
                </div>
              </button>
            ))
          ) : (
            <div style={{ padding: '12px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              {value.trim() ? 'No auditors match that search yet.' : 'Start typing to pick an auditor.'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

