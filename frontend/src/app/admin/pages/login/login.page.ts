import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TranslocoModule } from '@jsverse/transloco';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [...SHARED_IMPORTS, CardModule, ButtonModule, TranslocoModule],
  templateUrl: './login.page.html'
})
export class LoginPage {
  form = {
    email: '',
    password: ''
  };
  error = '';

  constructor(private auth: AuthService, private router: Router) {}

  submit() {
    this.auth.login(this.form).subscribe({
      next: () => this.router.navigate(['/admin/dashboard']),
      error: () => (this.error = 'Login failed')
    });
  }
}
