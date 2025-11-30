import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';
import { OpeningHours } from '../../../core/models/entities';

@Component({
  selector: 'app-opening-hours-page',
  templateUrl: './opening-hours.page.html'
})
export class OpeningHoursPage implements OnInit {
  openingHours: OpeningHours[] = [];

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.api.openingHours().subscribe(hours => (this.openingHours = hours));
  }
}
