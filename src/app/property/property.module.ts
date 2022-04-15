import { NgModule } from '@angular/core';
import { PropertyComponent } from './property/property.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyRoutingModule } from './property-routing.module';
import { AddPropertyComponent } from './property/add-property/add-property.component';



@NgModule({
  declarations: [
    PropertyComponent,
    AddPropertyComponent
  ],
  imports: [
    SharedModule,
    PropertyRoutingModule,
  ],
  exports: [
    AddPropertyComponent,
  ],
  entryComponents: [AddPropertyComponent]
})
export class PropertyModule { }
