import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../components/button/button';
import { Input } from '../../../components/input/input';
import { ClientService } from '../../../core/services/client.service';
import { ClientItem, CreateClientRequest, UpdateClientRequest } from '../../../models/client.models';

@Component({
  selector: 'app-cliente',
  imports: [FormsModule, Button, Input],
  templateUrl: './cliente.html',
})
export class Cliente implements OnInit {
  private readonly clientService = inject(ClientService);

  protected readonly searchQuery = signal('');
  protected readonly filterStatus = signal<'all' | 'active' | 'inactive'>('all');
  protected readonly isModalOpen = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  protected formDocNumber = signal('');
  protected formFullName = signal('');
  protected formEmail = signal('');
  protected formPhone = signal('');
  protected formAddress = signal('');
  protected formIsActive = signal(true);

  protected readonly clients = signal<ClientItem[]>([]);

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

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading.set(true);
    this.clientService.getClients().subscribe({
      next: (data) => {
        this.clients.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al cargar clientes.');
        this.loading.set(false);
      },
    });
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.formDocNumber.set('');
    this.formFullName.set('');
    this.formEmail.set('');
    this.formPhone.set('');
    this.formAddress.set('');
    this.formIsActive.set(true);
    this.errorMessage.set('');
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
    this.errorMessage.set('');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.errorMessage.set('');
  }

  saveClient(): void {
    if (!this.formFullName().trim() || !this.formDocNumber().trim() || !this.formEmail().trim()) {
      this.errorMessage.set('Por favor completa todos los campos obligatorios.');
      return;
    }

    if (this.isEditing() && this.editingId()) {
      const payload: UpdateClientRequest = {
        documentNumber: this.formDocNumber().trim(),
        fullName: this.formFullName().trim(),
        email: this.formEmail().trim(),
        phone: this.formPhone().trim(),
        address: this.formAddress().trim(),
        isActive: this.formIsActive(),
      };

      this.clientService.updateClient(this.editingId()!, payload).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Error al actualizar el cliente.');
        },
      });
    } else {
      const payload: CreateClientRequest = {
        documentNumber: this.formDocNumber().trim(),
        fullName: this.formFullName().trim(),
        email: this.formEmail().trim(),
        phone: this.formPhone().trim(),
        address: this.formAddress().trim(),
        isActive: this.formIsActive(),
      };

      this.clientService.createClient(payload).subscribe({
        next: () => {
          this.loadClients();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Error al registrar el cliente.');
        },
      });
    }
  }

  deleteClient(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

    this.clientService.deleteClient(id).subscribe({
      next: () => {
        this.loadClients();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al eliminar cliente.');
      },
    });
  }
}
