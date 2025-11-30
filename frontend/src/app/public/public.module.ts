import { NgModule } from '@angular/core';
import { PublicRoutingModule } from './public-routing.module';
import { RentBikePage } from './pages/rent-bike/rent-bike.page';
import { ServiceBookingPage } from './pages/service-booking/service-booking.page';
import { CalendarComponent } from './components/calendar/calendar.component';
import { BikeListComponent } from './components/bike-list/bike-list.component';
import { BikeDetailsComponent } from './components/bike-details/bike-details.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [RentBikePage, ServiceBookingPage, CalendarComponent, BikeListComponent, BikeDetailsComponent],
  imports: [SharedModule, PublicRoutingModule]
})
export class PublicModule {}
