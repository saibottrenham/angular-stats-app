import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddPropertyGroupComponent } from './add-property-group/add-property-group.component';
import { PropertyGroup } from '../property-group.model';
import { UiService } from '../../shared/ui.service';
import { propertiesGroupPath } from '../../shared/paths';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-property',
  templateUrl: './property-group.component.html',
  styleUrls: ['./property-group.component.scss']
})
export class PropertyGroupComponent implements OnInit, OnDestroy {
  propertyGroups: []
  loading: boolean = true;
  sub: Subscription;


  constructor(
      private dialog: MatDialog,
      private uiService: UiService,
  ) {}

  ngOnInit(): void {
    this.sub = this.uiService.get(propertiesGroupPath)
    .subscribe(
      res => {
        console.log(res);
        this.propertyGroups = res;
        this.loading = false;
      }
    );
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  addPropertyGroup() {
    this.dialog.open(AddPropertyGroupComponent, {
      width: '100%',
      data: {}
    });
  }

  editPopertyGroup(e: PropertyGroup) {
    this.dialog.open(AddPropertyGroupComponent, {
      width: '100%',
      data: e
    });
  }

  deletePropertyGroup(e: PropertyGroup) {
    this.uiService.delete(e, propertiesGroupPath);
  }

}
