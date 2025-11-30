import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Bicycle } from '../../core/models/entities';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BicycleService {
  constructor(private http: HttpClient) {}

  list(categoryId?: number): Observable<Bicycle[]> {
    let params = new HttpParams();
    if (categoryId !== undefined) {
      params = params.set('categoryId', categoryId);
    }
    return this.http.get<Bicycle[]>(`${environment.apiBaseUrl}/public/bicycles`, { params });
  }
}
