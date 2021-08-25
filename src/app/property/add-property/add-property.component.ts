import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Property } from '../property.model';
import { PropertyService } from '../property.service';

@Component({
    selector: 'app-add-house',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
    propertyForm: FormGroup;
    imageUrl: string;
    propertyPath = 'Property';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Property,
        private propertyService: PropertyService,
        private fb: FormBuilder
        ) { }

    ngOnInit(): void {
          this.propertyForm = this.fb.group({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            address: new FormControl(this.data?.address, {validators: [Validators.required]}),
            notes: new FormControl(this.data?.address, {validators: [Validators.required]}),
            price: new FormControl(this.data?.address, {validators: [Validators.required]}),
            rentedOut: new FormControl(this.data?.address, {validators: [Validators.required]}),
            tennants: this.fb.array(this.data?.tennants ? this.data.tennants : []),
            propertyManagers: this.fb.array(this.data?.propertyManagers ? this.data.propertyManagers : [])
          });
    }
   

    onUploadFinished(imageUrl: string) {
      this.imageUrl = imageUrl;
    }   

    onSubmit() {
      const house = this.propertyForm.value;
      house.imageUrl = this.imageUrl ? this.imageUrl : this.data?.imageUrl || null;
      // Edit Steps
      if (this.data?.id) {
          this.propertyService.editProperty(
              {...house, id: this.data.id, userId: this.data.userId, lastUpdated: new Date()}
          );
      } else {
          house.created = new Date();
          house.lastUpdated = new Date();
          this.propertyService.addProperty(house);
      }
    }
   
}