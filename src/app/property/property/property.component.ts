import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { AddPropertyComponent } from './add-property/add-property.component';
import { Property } from '../property.model';
import { UiService } from '../../shared/ui.service';
import { propertiesGroupPath, propertiesPath } from '../../shared/paths';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  properties: Property[] = [];
  loading: boolean = true;
  sub: Subscription;


  constructor(
      private dialog: MatDialog,
      private uiService: UiService,
  ) { }

  ngOnInit(): void {
    this.sub = this.uiService.get(propertiesPath).subscribe(res => {
      this.properties = res;
      this.loading = false;
    });
  }

  onDestroy() {
    this.sub.unsubscribe();
  }

  addProperty() {
    this.dialog.open(AddPropertyComponent, {
      width: '100%',
      data: {}
    });
  }

  editPoperty(e: Property) {
    this.dialog.open(AddPropertyComponent, {
      width: '100%',
      data: {...e}
    });
  }

  deleteProperty(e: Property) {
  this.uiService.delete(e, propertiesPath).then(
    () => {
      this.uiService.scanObjectsForItemToDelete(e.id, 'properties', propertiesGroupPath);
    },
    err => {
      console.log(err);
    }
  );
  }
}
