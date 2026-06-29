import { CategoryMetadata } from '../types';

export const CATEGORIES: CategoryMetadata[] = [
  {
    id: 'calculator',
    name: 'Calculator Tools',
    description: 'Financial, scientific, health, and mathematical offline calculators.',
    icon: 'Calculator',
    color: 'bg-blue-500 text-white dark:bg-blue-600',
    badgeCount: 14
  },
  {
    id: 'developer',
    name: 'Developer Tools',
    description: 'JSON formatters, regex debuggers, UUID generators, and encoding converters.',
    icon: 'Code2',
    color: 'bg-emerald-500 text-white dark:bg-emerald-600',
    badgeCount: 12
  },
  {
    id: 'text',
    name: 'Text Tools',
    description: 'Word counters, case converters, lorem ipsum generators, and diff checkers.',
    icon: 'FileText',
    color: 'bg-amber-500 text-white dark:bg-amber-600',
    badgeCount: 10
  },
  {
    id: 'seo',
    name: 'SEO Tools',
    description: 'Meta tag generators, keyword density analyzers, robots.txt builders, and slug generators.',
    icon: 'Search',
    color: 'bg-purple-500 text-white dark:bg-purple-600',
    badgeCount: 8
  },
  {
    id: 'image',
    name: 'Image Tools',
    description: 'Image dimension resizers, aspect ratio calculators, color palette extractors, and base64 encoders.',
    icon: 'Image',
    color: 'bg-rose-500 text-white dark:bg-rose-600',
    badgeCount: 7
  },
  {
    id: 'pdf',
    name: 'PDF Tools',
    description: 'PDF metadata inspectors, page count estimators, text extractors, and secure offline viewers.',
    icon: 'FileCode',
    color: 'bg-red-500 text-white dark:bg-red-600',
    badgeCount: 5
  },
  {
    id: 'utility',
    name: 'Utility Tools',
    description: 'Secure password generators, QR code generators, timestamp converters, and unit converters.',
    icon: 'Wrench',
    color: 'bg-cyan-500 text-white dark:bg-cyan-600',
    badgeCount: 12
  },
  {
    id: 'ai',
    name: 'AI Tools (Future Ready)',
    description: 'Prompt optimizers, AI token estimators, markdown formatting assistants, and JSON schema generators.',
    icon: 'Sparkles',
    color: 'bg-indigo-500 text-white dark:bg-indigo-600',
    badgeCount: 6
  }
];
