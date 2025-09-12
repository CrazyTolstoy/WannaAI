import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

/** Shapes coming from your Spring BE (adjust if your JSON differs) */
export interface BackendOrderAddress {
  id: number;
  type: 'shipping' | 'billing' | string;
  firstName?: string | null;
  lastName?: string | null;
  company?: string | null;
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  state?: string | null;
  postcode?: string | null;
  country?: string | null;
  phone?: string | null;
  email?: string | null;
}

export interface BackendOrderItem {
  id: number;
  productId?: number;
  sku?: string;
  name?: string;
  quantity: number;
  price: number;
}

export interface BackendOrder {
  id: number;
  source?: string;
  customerName: string;
  customerEmail?: string;
  customerPhone?: string;
  createdAt?: string;
  status?: string;
  woocommerceOrderId?: number | null;
  items: BackendOrderItem[];
  addresses?: BackendOrderAddress[];   // <-- add this
  note?: string;
}

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private base = 'http://192.168.1.102:8080/api/orders';

  constructor(private http: HttpClient) {}

  getAll(): Observable<BackendOrder[]> {
    return this.http.get<BackendOrder[]>(this.base);
  }

  sendToWoo(id: number): Observable<BackendOrder> {
    return this.http.post<BackendOrder>(`${this.base}/${id}/send`, {});
  }
}
