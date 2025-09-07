import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Shapes coming from your Spring BE (adjust if your JSON differs) */
export interface BackendOrderItem {
  id: number;
  productId?: number;
  sku?: string;
  name?: string;
  quantity: number;
  price: number; // per unit
}

export interface BackendOrder {
  id: number;
  source?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt?: string;         // ISO
  status?: string;            // e.g. "sent", "failed", "novo"...
  woocommerceOrderId?: number | null;
  items: BackendOrderItem[];
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private base = 'http://localhost:8080/api/orders';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BackendOrder[]> {
    return this.http.get<BackendOrder[]>(this.base);
  }

  sendToWoo(id: number): Observable<BackendOrder> {
    return this.http.post<BackendOrder>(`${this.base}/${id}/send`, {});
  }
}
