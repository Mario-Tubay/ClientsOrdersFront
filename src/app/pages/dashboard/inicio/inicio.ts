import { Component, computed, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

export interface RecentOrder {
  id: string;
  orderNumber: string;
  clientName: string;
  date: string;
  status: 'Completed' | 'Pending' | 'Cancelled';
  total: number;
}

export interface ActivityMonth {
  month: string;
  orders: number;
  percentage: number;
}

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
})
export class Inicio {
  protected readonly totalOrders = signal(148);
  protected readonly completedOrders = signal(108);
  protected readonly pendingOrders = signal(32);
  protected readonly cancelledOrders = signal(8);
  protected readonly activeClients = signal(45);

  protected readonly completionRate = computed(() => {
    const total = this.totalOrders();
    if (total === 0) return 0;
    return Math.round((this.completedOrders() / total) * 100);
  });

  protected readonly activityData = signal<ActivityMonth[]>([
    { month: 'Mayo', orders: 18, percentage: 35 },
    { month: 'Junio', orders: 24, percentage: 48 },
    { month: 'Julio', orders: 31, percentage: 62 },
    { month: 'Agosto', orders: 28, percentage: 56 },
    { month: 'Septiembre', orders: 38, percentage: 76 },
    { month: 'Octubre', orders: 49, percentage: 100 },
  ]);

  protected readonly recentOrders = signal<RecentOrder[]>([
    {
      id: '1',
      orderNumber: 'PED-2026-001',
      clientName: 'Importadora Andina S.A.',
      date: '07 Oct 2026',
      status: 'Completed',
      total: 1250.0,
    },
    {
      id: '2',
      orderNumber: 'PED-2026-002',
      clientName: 'Logística del Pacífico Cía.',
      date: '07 Oct 2026',
      status: 'Pending',
      total: 3420.5,
    },
    {
      id: '3',
      orderNumber: 'PED-2026-003',
      clientName: 'Distribuidora Guayas',
      date: '06 Oct 2026',
      status: 'Completed',
      total: 890.0,
    },
    {
      id: '4',
      orderNumber: 'PED-2026-004',
      clientName: 'Corporación Marítima',
      date: '05 Oct 2026',
      status: 'Cancelled',
      total: 2100.0,
    },
    {
      id: '5',
      orderNumber: 'PED-2026-005',
      clientName: 'Comercializadora Torres',
      date: '04 Oct 2026',
      status: 'Completed',
      total: 4500.0,
    },
  ]);
}
