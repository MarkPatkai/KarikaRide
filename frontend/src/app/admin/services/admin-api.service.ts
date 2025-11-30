import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  Accessory,
  Bicycle,
  BicycleCategory,
  BicycleTemplate,
  OpeningHours,
  ServiceCapacity
} from '../../core/models/entities';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminApiService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private options() {
    return { headers: this.auth.authHeaders() };
  }

  categories(): Observable<BicycleCategory[]> {
    return this.http.get<BicycleCategory[]>(`${environment.apiBaseUrl}/admin/categories`, this.options());
  }

  saveCategory(category: Partial<BicycleCategory>): Observable<BicycleCategory> {
    return this.http.post<BicycleCategory>(`${environment.apiBaseUrl}/admin/categories`, category, this.options());
  }

  templates(): Observable<BicycleTemplate[]> {
    return this.http.get<BicycleTemplate[]>(`${environment.apiBaseUrl}/admin/templates`, this.options());
  }

  bicycles(): Observable<Bicycle[]> {
    return this.http.get<Bicycle[]>(`${environment.apiBaseUrl}/admin/bicycles`, this.options());
  }

  saveBicycle(bicycle: Partial<Bicycle>): Observable<Bicycle> {
    return this.http.post<Bicycle>(`${environment.apiBaseUrl}/admin/bicycles`, bicycle, this.options());
  }

  accessories(): Observable<Accessory[]> {
    return this.http.get<Accessory[]>(`${environment.apiBaseUrl}/admin/accessories`, this.options());
  }

  openingHours(): Observable<OpeningHours[]> {
    return this.http.get<OpeningHours[]>(`${environment.apiBaseUrl}/admin/opening-hours`, this.options());
  }

  serviceCapacity(): Observable<ServiceCapacity[]> {
    return this.http.get<ServiceCapacity[]>(`${environment.apiBaseUrl}/admin/service-capacity`, this.options());
  }
}
