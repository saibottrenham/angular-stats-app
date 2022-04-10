import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { PropertyGroup } from '../../property-group.model';
import { PropertyGroupService } from '../../property-group.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Property } from '../../../property/property.model';
import { Cost } from '../../../analytics/cost/cost.model';
import { AddCostComponent } from '../../../analytics/cost/cost/add-cost/add-cost.component';
import { CostService } from '../../../analytics/cost/cost.service';
import { PropertyService } from '../../../property/property.service';
import { AddPropertyComponent } from '../../../property/property/add-property/add-property.component';
import { filter } from '../../../shared/filter';
import { BaseModel } from '../../../shared/common-model';
import { propertyGroupPath } from '../../../shared/paths';

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
    tableCosts: Cost[] = [];
    properties: Property[] = [];
    tableProperties: Property[] = [];
    costs: Cost[] = [];
    subs = [];
    propertyGroupPath = propertyGroupPath;

    @ViewChild('propertyTrigger') propertyTrigger: MatAutocompleteTrigger;
    @ViewChild('costTrigger') costTrigger: MatAutocompleteTrigger;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: PropertyGroup,
        private dialog: MatDialog,
        private propertyGroupService: PropertyGroupService,
        private costService: CostService,
        private propertyService: PropertyService,
        private fb: FormBuilder,
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
      if (!this.data?.id) {
        this.propertyGroupService.createPropertyGroup().then(res => {
          this.data.id = res.id;
        });
      }

      this.subs.push(this.propertyService.fetchProperties().subscribe(properties => {
        this.properties = properties.filter(property => !this.data?.properties || !this.data.properties.includes(property.id));
        this.getProperties(this.data?.properties || []);
      }));
      this.subs.push(this.costService.fetchCosts().subscribe(costs => {
        this.costs = costs.filter(cost => !this.data?.costs || !this.data.costs.includes(cost.id));
        this.getCosts(this.data?.costs || []);
      }));

      this.propertyGroupForm = this.fb.group({
        name: new FormControl(this.data?.name, {validators: [Validators.required]}),
        notes: new FormControl(this.data?.notes, {validators: [Validators.required]}),
      });
    }  

    onDestroy() {
      this.subs.forEach(sub => sub.unsubscribe());
    }

    onSubmit() {
      const propertyGroup = this.propertyGroupForm.value;
      propertyGroup.imageUrl = this.imageUrl ? this.imageUrl : this.data?.imageUrl || null;
      // Edit Steps
      this.propertyGroupService.editPropertyGroup(
          {...propertyGroup, id: this.data.id, userId: this.data.userId, lastUpdated: new Date()}
      );  
    }

    addCost() {
      const dialogref = this.dialog.open(AddCostComponent, {
        width: '600px',
        data: {}
      });
      dialogref.afterClosed().subscribe(res => {
        if (res) {
          this.data.costs = this.data.costs.length ? [...this.data.costs, res.id] : [res.id];
          this.getCosts(this.data.costs);
        }}
      )
    }

    editCost(cost: Cost): void {
      this.dialog.open(AddCostComponent, {
        width: '600px',
        data: cost
      });
    }

    deleteCost(cost: Cost): void {
      this.costService.deleteCost(cost).then(() => {
        this.removeCostFromPropertyGroup(cost);
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

    deleteProperty(property: Property): void {
      this.propertyService.deleteProperty(property);
    }

    addCostToPropertyGroup(cost: Cost) {
      const costs = this.data?.costs.length ? [...this.data.costs, cost.id] : [cost.id];
      this.data.costs = costs;
      this.costCtrl.setValue(null);
      this.propertyGroupService.editPropertyGroup(
        {
          ...this.data,
          costs: costs,
          id: this.data.id,
          userId: this.data.userId,
          lastUpdated: new Date()
        }
      ).then(() => this.getCosts(costs));
    }

    removeCostFromPropertyGroup(cost: Cost) {
      const costs = this.data?.costs.length ? this.data.costs.filter(id => id !== cost.id) : [];
      this.data.costs = costs;
      this.propertyGroupService.editPropertyGroup(
        {
          ...this.data,
          costs: costs,
          id: this.data.id,
          userId: this.data.userId,
          lastUpdated: new Date()
        }
      ).then(() => this.getCosts(costs));
    }

    addPropertyToPropertyGroup(property: Property) {
      const properties = this.data?.properties.length ? [...this.data.properties, property.id] : [property.id]
      this.data.properties = properties;
      this.propertyCtrl.setValue(null);
      this.propertyGroupService.editPropertyGroup(
        {
          ...this.data,
          properties: properties,
          id: this.data.id,
          userId: this.data.userId,
          lastUpdated: new Date()
        }
      ).then(() => this.getProperties(properties));
    }

    removePropertyFromPropertyGroup(property: Property) {
      const properties = this.data?.properties.length ? this.data?.properties.filter(id => id !== property.id) : [];
      this.data.properties = properties;
      this.propertyGroupService.editPropertyGroup(
        {
          ...this.data,
          properties: properties,
          id: this.data.id,
          userId: this.data.userId,
          lastUpdated: new Date()
        }
      ).then(() => this.getProperties(properties));
    }

    getProperties(propertiesIds: string[]) {
      if (propertiesIds.length) {
        this.propertyService.getProperties(propertiesIds).subscribe(
          res => {
            this.tableProperties = res;
          } 
        );
      } else {
        this.tableProperties = [];
      }
    }
  
    getCosts(costsIds: string[]) {
      console.log(costsIds);
      if (costsIds.length) {
        this.costService.getCosts(costsIds).subscribe(
          res => {
            this.tableCosts = res;
          }
        );
      } else {
        this.tableCosts = [];
      }
    }

  }