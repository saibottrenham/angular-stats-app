import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { AddPropertyGroupComponent } from './add-property-group/add-property-group.component';
import * as UI from '../../shared/ui.actions';
import * as fromUI from '../../shared/ui.reducer';
import { PropertyGroupService } from '../property-group.service';
import { PropertyGroup } from '../property-group.model';
import { Cost } from '../../analytics/cost/cost.model';
import { Property } from '../../property/property.model';

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
      private uiStore: Store<fromUI.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromUI.getIsLoading);
    
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
    this.dialog.open(AddPropertyGroupComponent, {
      width: '100%',
      data: []
    });
  }

  editPopertyGroup(e: PropertyGroup) {
    this.dialog.open(AddPropertyGroupComponent, {
      width: '100%',
      data: {...e}
    });
  }

  deletePropertyGroup(e: PropertyGroup) {
    this.propertyGroupService.deletePropertyGroup(e);
  }

}
