export interface Growth {
  growth_percent: number;
  status: "increase" | "decrease" | "stable";
}

export interface Summary {
  total_earning: number;
  total_donation: number;
  total_users: number;
  total_views: number;
  earning_growth: Growth;
  donation_growth: Growth;
  user_growth: Growth;
  views_growth: Growth;
}

export interface MonthlyViews {
  labels: string[];
  current_year: number[];
  last_year: number[];
}

export interface LatestUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  role: string;
  status: string;
  joined_date: string;
  avatar?: string;
}

export interface EarningActivity {
  US: number;
  Canada: number;
  Mexico: number;
  Others: number;
}

export interface AdminDashboardResponse {
  summary: Summary;
  monthly_views: MonthlyViews;
  latest_users: LatestUser[];
  earning_activity: EarningActivity;
}

export interface UserListResponse {
  message: string;
  total_users: number;
  num_pages: number;
  current_page: number;
  data: LatestUser[];
}
