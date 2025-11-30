import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login-page',
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
