import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DashboardService } from '../../../core/services/dashboard.service';
import { MonthlyActivityItem, RecentOrderSummary } from '../../../models/dashboard.models';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink],
  templateUrl: './inicio.html',
})
export class Inicio implements OnInit {
  private readonly dashboardService = inject(DashboardService);

  protected readonly totalOrders = signal(0);
  protected readonly completedOrders = signal(0);
  protected readonly pendingOrders = signal(0);
  protected readonly cancelledOrders = signal(0);
  protected readonly activeClients = signal(0);
  protected readonly completionRate = signal(0);
  protected readonly totalRevenue = signal(0);
  protected readonly loading = signal(true);

  protected readonly pendingRate = computed(() => {
    const total = this.totalOrders();
    return total > 0 ? Math.round((this.pendingOrders() / total) * 100) : 0;
  });

  protected readonly cancelledRate = computed(() => {
    const total = this.totalOrders();
    return total > 0 ? Math.round((this.cancelledOrders() / total) * 100) : 0;
  });

  protected readonly activityData = signal<MonthlyActivityItem[]>([]);
  protected readonly recentOrders = signal<RecentOrderSummary[]>([]);

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.loading.set(true);
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.totalOrders.set(data.totalOrders);
        this.completedOrders.set(data.completedOrders);
        this.pendingOrders.set(data.pendingOrders);
        this.cancelledOrders.set(data.cancelledOrders);
        this.activeClients.set(data.activeClients);
        this.completionRate.set(data.completionRate);
        this.totalRevenue.set(data.totalRevenue);
        this.activityData.set(data.monthlyActivity);
        this.recentOrders.set(data.recentOrders);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
