import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddPropertyComponent } from '../add-property/add-property.component';
import * as fromUI from '../../shared/ui.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(
      private dialog: MatDialog,
      private uiStore: Store<fromUI.State>,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromRoot.getIsLoading);
  }

  addHouse() {
    const dialogRef = this.dialog.open(AddPropertyComponent, {
      data: {
        frank: 'hello'
      },
      width: '80vw',
    });
    dialogRef.afterClosed().subscribe();
  }

}
