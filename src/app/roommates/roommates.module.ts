import { NgModule } from '@angular/core';
import { RoommatesComponent } from './roommates/roommates.component';
import { SharedModule } from '../shared/shared.module';
import { RoommatesRoutingModule } from './roommates-routing.module';



@NgModule({
  declarations: [
    RoommatesComponent
  ],
  imports: [
    SharedModule,
    RoommatesRoutingModule
  ]
})
export class RoommatesModule { }
