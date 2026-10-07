import { Component, computed, input, model, signal } from '@angular/core';

@Component({
  selector: 'app-input',
  imports: [],
  templateUrl: './input.html',
  // styleUrl: '',
})
export class Input {
  label = input<string>('');
  id = input<string>('input-' + Math.random().toString(36).substring(2, 9));
  type = input<'text' | 'email' | 'password' | 'number' | 'tel'>('text');
  placeholder = input<string>('');
  errorMessage = input<string>('');
  disabled = input<boolean>(false);
  icon = input<'email' | 'lock' | 'user' | ''>('');

  value = model<string>('');
  showPassword = signal(false);

  computedType = computed(() => {
    if (this.type() === 'password') {
      return this.showPassword() ? 'text' : 'password';
    }
    return this.type();
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((val) => !val);
  }

  onInput(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.value.set(target.value);
  }

  getInputStyles(): string {
    const base =
      'w-full py-2.5 bg-white border rounded-xl text-slate-900 placeholder-slate-400 text-sm focus:outline-none transition-all duration-150 shadow-sm';
    const leftPadding = this.icon() ? 'pl-3' : 'px-3.5';
    const rightPadding = this.type() === 'password' ? 'pr-10' : (this.icon() ? 'pr-3.5' : 'px-3.5');

    if (this.errorMessage()) {
      return `${base} ${leftPadding} ${rightPadding} border-rose-500 text-rose-900 focus:border-rose-600 focus:ring-4 focus:ring-rose-500/10`;
    }
    return `${base} ${leftPadding} ${rightPadding} border-slate-300 focus:border-[#0091CA] focus:ring-4 focus:ring-[#0091CA]/15 hover:border-slate-400`;
  }


}

