import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TennantsComponent } from './tennants/tennants.component';



const routes: Routes = [
  { path: '', component: TennantsComponent}
];

@NgModule({
  imports: [
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class TennantsRoutingModule { }
