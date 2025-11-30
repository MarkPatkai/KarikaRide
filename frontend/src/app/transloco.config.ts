import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER, TranslocoConfig, TranslocoLoader } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`);
  }
}

export const TRANSLOCO_PROVIDERS = [
  {
    provide: TRANSLOCO_CONFIG,
    useValue: {
      availableLangs: ['en'],
      defaultLang: 'en',
      reRenderOnLangChange: true,
      prodMode: environment.production
    } as TranslocoConfig
  },
  { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
];
