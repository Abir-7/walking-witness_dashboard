// types/dashboard.ts
export interface Donation {
  donation_id: string;
  title: string;
  date: string;
  location: string;
  amount: number;
  support_type: string;
  payment_method: string;
  payment_status: string;
  donor: string;
}

export interface Growth {
  growth_percent: number;
  status: "increase" | "decrease";
}

export interface Summary {
  total_earning: number;
  total_donation: number;
  earning_growth: Growth;
  donation_growth: Growth;
}

export interface Pagination {
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface DonationsResponse {
  summary: Summary;
  pagination: Pagination;
  donations: Donation[];
}
