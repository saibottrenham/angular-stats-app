import { NgModule } from '@angular/core';
import { TennantsComponent } from './tennants/tennants.component';
import { SharedModule } from '../shared/shared.module';
import { TennantsRoutingModule } from './tennants-routing.module';



@NgModule({
  declarations: [
    TennantsComponent
  ],
  imports: [
    SharedModule,
    TennantsRoutingModule
  ]
})
export class TennantsModule { }
