import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: 'public',
    loadChildren: () => import('./public/public.routes').then(m => m.PUBLIC_ROUTES)
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },
  { path: '', pathMatch: 'full', redirectTo: 'public' },
  { path: '**', redirectTo: 'public' }
];
