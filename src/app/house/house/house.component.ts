import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { AddHouseComponent } from '../add-house/add-house.component';

@Component({
  selector: 'app-house',
  templateUrl: './house.component.html',
  styleUrls: ['./house.component.scss']
})
export class HouseComponent implements OnInit {
  isLoading$: Observable<boolean>;

  constructor(
      private dialog: MatDialog,
      // private store: Store<fromTraining.State>,
  ) { }

  ngOnInit(): void {
    // this.isLoading$ = this.store.select(fromRoot.getIsLoading);
  }

  addHouse() {
    const dialogRef = this.dialog.open(AddHouseComponent, {
      data: {
        frank: 'hello'
      },
      width: '600px',
    });
    dialogRef.afterClosed().subscribe();
  }

}
