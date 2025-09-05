import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class WooCommerceService {
// TODO: move to environment.ts in production
private baseUrl = 'https://yourstore.com/wp-json/wc/v3';
private consumerKey = 'ck_xxx';
private consumerSecret = 'cs_xxx';


constructor(private http: HttpClient) {}


createOrder(payload: any): Observable<any> {
const params = new HttpParams()
.set('consumer_key', this.consumerKey)
.set('consumer_secret', this.consumerSecret);


return this.http.post(`${this.baseUrl}/orders`, payload, { params });
}
}