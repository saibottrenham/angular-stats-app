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
    filteredPropertyManagers: Observable<PropertyManager[]>;
    tennants: Tennant[] = [];
    propertyManagers: Tennant[] = [];
    allTennants: Tennant[] = [];
    allPropertyManagers: PropertyManager[] = [];

  @ViewChild('tennantInput') tennantInput: ElementRef<HTMLInputElement>;
  @ViewChild('propertyManagerInput') propertyManagerInput: ElementRef<HTMLInputElement>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Property,
        private propertyService: PropertyService,
        private fb: FormBuilder
        ) { 

          this.filteredTennants = this.tennantCtrl.valueChanges.pipe(
            startWith(null),
            map((tennant: string | null) => tennant ? this._filter(tennant, this.allTennants) : this.allTennants.slice()));
          this.filteredPropertyManagers = this.propertyManagerCtrl.valueChanges.pipe(
              startWith(null),
              map((propertyManager: string | null) => propertyManager ?
               this._filterPropertyManager(propertyManager, this.allPropertyManagers) : this.allPropertyManagers.slice()));
        }

    ngOnInit(): void {
        this.tennants = [...this.data?.tennants];
        this.propertyManagers = [...this.data?.propertyManagers];
        this.data?.allPropertyManagers.subscribe(x => {
            this.allPropertyManagers = x.filter(propertyManager => {
              return this.data?.propertyManagers.filter(propertyManager2 => {
                return propertyManager2.id == propertyManager.id;
              }).length == 0
          });
        });
        this.data?.allTennants.subscribe(x => {
            this.allTennants = x.filter(tennant => {
              return this.data?.tennants.filter(tennant2 => {
                return tennant2.id == tennant.id;
              }).length == 0
          });
        });
          this.propertyForm = this.fb.group({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            address: new FormControl(this.data?.address, {validators: [Validators.required]}),
            notes: new FormControl(this.data?.notes, {validators: [Validators.required]}),
            price: new FormControl(this.data?.price, {validators: [Validators.required]}),
            rentedOut: new FormControl(this.data?.rentedOut, {validators: [Validators.required]}),
            tennants: this.fb.array(this.data?.tennants ? this.data.tennants : []),
            propertyManagers: this.fb.array(this.data?.propertyManagers ? this.data.propertyManagers : [])
          });
    }
   

    onUploadFinished(imageUrl: string) {
      this.imageUrl = imageUrl;
    }   

    onSubmit() {
      const property = this.propertyForm.value;
      property.tennants = this.tennants;
      property.propertyManagers = this.propertyManagers;

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
  
    removeTennant(tennant: Tennant): void {
      const index = this.tennants.indexOf(tennant);
      if (index >= 0) {
        this.tennants.splice(index, 1);
      }
      this.allTennants.push(tennant);
    }
  
    selectTennant(event: MatAutocompleteSelectedEvent): void {
      this.tennants.push(event.option.value);
      this.allTennants = this.allTennants.filter(item => {
        return this.tennants.indexOf(item) === -1;
      });
      this.tennantInput.nativeElement.value = '';
      this.tennantCtrl.setValue(null);
    }

    removePropertyManager(propertyManager: PropertyManager): void {
      const index = this.propertyManagers.indexOf(propertyManager);
      if (index >= 0) {
        this.propertyManagers.splice(index, 1);
      }
      this.allPropertyManagers.push(propertyManager);
    }
  
    selectPropertyManager(event: MatAutocompleteSelectedEvent): void {
      this.propertyManagers.push(event.option.value);
      this.allPropertyManagers = this.allPropertyManagers.filter(item => {
        return this.propertyManagers.indexOf(item) === -1;
      });
      this.propertyManagerInput.nativeElement.value = '';
      this.propertyManagerCtrl.setValue(null);
    }
  
    private _filter(value: string, filterArray = []): Tennant[] {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
      return filterArray.filter(tennant => tennant.name.toLowerCase().includes(filterValue));
    }

    private _filterPropertyManager(value: string, filterArray = []): PropertyManager[] {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
      return filterArray.filter(propertyManager => propertyManager.name.toLowerCase().includes(filterValue));
    }
  }
