import { NgModule } from '@angular/core';
import { TagComponent } from './tag/tag.component';
import { AddTagComponent } from './tag/add-tag/add-tag.component';
import { SharedModule } from '../shared/shared.module';
import { TagRoutingModule } from './tag-routing.module';



@NgModule({
  declarations: [
    AddTagComponent,
    TagComponent
  ],
  imports: [
    SharedModule,
    TagRoutingModule,
  ]
})
export class TagModule { }
