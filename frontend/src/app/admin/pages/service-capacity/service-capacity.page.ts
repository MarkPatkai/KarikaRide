import { Component, OnInit } from '@angular/core';
import { AdminApiService } from '../../services/admin-api.service';
import { ServiceCapacity } from '../../../core/models/entities';

@Component({
  selector: 'app-service-capacity-page',
  templateUrl: './service-capacity.page.html'
})
export class ServiceCapacityPage implements OnInit {
  capacities: ServiceCapacity[] = [];

  constructor(private api: AdminApiService) {}

  ngOnInit(): void {
    this.api.serviceCapacity().subscribe(c => (this.capacities = c));
  }
}
