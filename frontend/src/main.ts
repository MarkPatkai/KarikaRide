import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { APP_ROUTES } from './app/app.routes';
import { TRANSLOCO_PROVIDERS } from './app/transloco.config';
import { providePrimeNG } from 'primeng/config';
import Material from '@primeng/themes/material';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    provideRouter(APP_ROUTES),
    provideAnimations(),
    providePrimeNG({ theme : {
      preset: Material
    }}),
    TRANSLOCO_PROVIDERS
  ]
}).catch(err => console.error(err));
