import { NgModule } from '@angular/core';
import { HouseComponent } from './house/house.component';
import { SharedModule } from '../shared/shared.module';
import { HouseRoutingModule } from './house-routing.module';



@NgModule({
  declarations: [
    HouseComponent
  ],
  imports: [
    SharedModule,
    HouseRoutingModule
  ]
})
export class HouseModule { }
