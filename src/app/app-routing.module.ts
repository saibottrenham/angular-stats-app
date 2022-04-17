import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { WelcomeComponent } from './welcome/welcome.component';
import { AuthGuard } from './auth/auth.guard';

const routes: Routes = [
  { path: '', component: WelcomeComponent },
  { path: 'propertyGroups', loadChildren: () => import('./property-group/property-group.module').then(m => m.PropertyGroupModule), canLoad: [AuthGuard] },
  { path: 'costs', loadChildren: () => import('./analytics/cost/cost.module').then(m => m.CostModule), canLoad: [AuthGuard] },
  { path: 'properties', loadChildren: () => import('./property/property.module').then(m => m.PropertyModule), canLoad: [AuthGuard] },
  { path: 'analytics', loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule), canLoad: [AuthGuard] },
  { path: 'tennants', loadChildren: () => import('./tennant/tennant.module').then(m => m.TennantModule), canLoad: [AuthGuard] },
  { path: 'propertyManagers', loadChildren: () => import('./property-manager/property-manager.module').then(m => m.PropertyManagerModule), canLoad: [AuthGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
