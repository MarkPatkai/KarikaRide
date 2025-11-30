import { Component, OnDestroy } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { TranslocoModule, TranslocoService } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';
import { filter, Subscription } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { DialogModule } from 'primeng/dialog';
import { FlagService } from './core/services/flag.service';
import { LANGUAGES } from './core/i18n/languages';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet, TranslocoModule, MenuModule, DialogModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'KarikaRide';
  isAdminRoute = false;
  showLangModal = false;
  languages = LANGUAGES;
  currentLang = '';
  currentFlagUrl = '';
  languageItems: (MenuItem & { flag: string; code: string })[] = [];
  private subscription: Subscription;

  constructor(
    private router: Router,
    private transloco: TranslocoService,
    public flagService: FlagService
  ) {
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        const url = (event as NavigationEnd).urlAfterRedirects || (event as NavigationEnd).url;
        this.isAdminRoute = url.startsWith('/admin');
      });
    this.isAdminRoute = this.router.url.startsWith('/admin');
    this.initializeLanguage();
    this.languageItems = this.buildLanguageItems();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  changeLanguage(lang: string) {
    this.setLanguage(lang, true);
  }

  chooseLanguage(lang: string) {
    this.setLanguage(lang, true);
    this.showLangModal = false;
  }

  private initializeLanguage() {
    const stored = typeof window !== 'undefined' ? localStorage.getItem('lang') : null;
    if (stored) {
      this.setLanguage(stored, false);
    } else {
      this.setLanguage(this.transloco.getActiveLang(), false);
      this.showLangModal = true;
    }
  }

  private buildLanguageItems(): (MenuItem & { flag: string; code: string })[] {
    return this.languages.map(lang => ({
      label: lang.name,
      code: lang.code,
      flag: this.flagService.getFlagUrl(lang.code),
      command: () => this.changeLanguage(lang.code)
    }));
  }

  private setLanguage(lang: string, reload: boolean) {
    this.transloco.setActiveLang(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('lang', lang);
    }
    this.currentLang = lang;
    this.currentFlagUrl = this.flagService.getFlagUrl(lang);
    if (reload && typeof window !== 'undefined') {
      window.location.reload();
    }
  }
}
