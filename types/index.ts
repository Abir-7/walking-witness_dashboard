/* eslint-disable @typescript-eslint/no-explicit-any */
export type UserType = "Leader" | "Donor";

export interface User {
  id: string;
  full_name: string;
  email: string;
  phone_number: string;
  location: string;
  role: "user" | "admin"; // if only these roles exist
  status: "active" | "inactive"; // adjust based on your API
  joined_date: string; // ISO date string
  avatar?: string;
}

export interface Project {
  id: number;
  title: string;
  location: string;
  families: number;
  image?: string;
  tags?: string[];
}

export interface UserDetails extends User {
  joined: string; // Maybe same as date, but design has specific format sometimes
  earnings: string;
  projectsCount: number;
  earningsTrend: number;
  projectsTrend: number;
  projectList: Project[];
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: any;
}

export interface DoubleBarDataPoint {
  name: string;
  current: number;
  previous: number;
}
