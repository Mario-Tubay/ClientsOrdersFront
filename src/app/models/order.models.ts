export interface OrderItemModel {
  id?: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal?: number;
}

export interface OrderRecord {
  id: string;
  orderNumber: string;
  clientId: string;
  clientName: string;
  orderDate: string;
  status: 'Pending' | 'Completed' | 'Cancelled';
  totalAmount: number;
  notes: string;
  checkTransporte: boolean;
  items: OrderItemModel[];
}

export interface CreateOrderRequest {
  orderNumber?: string;
  clientId: string;
  status: string;
  notes: string;
  checkTransporte: boolean;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}

export interface UpdateOrderRequest {
  clientId: string;
  status: string;
  notes: string;
  checkTransporte: boolean;
  items: {
    productName: string;
    quantity: number;
    unitPrice: number;
  }[];
}
