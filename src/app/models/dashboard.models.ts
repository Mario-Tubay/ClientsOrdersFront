export interface RecentOrderSummary {
  id: string;
  orderNumber: string;
  clientName: string;
  date: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  total: number;
}

export interface MonthlyActivityItem {
  month: string;
  orders: number;
  percentage: number;
}

export interface DashboardStats {
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  cancelledOrders: number;
  activeClients: number;
  completionRate: number;
  totalRevenue: number;
  recentOrders: RecentOrderSummary[];
  monthlyActivity: MonthlyActivityItem[];
}
