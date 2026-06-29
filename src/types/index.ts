export type PageType = 
  | 'home' 
  | 'all-tools' 
  | 'categories' 
  | 'blog' 
  | 'about' 
  | 'contact' 
  | 'privacy-policy' 
  | 'terms' 
  | 'disclaimer' 
  | 'sitemap' 
  | '404' 
  | 'offline' 
  | 'article-detail' 
  | 'tool-detail';

export type ToolCategory = 
  | 'calculator' 
  | 'image' 
  | 'pdf' 
  | 'text' 
  | 'developer' 
  | 'seo' 
  | 'utility' 
  | 'ai';

export interface CategoryMetadata {
  id: ToolCategory;
  name: string;
  description: string;
  icon: string;
  color: string;
  badgeCount: number;
}

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  description: string;
  icon: string;
  trending?: boolean;
  featured?: boolean;
  popular?: boolean;
  keywords: string[];
  usageCount: number;
  componentKey: string;
  formulas?: string[];
}

export interface BlogArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  imageUrl: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company: string;
  avatar: string;
  comment: string;
  rating: number;
}

export type AdBannerPosition = 'header' | 'sidebar' | 'in-content' | 'footer' | 'sticky-mobile';
