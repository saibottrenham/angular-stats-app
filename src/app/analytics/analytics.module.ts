import { NgModule } from '@angular/core';
import { AnalyticsComponent } from './analytics/analytics.component';
import { SharedModule } from '../shared/shared.module';
import { AnalyticsRoutingModule } from './analytics-routing.module';
import { EchartsxModule } from 'echarts-for-angular';



@NgModule({
  declarations: [
      AnalyticsComponent
  ],
  imports: [
    EchartsxModule,
    SharedModule,
    AnalyticsRoutingModule,
  ]
})
export class AnalyticsModule { }
