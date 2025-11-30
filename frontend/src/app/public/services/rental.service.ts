import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { CreateRentalRequest, Rental } from '../../core/models/entities';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class RentalService {
  constructor(private http: HttpClient) {}

  createRental(payload: CreateRentalRequest): Observable<any> {
    return this.http.post(`${environment.apiBaseUrl}/public/rental`, payload);
  }

  getRentalsToday(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${environment.apiBaseUrl}/admin/rentals/today`);
  }

  updateRentalStatus(id: number, status: Rental['status']): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${environment.apiBaseUrl}/admin/rental/${id}/status`, { status }, { params });
  }
}
