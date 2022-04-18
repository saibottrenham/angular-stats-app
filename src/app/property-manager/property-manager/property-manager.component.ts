import { Component, OnInit } from '@angular/core';
import { PropertyManager } from '../property-manager.model';
import { Subscription } from 'rxjs';
import { UiService } from '../../shared/ui.service';
import { propertiesPath, propertyManagersPath } from '../../shared/paths';
import { AddPropertyManagerComponent } from './add-property-manager/add-property-manager.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-property-manager',
  templateUrl: './property-manager.component.html',
  styleUrls: ['./property-manager.component.scss']
})
export class PropertyManagerComponent implements OnInit {
  propertyManagers: PropertyManager[] = [];
  sub: Subscription;
  loading: boolean = true;

  constructor(
    private dialog: MatDialog,
    private uiService: UiService
    ) { }

  ngOnInit(): void {
    this.sub = this.uiService.get(propertyManagersPath).subscribe(
      res => {
        this.propertyManagers = res;
        this.loading = false;
      }
    )
  }

  onDestroy() {
    this.sub.unsubscribe();
  }

  addPropertyManager() {
    this.dialog.open(AddPropertyManagerComponent, {
      width: '100%',
      data: {}
    });
  }

  editPropertyManager(e: PropertyManager) {
    this.dialog.open(AddPropertyManagerComponent, {
      width: '100%',
      data: {...e}
    });
  }

  deletePropertyManager(e: PropertyManager) {
    this.uiService.delete(e, propertyManagersPath).then(
      () => {
        this.uiService.scanObjectsForItemToDelete(e.id, 'propertyManagers', propertiesPath);
      },
      err => {
        console.log(err);
      }
    );
  }
}
