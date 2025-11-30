import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TranslocoLoader, provideTransloco, translocoConfig } from '@jsverse/transloco';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`);
  }
}

export const TRANSLOCO_PROVIDERS = provideTransloco({
  config: translocoConfig({
    availableLangs: ['en'],
    defaultLang: 'en',
    reRenderOnLangChange: true,
    prodMode: environment.production
  }),
  loader: TranslocoHttpLoader
});
