import { Routes } from '@angular/router';
import { RentBikePage } from './pages/rent-bike/rent-bike.page';
import { ServiceBookingPage } from './pages/service-booking/service-booking.page';
import { ContactPage } from './pages/contact/contact.page';

export const PUBLIC_ROUTES: Routes = [
  { path: '', component: RentBikePage },
  { path: 'service', component: ServiceBookingPage },
  { path: 'contact', component: ContactPage }
];
