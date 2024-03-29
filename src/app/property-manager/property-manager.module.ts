import { NgModule } from '@angular/core';
import { PropertyManagerComponent } from './property-manager/property-manager.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyManagerRoutingModule } from './property-manager-routing.module';
import { AddPropertyManagerComponent } from './property-manager/add-property-manager/add-property-manager.component';


@NgModule({
  declarations: [
      PropertyManagerComponent,
      AddPropertyManagerComponent
  ],
  imports: [
    SharedModule,
    PropertyManagerRoutingModule
  ]
})
export class PropertyManagerModule { }