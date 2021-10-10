import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddPropertyGroupComponent } from './add-property-group/add-property-group.component';
import * as fromUI from '../../shared/ui.reducer';
import * as fromPropertyGroup from '../property-group.reducer';
import * as fromRoot from '../../app.reducer';
import { PropertyGroupService } from '../property-group.service';
import { PropertyGroup } from '../property-group.model';
import { Cost } from '../../analytics/cost/cost.model';
import { CostService } from '../../analytics/cost/cost.service';

@Component({
  selector: 'app-property',
  templateUrl: './property-group.component.html',
  styleUrls: ['./property-group.component.scss']
})
export class PropertyGroupComponent implements OnInit {
  propertyGroups$: Observable<PropertyGroup[]> = null;
  costs$: Observable<Cost[]> = null;
  isLoading$: Observable<boolean>;


  constructor(
      private dialog: MatDialog,
      private propertyGroupService: PropertyGroupService,
      private costService: CostService,
      private propertyGroupStore: Store<fromPropertyGroup.State>,
      private uiStore: Store<fromUI.State>,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromRoot.getIsLoading);
    this.propertyGroups$ = this.propertyGroupStore.select(fromPropertyGroup.getPropertyGroups);
    this.costService.fetchCosts();
    this.propertyGroupService.fetchPropertyGroups();
  }

  addPropertyGroup() {
    const dialogRef = this.dialog.open(AddPropertyGroupComponent, {
      width: '600px',
      data: {
        allProperties: this.propertyGroups$,
        allCosts: this.costs$
      }
    });
  }

  editPopertyGroup(e: PropertyGroup) {
    this.dialog.open(AddPropertyGroupComponent, {
      width: '600px',
      data: {
        ...e,
        allProperties: this.propertyGroups$,
        allCosts: this.costs$
      }
    });
  }

  deletePropertyGroup(e: PropertyGroup) {
    this.propertyGroupService.deletePropertyGroup(e);
  }

}
