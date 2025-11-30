import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Rental } from '../../core/models/entities';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../core/services/auth.service';

@Injectable({ providedIn: 'root' })
export class AdminRentalService {
  constructor(private http: HttpClient, private auth: AuthService) {}

  private options() {
    return { headers: this.auth.authHeaders() };
  }

  getRentalsToday(): Observable<Rental[]> {
    return this.http.get<Rental[]>(`${environment.apiBaseUrl}/admin/rentals/today`, this.options());
  }

  updateRentalStatus(id: number, status: Rental['status']): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.put(`${environment.apiBaseUrl}/admin/rental/${id}/status`, { status }, { ...this.options(), params });
  }
}
