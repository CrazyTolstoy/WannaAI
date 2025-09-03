import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private refreshNeeded$ = new Subject<void>();

  constructor(private http: HttpClient) { }

  fetchFarmaData(payload: any): Observable<any> {
    const url = 'https://eagro.artivagency.com/baza/farma.php';
    return this.http.post<any>(url, payload);
  }

  pregledNabavke(payload: any): Observable<any> {
    const url = 'https://eagro.artivagency.com/baza/pregledNabavki.php';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(url, JSON.stringify(payload), httpOptions);
  }


  fetchSkladisteRobaData(): Observable<any> {
    return this.http.get('https://eagro.artivagency.com/baza/skladisteRoba.php');
  }

  stanjeSkladista(payload: any): Observable<any> {
    const url = 'https://eagro.artivagency.com/baza/lager.php';
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
    return this.http.post<any>(url, JSON.stringify(payload), httpOptions);
  }


//ŠTAMPA

  generateDocument(data: any) {
    return this.http.post('http://localhost:3000/generate-doc', data, { responseType: 'blob' });
  }
}
