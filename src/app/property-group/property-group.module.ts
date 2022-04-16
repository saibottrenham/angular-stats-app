import { NgModule } from '@angular/core';
import { PropertyGroupComponent } from './property-group/property-group.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyGroupRoutingModule } from './property-group-routing.module';
import { AddPropertyGroupComponent } from './property-group/add-property-group/add-property-group.component';
import { CostModule } from '../analytics/cost/cost.module';
import { PropertyModule } from '../property/property.module';



@NgModule({
  declarations: [
    PropertyGroupComponent,
    AddPropertyGroupComponent
  ],
  imports: [
    SharedModule,
    PropertyGroupRoutingModule,
    CostModule,
    PropertyModule,
  ],
  entryComponents: [AddPropertyGroupComponent]
})
export class PropertyGroupModule { }
