import { NgModule } from '@angular/core';
import { HouseComponent } from './house/house.component';
import { SharedModule } from '../shared/shared.module';
import { HouseRoutingModule } from './house-routing.module';
import { AddHouseComponent } from './add-house/add-house.component';



@NgModule({
  declarations: [
    HouseComponent,
    AddHouseComponent
  ],
  imports: [
    SharedModule,
    HouseRoutingModule
  ],
  entryComponents: [AddHouseComponent]
})
export class HouseModule { }
