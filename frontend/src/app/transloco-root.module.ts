import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TRANSLOCO_CONFIG, TRANSLOCO_LOADER, TranslocoConfig, TranslocoLoader, TranslocoModule } from '@ngneat/transloco';
import { environment } from '../environments/environment';
import { Observable } from 'rxjs';

export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string): Observable<Record<string, any>> {
    return this.http.get<Record<string, any>>(`/assets/i18n/${lang}.json`);
  }
}

@NgModule({
  exports: [TranslocoModule],
  providers: [
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
  ]
})
export class TranslocoRootModule {}
