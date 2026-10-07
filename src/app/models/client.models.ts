export interface ClientItem {
  id: string;
  documentNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
  createdAt: string;
  totalOrders: number;
}

export interface CreateClientRequest {
  documentNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}

export interface UpdateClientRequest {
  documentNumber: string;
  fullName: string;
  email: string;
  phone: string;
  address: string;
  isActive: boolean;
}
