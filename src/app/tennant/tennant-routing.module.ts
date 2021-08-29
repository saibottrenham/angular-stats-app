import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TennantComponent } from './tennant/tennant.component';



const routes: Routes = [
  { path: '', component: TennantComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TennantRoutingModule { }
