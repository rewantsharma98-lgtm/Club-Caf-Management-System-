const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

type RequestOptions = RequestInit & { token?: string };

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { token, headers, ...rest } = options;
  let res: Response;
  try {
    res = await fetch(`${API_URL}${endpoint}`, {
      ...rest,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...headers,
      },
    });
  } catch {
    throw new Error(
      'Cannot reach the API. Start the backend: cd backend && npm run dev (and connect MongoDB).'
    );
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.errors?.[0]?.msg || 'Request failed');
  }
  return data;
}

export const api = {
  // Public
  getEvents: () => request<{ success: boolean; data: EventItem[] }>('/events'),
  createReservation: (body: ReservationInput) =>
    request<{ success: boolean; data: Reservation }>('/reservations', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  getAvailableTables: (params: { date: string; time: string; guests: string; branchId?: string }) =>
    request<{ success: boolean; data: VenueTable[] }>(
      `/tables/available?${new URLSearchParams(params)}`
    ),
  getMenu: () => request<{ success: boolean; data: MenuData }>('/menu'),
  getMenuByQr: (code: string) =>
    request<{ success: boolean; data: QrMenuData }>(`/menu/qr/${encodeURIComponent(code)}`),

  // Auth
  login: (email: string, password: string) =>
    request<{ success: boolean; token: string; user: AdminUser; redirect?: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  verify: (token: string) =>
    request<{ success: boolean; user: AdminUser }>('/auth/verify', { token }),

  // Admin
  getStats: (token: string) =>
    request<{ success: boolean; stats: DashboardStats; recent: Reservation[] }>(
      '/reservations/stats',
      { token }
    ),
  getReservations: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: Reservation[]; pagination: Pagination }>(
      `/reservations${query}`,
      { token }
    );
  },
  updateReservation: (token: string, id: string, body: Partial<Reservation>) =>
    request<{ success: boolean; data: Reservation }>(`/reservations/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(body),
    }),
  approveReservation: (token: string, id: string) =>
    request<{ success: boolean; data: Reservation }>(`/reservations/${id}/approve`, {
      method: 'PATCH',
      token,
    }),
  deleteReservation: (token: string, id: string) =>
    request<{ success: boolean }>(`/reservations/${id}`, { method: 'DELETE', token }),

  getCustomers: (token: string, params?: Record<string, string>) => {
    const query = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: Customer[]; pagination: Pagination }>(
      `/customers${query}`,
      { token }
    );
  },
  getCustomer: (token: string, id: string) =>
    request<{ success: boolean; data: Customer }>(`/customers/${id}`, { token }),

  createEvent: (token: string, body: EventInput) =>
    request<{ success: boolean; data: EventItem }>('/events', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
  updateEvent: (token: string, id: string, body: Partial<EventInput>) =>
    request<{ success: boolean; data: EventItem }>(`/events/${id}`, {
      method: 'PUT',
      token,
      body: JSON.stringify(body),
    }),
  deleteEvent: (token: string, id: string) =>
    request<{ success: boolean }>(`/events/${id}`, { method: 'DELETE', token }),

  // Analytics
  getBusinessAnalytics: (token: string, params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: BusinessAnalytics }>(`/analytics/business${q}`, { token });
  },
  getPlatformAnalytics: (token: string) =>
    request<{ success: boolean; data: PlatformAnalytics }>('/analytics/platform', { token }),

  // Branches
  getBranches: (token: string, params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: Branch[] }>(`/branches${q}`, { token });
  },
  createBranch: (token: string, body: Partial<Branch>) =>
    request<{ success: boolean; data: Branch }>('/branches', { method: 'POST', token, body: JSON.stringify(body) }),

  // Loyalty
  getRewards: (params?: Record<string, string>) => {
    const q = params ? `?${new URLSearchParams(params)}` : '';
    return request<{ success: boolean; data: Reward[] }>(`/loyalty/rewards${q}`);
  },
  createReward: (token: string, body: Partial<Reward>) =>
    request<{ success: boolean; data: Reward }>('/loyalty/rewards', { method: 'POST', token, body: JSON.stringify(body) }),
  deleteReward: (token: string, id: string) =>
    request<{ success: boolean }>(`/loyalty/rewards/${id}`, { method: 'DELETE', token }),

  // Automation
  getAutomationRules: (token: string) =>
    request<{ success: boolean; data: AutomationRule[] }>('/automation', { token }),
  createAutomationRule: (token: string, body: Partial<AutomationRule>) =>
    request<{ success: boolean; data: AutomationRule }>('/automation', { method: 'POST', token, body: JSON.stringify(body) }),
  deleteAutomationRule: (token: string, id: string) =>
    request<{ success: boolean }>(`/automation/${id}`, { method: 'DELETE', token }),

  // Notifications
  getAdminNotifications: (token: string) =>
    request<{ success: boolean; data: NotificationItem[] }>('/notifications', { token }),

  // QR
  verifyQR: (token: string) =>
    request<{ success: boolean; valid: boolean; message?: string }>(`/qr/verify/${token}`),
  scanQR: (token: string, qrToken: string) =>
    request<{ success: boolean; valid: boolean; message?: string }>(`/qr/scan/${qrToken}`, { method: 'POST', token }),

  // Super Admin
  getSuperOverview: (token: string) =>
    request<{ success: boolean; analytics: PlatformAnalytics; recentLogs: unknown[] }>('/super-admin/overview', { token }),
  getBusinesses: (token: string) =>
    request<{ success: boolean; data: Business[] }>('/businesses', { token }),
  getAuditLogs: (token: string) =>
    request<{ success: boolean; data: unknown[] }>('/super-admin/audit-logs', { token }),

  // Portal
  portalRegister: (body: PortalRegisterInput) =>
    request<{ success: boolean; token: string; customer: PortalCustomer }>('/portal/register', {
      method: 'POST',
      body: JSON.stringify(body),
    }),
  portalLogin: (email: string, password: string) =>
    request<{ success: boolean; token: string; customer: PortalCustomer }>('/portal/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  portalDashboard: (token: string) =>
    request<{ success: boolean; loyalty: LoyaltyDashboard; reservations: Reservation[]; notifications: NotificationItem[]; unreadCount: number; membership: MembershipInfo; offers: Offer[] }>(
      '/portal/dashboard',
      { token }
    ),
  portalLoyalty: (token: string) =>
    request<{ success: boolean; data: LoyaltyDashboard }>('/portal/loyalty', { token }),
  portalRedeem: (token: string, rewardId: string) =>
    request<{ success: boolean; data: unknown }>('/portal/loyalty/redeem', {
      method: 'POST',
      token,
      body: JSON.stringify({ rewardId }),
    }),
  portalNotifications: (token: string) =>
    request<{ success: boolean; data: NotificationItem[] }>('/portal/notifications', { token }),
  portalQRs: (token: string) =>
    request<{ success: boolean; data: QRItem[] }>('/portal/qr', { token }),
  portalGetProfile: (token: string) =>
    request<{ success: boolean; data: PortalProfile }>('/portal/me', { token }),
  portalUpdateProfile: (token: string, body: Partial<PortalProfile>) =>
    request<{ success: boolean; data: PortalProfile }>('/portal/me', {
      method: 'PUT',
      token,
      body: JSON.stringify(body),
    }),
  portalMembership: (token: string) =>
    request<{
      success: boolean;
      membership: MembershipInfo;
      loyalty: LoyaltyDashboard;
      tierHistory?: { tier: string; since?: string }[];
    }>('/portal/membership', { token }),
  portalMarkNotificationRead: (token: string, id: string) =>
    request<{ success: boolean }>(`/portal/notifications/${id}/read`, { method: 'PATCH', token }),
  portalMarkAllNotificationsRead: (token: string) =>
    request<{ success: boolean }>('/portal/notifications/read-all', { method: 'PATCH', token }),
  sendNotification: (token: string, body: Record<string, unknown>) =>
    request<{ success: boolean }>('/notifications/send', { method: 'POST', token, body: JSON.stringify(body) }),
  getPlans: (token: string) =>
    request<{ success: boolean; data: SubscriptionPlan[] }>('/super-admin/plans', { token }),
  onboardBusiness: (token: string, body: Record<string, unknown>) =>
    request<{ success: boolean }>('/super-admin/onboard', { method: 'POST', token, body: JSON.stringify(body) }),
  assignSubscription: (token: string, body: { businessId: string; planId: string; status?: string }) =>
    request<{ success: boolean }>('/super-admin/subscriptions', {
      method: 'POST',
      token,
      body: JSON.stringify(body),
    }),
};

export interface PortalProfile {
  id?: string;
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  tier?: string;
  points?: number;
  preferences?: {
    seatingPreference?: string;
    favoriteDrinks?: string[];
    favoriteEvents?: string[];
    dietaryNotes?: string;
  };
  membership?: MembershipInfo;
}

export interface SubscriptionPlan {
  _id: string;
  name: string;
  slug: string;
  priceMonthly: number;
  maxBranches: number;
  features: string[];
}

export type ReservationStatus = 'Pending' | 'Approved' | 'Rejected' | 'Completed';

export interface Reservation {
  _id: string;
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: 'Indoor' | 'Outdoor';
  specialRequest?: string;
  table?: string;
  tableLabel?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface ReservationInput {
  customerName: string;
  phone: string;
  email: string;
  date: string;
  time: string;
  guests: number;
  seatingPreference: 'Indoor' | 'Outdoor';
  specialRequest?: string;
  table?: string;
}

export interface VenueTable {
  _id: string;
  number: number;
  label: string;
  capacity: number;
  type: string;
  zone: string;
  available: boolean;
}

export interface MenuItemRecord {
  _id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  isFeatured?: boolean;
}

export interface MenuData {
  categories: { key: string; label: string; items: MenuItemRecord[] }[];
  featured: MenuItemRecord[];
}

export interface QrMenuData {
  table: { _id: string; label: string; number: number; zone: string };
  items: MenuItemRecord[];
}

export interface EventItem {
  _id: string;
  title: string;
  image: string;
  description: string;
  date: string;
  featured?: boolean;
}

export interface EventInput {
  title: string;
  image: string;
  description: string;
  date: string;
  featured?: boolean;
}

export interface Customer {
  _id: string;
  name: string;
  phone: string;
  email: string;
  reservations: Reservation[];
  totalVisits: number;
  createdAt: string;
}

export interface AdminUser {
  id: string;
  username: string;
  email: string;
  role: string;
  business?: string;
  branch?: string;
}

export interface Business {
  _id: string;
  name: string;
  slug: string;
  type: string;
  isActive: boolean;
}

export interface Branch {
  _id: string;
  name: string;
  code: string;
  address: string;
  capacity: number;
  business?: string;
}

export interface Reward {
  _id: string;
  title: string;
  description: string;
  pointsCost: number;
  category: string;
  vipOnly?: boolean;
}

export interface AutomationRule {
  _id: string;
  name: string;
  trigger: string;
  action: string;
  isActive: boolean;
  config?: Record<string, unknown>;
}

export interface NotificationItem {
  _id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

export interface PortalCustomer {
  id: string;
  name: string;
  email: string;
  tier: string;
  points: number;
}

export interface PortalRegisterInput {
  name: string;
  email: string;
  phone: string;
  password: string;
  businessSlug?: string;
}

export interface LoyaltyDashboard {
  points: number;
  lifetimePoints: number;
  tier: string;
  nextTier: string | null;
  pointsToNextTier: number;
  history: { type: string; points: number; description: string; createdAt: string }[];
  redemptions: unknown[];
}

export interface MembershipInfo {
  tier: string;
  benefits: string[];
  lifetimePoints: number;
  nextTier: string | null;
}

export interface Offer {
  title: string;
  description: string;
  expiresAt?: string;
}

export interface QRItem {
  _id: string;
  type: string;
  token: string;
  expiresAt?: string;
}

export interface BusinessAnalytics {
  overview: {
    totalReservations: number;
    completedReservations: number;
    pendingReservations: number;
    totalCustomers: number;
    repeatCustomers: number;
    retentionRate: number;
    loyaltyPointsIssued: number;
  };
  bookingGrowth: { label: string; value: number }[];
  peakHours: { hour: string; count: number }[];
  eventPerformance: { title: string; fillRate: number }[];
  insights: string[];
}

export interface PlatformAnalytics {
  overview: { businesses: number; activeSubs: number; totalReservations: number; totalCustomers: number };
  platformHealth: string;
}

export interface DashboardStats {
  total: number;
  pending: number;
  approved: number;
  todayBookings: number;
}

export interface Pagination {
  total: number;
  page: number;
  pages: number;
}
