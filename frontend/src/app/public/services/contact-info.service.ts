import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactInfoService {
  private apiUrl = '/api/contact-info';

  constructor(private http: HttpClient) {}

  getContactInfo(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
