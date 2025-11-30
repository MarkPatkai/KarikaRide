import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BicycleCategory } from '../../core/models/entities';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  constructor(private http: HttpClient) {}

  list(): Observable<BicycleCategory[]> {
    return this.http.get<BicycleCategory[]>(`${environment.apiBaseUrl}/public/categories`);
  }
}
