import { Component, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AddPropertyManagerComponent } from './add-property-manager/add-property-manager.component';
import { PropertyManager } from '../property-manager.model';
import { UiService } from '../../shared/ui.service';
import { propertyManagerPath } from '../../shared/paths';

@Component({
  selector: 'app-property-manager',
  templateUrl: './property-manager.component.html',
  styleUrls: ['./property-manager.component.scss']
})
export class PropertyManagerComponent implements OnInit {
  propertyManagers: PropertyManager[] = [];
  loading: boolean = true;

  constructor(
      private dialog: MatDialog,
      public dialogRef: MatDialogRef<PropertyManager>,
      private uiService: UiService,
  ) { }

  ngOnInit(): void {
    this.uiService.get(propertyManagerPath).subscribe(
      res => {
        this.propertyManagers = res;
        this.loading = false;
      }
    )
  }

  addManager() {
    this.dialog.open(AddPropertyManagerComponent, {
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
    this.uiService.delete(e, propertyManagerPath);
  }

}
