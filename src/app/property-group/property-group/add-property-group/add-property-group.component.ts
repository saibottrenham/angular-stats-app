import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
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
          map((property: string | null) => filter(property, this.properties, this.data && this.data?.properties || [])));
        this.filteredCosts = this.costCtrl.valueChanges.pipe(
            startWith(null),
            map((cost: string | null) => filter(cost, this.costs, this.data && this.data?.costs || [])));
        
        }

    ngOnInit(): void {

      this.subs.push(this.uiService.get(propertiesPath).subscribe(properties => {
        this.properties = properties.filter(property => !this.data?.properties?.length || !this.data.properties.includes(property.id)) || [];
        this.tableProperties = this.data?.properties?.length ? this.data?.properties.map(id => properties.find(property => property.id === id)).filter(
          property => property !== undefined
        ) : [];
        this.allProperties = properties;
      }));
      this.subs.push(this.uiService.get(costsPath).subscribe(costs => {
        this.costs = costs.filter(cost => !this.data?.costs.length || !this.data.costs.includes(cost.id)) || [];
        this.tableCosts = this.data?.costs?.length ? this.data.costs.map(id => costs.find(cost => cost.id === id)).filter(
          cost => cost !== undefined
        ) : [];
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
        properties: this.data?.properties?.length ? this.data.properties : [],
        costs: this.data?.costs?.length ? this.data.costs : [],
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
      dialogref.afterClosed().subscribe((cost: Cost) => {
        if (cost) this.addCostToPropertyGroup(cost);
      });
    }

    editCost(cost: Cost): void {
      this.dialog.open(AddCostComponent, {
        width: '600px',
        data: cost
      });
    }

    addProperty() {
      const dialogref = this.dialog.open(AddPropertyComponent, {
          width: '600px',
          data: {}
        });
      dialogref.afterClosed().subscribe((res: Property) => {
        if (res) this.addPropertyToPropertyGroup(res);
      });
    }
  
    editProperty(property: Property): void {
      this.dialog.open(AddPropertyComponent, {
        width: '600px',
        data: {...property}
      });
    }

    delete(item: any, path: string): void {
      this.uiService.delete(item, path).then(() => {
        this.removeCostFromPropertyGroup(item);
      });
    }

    addCostToPropertyGroup(element: any): void {
      this.costCtrl.setValue(null);
      this.uiService.addToObjectArray(this.data, element, 'costs', propertiesGroupPath, this.costCtrl).then(() => {
        this.tableCosts = this.data.costs.map(id => this.allCosts.find(cost => cost.id === id)).filter(
          cost => cost !== undefined
          );
        this.costs = this.allCosts.filter(cost => !this.data.costs.includes(cost.id));
      });
    }

    removeCostFromPropertyGroup(cost: Cost) {
      this.uiService.removeFromObjectArray(this.data, cost, 'costs', propertiesGroupPath).then(() => {
        this.costs.push(cost);
        this.tableCosts = this.tableCosts.filter(tableCost => tableCost.id !== cost.id);
      });
    }

    addPropertyToPropertyGroup(property: Property) {
      this.uiService.addToObjectArray(this.data, property, 'properties', propertiesGroupPath, this.propertyCtrl).then(() => {
        this.tableProperties.push(property);
        this.properties = this.properties.filter(property => property.id !== property.id);
      });
    }

    removePropertyFromPropertyGroup(property: Property) {
      this.uiService.removeFromObjectArray(this.data, property, 'properties', propertiesGroupPath).then(() => {
        this.properties.push(property);
        this.tableProperties = this.tableProperties.filter(property => property.id !== property.id);
      });
    }
  }