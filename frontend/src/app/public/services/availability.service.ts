import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bicycle } from '../../core/models/entities';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  constructor(private http: HttpClient) {}

  getAvailableBicycles(from: string, to: string): Observable<Bicycle[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<Bicycle[]>(`${environment.apiBaseUrl}/public/availability`, { params });
  }
}
