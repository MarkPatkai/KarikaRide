import { Routes } from '@angular/router';
import { AuthGuard } from '../core/guards/auth.guard';
import { AccessoryCrudPage } from './pages/accessory-crud/accessory-crud.page';
import { BicycleCrudPage } from './pages/bicycle-crud/bicycle-crud.page';
import { CategoryCrudPage } from './pages/category-crud/category-crud.page';
import { DashboardPage } from './pages/dashboard/dashboard.page';
import { LoginPage } from './pages/login/login.page';
import { OpeningHoursPage } from './pages/opening-hours/opening-hours.page';
import { RentalsTodayPage } from './pages/rentals-today/rentals-today.page';
import { ServiceCapacityPage } from './pages/service-capacity/service-capacity.page';

export const ADMIN_ROUTES: Routes = [
  { path: 'login', component: LoginPage },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardPage },
      { path: 'bicycles', component: BicycleCrudPage },
      { path: 'categories', component: CategoryCrudPage },
      { path: 'accessories', component: AccessoryCrudPage },
      { path: 'rentals', component: RentalsTodayPage },
      { path: 'opening-hours', component: OpeningHoursPage },
      { path: 'service-capacity', component: ServiceCapacityPage }
    ]
  }
];
