import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddHouseComponent } from '../add-house/add-house.component';
import * as fromUI from '../../shared/ui.reducer';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss']
})
export class HouseComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(
      private dialog: MatDialog,
      private uiStore: Store<fromUI.State>,
  ) { }

  ngOnInit(): void {
    this.isLoading$ = this.uiStore.select(fromRoot.getIsLoading);
  }

  addHouse() {
    const dialogRef = this.dialog.open(AddHouseComponent, {
      data: {
        frank: 'hello'
      },
      width: '80vw',
    });
    dialogRef.afterClosed().subscribe();
  }

}
