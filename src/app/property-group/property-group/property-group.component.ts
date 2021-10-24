import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddPropertyGroupComponent } from './add-property-group/add-property-group.component';
import * as fromUI from '../../shared/ui.reducer';
import * as fromPropertyGroup from '../property-group.reducer';
import * as fromProperty from '../../property/property.reducer';
import * as fromCost from '../../analytics/cost/cost.reducer';
import * as fromRoot from '../../app.reducer';
import { PropertyGroupService } from '../property-group.service';
import { PropertyGroup } from '../property-group.model';
import { Cost } from '../../analytics/cost/cost.model';
import { CostService } from '../../analytics/cost/cost.service';
import { Property } from '../../property/property.model';
import { PropertyService } from '../../property/property.service';

@Component({
  selector: 'app-property',
  templateUrl: './property-group.component.html',
  styleUrls: ['./property-group.component.scss']
})
export class PropertyGroupComponent implements OnInit {
  propertyGroups$: Observable<PropertyGroup[]> = null;
  properties$: Observable<Property[]> = null;
  costs$: Observable<Cost[]> = null;
  isLoading$: Observable<boolean>;


  constructor(
      private dialog: MatDialog,
      private propertyGroupService: PropertyGroupService,
      private popertyService: PropertyService,
      private costService: CostService,
      private propertyGroupStore: Store<fromPropertyGroup.State>,
      private propertyStore: Store<fromProperty.State>,
      private costStore: Store<fromCost.State>,
      private uiStore: Store<fromUI.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromRoot.getIsLoading);
    this.costs$ = this.costStore.select(fromCost.getCosts);
    this.propertyGroups$ = this.propertyGroupStore.select(fromPropertyGroup.getPropertyGroups);
    this.properties$ = this.propertyStore.select(fromProperty.getProperties);
    this.costService.fetchCosts();
    this.popertyService.fetchProperties();
    this.propertyGroupService.fetchPropertyGroups();
  }

  addPropertyGroup() {
    const dialogref = this.dialog.open(AddPropertyGroupComponent, {
      width: '100%',
      data: {
        allProperties: this.properties$,
        allCosts: this.costs$
      }
    });
    dialogref.afterClosed().subscribe(() => {
      this.propertyGroupService.fetchPropertyGroups();
    });
  }

  editPopertyGroup(e: PropertyGroup) {
    const dialogref = this.dialog.open(AddPropertyGroupComponent, {
      width: '100%',
      data: {
        ...e,
        allProperties: this.properties$,
        allCosts: this.costs$
      }
    });
    dialogref.afterClosed().subscribe(() => {
      this.propertyGroupService.fetchPropertyGroups();
    });
  }

  deletePropertyGroup(e: PropertyGroup) {
    this.propertyGroupService.deletePropertyGroup(e);
  }

}
