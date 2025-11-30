import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Accessory, Bicycle } from '../../core/models/entities';
import { environment } from '../../../environments/environment';
import { AvailabilityListResponse, AvailabilitySummary, RentalNeeds } from '../../core/models/rental-stepper';

@Injectable({ providedIn: 'root' })
export class AvailabilityService {
  constructor(private http: HttpClient) {}

  getAvailableBicycles(from: string, to: string): Observable<Bicycle[]> {
    const params = new HttpParams().set('from', from).set('to', to);
    return this.http.get<Bicycle[]>(`${environment.apiBaseUrl}/public/availability`, { params });
  }

  getAvailabilitySummary(from: string, to: string): Observable<AvailabilitySummary> {
    return this.http.post<AvailabilitySummary>(`${environment.apiBaseUrl}/public/availability/summary`, { from, to });
  }

  listAvailability(from: string, to: string, needs: RentalNeeds): Observable<AvailabilityListResponse<Bicycle, Accessory>> {
    return this.http.post<AvailabilityListResponse<Bicycle, Accessory>>(
      `${environment.apiBaseUrl}/public/availability/list`,
      { from, to, needs }
    );
  }
}
