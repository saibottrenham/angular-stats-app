import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPropertyManagerComponent } from './add-property-manager/add-property-manager.component';
import { PropertyManagerService } from '../property-manager.service';
import * as fromRoot from '../../app.reducer';
import * as fromPropertyManager from '../property-manager.reducer';
import * as fromUI from '../../shared/ui.reducer';
import { Observable } from 'rxjs';
import { PropertyManager } from '../property-manager.model';
import { Store } from '@ngrx/store';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-property-manager',
  templateUrl: './property-manager.component.html',
  styleUrls: ['./property-manager.component.scss']
})
export class PropertyManagerComponent implements OnInit {
  propertyManagers$: Observable<PropertyManager[]> = null;
  isLoading$: Observable<boolean> = null;

  constructor(
      private dialog: MatDialog,
      private afAuth: AngularFireAuth,
      private propertyManagerService: PropertyManagerService,
      private store: Store<fromPropertyManager.State>,
      private uiStore: Store<fromUI.State>
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromRoot.getIsLoading);
    this.propertyManagers$ = this.store.select(fromPropertyManager.getPropertyManagers);
    this.propertyManagerService.fetchPropertyManager();
  }

  addManager() {
    const dialogRef = this.dialog.open(AddPropertyManagerComponent, {
      width: '600px',
    });
  }

  editManager(e: PropertyManager) {
    this.dialog.open(AddPropertyManagerComponent, {
      width: '600px',
      data: e
    });
  }

  deleteManager(e: PropertyManager) {
    this.propertyManagerService.deletePropertyManager(e);
  }

}
