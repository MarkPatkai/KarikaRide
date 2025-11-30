import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { AdminRoutingModule } from './admin-routing.module';
import { LoginPage } from './pages/login/login.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { BicycleCrudPage } from './pages/bicycle-crud/bicycle-crud.page';
import { CategoryCrudPage } from './pages/category-crud/category-crud.page';
import { AccessoryCrudPage } from './pages/accessory-crud/accessory-crud.page';
import { RentalsTodayPage } from './pages/rentals-today/rentals-today.page';
import { OpeningHoursPage } from './pages/opening-hours/opening-hours.page';
import { ServiceCapacityPage } from './pages/service-capacity/service-capacity.page';

@NgModule({
  declarations: [
    LoginPage,
    DashboardPage,
    BicycleCrudPage,
    CategoryCrudPage,
    AccessoryCrudPage,
    RentalsTodayPage,
    OpeningHoursPage,
    ServiceCapacityPage
  ],
  imports: [SharedModule, AdminRoutingModule]
})
export class AdminModule {}
