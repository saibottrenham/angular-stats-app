import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PropertyGroupComponent } from './property-group/property-group.component';


const routes: Routes = [
  { path: '', component: PropertyGroupComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class PropertyGroupRoutingModule { }
