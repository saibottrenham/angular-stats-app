import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddPropertyComponent } from './add-property/add-property.component';
import * as fromUI from '../../shared/ui.reducer';
import * as fromProperty from '../property.reducer';
import * as fromPropertyManager from '../../property-manager/property-manager.reducer';
import * as fromTennant from '../../tennant/tennant.reducer';
import * as fromRoot from '../../app.reducer';
import { PropertyService } from '../property.service';
import { Property } from '../property.model';
import { TennantService } from '../../tennant/tennant.service';
import { PropertyManagerService } from '../../property-manager/property-manager.service';
import { Tennant } from '../../tennant/tennant.model';
import { PropertyManager } from '../../property-manager/property-manager.model';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  propertyManagers$: Observable<PropertyManager[]> = null;
  properties$: Observable<Property[]> = null;
  tennants$: Observable<Tennant[]> = null;
  isLoading$: Observable<boolean>;


  constructor(
      private dialog: MatDialog,
      private propertyManagerService: PropertyManagerService,
      private propertyService: PropertyService,
      private tennantService: TennantService,
      private propertyManagerStore: Store<fromPropertyManager.State>,
      private propertyStore: Store<fromProperty.State>,
      private tennantStore: Store<fromTennant.State>,
      private uiStore: Store<fromUI.State>,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromRoot.getIsLoading);
    this.propertyManagers$ = this.propertyManagerStore.select(fromPropertyManager.getPropertyManagers);
    this.properties$ = this.propertyStore.select(fromProperty.getProperties);
    this.tennants$ = this.tennantStore.select(fromTennant.getTennants);
    this.propertyManagerService.fetchPropertyManagers();
    this.tennantService.fetchTennants();
    this.propertyService.fetchProperties();
  }

  addProperty() {
    const dialogRef = this.dialog.open(AddPropertyComponent, {
      width: '600px',
      data: {
        tennants: [],
        propertyManagers: [],
        allTennants: this.tennants$,
        allPropertyManagers: this.propertyManagers$
      }
    });
    dialogRef.afterClosed().subscribe(() => this.propertyService.fetchProperties());
  }

  editPoperty(e: Property) {
    const dialogRef = this.dialog.open(AddPropertyComponent, {
      width: '600px',
      data: {
        ...e,
        allTennants: this.tennants$,
        allPropertyManagers: this.propertyManagers$
      }
    });
    dialogRef.afterClosed().subscribe(() => this.propertyService.fetchProperties());
  }

  deleteProperty(e: Property) {
    this.propertyService.deleteProperty(e);
  }

}
