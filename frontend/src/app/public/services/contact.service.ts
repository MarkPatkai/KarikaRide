import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactInfo } from '../../core/models/rental-stepper';

@Injectable({ providedIn: 'root' })
export class ContactService {
  constructor(private http: HttpClient) {}

  getContactInfo(): Observable<ContactInfo> {
    return this.http.get<ContactInfo>(`${environment.apiBaseUrl}/public/contact-info`);
  }
}
