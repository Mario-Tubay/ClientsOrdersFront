import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../components/button/button';
import { Input } from '../../../components/input/input';

export interface ClientItem {
  id: string;
  documentNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  totalOrders: number;
}

@Component({
  selector: 'app-cliente',
  imports: [FormsModule, Button, Input],
  templateUrl: './cliente.html',
})
export class Cliente {
  protected readonly searchQuery = signal('');
  protected readonly filterStatus = signal<'all' | 'active' | 'inactive'>('all');
  protected readonly isModalOpen = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly editingId = signal<string | null>(null);

  protected formDocNumber = signal('');
  protected formFullName = signal('');
  protected formEmail = signal('');
  protected formPhone = signal('');
  protected formAddress = signal('');
  protected formIsActive = signal(true);

  protected readonly clients = signal<ClientItem[]>([
    {
      id: '1',
      documentNumber: '0992345678001',
      fullName: 'Importadora Andina S.A.',
      email: 'contacto@andina.com.ec',
      phone: '+593 4 234 5678',
      address: 'Av. Juan Tanca Marengo Km 4.5',
      isActive: true,
      totalOrders: 14,
    },
    {
      id: '2',
      documentNumber: '1791234567001',
      fullName: 'Logística del Pacífico Cía.',
      email: 'operaciones@pacificolog.com',
      phone: '+593 2 543 2100',
      address: 'Parque Industrial Sur, Lote 12',
      isActive: true,
      totalOrders: 28,
    },
    {
      id: '3',
      documentNumber: '0998765432001',
      fullName: 'Distribuidora Guayas',
      email: 'ventas@distguayas.ec',
      phone: '+593 4 600 7890',
      address: 'Km 14 Vía a Daule',
      isActive: true,
      totalOrders: 9,
    },
    {
      id: '4',
      documentNumber: '0991122334001',
      fullName: 'Corporación Marítima',
      email: 'gerencia@maritima.com',
      phone: '+593 4 288 9900',
      address: 'Puerto Marítimo de Guayaquil',
      isActive: false,
      totalOrders: 3,
    },
  ]);

  protected readonly filteredClients = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const status = this.filterStatus();

    return this.clients().filter((c) => {
      const matchesSearch =
        !q ||
        c.fullName.toLowerCase().includes(q) ||
        c.documentNumber.includes(q) ||
        c.email.toLowerCase().includes(q);

      const matchesStatus =
        status === 'all' ||
        (status === 'active' && c.isActive) ||
        (status === 'inactive' && !c.isActive);

      return matchesSearch && matchesStatus;
    });
  });

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.formDocNumber.set('');
    this.formFullName.set('');
    this.formEmail.set('');
    this.formPhone.set('');
    this.formAddress.set('');
    this.formIsActive.set(true);
    this.isModalOpen.set(true);
  }

  openEditModal(client: ClientItem): void {
    this.isEditing.set(true);
    this.editingId.set(client.id);
    this.formDocNumber.set(client.documentNumber);
    this.formFullName.set(client.fullName);
    this.formEmail.set(client.email);
    this.formPhone.set(client.phone);
    this.formAddress.set(client.address);
    this.formIsActive.set(client.isActive);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  saveClient(): void {
    if (!this.formFullName().trim() || !this.formDocNumber().trim()) return;

    if (this.isEditing()) {
      this.clients.update((prev) =>
        prev.map((c) =>
          c.id === this.editingId()
            ? {
                ...c,
                documentNumber: this.formDocNumber().trim(),
                fullName: this.formFullName().trim(),
                email: this.formEmail().trim(),
                phone: this.formPhone().trim(),
                address: this.formAddress().trim(),
                isActive: this.formIsActive(),
              }
            : c
        )
      );
    } else {
      const newClient: ClientItem = {
        id: Date.now().toString(),
        documentNumber: this.formDocNumber().trim(),
        fullName: this.formFullName().trim(),
        email: this.formEmail().trim(),
        phone: this.formPhone().trim(),
        address: this.formAddress().trim(),
        isActive: this.formIsActive(),
        totalOrders: 0,
      };
      this.clients.update((prev) => [newClient, ...prev]);
    }

    this.closeModal();
  }

  deleteClient(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;
    this.clients.update((prev) => prev.filter((c) => c.id !== id));
  }
}
