import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RoommatesComponent } from './roommates/roommates.component';



const routes: Routes = [
  { path: '', component: RoommatesComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class RoommatesRoutingModule { }
