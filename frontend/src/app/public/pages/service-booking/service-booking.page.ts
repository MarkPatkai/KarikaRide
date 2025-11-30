import { Component } from '@angular/core';
import { SHARED_IMPORTS } from '../../../shared/shared-imports';
import { TranslocoModule } from '@jsverse/transloco';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { ServiceBookingService } from '../../services/service-booking.service';

@Component({
  selector: 'app-service-booking',
  standalone: true,
  imports: [...SHARED_IMPORTS, TranslocoModule, CardModule, ButtonModule],
  templateUrl: './service-booking.page.html'
})
export class ServiceBookingPage {
  date: Date | null = null;
  form = {
    name: '',
    phone: '',
    description: ''
  };
  capacityInfo?: { remaining: number; capacity: number };
  message = '';

  constructor(private serviceBooking: ServiceBookingService) {}

  onDateChange(date: Date) {
    if (!date) return;
    const formatted = date.toISOString().slice(0, 10);
    this.serviceBooking.getCapacity(formatted).subscribe(info => (this.capacityInfo = info));
  }

  submit() {
    if (!this.date) return;
    const formattedDate = this.date.toISOString().slice(0, 10);
    this.serviceBooking
      .createBooking({
        date: formattedDate,
        userName: this.form.name,
        userPhone: this.form.phone,
        description: this.form.description
      })
      .subscribe(() => (this.message = 'Service booking submitted'));
  }
}
