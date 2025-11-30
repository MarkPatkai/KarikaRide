import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TranslocoModule } from '@jsverse/transloco';
import { AdminApiService } from '../../services/admin-api.service';
import { OpeningHours } from '../../../core/models/entities';

@Component({
  selector: 'app-opening-hours-page',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, TranslocoModule],
  templateUrl: './opening-hours.page.html'
})
export class OpeningHoursPage implements OnInit {
  openingHours: OpeningHours[] = [];

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.api.openingHours().subscribe(hours => (this.openingHours = hours));
  }
}
