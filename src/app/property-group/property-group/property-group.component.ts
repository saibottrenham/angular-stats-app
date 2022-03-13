import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AddPropertyGroupComponent } from './add-property-group/add-property-group.component';
import * as UI from '../../shared/ui.actions';
import * as fromUI from '../../shared/ui.reducer';
import * as fromProperty from '../../property/property.reducer';
import * as fromCost from '../../analytics/cost/cost.reducer';
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
export class PropertyGroupComponent implements OnInit, OnDestroy {
  propertyGroups: PropertyGroup[];
  properties$: Observable<Property[]> = null;
  costs$: Observable<Cost[]> = null;
  isLoading$: Observable<boolean>;
  sub: Subscription;


  constructor(
      private dialog: MatDialog,
      private propertyGroupService: PropertyGroupService,
      private propertyService: PropertyService,
      private costService: CostService,
      private propertyStore: Store<fromProperty.State>,
      private costStore: Store<fromCost.State>,
      private uiStore: Store<fromUI.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromUI.getIsLoading);
    this.costs$ = this.costStore.select(fromCost.getCosts);
    this.properties$ = this.propertyStore.select(fromProperty.getProperties);
    this.costService.fetchCosts();
    this.propertyService.fetchProperties();
    
    this.sub = this.propertyGroupService.fetchPropertyGroups().subscribe(
      (res: PropertyGroup[]) => { 
        this.propertyGroups = res; 
        this.uiStore.dispatch(new UI.StopLoading());
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
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
