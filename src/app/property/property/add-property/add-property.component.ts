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
import { costsPath, propertiesPath, propertyManagersPath, tennantsPath } from '../../../shared/paths';
import { AddTennantComponent } from '../../../tennant/tennant/add-tennant/add-tennant.component';
import { AddPropertyManagerComponent } from '../../../property-manager/property-manager/add-property-manager/add-property-manager.component';
import { addToObject, deleteFromDB, initViewGroups, removeFromObject, setFilters } from '../../../shared/utils';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { AddCostComponent } from '../../../analytics/cost/cost/add-cost/add-cost.component';
import { Cost } from '../../../analytics/cost/cost.model';

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
    costCtrl = new FormControl();

    filteredTennants: Observable<BaseModel[]>;
    filteredPropertyManagers: Observable<BaseModel[]>;
    filteredCosts: Observable<BaseModel[]>;

    tennants: Tennant[] = [];
    tableTennants: Tennant[] = [];
    allTennants: Tennant[] = [];

    propertyManagers: PropertyManager[] = [];
    tablePropertyManagers: PropertyManager[] = [];
    allPropertyManagers: PropertyManager[] = [];

    costs: Cost[] = [];
    tableCosts: Cost[] = [];
    allCosts: Cost[] = [];

    subs: Subscription[] = [];
    propertiesPath = propertiesPath;
    tennantsPath = tennantsPath;
    propertyManagersPath = propertyManagersPath;
    costsPath = costsPath;

    addToObject = addToObject;
    removeFromObject = removeFromObject;

    AddTennantComponent = AddTennantComponent;
    AddPropertyManagerComponent = AddPropertyManagerComponent;
    AddCostComponent = AddCostComponent;

    viewGroups: any = {
      tennants: {
        path: tennantsPath,
        elements: 'tennants',
        tableElements: 'tableTennants',
        allElements: 'allTennants',
        filteredElements: 'filteredTennants',
        ctrl: 'tennantCtrl',
        columns: ['image', 'name', 'rent', 'removeable', 'actions'],
      }, 
      propertyManagers: {
        path: propertyManagersPath,
        elements: 'propertyManagers',
        tableElements: 'tablePropertyManagers',
        allElements: 'allPropertyManagers',
        filteredElements: 'filteredPropertyManagers',
        ctrl: 'propertyManagerCtrl',
        columns: ['image', 'name', 'email', 'removeable', 'actions']
      },
      costs: {
        path: costsPath,
        elements: 'costs',
        tableElements: 'tableCosts',
        allElements: 'allCosts',
        filteredElements: 'filteredCosts',
        ctrl: 'costCtrl',
        columns: ['image', 'name', 'amount', 'frequency', 'removeable', 'actions']
      }
    }

  @ViewChild('tennantTrigger') tennantTrigger: MatAutocompleteTrigger;
  @ViewChild('propertyManagerTrigger') propertyManagerTrigger: MatAutocompleteTrigger;
  @ViewChild('costTrigger') costTrigger: MatAutocompleteTrigger;

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
    costs: this.data?.costs?.length ? this.data.costs : [],
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
