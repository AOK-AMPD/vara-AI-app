'use client';

import { Info } from 'lucide-react';

export default function ResponsibleAIBanner() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '6px',
      padding: '5px 10px', marginTop: '4px',
      background: 'rgba(30, 58, 138, 0.12)',
      border: '1px solid rgba(96, 165, 250, 0.12)',
      borderRadius: '6px', fontSize: '0.68rem', color: 'rgba(148,163,184,0.7)',
    }}>
      <Info size={11} style={{ flexShrink: 0, color: 'rgba(96,165,250,0.5)' }} />
      <span>AI-generated — verify before use</span>
    </div>
  );
}
