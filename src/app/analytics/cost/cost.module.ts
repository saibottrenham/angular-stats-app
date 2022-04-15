import { NgModule } from '@angular/core';
import { CostComponent } from './cost/cost.component';
import { SharedModule } from '../../shared/shared.module';
import { CostRoutingModule } from './cost-routing.module';
import { AddCostComponent } from './cost/add-cost/add-cost.component';



@NgModule({
  declarations: [
    CostComponent,
    AddCostComponent
  ],
  imports: [
    SharedModule,
    CostRoutingModule,
  ],
  exports: [
    AddCostComponent
  ],
  entryComponents: [AddCostComponent]
})
export class CostModule { }
