import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ClientItem, CreateClientRequest, UpdateClientRequest } from '../../models/client.models';

@Injectable({
  providedIn: 'root',
})
export class ClientService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiGatewayUrl}/clients`;

  getClients(search?: string, status?: string): Observable<ClientItem[]> {
    let params = new HttpParams();
    if (search) params = params.set('search', search);
    if (status && status !== 'all') params = params.set('status', status);

    return this.http.get<ClientItem[]>(this.apiUrl, { params });
  }

  getClientById(id: string): Observable<ClientItem> {
    return this.http.get<ClientItem>(`${this.apiUrl}/${id}`);
  }

  createClient(client: CreateClientRequest): Observable<ClientItem> {
    return this.http.post<ClientItem>(this.apiUrl, client);
  }

  updateClient(id: string, client: UpdateClientRequest): Observable<ClientItem> {
    return this.http.put<ClientItem>(`${this.apiUrl}/${id}`, client);
  }

  deleteClient(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
