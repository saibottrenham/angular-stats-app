import { Component, Inject, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { House, Room } from '../house.model';
import { HouseService } from '../house.service';

@Component({
    selector: 'app-add-house',
    templateUrl: './add-house.component.html',
    styleUrls: ['./add-house.component.scss']
})
export class AddHouseComponent implements OnInit {
    houseForm: FormGroup;
    imageUrl: string;
    housePath = 'House';

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: House,
        private houseService: HouseService,
        private fb: FormBuilder
        ) { }

    ngOnInit(): void {
          this.houseForm = this.fb.group({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            address: new FormControl(this.data?.address, {validators: [Validators.required]}),
            rooms: this.fb.array(this.data?.rooms ? this.data?.rooms : []),
            costs: this.fb.array(this.data?.costs ? this.data?.costs : []),
            notes: new FormControl(this.data?.notes, {validators: [Validators.required]})
          });
    }
   
    get rooms() : FormArray {
      return this.houseForm.get("rooms") as FormArray
    }
   
    newRoom(data = null): FormGroup {
      return this.fb.group({
        price: new FormControl(data ? data.price : '', {validators: [Validators.required]}),
        rentedOut: new FormControl(data ? data.rentedOut : '', {validators: [Validators.required]}),
        rentedOutBy: this.fb.array(data?.rentedOut ? data.rentedOut : []),
        tennant: this.fb.array(data?.roommate ? data.roommate : [])
      })
    }
   
    addRoom() {
      this.rooms.push(this.newRoom());
    }
   
    removeRoom(i:number) {
      this.rooms.removeAt(i);
    }

    onUploadFinished(imageUrl: string) {
      this.imageUrl = imageUrl;
    }   

    onSubmit() {
      const house = this.houseForm.value;
      house.imageUrl = this.imageUrl ? this.imageUrl : this.data?.imageUrl || null;
      // Edit Steps
      if (this.data?.id) {
          this.houseService.editHouse(
              {...house, id: this.data.id, userId: this.data.userId, lastUpdated: new Date()}
          );
      } else {
          house.created = new Date();
          house.lastUpdated = new Date();
          this.houseService.addHouse(house);
      }
    }
   
}