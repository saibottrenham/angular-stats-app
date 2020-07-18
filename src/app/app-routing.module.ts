import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'houses', loadChildren: () => import('./house/house.module').then(m => m.HouseModule), canLoad: [AuthGuard] },
  { path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule), canLoad: [AuthGuard] },
  { path: 'roommates', loadChildren: () => import('./roommates/roommates.module').then(m => m.RoommatesModule), canLoad: [AuthGuard] },
  { path: 'manager', loadChildren: () => import('./property-manager/property-manager.module').then(
      m => m.PropertyManagerModule), canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
