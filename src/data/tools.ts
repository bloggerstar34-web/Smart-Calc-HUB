import { ToolItem } from '../types';

export const TOOLS: ToolItem[] = [
  // CALCULATORS
  {
    id: 'scientific-calculator',
    name: 'Scientific Calculator',
    category: 'calculator',
    description: 'Advanced trigonometric, logarithmic, exponential, and arithmetic calculator with formula history.',
    icon: 'Calculator',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['scientific', 'trig', 'sin', 'cos', 'log', 'math', 'calculator', 'offline'],
    usageCount: 145200,
    componentKey: 'ScientificCalculator'
  },
  {
    id: 'mortgage-calculator',
    name: 'Mortgage Calculator',
    category: 'calculator',
    description: 'Estimate monthly home loan repayments with interest rates, down payments, taxes, and amortization breakdown.',
    icon: 'Home',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['mortgage', 'home loan', 'real estate', 'repayment', 'amortization', 'interest'],
    usageCount: 98400,
    componentKey: 'MortgageCalculator'
  },
  {
    id: 'emi-calculator',
    name: 'Loan EMI Calculator',
    category: 'calculator',
    description: 'Calculate Equated Monthly Installment (EMI) for car loans, personal loans, and education loans.',
    icon: 'CreditCard',
    trending: false,
    featured: true,
    popular: true,
    keywords: ['emi', 'loan', 'finance', 'banking', 'interest', 'car loan'],
    usageCount: 87300,
    componentKey: 'EmiCalculator'
  },
  {
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    category: 'calculator',
    description: 'Instant percentage increase/decrease, fraction to percentage, and tip percentage calculations.',
    icon: 'Percent',
    trending: true,
    popular: true,
    keywords: ['percentage', 'discount', 'tip', 'math', 'fraction', 'growth rate'],
    usageCount: 210400,
    componentKey: 'PercentageCalculator'
  },
  {
    id: 'bmi-calculator',
    name: 'BMI Calculator',
    category: 'calculator',
    description: 'Calculate Body Mass Index (BMI) and determine healthy weight category based on height and weight.',
    icon: 'Activity',
    trending: false,
    popular: true,
    keywords: ['bmi', 'body mass index', 'health', 'fitness', 'weight', 'height'],
    usageCount: 132000,
    componentKey: 'BmiCalculator'
  },
  {
    id: 'age-calculator',
    name: 'Exact Age Calculator',
    category: 'calculator',
    description: 'Calculate exact chronological age in years, months, days, hours, and seconds from date of birth.',
    icon: 'Calendar',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['age', 'birthday', 'chronological', 'dob', 'date difference', 'age finder', 'exact age', 'how old am i', 'birth calculator', 'calendar tools'],
    usageCount: 115000,
    componentKey: 'AgeCalculator'
  },
  {
    id: 'salary-tax-calculator',
    name: 'Salary & Hourly Wage Calc',
    category: 'calculator',
    description: 'Convert hourly wages to weekly, monthly, and annual salaries with estimated overtime.',
    icon: 'DollarSign',
    keywords: ['salary', 'hourly', 'wage', 'paycheck', 'income', 'overtime'],
    usageCount: 65200,
    componentKey: 'SalaryCalculator'
  },
  {
    id: 'discount-calculator',
    name: 'Shopping Discount Calc',
    category: 'calculator',
    description: 'Calculate final price after multiple store discounts, promo codes, and sales tax.',
    icon: 'Tag',
    keywords: ['discount', 'shopping', 'sale', 'coupon', 'retail', 'savings'],
    usageCount: 54100,
    componentKey: 'DiscountCalculator'
  },

  // DEVELOPER TOOLS
  {
    id: 'json-formatter',
    name: 'JSON Formatter & Validator',
    category: 'developer',
    description: 'Beautify, minify, validate syntax, and inspect deeply nested JSON structures offline.',
    icon: 'Code',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['json', 'formatter', 'validator', 'lint', 'prettify', 'minify', 'developer'],
    usageCount: 310000,
    componentKey: 'JsonFormatter'
  },
  {
    id: 'regex-tester',
    name: 'Regular Expression Debugger',
    category: 'developer',
    description: 'Test JavaScript RegExp patterns with live group highlighting, match counts, and flags substitution.',
    icon: 'Terminal',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['regex', 'regexp', 'regular expression', 'test', 'match', 'pattern'],
    usageCount: 195000,
    componentKey: 'RegexTester'
  },
  {
    id: 'base64-converter',
    name: 'Base64 Encoder / Decoder',
    category: 'developer',
    description: 'Encode UTF-8 strings or decode Base64 data securely in your browser with zero server transmission.',
    icon: 'Cpu',
    popular: true,
    keywords: ['base64', 'encode', 'decode', 'cryptography', 'data uri', 'string'],
    usageCount: 178000,
    componentKey: 'Base64Converter'
  },
  {
    id: 'url-encoder',
    name: 'URL Encoder & Decoder',
    category: 'developer',
    description: 'Safely encode URI components or decode query parameters and escaped URLs.',
    icon: 'Link',
    keywords: ['url', 'uri', 'encode', 'decode', 'percent encoding', 'query string'],
    usageCount: 142000,
    componentKey: 'UrlEncoder'
  },
  {
    id: 'uuid-generator',
    name: 'UUID v4 Generator',
    category: 'developer',
    description: 'Generate secure, RFC4122 compliant random UUID v4 strings in bulk with instant copy.',
    icon: 'Key',
    trending: true,
    keywords: ['uuid', 'guid', 'v4', 'random id', 'token generator', 'bulk'],
    usageCount: 165000,
    componentKey: 'UuidGenerator'
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Token Inspector',
    category: 'developer',
    description: 'Parse and verify JSON Web Token (JWT) headers and claims payload completely offline.',
    icon: 'ShieldAlert',
    keywords: ['jwt', 'json web token', 'auth', 'oauth', 'claims', 'bearer'],
    usageCount: 121000,
    componentKey: 'JwtDecoder'
  },
  {
    id: 'html-entity-converter',
    name: 'HTML Entity Escape',
    category: 'developer',
    description: 'Escape special HTML characters or unescape XML/HTML entities.',
    icon: 'FileCode2',
    keywords: ['html', 'entities', 'escape', 'unescape', 'xml', 'security'],
    usageCount: 89000,
    componentKey: 'HtmlEntityConverter'
  },

  // TEXT TOOLS
  {
    id: 'word-counter',
    name: 'Word & Character Counter',
    category: 'text',
    description: 'Real-time word count, character count, sentence count, paragraph count, and reading time estimator.',
    icon: 'FileText',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['word count', 'character count', 'reading time', 'essay', 'copywriting'],
    usageCount: 420000,
    componentKey: 'WordCounter'
  },
  {
    id: 'case-converter',
    name: 'Text Case Converter',
    category: 'text',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, snake_case, and kebab-case.',
    icon: 'Type',
    popular: true,
    keywords: ['case converter', 'uppercase', 'lowercase', 'title case', 'camelcase', 'snake case'],
    usageCount: 256000,
    componentKey: 'CaseConverter'
  },
  {
    id: 'lorem-ipsum-generator',
    name: 'Lorem Ipsum Generator',
    category: 'text',
    description: 'Generate customizable placeholder text by paragraphs, words, or sentences for design mockups.',
    icon: 'AlignLeft',
    keywords: ['lorem ipsum', 'placeholder', 'dummy text', 'typesetting', 'mockup'],
    usageCount: 184000,
    componentKey: 'LoremIpsumGenerator'
  },
  {
    id: 'duplicate-line-remover',
    name: 'Duplicate Line Remover',
    category: 'text',
    description: 'Clean up lists by automatically stripping exact duplicate lines, sorting alphabetically, and trimming whitespace.',
    icon: 'ListChecks',
    keywords: ['duplicate lines', 'unique', 'clean text', 'sort list', 'deduplicate'],
    usageCount: 94000,
    componentKey: 'DuplicateLineRemover'
  },
  {
    id: 'text-diff-checker',
    name: 'Text Difference Comparison',
    category: 'text',
    description: 'Compare two text blocks side-by-side to highlight added, deleted, and modified words.',
    icon: 'Columns',
    keywords: ['diff', 'compare text', 'difference', 'version control', 'plagiarism'],
    usageCount: 112000,
    componentKey: 'TextDiffChecker'
  },

  // SEO TOOLS
  {
    id: 'meta-tag-generator',
    name: 'SEO Meta Tag Generator',
    category: 'seo',
    description: 'Generate search engine optimized HTML title tags, meta descriptions, Open Graph, and Twitter Cards.',
    icon: 'Globe',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['seo', 'meta tag', 'open graph', 'twitter card', 'html head', 'google rank'],
    usageCount: 198000,
    componentKey: 'MetaTagGenerator'
  },
  {
    id: 'slug-generator',
    name: 'URL Slug Generator',
    category: 'seo',
    description: 'Convert blog post titles into clean, lowercase, ASCII URL slugs optimized for SEO.',
    icon: 'Hash',
    keywords: ['slug', 'url', 'permalink', 'clean url', 'seo', 'hyphenate'],
    usageCount: 143000,
    componentKey: 'SlugGenerator'
  },
  {
    id: 'keyword-density-checker',
    name: 'Keyword Density Analyzer',
    category: 'seo',
    description: 'Analyze text content to find top 1-word, 2-word, and 3-word keyword frequency percentages.',
    icon: 'BarChart2',
    keywords: ['keyword density', 'seo content', 'frequency', 'analyzer', 'copywriting'],
    usageCount: 105000,
    componentKey: 'KeywordDensityChecker'
  },
  {
    id: 'robots-txt-generator',
    name: 'robots.txt File Builder',
    category: 'seo',
    description: 'Create customized search engine crawler directives and sitemap locations for your website.',
    icon: 'Bot',
    keywords: ['robots.txt', 'crawler', 'googlebot', 'sitemap', 'seo directives'],
    usageCount: 76000,
    componentKey: 'RobotsTxtGenerator'
  },

  // IMAGE TOOLS
  {
    id: 'aspect-ratio-calculator',
    name: 'Aspect Ratio Calculator',
    category: 'image',
    description: 'Calculate image width and height dimensions for 16:9, 4:3, 1:1, 21:9 displays.',
    icon: 'Maximize2',
    featured: true,
    popular: true,
    keywords: ['aspect ratio', 'image resolution', '16:9', '1080p', '4k', 'resize'],
    usageCount: 167000,
    componentKey: 'AspectRatioCalculator'
  },
  {
    id: 'color-picker-tool',
    name: 'Color Converter (HEX/RGB/HSL)',
    category: 'image',
    description: 'Convert between HEX, RGB, RGBA, HSL, and CMYK color codes with live visual contrast preview.',
    icon: 'Palette',
    trending: true,
    popular: true,
    keywords: ['color picker', 'hex', 'rgb', 'hsl', 'css colors', 'palette', 'contrast'],
    usageCount: 231000,
    componentKey: 'ColorPickerTool'
  },
  {
    id: 'image-to-base64',
    name: 'Image to Base64 Data URI',
    category: 'image',
    description: 'Convert PNG, JPG, SVG, or WEBP image files directly into inline CSS/HTML Base64 strings.',
    icon: 'FileImage',
    keywords: ['image to base64', 'data uri', 'inline image', 'css sprite', 'converter'],
    usageCount: 134000,
    componentKey: 'ImageToBase64'
  },

  // PDF TOOLS
  {
    id: 'pdf-page-estimator',
    name: 'PDF Word to Page Estimator',
    category: 'pdf',
    description: 'Estimate number of printed PDF or paperback pages based on word count, font size, and spacing.',
    icon: 'BookOpen',
    keywords: ['pdf pages', 'word to page', 'book layout', 'printing estimate', 'typesetting'],
    usageCount: 68000,
    componentKey: 'PdfPageEstimator'
  },
  {
    id: 'pdf-metadata-inspector',
    name: 'PDF Metadata Reader Info',
    category: 'pdf',
    description: 'Learn about PDF document security flags, standard encryption structures, and offline viewing capabilities.',
    icon: 'FileCheck',
    keywords: ['pdf', 'metadata', 'inspector', 'document properties', 'security'],
    usageCount: 52000,
    componentKey: 'PdfMetadataInspector'
  },

  // UTILITY TOOLS
  {
    id: 'password-generator',
    name: 'Secure Password Generator',
    category: 'utility',
    description: 'Generate high-entropy cryptographic passwords with custom symbols, numbers, and strength estimator.',
    icon: 'Lock',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['password generator', 'secure', 'random', 'strong password', 'cybersecurity'],
    usageCount: 389000,
    componentKey: 'PasswordGenerator'
  },
  {
    id: 'qrcode-generator',
    name: 'QR Code Generator',
    category: 'utility',
    description: 'Generate high-resolution SVG/Canvas QR codes for URLs, WiFi networks, emails, and phone numbers.',
    icon: 'QrCode',
    trending: true,
    featured: true,
    popular: true,
    keywords: ['qr code', 'qrcode generator', 'barcode', 'wifi qr', 'vcard', 'url'],
    usageCount: 342000,
    componentKey: 'QrcodeGenerator'
  },
  {
    id: 'unix-timestamp-converter',
    name: 'Unix Epoch Timestamp Converter',
    category: 'utility',
    description: 'Convert Unix epoch seconds/milliseconds to human-readable UTC and local date strings.',
    icon: 'Clock',
    popular: true,
    keywords: ['timestamp', 'unix epoch', 'time converter', 'utc', 'date formatting'],
    usageCount: 215000,
    componentKey: 'UnixTimestampConverter'
  },
  {
    id: 'unit-converter',
    name: 'Universal Unit Converter',
    category: 'utility',
    description: 'Convert length, weight, temperature, data storage (bytes/GB), and speed measurements.',
    icon: 'RefreshCw',
    popular: true,
    keywords: ['unit converter', 'length', 'weight', 'celsius to fahrenheit', 'kilograms to pounds'],
    usageCount: 284000,
    componentKey: 'UnitConverter'
  },
  {
    id: 'stopwatch-timer',
    name: 'Precision Stopwatch & Timer',
    category: 'utility',
    description: 'Online countdown timer and lap stopwatch with audio alerts and offline background persistence.',
    icon: 'Timer',
    keywords: ['stopwatch', 'timer', 'countdown', 'lap time', 'pomodoro', 'alarm'],
    usageCount: 154000,
    componentKey: 'StopwatchTimer'
  },

  // AI TOOLS (FUTURE READY)
  {
    id: 'ai-prompt-optimizer',
    name: 'AI Prompt Structure Optimizer',
    category: 'ai',
    description: 'Enhance your ChatGPT, Claude, and Gemini prompts with structured role definitions, context constraints, and output formats.',
    icon: 'Sparkles',
    trending: true,
    featured: true,
    keywords: ['ai prompt', 'prompt engineering', 'chatgpt', 'gemini', 'claude', 'system prompt'],
    usageCount: 189000,
    componentKey: 'AiPromptOptimizer'
  },
  {
    id: 'ai-token-counter',
    name: 'LLM Token Estimator',
    category: 'ai',
    description: 'Estimate BPE token counts and context window utilization for modern large language models.',
    icon: 'Cpu',
    keywords: ['tokens', 'llm', 'token counter', 'bpe', 'context window', 'ai pricing'],
    usageCount: 132000,
    componentKey: 'AiTokenCounter'
  },
  {
    id: 'markdown-table-generator',
    name: 'Markdown Table Generator',
    category: 'ai',
    description: 'Create clean, aligned ASCII Markdown tables from CSV or spreadsheet copy-paste.',
    icon: 'Table',
    keywords: ['markdown table', 'github flavored markdown', 'csv to markdown', 'readme'],
    usageCount: 118000,
    componentKey: 'MarkdownTableGenerator'
  }
];
