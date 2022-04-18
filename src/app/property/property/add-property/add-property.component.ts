import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { Property } from '../../property.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { Tennant } from '../../../tennant/tennant.model';
import { PropertyManager } from '../../../property-manager/property-manager.model';
import { UiService } from '../../../shared/ui.service';
import { BaseModel } from '../../../shared/common-model';
import { propertiesPath, propertyManagersPath, tennantsPath } from '../../../shared/paths';
import { AddTennantComponent } from '../../../tennant/tennant/add-tennant/add-tennant.component';
import { AddPropertyManagerComponent } from '../../../property-manager/property-manager/add-property-manager/add-property-manager.component';
import { addToObject, deleteFromDB, initViewGroups, removeFromObject, setFilters } from '../../../shared/utils';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';

@Component({
    selector: 'app-add-house',
    templateUrl: './add-property.component.html',
    styleUrls: ['./add-property.component.scss']
})
export class AddPropertyComponent implements OnInit {
    propertyForm: FormGroup;
    uploadProgress = 0;
    imageUrl: string = null;
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];

    tennantCtrl = new FormControl();
    propertyManagerCtrl = new FormControl();

    filteredTennants: Observable<BaseModel[]>;
    filteredPropertyManagers: Observable<BaseModel[]>;

    tennants: Tennant[] = [];
    tableTennants: Tennant[] = [];
    allTennants: Tennant[] = [];

    propertyManagers: PropertyManager[] = [];
    tablePropertyManagers: PropertyManager[] = [];
    allPropertyManagers: PropertyManager[] = [];

    subs: Subscription[] = [];
    propertiesPath = propertiesPath;
    tennantsPath = tennantsPath;
    propertyManagersPath = propertyManagersPath;
    addToObject = addToObject;
    removeFromObject = removeFromObject;
    AddTennantComponent = AddTennantComponent;
    AddPropertyManagerComponent = AddPropertyManagerComponent;

    viewGroups: any = {
      tennants: {
        path: tennantsPath,
        elements: 'tennants',
        tableElements: 'tableTennants',
        allElements: 'allTennants',
        filteredElements: 'filteredTennants',
        ctrl: 'tennantCtrl',
        columns: ['name', 'email', 'removeable', 'actions'],
      }, 
      propertyManagers: {
        path: propertyManagersPath,
        elements: 'propertyManagers',
        tableElements: 'tablePropertyManagers',
        allElements: 'allPropertyManagers',
        filteredElements: 'filteredPropertyManagers',
        ctrl: 'propertyManagerCtrl',
        columns: ['name', 'email', 'removeable', 'actions']
      }
    }

  @ViewChild('tennantTrigger') tennantTrigger: MatAutocompleteTrigger;
  @ViewChild('propertyManagerTrigger') propertyManagerTrigger: MatAutocompleteTrigger;

constructor(
    @Inject(MAT_DIALOG_DATA) public data: Property,
    private dialog: MatDialog,
    private uiService: UiService,
    public dialogRef: MatDialogRef<Property>
    ) {
      setFilters(this);
      initViewGroups(this);
    }

ngOnInit(): void {
  this.propertyForm = new FormGroup({
    notes: new FormControl(this.data?.notes, {validators: [Validators.required]}),
    name: new FormControl(this.data?.name, [Validators.required]),
    address: new FormControl(this.data?.address, [Validators.required]),
    imageUrl: new FormControl(this.data?.imageUrl),
    price: new FormControl(this.data?.price, [Validators.required]),
    rentedOut: new FormControl(this.data?.rentedOut, [Validators.required])
  });
}  

onDestroy() {
  this.subs.forEach(sub => sub.unsubscribe());
}

onSubmit() {
  const newProperty = {
    ...this.propertyForm.value,
    imageUrl: this.imageUrl ? this.imageUrl : this.data?.imageUrl || null,
    id: this.data?.id ? this.data.id : this.uiService.getFireStoreId(),
    lastUpdated: new Date(),
    createdDate: this.data?.created ? this.data.created : new Date(),
    tennants: this.data?.tennants?.length ? this.data.tennants : [],
    propertyManagers: this.data?.propertyManagers?.length ? this.data.propertyManagers : [],
    userId: localStorage.getItem('userId')
  }
  this.uiService.set(newProperty, propertiesPath).then(() => {
    this.dialogRef.close(newProperty);
  })
}

  edit(element: any, component: any): void {
    this.dialog.open(component, {
      width: '100%',
      data: {...element}
    });
  }

  add(component: any, group: any): void {
    const dialogref = this.dialog.open(component, {
        width: '100%',
        data: {}
      });
    dialogref.afterClosed().subscribe(element => {
      if (element) this.addToObject(
          this, element, group.elements, group.tableElements, group.allElements, group.ctrl, propertiesPath
        );
    });
  }

  remove(item: any, path: string, group: any): void {
    deleteFromDB(this, item, group.elements, group.tableElements, path);
  }
}
