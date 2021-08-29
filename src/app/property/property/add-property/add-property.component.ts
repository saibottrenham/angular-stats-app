import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { Property } from '../../property.model';
import { PropertyService } from '../../property.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Tennant } from '../../../tennant/tennant.model';
import { PropertyManager } from '../../../property-manager/property-manager.model';

@Component({
    selector: 'app-add-house',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
    propertyForm: FormGroup;
    imageUrl: string;
    propertyPath = 'Property';
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    tennantCtrl = new FormControl();
    propertyManagerCtrl = new FormControl();
    filteredTennants: Observable<Tennant[]>;
    filteredPropertyManagers: Observable<Tennant[]>;
    tennants: Tennant[] = [];
    propertyManagers: Tennant[] = [];
    allTennants: Tennant[] = [{
      id: '123',
      name: "Tobias",
      mobile: "0411272089",
      address: "123",
      email: "tobiasmahnert@web.de",
      imageUrl: "hello.jpg"
  }];
  allPropertyManagers: PropertyManager[] = [{
      id: '123',
      name: "Tobias",
      address: '123',
      mobile: "0411272089",
      email: "tobiasmahnert@web.de",
      imageUrl: "hello.jpg"
  }];

  @ViewChild('tennantInput') tennantInput: ElementRef<HTMLInputElement>;
  @ViewChild('propertyManagerInput') propertyManagerInput: ElementRef<HTMLInputElement>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Property,
        private propertyService: PropertyService,
        private fb: FormBuilder
        ) { 
          this.allTennants = this.data?.tennants ? this.data.tennants : [{
            id: '123',
            name: "Tobias",
            address: "123",
            mobile: "0411272089",
            email: "tobiasmahnert@web.de",
            imageUrl: "hello.jpg"
        }];
        this.allPropertyManagers = this.data?.propertyManagers ? this.data.propertyManagers : [{
          id: '123',
          name: "Tobias",
          address: '123',
          mobile: "0411272089",
          email: "tobiasmahnert@web.de",
          imageUrl: "hello.jpg"
      }];
          this.filteredTennants = this.tennantCtrl.valueChanges.pipe(
            startWith(null),
            map((tennant: string | null) => tennant ? this._filter(tennant, this.allTennants) : this.allTennants.slice()));
          this.filteredPropertyManagers = this.propertyManagerCtrl.valueChanges.pipe(
              startWith(null),
              map((propertyManager: string | null) => propertyManager ? this._filter(propertyManager, this.allPropertyManagers) : this.allPropertyManagers.slice()));
        }

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
      const property = this.propertyForm.value;
      property.imageUrl = this.imageUrl ? this.imageUrl : this.data?.imageUrl || null;
      // Edit Steps
      if (this.data?.id) {
          this.propertyService.editProperty(
              {...property, id: this.data.id, userId: this.data.userId, lastUpdated: new Date()}
          );
      } else {
          property.created = new Date();
          property.lastUpdated = new Date();
          this.propertyService.addProperty(property);
      }
    }
  
    remove(item: Tennant | PropertyManager, removeItems = [], addItems = []): void {
      const index = removeItems.indexOf(item);
      if (index >= 0) {
        removeItems.splice(index, 1);
      }
      addItems.push(item);
    }
  
    selected(event: MatAutocompleteSelectedEvent, removeItems = [], addItems = []): void {
      const item = event.option.value;
      this.remove(item, removeItems, addItems);
      this.tennantInput.nativeElement.value = '';
      this.tennantCtrl.setValue(null);
    }
  
    private _filter(value: string, filterArray = []): Tennant[] {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
      return filterArray.filter(tennant => tennant.name.toLowerCase().includes(filterValue));
    }
  }
