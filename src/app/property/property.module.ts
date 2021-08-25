import { NgModule } from '@angular/core';
import { PropertyComponent } from './property/property.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyRoutingModule } from './property-routing.module';
import { AddPropertyComponent } from './add-property/add-property.component';



@NgModule({
  declarations: [
    PropertyComponent,
    AddPropertyComponent
  ],
  imports: [
    SharedModule,
    PropertyRoutingModule
  ],
  entryComponents: [AddPropertyComponent]
})
export class PropertyModule { }
