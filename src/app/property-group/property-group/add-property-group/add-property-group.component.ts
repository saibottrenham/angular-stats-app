import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { map, Observable, startWith } from 'rxjs';
import { PropertyGroup } from '../../property-group.model';
import { PropertyGroupService } from '../../property-group.service';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { Property } from '../../../property/property.model';
import { Cost } from '../../../analytics/cost/cost.model';
import { AddCostComponent } from '../../../analytics/cost/cost/add-cost/add-cost.component';
import { CostService } from '../../../analytics/cost/cost.service';
import { PropertyService } from '../../../property/property.service';
import { AddPropertyComponent } from '../../../property/property/add-property/add-property.component';

@Component({
    selector: 'app-add-house',
    templateUrl: './add-property-group.component.html',
    styleUrls: ['./add-property-group.component.scss']
})
export class AddPropertyGroupComponent implements OnInit {
    propertyGroupForm: FormGroup;
    imageUrl: string;
    uploadProgress = 0;
    propertyGroupPath = 'PropertyGroup';
    selectable = true;
    removable = true;
    separatorKeysCodes: number[] = [ENTER, COMMA];
    propertyCtrl = new FormControl();
    costCtrl = new FormControl();
    filteredProperties: Observable<Property[]>;
    filteredCosts: Observable<Cost[]>;
    allProperties: Property[] = [];
    properties: Property[] = [];
    allCosts: Cost[] = [];
    costs: Cost[] = [];

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
            map((property: string | null) => property ? this._filter(property, this.allProperties) : this.allProperties.slice()));
          this.filteredCosts = this.costCtrl.valueChanges.pipe(
            startWith(null),
            map((cost: string | null) => cost ? this._filterCost(cost, this.allCosts) : this.allCosts.slice()));
        }

    ngOnInit(): void {
        this.data?.allProperties.subscribe(x => {
            this.properties = (x || []).filter(property => {
              return (this.data?.properties || []).filter((propertyId: string) => {
                return propertyId === property.id;
              }).length !== 0
            });

            this.allProperties = (x || []).filter(property => {
              return (this.data?.properties || []).filter((propertyId: string) => {
                return propertyId === property.id;
              }).length === 0
          });
        });
        this.data?.allCosts.subscribe(x => {
          this.costs = (x || []).filter(cost => {
            return (this.data?.costs || []).filter((costId: string) => {
              return costId === cost.id;
            }).length !== 0
        });

          this.allCosts = (x || []).filter(cost => {
            return (this.data?.costs || []).filter((costId: string) => {
              return costId === cost.id;
            }).length === 0
        });
      });

          this.propertyGroupForm = this.fb.group({
            name: new FormControl(this.data?.name, {validators: [Validators.required]}),
            notes: new FormControl(this.data?.notes, {validators: [Validators.required]}),
            properties: this.fb.array(this.properties),
            costs: this.fb.array(this.costs)
          });
    }  

    onSubmit() {
      const propertyGroup = this.propertyGroupForm.value;
      propertyGroup.properties = this.properties.map(property => property.id);
      propertyGroup.costs = this.costs.map(cost => cost.id);

      propertyGroup.imageUrl = this.imageUrl ? this.imageUrl : this.data?.imageUrl || null;
      // Edit Steps
      if (this.data?.id) {
          this.propertyGroupService.editPropertyGroup(
              {...propertyGroup, id: this.data.id, userId: this.data.userId, lastUpdated: new Date()}
          );
      } else {
          propertyGroup.created = new Date();
          propertyGroup.lastUpdated = new Date();
          this.propertyGroupService.addPropertyGroup(propertyGroup);
      }
    }
  
    removeProperty(property: Property): void {
      const index = this.properties.indexOf(property);
      if (index >= 0) {
        this.properties.splice(index, 1);
        // trigger the list change
        this.properties = [...this.properties];
      }
      this.allProperties = [property, ...this.allProperties]
      // trigger a form ctrl reset
      this.propertyCtrl.setValue('');
    }
  
    selectProperty(event: MatAutocompleteSelectedEvent): void {
      this.properties = [...this.properties, event.option.value];
      this.allProperties = this.allProperties.filter(item => {
        return this.properties.indexOf(item) === -1;
      });
      this.propertyCtrl.setValue('');
      setTimeout(() => {
        this.propertyTrigger.openPanel();
      }, 0);
    }

    removeCost(cost: Cost): void {
      const index = this.costs.indexOf(cost);
      if (index >= 0) {
        this.costs.splice(index, 1);
        // trigger the list change
        this.costs = [...this.costs];
      }
      this.allCosts = [cost, ...this.allCosts];
      // trigger a form ctrl reset
      this.costCtrl.setValue('');
    }
  
    selectCost(event: MatAutocompleteSelectedEvent): void {
      this.costs = [...this.costs, event.option.value];
      this.allCosts = this.allCosts.filter(item => {
        return this.costs.indexOf(item) === -1;
      });
      this.costCtrl.setValue('');
      setTimeout(() => {
        this.costTrigger.openPanel();
      }, 0);
    }

    private _filter(value: string, filterArray = []): Property[] {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
      return filterArray.filter(property => property.name.toLowerCase().includes(filterValue));
    }

    private _filterCost(value: string, filterArray = []): Cost[] {
      const filterValue = typeof value === 'string' ? value.toLowerCase() : '';
      return filterArray.filter(cost => cost.name.toLowerCase().includes(filterValue));
    }

    addCost() {
      this.dialog.open(AddCostComponent, {
        width: '600px',
        data: []
      });
    }

    editCost(cost: Cost): void {
      this.dialog.open(AddCostComponent, {
        width: '600px',
        data: cost
      });
    }

    deleteCost(cost: Cost): void {
      const index = this.costs.indexOf(cost);
      if (index >= 0) {
        this.costs.splice(index, 1);
        // trigger the list change
        this.costs = [...this.costs];
      }
      this.costService.deleteCost(cost);
    }


    addProperty() {
      this.dialog.open(AddPropertyComponent, {
          width: '600px',
          data: []
        });
      }
  
    editProperty(property: Property): void {
      this.dialog.open(AddPropertyComponent, {
        width: '600px',
        data: property
      });
    }

    deleteProperty(property: Property): void {
      const index = this.properties.indexOf(property);
      const allIndex = this.allProperties.indexOf(property);
      if (index >= 0) {
        this.properties.splice(index, 1);
        // trigger the list change
        this.properties = [...this.properties];
        this.allProperties.splice(allIndex, 1);
        this.allProperties = [...this.allProperties];
      }
      this.propertyService.deleteProperty(property);
    }

  }
