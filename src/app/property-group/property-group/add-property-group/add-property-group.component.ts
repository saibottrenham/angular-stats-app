import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { PropertyGroup } from '../../property-group.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Property } from '../../../property/property.model';
import { Cost } from '../../../analytics/cost/cost.model';
import { AddCostComponent } from '../../../analytics/cost/cost/add-cost/add-cost.component';
import { AddPropertyComponent } from '../../../property/property/add-property/add-property.component';
import { BaseModel } from '../../../shared/common-model';
import { addToObject, removeFromObject, initViewGroups, setFilters, deleteFromDB } from '../../../shared/utils';
import { costsPath, propertiesGroupPath, propertiesPath } from '../../../shared/paths';
import { UiService } from '../../../shared/ui.service';

@Component({
    selector: 'app-add-house',
    templateUrl: './add-property-group.component.html',
    styleUrls: ['./add-property-group.component.scss']
})
export class AddPropertyGroupComponent implements OnInit {
    propertyGroupForm: FormGroup;
    imageUrl: string;
    uploadProgress = 0;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    propertyCtrl = new FormControl();
    costCtrl = new FormControl();
    filteredProperties: Observable<BaseModel[]>;
    filteredCosts: Observable<BaseModel[]>;
    properties: Property[] = [];
    tableProperties: Property[] = [];
    allProperties: Property[] = [];
    costs: Cost[] = [];
    tableCosts: Cost[] = [];
    allCosts: Cost[] = [];
    subs = [];
    addToObject = addToObject;
    removeFromObject = removeFromObject;
    propertiesGroupPath = propertiesGroupPath;
    AddCostComponent = AddCostComponent;
    AddPropertyComponent = AddPropertyComponent;

          // for loop
    viewGroups: any = {
        properties: {
          path: propertiesPath,
          elements: 'properties',
          tableElements: 'tableProperties',
          allElements: 'allProperties',
          filteredElements: 'filteredProperties',
          ctrl: 'propertyCtrl',
          columns: ['name', 'address', 'removeable', 'actions'],
        }, 
        costs: {
          path: costsPath,
          elements: 'costs',
          tableElements: 'tableCosts',
          allElements: 'allCosts',
          filteredElements: 'filteredCosts',
          ctrl: 'costCtrl',
          columns: ['name', 'amount', 'frequency', 'removeable', 'actions']
        }
      }

    @ViewChild('propertyTrigger') propertyTrigger: MatAutocompleteTrigger;
    @ViewChild('costTrigger') costTrigger: MatAutocompleteTrigger;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: PropertyGroup,
        private dialog: MatDialog,
        private uiService: UiService,
        public dialogRef: MatDialogRef<AddPropertyGroupComponent>
        ) {
          setFilters(this);
          initViewGroups(this);
        }

    ngOnInit(): void {
      this.propertyGroupForm = new FormGroup({
        name: new FormControl(this.data?.name, {validators: [Validators.required]}),
        notes: new FormControl(this.data?.notes, {validators: [Validators.required]}),
      });
    }  

    onDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }

    onSubmit() {
      this.uiService.set({
        ...this.propertyGroupForm.value,
        imageUrl: this.imageUrl ? this.imageUrl : this.data?.imageUrl || null,
        id: this.data?.id ? this.data.id : this.uiService.getFireStoreId(),
        lastUpdated: new Date(),
        createdDate: this.data?.created ? this.data.created : new Date(),
        properties: this.data?.properties?.length ? this.data.properties : [],
        costs: this.data?.costs?.length ? this.data.costs : [],
        userId: localStorage.getItem('userId')
      }, this.propertiesGroupPath).then(() => {
        this.dialogRef.close();
      })
    }

    edit(element: any, component: any): void {
      this.dialog.open(component, {
        width: '600px',
        data: element
      });
    }

    add(component: any, group: any): void {
      const dialogref = this.dialog.open(component, {
          width: '600px',
          data: {}
        });
      dialogref.afterClosed().subscribe((element: Property) => {
        if (element) this.addToObject(
            this, element, group.elements, group.tableElements, group.allElements, group.ctrl, propertiesGroupPath
          );
      });
    }

    remove(item: any, path: string, group: any): void {
      deleteFromDB(this, item, group.elements, group.tableElements, path);
    }
  }