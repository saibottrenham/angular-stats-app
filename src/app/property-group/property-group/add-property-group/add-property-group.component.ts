import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { PropertyGroup } from '../../property-group.model';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Property } from '../../../property/property.model';
import { Cost } from '../../../analytics/cost/cost.model';
import { AddCostComponent } from '../../../analytics/cost/cost/add-cost/add-cost.component';
import { AddPropertyComponent } from '../../../property/property/add-property/add-property.component';
import { filter } from '../../../shared/filter';
import { BaseModel } from '../../../shared/common-model';
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
    propertyGroupPath = propertiesGroupPath;
    propertiesPath = propertiesPath;
    costsPath = costsPath;

    @ViewChild('propertyTrigger') propertyTrigger: MatAutocompleteTrigger;
    @ViewChild('costTrigger') costTrigger: MatAutocompleteTrigger;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: PropertyGroup,
        private dialog: MatDialog,
        private uiService: UiService,
        public dialogRef: MatDialogRef<AddPropertyGroupComponent>,
        ) {  

        this.filteredProperties = this.propertyCtrl.valueChanges.pipe(
          startWith(null),
          map((property: string | null) => filter(property, this.properties, this.data?.properties)));
        this.filteredCosts = this.costCtrl.valueChanges.pipe(
            startWith(null),
            map((cost: string | null) => filter(cost, this.costs, this.data?.costs)));
        
        }

    ngOnInit(): void {

      this.subs.push(this.uiService.get(propertiesPath).subscribe(properties => {
        this.properties = properties.filter(property => !this.data?.properties || !this.data.properties.includes(property.id));
        this.tableProperties = this.data?.properties ? this.data.properties.map(id => properties.find(property => property.id === id)) : [];
        this.allProperties = properties;
      }));
      this.subs.push(this.uiService.get(costsPath).subscribe(costs => {
        this.costs = costs.filter(cost => !this.data?.costs || !this.data.costs.includes(cost.id));
        this.tableCosts = this.data?.costs ? this.data.costs.map(id => costs.find(cost => cost.id === id)) : [];
        this.allCosts = costs;
      }));

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
        properties: this.data?.properties ? this.data.properties : [],
        costs: this.data?.costs ? this.data.costs : [],
        userId: localStorage.getItem('userId')
      }, this.propertyGroupPath).then(() => {
        this.dialogRef.close();
      })
    }

    addCost() {
      const dialogref = this.dialog.open(AddCostComponent, {
        width: '600px',
        data: {}
      });
      dialogref.afterClosed().subscribe(res => {
        if (res) {
          this.data.costs = this.data.costs.length ? [...this.data.costs, res.id] : [res.id];
          this.tableCosts = this.tableCosts.length ? [...this.tableCosts, res] : [res];
        }}
      )
    }

    editCost(cost: Cost): void {
      this.dialog.open(AddCostComponent, {
        width: '600px',
        data: cost
      });
    }

    addProperty() {
      this.dialog.open(AddPropertyComponent, {
          width: '600px',
          data: {}
        });
      }
  
    editProperty(property: Property): void {
      this.dialog.open(AddPropertyComponent, {
        width: '600px',
        data: property
      });
    }

    delete(item: any, path: string): void {
      this.uiService.delete(item, path).then(() => {
        this.removeCostFromPropertyGroup(item);
      });
    }

    addCostToPropertyGroup(cost: Cost) {
      const costs = this.data?.costs.length ? [...this.data.costs, cost.id] : [cost.id];
      this.data.costs = costs;
      this.costCtrl.setValue(null);
      this.uiService.set(
        {
          ...this.data,
          costs: costs,
          id: this.data.id,
          userId: this.data.userId,
          lastUpdated: new Date()
        },
        this.propertyGroupPath
      ).then(() => {
        this.tableCosts = [...this.tableCosts, cost];
      });
    }

    removeCostFromPropertyGroup(cost: Cost) {
      const costs = this.data?.costs.length ? this.data.costs.filter(id => id !== cost.id) : [];
      this.data.costs = costs;
      this.uiService.set(
        {
          ...this.data,
          costs: costs,
          id: this.data.id,
          userId: this.data.userId,
          lastUpdated: new Date()
        },
        propertiesGroupPath
      ).then(() => {
        this.tableCosts = this.tableCosts.filter(item => item.id !== cost.id);
      });
    }

    addPropertyToPropertyGroup(property: Property) {
      const properties = this.data?.properties.length ? [...this.data.properties, property.id] : [property.id]
      this.data.properties = properties;
      this.propertyCtrl.setValue(null);
      this.uiService.set(
        {
          ...this.data,
          properties: properties,
          id: this.data.id,
          userId: this.data.userId,
          lastUpdated: new Date()
        },
        this.propertyGroupPath
      ).then(() => {
        this.tableProperties = [...this.tableProperties, property];
      });
    }

    removePropertyFromPropertyGroup(property: Property) {
      const properties = this.data?.properties.length ? this.data?.properties.filter(id => id !== property.id) : [];
      this.data.properties = properties;
      this.uiService.set(
        {
          ...this.data,
          properties: properties,
          id: this.data.id,
          userId: this.data.userId,
          lastUpdated: new Date()
        },
        this.propertyGroupPath
      ).then(() => {
        this.tableProperties = this.tableProperties.filter(item => item.id !== property.id);
      });
    }
  }