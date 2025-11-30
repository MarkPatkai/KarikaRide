import { Component } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TranslocoModule } from '@jsverse/transloco';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, CardModule, TranslocoModule],
  templateUrl: './dashboard.page.html'
})
export class DashboardPage {}
