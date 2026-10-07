import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../components/button/button';
import { Input } from '../../../components/input/input';
import { ClientService } from '../../../core/services/client.service';
import { OrderService } from '../../../core/services/order.service';
import { CreateOrderRequest, OrderItemModel, OrderRecord, UpdateOrderRequest } from '../../../models/order.models';

@Component({
  selector: 'app-ordenes',
  imports: [FormsModule, Button, Input],
  templateUrl: './ordenes.html',
})
export class Ordenes implements OnInit {
  private readonly orderService = inject(OrderService);
  private readonly clientService = inject(ClientService);

  protected readonly searchQuery = signal('');
  protected readonly filterStatus = signal<string>('all');
  protected readonly filterClientId = signal<string>('all');
  protected readonly filterStartDate = signal<string>('');
  protected readonly filterEndDate = signal<string>('');

  protected readonly isModalOpen = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly editingId = signal<string | null>(null);
  protected readonly loading = signal(false);
  protected readonly errorMessage = signal('');

  protected formOrderNumber = signal('');
  protected formClientId = signal('');
  protected formNotes = signal('');
  protected formItems = signal<OrderItemModel[]>([
    { productName: 'Despacho Aduanero', quantity: 1, unitPrice: 450.0 },
  ]);

  protected readonly clientsList = signal<{ id: string; name: string }[]>([]);
  protected readonly orders = signal<OrderRecord[]>([]);

  protected readonly hasActiveFilters = computed(() => {
    return (
      !!this.searchQuery().trim() ||
      this.filterStatus() !== 'all' ||
      this.filterClientId() !== 'all' ||
      !!this.filterStartDate() ||
      !!this.filterEndDate()
    );
  });

  protected readonly filteredOrders = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.filterStatus();
    const clId = this.filterClientId();
    const start = this.filterStartDate();
    const end = this.filterEndDate();

    return this.orders().filter((o) => {
      const matchesSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.clientName.toLowerCase().includes(q) ||
        o.notes.toLowerCase().includes(q);

      const matchesStatus = st === 'all' || o.status.toLowerCase() === st.toLowerCase();
      const matchesClient = clId === 'all' || o.clientId === clId;

      const orderDateStr = o.orderDate ? o.orderDate.split('T')[0] : '';
      const matchesStart = !start || orderDateStr >= start;
      const matchesEnd = !end || orderDateStr <= end;

      return matchesSearch && matchesStatus && matchesClient && matchesStart && matchesEnd;
    });
  });

  protected readonly computedModalTotal = computed(() => {
    return this.formItems().reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  });

  ngOnInit(): void {
    this.loadOrders();
    this.loadClients();
  }

  loadOrders(): void {
    this.loading.set(true);
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        this.errorMessage.set(err.error?.message || 'Error al cargar los pedidos.');
        this.loading.set(false);
      },
    });
  }

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => {
        const mapped = data.map((c) => ({ id: c.id, name: c.fullName }));
        this.clientsList.set(mapped);
        if (mapped.length > 0 && !this.formClientId()) {
          this.formClientId.set(mapped[0].id);
        }
      },
    });
  }

  resetFilters(): void {
    this.searchQuery.set('');
    this.filterStatus.set('all');
    this.filterClientId.set('all');
    this.filterStartDate.set('');
    this.filterEndDate.set('');
  }

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.formOrderNumber.set('');
    if (this.clientsList().length > 0) {
      this.formClientId.set(this.clientsList()[0].id);
    }
    this.formNotes.set('');
    this.formItems.set([{ productName: 'Servicio Logístico', quantity: 1, unitPrice: 500.0 }]);
    this.errorMessage.set('');
    this.isModalOpen.set(true);
  }

  openEditModal(order: OrderRecord): void {
    this.isEditing.set(true);
    this.editingId.set(order.id);
    this.formOrderNumber.set(order.orderNumber);
    this.formClientId.set(order.clientId);
    this.formNotes.set(order.notes);
    this.formItems.set(
      order.items.map((i) => ({
        productName: i.productName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      }))
    );
    this.errorMessage.set('');
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.errorMessage.set('');
  }

  addItem(): void {
    this.formItems.update((prev) => [...prev, { productName: '', quantity: 1, unitPrice: 0 }]);
  }

  removeItem(index: number): void {
    if (this.formItems().length <= 1) return;
    this.formItems.update((prev) => prev.filter((_, i) => i !== index));
  }

  updateItem(index: number, field: keyof OrderItemModel, value: any): void {
    this.formItems.update((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  saveOrder(): void {
    if (!this.formClientId()) {
      this.errorMessage.set('Por favor selecciona un cliente asociado.');
      return;
    }

    const items = this.formItems().filter((i) => i.productName.trim().length > 0 && i.quantity > 0);
    if (items.length === 0) {
      this.errorMessage.set('Debes registrar al menos un producto o servicio válido.');
      return;
    }

    if (this.isEditing() && this.editingId()) {
      const payload: UpdateOrderRequest = {
        clientId: this.formClientId(),
        status: 'Pending',
        notes: this.formNotes().trim(),
        items: items.map((i) => ({
          productName: i.productName.trim(),
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      };

      this.orderService.updateOrder(this.editingId()!, payload).subscribe({
        next: () => {
          this.loadOrders();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Error al actualizar el pedido.');
        },
      });
    } else {
      const payload: CreateOrderRequest = {
        orderNumber: this.formOrderNumber().trim() || undefined,
        clientId: this.formClientId(),
        status: 'Pending',
        notes: this.formNotes().trim(),
        items: items.map((i) => ({
          productName: i.productName.trim(),
          quantity: Number(i.quantity),
          unitPrice: Number(i.unitPrice),
        })),
      };

      this.orderService.createOrder(payload).subscribe({
        next: () => {
          this.loadOrders();
          this.closeModal();
        },
        error: (err) => {
          this.errorMessage.set(err.error?.message || 'Error al crear el pedido.');
        },
      });
    }
  }

  updateStatus(id: string, newStatus: 'Pending' | 'Completed' | 'Cancelled'): void {
    this.orderService.updateOrderStatus(id, newStatus).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al cambiar estado del pedido.');
      },
    });
  }

  deleteOrder(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;

    this.orderService.deleteOrder(id).subscribe({
      next: () => {
        this.loadOrders();
      },
      error: (err) => {
        alert(err.error?.message || 'Error al eliminar pedido.');
      },
    });
  }
}
