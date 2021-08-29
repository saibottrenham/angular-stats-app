import { NgModule } from '@angular/core';
import { PropertyComponent } from './property/property.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyRoutingModule } from './property-routing.module';
import { AddPropertyComponent } from './property/add-property/add-property.component';
import { propertyReducer } from './property.reducer';
import { StoreModule } from '@ngrx/store';



@NgModule({
  declarations: [
    PropertyComponent,
    AddPropertyComponent
  ],
  imports: [
    SharedModule,
    PropertyRoutingModule,
    StoreModule.forFeature('property', propertyReducer)
  ],
  entryComponents: [AddPropertyComponent]
})
export class PropertyModule { }
