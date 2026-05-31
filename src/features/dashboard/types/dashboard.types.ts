export interface DashboardUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface DashboardBooking {
  id: number;
  user_id: number;
  office_id: number;
  office_title: string;
  office_slug: string;
  price: number;
  duration: string;
  status: string;
  created_at: string;
  user?: { id: number; name: string; email: string };
}

export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string;
}

export type DashboardTheme = 'admin' | 'provider' | 'customer';
