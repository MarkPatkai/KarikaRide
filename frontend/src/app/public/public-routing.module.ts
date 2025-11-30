import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RentBikePage } from './pages/rent-bike/rent-bike.page';
import { ServiceBookingPage } from './pages/service-booking/service-booking.page';

const routes: Routes = [
  { path: '', component: RentBikePage },
  { path: 'service', component: ServiceBookingPage }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PublicRoutingModule {}
