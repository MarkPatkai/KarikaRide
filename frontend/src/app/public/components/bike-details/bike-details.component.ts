import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Bicycle, BicycleCategory, CreateRentalRequest } from '../../../core/models/entities';

@Component({
  selector: 'app-bike-details',
  templateUrl: './bike-details.component.html'
})
export class BikeDetailsComponent {
  @Input() bicycle?: Bicycle;
  @Input() category?: BicycleCategory;
  @Input() bookingRange?: { from: string; to: string };
  @Output() createRental = new EventEmitter<CreateRentalRequest>();

  renter = {
    name: '',
    phone: '',
    email: ''
  };

  submitRental() {
    if (!this.bicycle || !this.bookingRange) return;
    this.createRental.emit({
      bicycleId: this.bicycle.id,
      userName: this.renter.name,
      userPhone: this.renter.phone,
      userEmail: this.renter.email,
      fromDatetime: this.bookingRange.from,
      toDatetime: this.bookingRange.to
    });
  }
}
