import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { Property } from '../../property.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Tennant } from '../../../tennant/tennant.model';
import { PropertyManager } from '../../../property-manager/property-manager.model';
import { UiService } from '../../../shared/ui.service';
import { filter } from '../../../shared/filter';
import { BaseModel } from '../../../shared/common-model';
import { propertyManagerPath, tennantsPath } from '../../../shared/paths';
import { AddTennantComponent } from '../../../tennant/tennant/add-tennant/add-tennant.component';
import { AddPropertyManagerComponent } from '../../../property-manager/property-manager/add-property-manager/add-property-manager.component';

@Component({
    selector: 'app-add-house',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
    propertyForm: FormGroup;
    uploadProgress = 0;
    imageUrl: string = null;
    propertyPath = 'Property';
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    tennantCtrl = new FormControl();
    propertyManagerCtrl = new FormControl();
    filteredTennants: Observable<BaseModel[]>;
    filteredPropertyManagers: Observable<BaseModel[]>;
    propertyManagers: Tennant[] = [];
    tablePropertyManagers: PropertyManager[] = [];
    allPropertyManagers: PropertyManager[] = [];
    tennants: Tennant[] = [];
    tableTennants: Tennant[] = [];
    allTennants: Tennant[] = [];
    subs: Subscription[] = [];
    tennantsPath = tennantsPath;
    propertyManagerPath = propertyManagerPath;

  @ViewChild('tennantInput') tennantInput: ElementRef<HTMLInputElement>;
  @ViewChild('propertyManagerInput') propertyManagerInput: ElementRef<HTMLInputElement>;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: Property,
        private dialog: MatDialog,
        private uiService: UiService,
        public dialogRef: MatDialogRef<AddPropertyComponent>,
        ) {  

        this.filteredTennants = this.tennantCtrl.valueChanges.pipe(
          startWith(null),
          map((tennant: string | null) => filter(tennant, this.tennants, this.data?.tennants)));
        this.filteredPropertyManagers = this.propertyManagerCtrl.valueChanges.pipe(
            startWith(null),
            map((propertyManager: string | null) => filter(propertyManager, this.propertyManagers, this.data?.propertyManagers)));
        
        }

    ngOnInit(): void {

      this.subs.push(this.uiService.get(tennantsPath).subscribe(tennants => {
        this.tennants = tennants.filter(tennant => !this.data?.tennants || !this.data.tennants.includes(tennant.id)) || [];
        this.tableTennants = this.data?.tennants.length ? this.data.tennants.map(id => tennants.find(tennant => tennant.id === id)) : [];
        this.allTennants = tennants;
      }));
      this.subs.push(this.uiService.get(propertyManagerPath).subscribe(propertyManagers => {
        this.propertyManagers = propertyManagers.filter(propertyManager => !this.data?.propertyManagers || !this.data.propertyManagers.includes(propertyManager.id)) || [];
        this.tablePropertyManagers = this.data?.propertyManagers.length ? this.data.propertyManagers.map(id => propertyManagers.find(propertyManager => propertyManager.id === id)) : [];
        this.allPropertyManagers = propertyManagers;
      }));

      this.propertyForm = new FormGroup({
        name: new FormControl(this.data?.name, [Validators.required]),
        address: new FormControl(this.data?.address, [Validators.required]),
        notes: new FormControl(this.data?.notes, [Validators.required]),
        imageUrl: new FormControl(this.data?.imageUrl),
        price: new FormControl(this.data?.price, [Validators.required]),
        rentedOut: new FormControl(this.data?.rentedOut, [Validators.required])
      });
    }  

    onDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }

    onSubmit() {
      this.uiService.set({
        ...this.propertyForm.value,
        imageUrl: this.imageUrl ? this.imageUrl : this.data?.imageUrl || null,
        id: this.data?.id ? this.data.id : this.uiService.getFireStoreId(),
        lastUpdated: new Date(),
        createdDate: this.data?.created ? this.data.created : new Date(),
        tennants: this.data?.tennants ? this.data.tennants : [],
        propertyManager: this.data?.propertyManagers ? this.data.propertyManagers : [],
        userId: localStorage.getItem('userId')
      }, this.propertyPath).then(() => {
        this.dialogRef.close();
      })
    }

    addTennant() {
      const dialogref = this.dialog.open(AddTennantComponent, {
        width: '100%',
        data: {}
      });
      dialogref.afterClosed().subscribe(res => {
        if (res) {
          this.data.tennants = this.data.tennants.length ? [...this.data.tennants, res.id] : [res.id];
          this.tableTennants = this.tableTennants.length ? [...this.tableTennants, res] : [res];
        }}
      )
    }

    editTennant(tennant: Tennant): void {
      this.dialog.open(AddTennantComponent, {
        width: '100%',
        data: tennant
      });
    }

    addPropertyManager() {
      this.dialog.open(AddPropertyManagerComponent, {
        width: '100%',
          data: {}
        });
      }
  
    editPropertyManager(propertyManager: PropertyManager): void {
      this.dialog.open(AddPropertyManagerComponent, {
        width: '100%',
        data: propertyManager
      });
    }

    delete(item: any, path: string): void {
      this.uiService.delete(item, path).then(() => {
        this.removeTennantFromProperty(item);
      });
    }

    addTennantToProperty(element: any, tableList: any, list: any, attribute: string, path: string, ctrl): void {
      tableList.push(element);
      list = list.filter(listElement => listElement.id !== element.id);
      // this.uiService.addToObjectArray(this.data, element, attribute, path, ctrl).then(() => {}, err => {
      //   console.log(err);
      //   list.push(element);
      //   tableList = tableList.filter(listElement => listElement.id !== element.id);
      // });
    }

    removeTennantFromProperty(tennant: Tennant) {
      // this.tennants.push(tennant);
      // this.tableTennants = this.tableTennants.filter(tennant => tennant.id !== tennant.id);
      // this.uiService.removeFromObjectArray(this.data, tennant, 'tennants', tennantsPath).then(() => {
      //   this.tableTennants.push(tennant);
      //   this.tennants = this.tennants.filter(tennant => tennant.id !== tennant.id);
      // });
    }

    addPropertyManagerToProperty(propertyManager: PropertyManager) {
      // this.uiService.addToObjectArray(this.data, propertyManager, 'propertyManagers', propertyManagerPath, this.propertyManagerCtrl).then(() => {
      //   this.tablePropertyManagers.push(propertyManager);
      //   this.propertyManagers = this.propertyManagers.filter(propertyManager => propertyManager.id !== propertyManager.id);
      // });
    }

    removePropertyManageFromProperty(propertyManager: PropertyManager) {
      // this.uiService.removeFromObjectArray(this.data, propertyManager, 'propertyManagers', propertyManagerPath).then(() => {
      //   this.propertyManagers.push(propertyManager);
      //   this.tablePropertyManagers = this.tablePropertyManagers.filter(propertyManager => propertyManager.id !== propertyManager.id);
      // });
    }
  }
