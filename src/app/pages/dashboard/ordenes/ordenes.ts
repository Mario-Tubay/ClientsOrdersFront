import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Button } from '../../../components/button/button';
import { Input } from '../../../components/input/input';

export interface OrderItemModel {
  productName: string;
  quantity: number;
  unitPrice: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  orderDate: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  notes: string;
  items: OrderItemModel[];
  totalAmount: number;
}

@Component({
  selector: 'app-ordenes',
  imports: [FormsModule, Button, Input],
  templateUrl: './ordenes.html',
})
export class Ordenes {
  protected readonly searchQuery = signal('');
  protected readonly filterStatus = signal<string>('all');
  protected readonly isModalOpen = signal(false);
  protected readonly isEditing = signal(false);
  protected readonly editingId = signal<string | null>(null);

  protected formOrderNumber = signal('');
  protected formClientId = signal('1');
  protected formNotes = signal('');
  protected formItems = signal<OrderItemModel[]>([
    { productName: 'Despacho Aduanero', quantity: 1, unitPrice: 450.0 },
  ]);

  protected readonly clientsList = signal([
    { id: '1', name: 'Importadora Andina S.A.' },
    { id: '2', name: 'Logística del Pacífico Cía.' },
    { id: '3', name: 'Distribuidora Guayas' },
    { id: '4', name: 'Corporación Marítima' },
  ]);

  protected readonly orders = signal<OrderRecord[]>([
    {
      id: '1',
      orderNumber: 'PED-2026-001',
      clientId: '1',
      clientName: 'Importadora Andina S.A.',
      orderDate: '2026-10-07',
      status: 'Completed',
      notes: 'Trámite aduanero completado con éxito',
      items: [{ productName: 'Despacho Aduanero FCL', quantity: 2, unitPrice: 625.0 }],
      totalAmount: 1250.0,
    },
    {
      id: '2',
      orderNumber: 'PED-2026-002',
      clientId: '2',
      clientName: 'Logística del Pacífico Cía.',
      orderDate: '2026-10-07',
      status: 'Pending',
      notes: 'Pendiente de confirmación de aforo',
      items: [{ productName: 'Inspección de Contenedor', quantity: 1, unitPrice: 3420.5 }],
      totalAmount: 3420.5,
    },
    {
      id: '3',
      orderNumber: 'PED-2026-003',
      clientId: '3',
      clientName: 'Distribuidora Guayas',
      orderDate: '2026-10-06',
      status: 'Completed',
      notes: 'Entrega finalizada en bodega',
      items: [{ productName: 'Transporte Terrestre', quantity: 1, unitPrice: 890.0 }],
      totalAmount: 890.0,
    },
    {
      id: '4',
      orderNumber: 'PED-2026-004',
      clientId: '4',
      clientName: 'Corporación Marítima',
      orderDate: '2026-10-05',
      status: 'Cancelled',
      notes: 'Cancelado por solicitud del importador',
      items: [{ productName: 'Almacenaje Temporal', quantity: 1, unitPrice: 2100.0 }],
      totalAmount: 2100.0,
    },
  ]);

  protected readonly filteredOrders = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const st = this.filterStatus();

    return this.orders().filter((o) => {
      const matchesSearch =
        !q ||
        o.orderNumber.toLowerCase().includes(q) ||
        o.clientName.toLowerCase().includes(q);

      const matchesStatus = st === 'all' || o.status === st;

      return matchesSearch && matchesStatus;
    });
  });

  protected readonly computedModalTotal = computed(() => {
    return this.formItems().reduce((acc, curr) => acc + curr.quantity * curr.unitPrice, 0);
  });

  openCreateModal(): void {
    this.isEditing.set(false);
    this.editingId.set(null);
    this.formOrderNumber.set(`PED-2026-00${this.orders().length + 1}`);
    this.formClientId.set('1');
    this.formNotes.set('');
    this.formItems.set([{ productName: 'Servicio Logístico', quantity: 1, unitPrice: 500.0 }]);
    this.isModalOpen.set(true);
  }

  openEditModal(order: OrderRecord): void {
    this.isEditing.set(true);
    this.editingId.set(order.id);
    this.formOrderNumber.set(order.orderNumber);
    this.formClientId.set(order.clientId);
    this.formNotes.set(order.notes);
    this.formItems.set([...order.items]);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
  }

  addItem(): void {
    this.formItems.update((prev) => [...prev, { productName: '', quantity: 1, unitPrice: 0 }]);
  }

  removeItem(index: number): void {
    this.formItems.update((prev) => prev.filter((_, i) => i !== index));
  }

  updateItem(index: number, field: keyof OrderItemModel, value: any): void {
    this.formItems.update((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  saveOrder(): void {
    const client = this.clientsList().find((c) => c.id === this.formClientId());
    const clientName = client ? client.name : 'Cliente General';
    const total = this.computedModalTotal();

    if (this.isEditing()) {
      this.orders.update((prev) =>
        prev.map((o) =>
          o.id === this.editingId()
            ? {
                ...o,
                orderNumber: this.formOrderNumber(),
                clientId: this.formClientId(),
                clientName: clientName,
                notes: this.formNotes(),
                items: [...this.formItems()],
                totalAmount: total,
              }
            : o
        )
      );
    } else {
      const newOrder: OrderRecord = {
        id: Date.now().toString(),
        orderNumber: this.formOrderNumber(),
        clientId: this.formClientId(),
        clientName: clientName,
        orderDate: new Date().toISOString().split('T')[0],
        status: 'Pending',
        notes: this.formNotes(),
        items: [...this.formItems()],
        totalAmount: total,
      };
      this.orders.update((prev) => [newOrder, ...prev]);
    }

    this.closeModal();
  }

  updateStatus(id: string, newStatus: 'Pending' | 'Completed' | 'Cancelled'): void {
    this.orders.update((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
  }

  deleteOrder(id: string): void {
    if (!confirm('¿Estás seguro de eliminar este pedido?')) return;
    this.orders.update((prev) => prev.filter((o) => o.id !== id));
  }
}
