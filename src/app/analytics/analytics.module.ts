import { NgModule } from '@angular/core';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsRoutingModule } from './analytics-routing.module';



@NgModule({
  declarations: [
      AnalyticsComponent
  ],
  imports: [
    SharedModule,
    AnalyticsRoutingModule
  ]
})
export class AnalyticsModule { }
