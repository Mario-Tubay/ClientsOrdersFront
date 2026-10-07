import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Button } from '../../../components/button/button';
import { Input } from '../../../components/input/input';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [Button, Input, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected firstName = signal('');
  protected lastName = signal('');
  protected email = signal('');
  protected password = signal('');
  protected loading = signal(false);
  protected errorMessage = signal('');

  // Validaciones reactivas de la contraseña
  protected hasMinLength = computed(() => this.password().length >= 8);
  protected hasUppercase = computed(() => /[A-Z]/.test(this.password()));
  protected hasNumber = computed(() => /\d/.test(this.password()));
  protected hasSpecialChar = computed(() => /[^a-zA-Z0-9]/.test(this.password()));
  
  protected isPasswordValid = computed(() =>
    this.hasMinLength() &&
    this.hasUppercase() &&
    this.hasNumber() &&
    this.hasSpecialChar()
  );

  onRegister(): void {
    if (
      !this.firstName().trim() ||
      !this.lastName().trim() ||
      !this.email().trim() ||
      !this.password()
    ) {
      this.errorMessage.set('Por favor completa todos los campos obligatorios.');
      return;
    }

    // Validaciones estrictas de contraseña
    if (!this.hasMinLength()) {
      this.errorMessage.set('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    if (!this.hasUppercase()) {
      this.errorMessage.set('La contraseña debe contener al menos una letra mayúscula (A-Z).');
      return;
    }

    if (!this.hasNumber()) {
      this.errorMessage.set('La contraseña debe contener al menos un número (0-9).');
      return;
    }

    if (!this.hasSpecialChar()) {
      this.errorMessage.set('La contraseña debe contener al menos un carácter especial (!@#$%...).');
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    this.authService
      .register({
        firstName: this.firstName().trim(),
        lastName: this.lastName().trim(),
        email: this.email().trim(),
        password: this.password(),
      })
      .subscribe({
        next: () => {
          this.loading.set(false);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.loading.set(false);
          // Captura mensajes directos o de validación de ModelState de .NET
          const firstValidationError = err.error?.errors
            ? Object.values(err.error.errors).flat()[0]
            : null;

          const msg =
            err.error?.message ||
            firstValidationError ||
            'Error al crear la cuenta. Verifica que los datos cumplan los requisitos.';
          this.errorMessage.set(String(msg));
        },
      });
  }
}
