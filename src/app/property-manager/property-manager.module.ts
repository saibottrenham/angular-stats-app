import { NgModule } from '@angular/core';
import { PropertyManagerComponent } from './property-manager/property-manager.component';
import { SharedModule } from '../shared/shared.module';
import { PropertyManagerRoutingModule } from './property-manager-routing.module';



@NgModule({
  declarations: [PropertyManagerComponent],
  imports: [
    SharedModule,
    PropertyManagerRoutingModule
  ],
})
export class PropertyManagerModule { }
