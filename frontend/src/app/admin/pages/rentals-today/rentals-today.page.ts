import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TranslocoModule } from '@jsverse/transloco';
import { Rental } from '../../../core/models/entities';
import { AdminRentalService } from '../../services/rental.service';

@Component({
  selector: 'app-rentals-today-page',
  standalone: true,
  imports: [CommonModule, CardModule, TableModule, ButtonModule, TranslocoModule],
  templateUrl: './rentals-today.page.html'
})
export class RentalsTodayPage implements OnInit {
  rentals: Rental[] = [];

  constructor(private rentalService: AdminRentalService) {}

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.rentalService.getRentalsToday().subscribe(r => (this.rentals = r));
  }

  updateStatus(rental: Rental, status: Rental['status']) {
    this.rentalService.updateRentalStatus(rental.id, status).subscribe(() => this.load());
  }
}
