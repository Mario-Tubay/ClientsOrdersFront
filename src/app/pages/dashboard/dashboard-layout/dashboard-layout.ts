import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-dashboard-layout',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './dashboard-layout.html',
})
export class DashboardLayout {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected readonly user = this.authService.currentUser;
  protected readonly userName = computed(() => this.user()?.fullName || 'Usuario');
  protected readonly userEmail = computed(() => this.user()?.email || 'usuario@torresytorres.com');

  onLogout(): void {
    this.authService.logout();
  }
}
