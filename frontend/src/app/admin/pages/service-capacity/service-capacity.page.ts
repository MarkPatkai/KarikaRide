import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TranslocoModule } from '@jsverse/transloco';
import { AdminApiService } from '../../services/admin-api.service';
import { ServiceCapacity } from '../../../core/models/entities';

@Component({
  selector: 'app-service-capacity-page',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, TranslocoModule],
  templateUrl: './service-capacity.page.html'
})
export class ServiceCapacityPage implements OnInit {
  capacities: ServiceCapacity[] = [];

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.api.serviceCapacity().subscribe(c => (this.capacities = c));
  }
}
