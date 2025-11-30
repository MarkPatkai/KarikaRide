import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class FlagService {
  private readonly CDN_BASE = 'https://cdn.jsdelivr.net/npm/flag-icons@6.6.6/flags/4x3/';

  getFlagUrl(lang: string): string {
    return `${this.CDN_BASE}${lang}.svg`;
  }
}
