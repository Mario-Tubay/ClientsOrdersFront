import { Component, computed, input, output } from '@angular/core';

export type ButtonVariant = 'primary' | 'success' | 'danger' | 'warning' | 'disabled' | 'secondary';

@Component({
  selector: 'app-button',
  imports: [],
  templateUrl: './button.html',
  // styleUrl: './',
})
export class Button {
  label = input<string>('Aceptar');
  variant = input<ButtonVariant>('primary');
  type = input<'button' | 'submit' | 'reset'>('button');
  loading = input<boolean>(false);
  disabled = input<boolean>(false);

  clicked = output<MouseEvent>();

  isDisabled = computed(() => this.disabled() || this.variant() === 'disabled' || this.loading());

  buttonClasses = computed(() => {
    const base =
      'w-full inline-flex items-center justify-center font-semibold text-sm px-5 py-2.5 rounded-xl transition-all duration-150 shadow-sm cursor-pointer disabled:cursor-not-allowed active:scale-[0.985] select-none';

    const variants: Record<ButtonVariant, string> = {
      primary: 'bg-[#0091CA] hover:bg-[#007BB0] text-white shadow-[#0091CA]/20 hover:shadow-[#007BB0]/30 border border-[#0071A0]/20',
      success: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20 border border-emerald-700/20',
      danger: 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/20 border border-rose-700/20',
      warning: 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/20 border border-amber-700/20',
      secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 shadow-sm',
      disabled: 'bg-slate-200 text-slate-400 border border-slate-300/80 cursor-not-allowed opacity-70 shadow-none',
    };

    return `${base} ${variants[this.variant()]}`;
  });



}
