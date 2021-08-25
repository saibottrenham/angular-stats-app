import { NgModule } from '@angular/core';
import { PropertyManagerComponent } from './property-manager/property-manager.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyManagerRoutingModule } from './property-manager-routing.module';
import { AddPropertyManagerComponent } from './property-manager/add-property-manager/add-property-manager.component';
import { StoreModule } from '@ngrx/store';
import { propertyManagerReducer } from './property-manager.reducer';


@NgModule({
  declarations: [
      PropertyManagerComponent,
      AddPropertyManagerComponent
  ],
  imports: [
    SharedModule,
    PropertyManagerRoutingModule,
    StoreModule.forFeature('propertyManager', propertyManagerReducer)
  ]
})
export class PropertyManagerModule { }
