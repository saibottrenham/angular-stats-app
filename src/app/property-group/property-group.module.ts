import { NgModule } from '@angular/core';
import { PropertyGroupComponent } from './property-group/property-group.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyGroupRoutingModule } from './property-group-routing.module';
import { AddPropertyGroupComponent } from './property-group/add-property-group/add-property-group.component';
import { propertyGroupReducer } from './property-group.reducer';
import { StoreModule } from '@ngrx/store';
import { costReducer } from '../analytics/cost/cost.reducer';
import { propertyReducer } from '../property/property.reducer';



@NgModule({
  declarations: [
    PropertyGroupComponent,
    AddPropertyGroupComponent
  ],
  imports: [
    SharedModule,
    PropertyGroupRoutingModule,
    StoreModule.forFeature('propertyGroup', propertyGroupReducer),
    StoreModule.forFeature('property', propertyReducer),
    StoreModule.forFeature('cost', costReducer),
  ],
  entryComponents: [AddPropertyGroupComponent]
})
export class PropertyGroupModule { }
