import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ngfModule } from 'angular-file';
import { ImageUploadComponent } from './image-upload/image-upload.component';
import { SharedTableComponent } from './shared-table/shared-table.component';


@NgModule({
  declarations: [
    ImageUploadComponent,
    SharedTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    ngfModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    ngfModule,
    ImageUploadComponent,
    SharedTableComponent
  ]
})
export class SharedModule {}
