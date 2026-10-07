import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../../components/button/button';
import { Input } from '../../../components/input/input';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [Button, Input, RouterLink],
  templateUrl: './login.html',
  // styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected email = signal('');
  protected password = signal('');
  protected loading = signal(false);
  protected errorMessage = signal('');

  onLogin(): void {
    if (!this.email() || !this.password()) {
      this.errorMessage.set('Por favor completa todos los campos.');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService
      .login({
        email: this.email(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          const msg =
            err.error?.message ||
            'Error al iniciar sesión. Verifica tus credenciales o el servidor.';
          this.errorMessage.set(msg);
        },
      });
  }
}
