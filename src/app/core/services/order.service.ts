import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CreateOrderRequest, OrderRecord, UpdateOrderRequest } from '../../models/order.models';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiGatewayUrl}/orders`;

  getOrders(search?: string, status?: string): Observable<OrderRecord[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status && status !== 'all') params = params.set('status', status);

    return this.http.get<OrderRecord[]>(this.apiUrl, { params });
  }

  getOrderById(id: string): Observable<OrderRecord> {
    return this.http.get<OrderRecord>(`${this.apiUrl}/${id}`);
  }

  createOrder(order: CreateOrderRequest): Observable<OrderRecord> {
    return this.http.post<OrderRecord>(this.apiUrl, order);
  }

  updateOrder(id: string, order: UpdateOrderRequest): Observable<OrderRecord> {
    return this.http.put<OrderRecord>(`${this.apiUrl}/${id}`, order);
  }

  updateOrderStatus(id: string, status: string): Observable<{ message: string; status: string }> {
    return this.http.patch<{ message: string; status: string }>(`${this.apiUrl}/${id}/status`, { status });
  }

  deleteOrder(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
