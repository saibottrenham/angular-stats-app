import { NgModule } from '@angular/core';
import { TennantComponent } from './tennant/tennant.component';
import { AddTennantComponent } from './tennant/add-tennant/add-tennant.component';
import { SharedModule } from '../shared/shared.module';
import { TennantRoutingModule } from './tennant-routing.module';
import { StoreModule } from '@ngrx/store';
import { tennantReducer } from './tennant.reducer';



@NgModule({
  declarations: [
    AddTennantComponent,
    TennantComponent
  ],
  imports: [
    SharedModule,
    TennantRoutingModule,
    StoreModule.forFeature('tennant', tennantReducer)
  ]
})
export class TennantModule { }
