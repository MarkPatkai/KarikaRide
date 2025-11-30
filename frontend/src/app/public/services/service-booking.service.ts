import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ServiceBooking, ServiceCapacity } from '../../core/models/entities';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ServiceBookingService {
  constructor(private http: HttpClient) {}

  getCapacity(date: string): Observable<{ remaining: number; capacity: number }> {
    const params = new HttpParams().set('date', date);
    return this.http.get<{ remaining: number; capacity: number }>(`${environment.apiBaseUrl}/public/service/capacity`, { params });
  }

  createBooking(payload: Omit<ServiceBooking, 'id'>): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/public/service-booking`, payload);
  }
}
