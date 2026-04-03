export interface SamplePrompt {
  label: string;
  prompt: string;
  category: string;
}

export const SAMPLE_PROMPT_CATEGORIES = [
  'Filing Research',
  'Accounting Standards',
  'Governance & Compliance',
  'Cross-Framework',
] as const;

export const SAMPLE_PROMPTS: SamplePrompt[] = [
  // Filing Research
  {
    category: 'Filing Research',
    label: 'Revenue recognition disclosures',
    prompt: 'How do SaaS companies disclose ARR and revenue recognition policies in their latest 10-Ks?',
  },
  {
    category: 'Filing Research',
    label: 'Material weakness trends',
    prompt: 'Find companies that disclosed material weaknesses in internal controls in the last 2 years.',
  },
  {
    category: 'Filing Research',
    label: 'Risk factor analysis',
    prompt: "Open Apple's latest 10-K and summarize the key risk factors.",
  },
  {
    category: 'Filing Research',
    label: 'Goodwill impairment testing',
    prompt: 'Compare goodwill impairment testing disclosures across MSFT, GOOGL, and META.',
  },
  {
    category: 'Filing Research',
    label: 'Going concern opinions',
    prompt: 'Search for going concern disclosures in 10-K filings from the last year.',
  },

  // Accounting Standards
  {
    category: 'Accounting Standards',
    label: 'ASC 606 multi-element',
    prompt: 'Explain ASC 606 revenue recognition for multi-element arrangements with variable consideration.',
  },
  {
    category: 'Accounting Standards',
    label: 'ASC 842 lease accounting',
    prompt: 'What are the key disclosure requirements under ASC 842 for operating vs. finance leases?',
  },
  {
    category: 'Accounting Standards',
    label: 'ASC 326 credit losses',
    prompt: 'Summarize ASC 326 CECL implementation requirements and common disclosure patterns.',
  },
  {
    category: 'Accounting Standards',
    label: 'DISE / ASU 2024-03',
    prompt: 'Which companies have early-adopted ASU 2024-03 expense disaggregation and what do their disclosures look like?',
  },
  {
    category: 'Accounting Standards',
    label: 'Non-GAAP measures',
    prompt: 'How do tech companies reconcile non-GAAP measures in their 10-K filings?',
  },

  // Governance & Compliance
  {
    category: 'Governance & Compliance',
    label: 'Board composition',
    prompt: "Extract board composition and independence data from Tesla's latest DEF 14A.",
  },
  {
    category: 'Governance & Compliance',
    label: 'Executive compensation',
    prompt: 'Compare CEO compensation structures between AAPL, MSFT, and GOOGL.',
  },
  {
    category: 'Governance & Compliance',
    label: 'Cybersecurity disclosures',
    prompt: 'Find cybersecurity risk factor disclosures under the new SEC cyber rule in recent 10-K filings.',
  },
  {
    category: 'Governance & Compliance',
    label: 'SOX 404 / ICFR',
    prompt: 'Search for companies that reported changes in internal controls over financial reporting.',
  },
  {
    category: 'Governance & Compliance',
    label: 'Critical audit matters',
    prompt: 'What are the most common critical audit matters (CAMs) cited by Big 4 auditors?',
  },

  // Cross-Framework
  {
    category: 'Cross-Framework',
    label: 'US GAAP vs IFRS revenue',
    prompt: 'How does revenue recognition differ between ASC 606 and IFRS 15?',
  },
  {
    category: 'Cross-Framework',
    label: 'Ind AS lease comparison',
    prompt: 'Compare lease accounting requirements under ASC 842, IFRS 16, and Ind AS 116.',
  },
  {
    category: 'Cross-Framework',
    label: 'Hedge accounting',
    prompt: 'How should I account for a cash flow hedge under both ASC 815 and Ind AS 109?',
  },
  {
    category: 'Cross-Framework',
    label: 'Financial instruments',
    prompt: 'Compare expected credit loss models under ASC 326 (CECL) vs IFRS 9 vs Ind AS 109.',
  },
  {
    category: 'Cross-Framework',
    label: 'Impairment testing',
    prompt: 'How does goodwill impairment testing differ between US GAAP (ASC 350) and IFRS (IAS 36)?',
  },
];
