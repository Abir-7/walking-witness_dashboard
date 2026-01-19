export interface TProjectRes {
  count: number;
  total_pages: number;
  current_page: number;
  results: TProject[];
}

export interface TProject {
  id: number;
  title: string;
  program: {
    id: number;
    name: string;
    image: string;
  };
  category: {
    id: number;
    name: string;
    image: string;
  };
  cover_image: string;
  village: string;
  location: string;
  pastor_name: string;
  sponsor_name: string;
  established_date: string; // ISO date string
  project_details: string;
  recent_updates: string;
  project_stories: string;
  total_benefited_families: number;
  impact: string;
  status: "published" | "draft" | string; // you can add other statuses if needed
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  pastor_support_prices: PastorSupportPrice[];
  livestock_items: LivestockItem[];
  other_supports: OtherSupport[];
}

export interface PastorSupportPrice {
  id: number;
  amount: string;
  currency: string;
}

export interface LivestockItem {
  id: number;
  name: string;
  quantity: number;
  amount: string;
  currency: string;
}

export interface OtherSupport {
  id: number;
  amount: string;
  currency: string;
}
